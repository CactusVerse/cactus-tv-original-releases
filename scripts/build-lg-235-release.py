#!/usr/bin/env python3
"""Build LG 2.0.35 release from pinned 2.0.30 assets and verified diffs."""
import io,tarfile,hashlib,json,base64,lzma,sys
from pathlib import Path
from copy import copy
ROOT=Path(".")
data64=''.join((Path('scripts')/('lg235-part%02d.txt'%n)).read_text().strip() for n in range(1,7))
PATCH=json.loads(lzma.decompress(base64.b64decode(data64,validate=True)))
APP='usr/palm/services/com.cocotecnico.cactustv.lgtest.service/backend/app/'

def read_ar(blob):
    assert blob.startswith(b'!<arch>\n')
    p=8; ret=[]
    while p<len(blob):
        h=blob[p:p+60]
        assert h[58:60]==bytes([96,10])
        n=h[:16].decode('ascii').strip().rstrip('/')
        z=int(h[48:58]);ret.append((n,blob[p+60:p+60+z]))
        p+=60+z+z%2
    assert p==len(blob)
    return ret

def write_ar(items):
    o=io.BytesIO();o.write(b'!<arch>\n')
    for n,d in items:
        h=f'{n:<16}{1794192000:<12}{0:<6}{0:<6}{"100644":<8}{len(d):<10}'+chr(96)+'\n'
        assert len(h)==60
        o.write(h.encode());o.write(d)
        if len(d)%2:o.write(b'\n')
    return o.getvalue()

def read_tar(b):
    with tarfile.open(fileobj=io.BytesIO(b),mode='r:gz') as t:
        return [(copy(m),t.extractfile(m).read() if m.isfile() else None) for m in t]

def write_tar(members):
    out=io.BytesIO()
    with tarfile.open(fileobj=out,mode='w:gz',format=tarfile.USTAR_FORMAT,compresslevel=6) as t:
        for m,d in members:
            m=copy(m);m.uid=m.gid=0;m.uname=m.gname=''
            if d is not None:m.size=len(d)
            t.addfile(m,io.BytesIO(d) if d is not None else None)
    b=out.getvalue()
    return b[:4]+bytes(4)+b[8:]

def apply(old,ops):
    out=bytearray()
    for op in ops:
        if op[0]=='c':
            _,s,n=op
            assert 0<=s and n>=0 and s+n<=len(old)
            out.extend(old[s:s+n])
        elif op[0]=='a':out.extend(base64.b64decode(op[1],validate=True))
        else:raise ValueError('Unknown patch instruction')
    return bytes(out)

def build(kind):
    cfg=PATCH['m'][kind]
    source=ROOT/f'CactusTV_LG_{kind}_2.0.30_Favoritos_UltimoCanal_Beta.ipk'
    original=source.read_bytes()
    assert hashlib.sha256(original).hexdigest()==cfg['old'],(kind,'source hash mismatch')
    ar=dict(read_ar(original))
    assert list(ar)==['debian-binary','control.tar.gz','data.tar.gz']
    items=read_tar(ar['data.tar.gz'])
    original_files={m.name.lstrip('./'):d for m,d in items if d is not None}
    control=read_tar(ar['control.tar.gz'])
    patches=PATCH['p'][kind];changed=set()
    for i,(m,d) in enumerate(items):
        if d is None:continue
        p=m.name.lstrip('./')
        if p in patches:
            d=apply(d,patches[p]['d'])
            assert hashlib.sha256(d).hexdigest()==patches[p]['sha'],(kind,p)
            changed.add(p)
        m.size=len(d);items[i]=(m,d)
    for p,x in patches.items():
        if p in changed:continue
        d=apply(b'',x['d'])
        assert hashlib.sha256(d).hexdigest()==x['sha'],(kind,p)
        template=next(m for m,_ in items if m.name.lstrip('./')==APP+'index.html')
        m=copy(template);m.name='./'+p;m.size=len(d)
        idx=next(i for i,(m2,_) in enumerate(items) if m2.name.lstrip('./')==APP+'index.html')
        items.insert(idx,(m,d));changed.add(p)
    assert changed==set(patches),(kind,'unapplied files')
    assert sum(d is not None for m,d in items)==cfg['files']
    for i,(m,d) in enumerate(control):
        if m.name.endswith('control'):
            assert b'Version: 2.0.30' in d
            d=d.replace(b'Version: 2.0.30',b'Version: 2.0.35').replace(b'beta 2.0.12',b'beta 2.0.35')
            m.size=len(d);control[i]=(m,d)
    output=write_ar([('debian-binary',ar['debian-binary']),('control.tar.gz',write_tar(control)),('data.tar.gz',write_tar(items))])
    name=f'CactusTV_LG_{kind}_2.0.35_Oficial.ipk'
    (ROOT/name).write_bytes(output)
    app=dict((m.name.lstrip('./'),d) for m,d in read_tar(dict(read_ar(output))['data.tar.gz']) if d is not None)
    assert len(app)==cfg['files']
    for p,x in patches.items():assert hashlib.sha256(app[p]).hexdigest()==x['sha']
    for p,d in app.items():
        if p in original_files and p not in patches:
            assert d==original_files[p],(kind,'unexpected change',p)
        if p.endswith('/appinfo.json'):assert json.loads(d)['version']=='2.0.35'
    assert b'::-webkit-scrollbar' in next(d for p,d in app.items() if p.endswith('/lg-v233.css'))
    print('OK',name,'bytes',len(output),'sha256',hashlib.sha256(output).hexdigest(),'files',len(app),'changes',len(changed))

for kind in ('Standard','webOS6'):build(kind)
