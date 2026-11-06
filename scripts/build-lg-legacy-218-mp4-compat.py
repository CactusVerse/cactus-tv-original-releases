#!/usr/bin/env python3
"""LG Legacy HD: remux del clip propio a MP4 no fragmentado + error HTML5 local."""
import io,json,tarfile,pathlib,hashlib
from copy import copy

SRC=pathlib.Path("base.ipk")
DEMO=pathlib.Path("cactus-demo-progressive.mp4")
OUT=pathlib.Path("CactusTV_LG_Legacy_HD_2.0.18_MP4_Compat.ipk")
def read_ar(data):
    assert data[:8]==b'!<arch>\n'
    p=8;parts={}
    while p<len(data):
        h=data[p:p+60];name=h[:16].decode("ascii").strip().rstrip("/")
        assert h[58:60]==bytes((96,10))
        n=int(h[48:58]);parts[name]=data[p+60:p+60+n];p+=60+n+n%2
    assert p==len(data)
    return parts
def mk_ar(parts):
    data=io.BytesIO();data.write(b'!<arch>\n')
    for name,body in parts:
        h=f'{name:<16}{1794000000:<12}{0:<6}{0:<6}{"100644":<8}{len(body):<10}'+chr(96)+'\n'
        assert len(h)==60
        data.write(h.encode());data.write(body)
        if len(body)%2:data.write(b'\n')
    return data.getvalue()
def fromtar(b):
    with tarfile.open(fileobj=io.BytesIO(b),mode='r:gz') as tar:
        return [(copy(m),tar.extractfile(m).read() if m.isfile() else None) for m in tar]
def totar(entries):
    buf=io.BytesIO()
    with tarfile.open(fileobj=buf,mode='w:gz',format=tarfile.USTAR_FORMAT,compresslevel=6) as t:
        for m,raw in entries:
            x=copy(m);x.uid=x.gid=0;x.uname=x.gname=''
            if raw is not None:x.size=len(raw)
            t.addfile(x,io.BytesIO(raw) if raw is not None else None)
    b=buf.getvalue()
    return b[:4]+bytes(4)+b[8:]

chunks=read_ar(SRC.read_bytes())
assert list(chunks)==['debian-binary','control.tar.gz','data.tar.gz']
files=fromtar(chunks['data.tar.gz'])
control=fromtar(chunks['control.tar.gz'])
converted=DEMO.read_bytes()
assert b'moof' not in converted and b'moov' in converted and b'mdat' in converted
changed=[]
for i,(m,data) in enumerate(files):
    if data is None:continue
    if m.name.endswith('/app/cactus-demo.mp4'):
        assert b'moof' in data
        data=converted
        changed.append('cactus-demo.mp4')
    elif m.name.endswith('/appinfo.json'):
        v=json.loads(data)
        assert v['version']=='2.0.17' and v['resolution']=='1280x720'
        v.update(version='2.0.18',title='Cactus TV LG Legacy HD',
                 appDescription='Prueba LG Legacy HD: demo MP4 progresivo para webOS 3.')
        data=json.dumps(v,ensure_ascii=False,indent=2).encode()
        changed.append('appinfo.json')
    elif m.name.endswith('/services.json'):
        v=json.loads(data)
        assert v['version']=='2.0.17'
        v['version']='2.0.18'
        data=json.dumps(v,ensure_ascii=False,indent=2).encode()
        changed.append('services.json')
    elif m.name.endswith('/app/playback-controls.js'):
        s=data.decode()
        anchor="v.addEventListener('canplay',autoReady);"
        extra=("v.addEventListener('error',function(){if(item&&item.source==='CACTUS_ORIGINAL_DEMO'){"
               "var e=video.error;status.textContent='Prueba local: error de video '+"
               "(e?e.code:'?')+', red '+video.networkState+', estado '+video.readyState;}});")
        assert s.count(anchor)==1
        data=s.replace(anchor,extra+"\n "+anchor).encode()
        changed.append('playback-controls.js')
    m.size=len(data)
    files[i]=(m,data)
assert set(changed)=={'cactus-demo.mp4','appinfo.json','services.json','playback-controls.js'},changed
for i,(m,body) in enumerate(control):
    if m.name.endswith('control'):
        assert b'Version: 2.0.17' in body
        body=body.replace(b'Version: 2.0.17',b'Version: 2.0.18')
        m.size=len(body);control[i]=(m,body)
out=mk_ar([('debian-binary',chunks['debian-binary']),('control.tar.gz',totar(control)),('data.tar.gz',totar(files))])
assert len(fromtar(read_ar(out)['data.tar.gz']))==len(files)
OUT.write_bytes(out)
print('Creado:',OUT,'bytes',len(out),'SHA256',hashlib.sha256(out).hexdigest(), 'Cambios:',changed)
