#!/usr/bin/env python3
"""Compatibilidad Chrome 38: reemplaza TypedArray.slice por subarray en el 3DES de LG Legacy."""
import io, tarfile, json, pathlib, hashlib
from copy import copy
SOURCE=pathlib.Path("base.ipk")
TARGET=pathlib.Path("CactusTV_LG_Legacy_HD_2.0.16_Chrome38_Fix.ipk")
OLD=b"function U(r){return[b(r.slice(0,8)),b(r.slice(8,16)),b(r.slice(16,24))]}"
NEW=b"function U(r){return[b(r.subarray(0,8)),b(r.subarray(8,16)),b(r.subarray(16,24))]}"
def from_ar(raw):
    assert raw.startswith(b'!<arch>\n')
    p=8;out=[]
    while p<len(raw):
        h=raw[p:p+60];n=h[:16].decode().strip().rstrip('/');sz=int(h[48:58])
        assert h[58:60]==bytes((96,10))
        out.append((n,raw[p+60:p+60+sz]))
        p+=60+sz+sz%2
    assert p==len(raw)
    return dict(out)
def to_ar(items):
    dst=io.BytesIO();dst.write(b'!<arch>\n')
    for n,b in items:
        h=f'{n:<16}{1794000000:<12}{0:<6}{0:<6}{"100644":<8}{len(b):<10}'+chr(96)+'\n'
        assert len(h)==60
        dst.write(h.encode());dst.write(b)
        if len(b)%2:dst.write(b'\n')
    return dst.getvalue()
def unpack(blob):
    with tarfile.open(fileobj=io.BytesIO(blob),mode='r:gz') as src:
        return [(copy(m),src.extractfile(m).read() if m.isfile() else None) for m in src]
def pack(items):
    buf=io.BytesIO()
    with tarfile.open(fileobj=buf,mode='w:gz',format=tarfile.USTAR_FORMAT,compresslevel=6) as dst:
        for member,data in items:
            m=copy(member);m.uid=m.gid=0;m.uname=m.gname=''
            if data is not None:m.size=len(data)
            dst.addfile(m,io.BytesIO(data) if data is not None else None)
    b=buf.getvalue()
    return b[:4]+bytes(4)+b[8:]
archive=from_ar(SOURCE.read_bytes())
assert set(archive)=={'debian-binary','control.tar.gz','data.tar.gz'}
assert archive['debian-binary']==b'2.0\n'
app=unpack(archive['data.tar.gz']);ctrl=unpack(archive['control.tar.gz'])
changed=[]
for i,(m,raw) in enumerate(app):
    if raw is None:continue
    if m.name.endswith('/xuper/crypto3des.js'):
        assert raw.count(OLD)==1
        raw=raw.replace(OLD,NEW);changed.append('crypto3des.js')
    elif m.name.endswith('/appinfo.json'):
        obj=json.loads(raw)
        assert obj['version']=='2.0.15' and obj['resolution']=='1280x720'
        obj.update(version='2.0.16',title='Cactus TV LG Legacy HD',
                   appDescription='Beta webOS 3 HD: compatibilidad de 3DES con Chromium 38.')
        raw=json.dumps(obj,indent=2,ensure_ascii=False).encode();changed.append('appinfo.json')
    elif m.name.endswith('/services.json'):
        obj=json.loads(raw);assert obj['version']=='2.0.15'
        obj['version']='2.0.16'
        raw=json.dumps(obj,indent=2,ensure_ascii=False).encode();changed.append('services.json')
    m.size=len(raw);app[i]=(m,raw)
assert set(changed)=={'crypto3des.js','appinfo.json','services.json'}
for i,(m,raw) in enumerate(ctrl):
    if m.name.endswith('control'):
        assert b'Version: 2.0.15' in raw
        raw=raw.replace(b'Version: 2.0.15',b'Version: 2.0.16')
        raw=raw.replace(b'Description: Cactus TV LG R9 - beta 2.0.14',b'Description: Cactus TV LG R9 - beta 2.0.16')
        m.size=len(raw);ctrl[i]=(m,raw)
result=to_ar([('debian-binary',archive['debian-binary']),
              ('control.tar.gz',pack(ctrl)),('data.tar.gz',pack(app))])
output=from_ar(result)
verify=unpack(output['data.tar.gz'])
assert len(verify)==len(app)
assert [(m.name,x) for m,x in verify]==[(m.name,x) for m,x in app]
TARGET.write_bytes(result)
print('OK: ',TARGET,'items=',len(app),'size=',len(result),'sha256=',hashlib.sha256(result).hexdigest())
