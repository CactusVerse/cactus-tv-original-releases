#!/usr/bin/env python3
"""LG 2.0.27: rescatar carátulas del LG 2.0.12, conservando canales y navegación 2.0.26."""
import io, json, tarfile, pathlib, hashlib, sys
from copy import copy

if len(sys.argv)!=4:
    raise SystemExit("uso: fix-lg-posters-227.py BASE226.ipk BASE212.ipk OUTPUT227.ipk")
current=pathlib.Path(sys.argv[1]); stable=pathlib.Path(sys.argv[2]); out=pathlib.Path(sys.argv[3])
VERSION="2.0.27"
app="usr/palm/services/com.cocotecnico.cactustv.lgtest.service/backend/app/"

def ar_read(data):
    assert data.startswith(b'!<arch>\n')
    pos=8;rows=[]
    while pos<len(data):
        h=data[pos:pos+60];n=h[:16].decode("ascii").strip().rstrip('/')
        assert h[58:60]==bytes((96,10))
        size=int(h[48:58]);rows.append((n,data[pos+60:pos+60+size]))
        pos+=60+size+size%2
    assert pos==len(data)
    return dict(rows)

def ar_pack(rows):
    out=io.BytesIO();out.write(b'!<arch>\n')
    for n,content in rows:
        h=f'{n:<16}{1794192000:<12}{0:<6}{0:<6}{"100644":<8}{len(content):<10}'+chr(96)+'\n'
        assert len(h)==60
        out.write(h.encode("ascii"));out.write(content)
        if len(content)%2:out.write(b'\n')
    return out.getvalue()

def tar_read(content):
    with tarfile.open(fileobj=io.BytesIO(content),mode="r:gz") as t:
        return [(copy(m),t.extractfile(m).read() if m.isfile() else None) for m in t]

def tar_pack(rows):
    out=io.BytesIO()
    with tarfile.open(fileobj=out,mode="w:gz",format=tarfile.USTAR_FORMAT,compresslevel=6) as t:
        for m,raw in rows:
            x=copy(m);x.uid=x.gid=0;x.uname=x.gname=''
            if raw is not None:x.size=len(raw)
            t.addfile(x,io.BytesIO(raw) if raw is not None else None)
    data=out.getvalue()
    return data[:4]+bytes(4)+data[8:]

def keyed(rows):
    return {m.name.lstrip('./'):raw for m,raw in rows if raw is not None}

def replace_exact(s, old, new, description):
    c=s.count(old)
    if c!=1:raise RuntimeError("%s found %s times"%(description,c))
    return s.replace(old,new)

old=ar_read(stable.read_bytes())
new=ar_read(current.read_bytes())
assert set(old)==set(new)=={"debian-binary","control.tar.gz","data.tar.gz"}
archived=keyed(tar_read(old["data.tar.gz"]))
rows=tar_read(new["data.tar.gz"])
ctrl=tar_read(new["control.tar.gz"])
old_image=archived[app+"poster-images.js"]
old_api=archived[app+"direct-api.js"].decode("utf8")
first=old_api.index(" function withCatalogueArtwork(")
last=old_api.index(" function remember(",first)
preserve=old_api[first:last]
assert "function withCatalogueArtwork(" in preserve and "posterList" in preserve
assert 'window.CACTUS_IMAGES' in old_image.decode("utf8")
changes=[]
for k,(m,raw) in enumerate(rows):
    if raw is None:continue
    n=m.name.lstrip('./')
    if n==app+"poster-images.js":
        assert raw!=old_image,"El cargador de imágenes ya es idéntico al original"
        raw=old_image
        changes.append("poster-images.js")
    elif n==app+"direct-api.js":
        src=raw.decode("utf8")
        assert "function withCatalogueArtwork(" not in src
        anchor=" function remember("
        src=replace_exact(src,anchor,preserve+anchor,"insert old artwork safeguard")
        previous="r=supplementArtwork(r,records[id]&&records[id].raw);r=supplementArtwork(r,boot&&boot.records[id]);"
        updated="r=withCatalogueArtwork(r,id);"+previous
        src=replace_exact(src,previous,updated,"preserve old catalog artwork in remember")
        # En consultas a una ficha registrada, volver a consultar primero las
        # portadas existentes del catálogo, sin pisarlas con miniaturas vacías.
        oldrec="if(raw&&!artwork(r.raw,false))r.raw=Object.assign({},raw,r.raw);"
        newrec="if(raw&&!artwork(r.raw,false))r.raw=withCatalogueArtwork(r.raw,id);"
        src=replace_exact(src,oldrec,newrec,"restore poster from known ID")
        raw=src.encode("utf8")
        changes.append("direct-api.js")
    elif n.endswith("/appinfo.json"):
        d=json.loads(raw)
        assert d["version"]=="2.0.26"
        d["version"]=VERSION
        d["appDescription"]="LG beta: carátulas restauradas, navegación optimizada y nuevos canales."
        raw=json.dumps(d,ensure_ascii=False,indent=2).encode()
        changes.append("appinfo.json")
    elif n.endswith("/services.json") or n.endswith("/packageinfo.json"):
        d=json.loads(raw)
        if "version" in d:d["version"]=VERSION
        raw=json.dumps(d,ensure_ascii=False,indent=2).encode()
        changes.append(n.rsplit("/",1)[-1])
    m.size=len(raw)
    rows[k]=(m,raw)
assert set(changes)=={"poster-images.js","direct-api.js","appinfo.json","services.json","packageinfo.json"},changes
for i,(m,raw) in enumerate(ctrl):
    if m.name.endswith("control"):
        assert b"Version: 2.0.26" in raw
        raw=raw.replace(b"Version: 2.0.26",b"Version: 2.0.27")
        m.size=len(raw);ctrl[i]=(m,raw)
result=ar_pack([("debian-binary",new["debian-binary"]),
                ("control.tar.gz",tar_pack(ctrl)),
                ("data.tar.gz",tar_pack(rows))])
extracted=keyed(tar_read(ar_read(result)["data.tar.gz"]))
assert len(extracted)==len(keyed(tar_read(new["data.tar.gz"])))
assert extracted[app+"poster-images.js"]==old_image
assert "function withCatalogueArtwork(" in extracted[app+"direct-api.js"].decode("utf8")
assert json.loads(next(v for k,v in extracted.items() if k.endswith("/appinfo.json")))["version"]==VERSION
out.write_bytes(result)
print("OUTPUT",out,"BYTES",len(result),"SHA256",hashlib.sha256(result).hexdigest(),"FILES_CHANGED",changes)
