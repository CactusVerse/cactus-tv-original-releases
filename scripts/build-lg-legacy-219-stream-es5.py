#!/usr/bin/env python3
"""LG Legacy 2.0.19: remove ES5 strict-invalid block function in stream.js."""
import io, tarfile, json, pathlib, hashlib
from copy import copy

SOURCE=pathlib.Path("base.ipk")
TARGET=pathlib.Path("CactusTV_LG_Legacy_HD_2.0.19_Stream_ES5.ipk")
OLD=b'function v(e){var t=String(Date.now());'
NEW=b'var v=function(e){var t=String(Date.now());'
OLD_END=b'"sign2="+r(e,t,"0")].join("&")}var m='
NEW_END=b'"sign2="+r(e,t,"0")].join("&")};var m='

def arread(blob):
    assert blob.startswith(b'!<arch>\n')
    pos=8;out={}
    while pos<len(blob):
        hdr=blob[pos:pos+60]
        assert hdr[58:60]==bytes((96,10))
        name=hdr[:16].decode('ascii').strip().rstrip('/')
        size=int(hdr[48:58])
        out[name]=blob[pos+60:pos+60+size]
        pos+=60+size+size%2
    assert pos==len(blob)
    return out

def arwrite(parts):
    buf=io.BytesIO();buf.write(b'!<arch>\n')
    for name,raw in parts:
        hdr=f'{name:<16}{1794000000:<12}{0:<6}{0:<6}{"100644":<8}{len(raw):<10}'+chr(96)+'\n'
        assert len(hdr)==60
        buf.write(hdr.encode('ascii'));buf.write(raw)
        if len(raw)%2:buf.write(b'\n')
    return buf.getvalue()

def tarread(blob):
    with tarfile.open(fileobj=io.BytesIO(blob),mode='r:gz') as src:
        return [(copy(member),src.extractfile(member).read() if member.isfile() else None) for member in src]

def tarwrite(entries):
    output=io.BytesIO()
    with tarfile.open(fileobj=output,mode='w:gz',format=tarfile.USTAR_FORMAT,compresslevel=6) as tar:
        for member,raw in entries:
            m=copy(member);m.uid=m.gid=0;m.uname=m.gname=''
            if raw is not None:m.size=len(raw)
            tar.addfile(m,io.BytesIO(raw) if raw is not None else None)
    data=output.getvalue()
    return data[:4]+bytes(4)+data[8:]

parts=arread(SOURCE.read_bytes())
assert list(parts)==['debian-binary','control.tar.gz','data.tar.gz']
app=tarread(parts['data.tar.gz'])
control=tarread(parts['control.tar.gz'])
changed=[]
for i,(m,raw) in enumerate(app):
    if raw is None: continue
    if m.name.endswith('/xuper/stream.js'):
        assert raw.count(OLD)==1 and raw.count(OLD_END)==1
        raw=raw.replace(OLD,NEW).replace(OLD_END,NEW_END)
        assert raw.count(b'if("vod"===e){')==1
        assert raw.count(b'if("vod"===e){var h=')==1
        assert raw.count(NEW)==1 and raw.count(NEW_END)==1
        pathlib.Path('stream-219.js').write_bytes(raw)
        changed.append('stream.js')
    elif m.name.endswith('/appinfo.json'):
        meta=json.loads(raw)
        assert meta['version']=='2.0.18'
        assert meta['resolution']=='1280x720'
        meta['version']='2.0.19'
        meta['title']='Cactus TV LG Legacy HD'
        meta['appDescription']='Legacy HD webOS 3.0: compatibilidad de stream.js con Chromium 38.'
        raw=json.dumps(meta,ensure_ascii=False,indent=2).encode()
        changed.append('appinfo.json')
    elif m.name.endswith('/services.json'):
        meta=json.loads(raw)
        assert meta['version']=='2.0.18'
        meta['version']='2.0.19'
        raw=json.dumps(meta,ensure_ascii=False,indent=2).encode()
        changed.append('services.json')
    m.size=len(raw);app[i]=(m,raw)
assert set(changed)=={'stream.js','appinfo.json','services.json'},changed
for i,(m,raw) in enumerate(control):
    if m.name.endswith('control'):
        assert b'Version: 2.0.18' in raw
        raw=raw.replace(b'Version: 2.0.18',b'Version: 2.0.19')
        m.size=len(raw);control[i]=(m,raw)
result=arwrite([('debian-binary',parts['debian-binary']),
                ('control.tar.gz',tarwrite(control)),
                ('data.tar.gz',tarwrite(app))])
verify=tarread(arread(result)['data.tar.gz'])
assert [(m.name,raw) for m,raw in verify]==[(m.name,raw) for m,raw in app]
TARGET.write_bytes(result)
print('OK:',TARGET,'bytes:',len(result),'SHA-256:',hashlib.sha256(result).hexdigest(),'modified:',changed)
