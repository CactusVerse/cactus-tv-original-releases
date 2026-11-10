#!/usr/bin/env python3
"""LG 2.0.28: rescatar carátulas y arreglar modo ligero / búsqueda del LG 2.0.12, conservando canales y navegación 2.0.26."""
import io, json, tarfile, pathlib, hashlib, sys
from copy import copy

if len(sys.argv)!=4:
    raise SystemExit("uso: fix-lg-posters-227.py BASE226.ipk BASE212.ipk OUTPUT227.ipk")
current=pathlib.Path(sys.argv[1]); stable=pathlib.Path(sys.argv[2]); out=pathlib.Path(sys.argv[3])
VERSION="2.0.28"
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

is_webos6="webOS6" in current.name
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
        updated="r=withCatalogueArtwork(r,id);"
        src=replace_exact(src,previous,updated,"preserve old catalog artwork in remember")
        # En consultas a una ficha registrada, volver a consultar primero las
        # portadas existentes del catálogo, sin pisarlas con miniaturas vacías.
        oldrec="if(raw&&!artwork(r.raw,false))r.raw=Object.assign({},raw,r.raw);"
        newrec="if(raw&&!artwork(r.raw,false))r.raw=withCatalogueArtwork(r.raw,id);"
        src=replace_exact(src,oldrec,newrec,"restore poster from known ID")
        raw=src.encode("utf8")
        changes.append("direct-api.js")
    elif n==app+"live-view.js":
        src=raw.decode("utf8")
        src=replace_exact(src," function el(id){"," var lgSearchTimer=null;\n function el(id){","search timer")
        src=replace_exact(src," function selectCategory(id,done){"," function selectCategory(id,done){clearTimeout(lgSearchTimer);","cancel search on category switch")
        src=replace_exact(src," function close(){"," function close(){clearTimeout(lgSearchTimer);","cancel search on exit")
        src=replace_exact(src,"applyExtraFilter(Boolean(data));","applyExtraFilter(Boolean(data)&&!query);","avoid extra reset")
        from_="if(next===1&&rows.length&&(!current||!rows.some(function(x){return x.id===current.id;})))"
        to_="if(next===1&&!query&&rows.length&&(!current||!rows.some(function(x){return x.id===current.id;})))"
        src=replace_exact(src,from_,to_,"avoid autoplay when searching")
        old_search=("search:function(value,done){value=String(value||'').slice(0,70);"
                    "if(category==='extras'){query=value;applyExtraFilter(true);if(done)done(null);return;}"
                    "++sequence;busy=false;query=value;loadPage(1,false,done);}")
        new_search=("search:function(value,done){value=String(value||'').slice(0,70);"
                    "clearTimeout(lgSearchTimer);clearTimeout(focusTimer);"
                    "if(typeof lgWarmTimer!=='undefined')clearTimeout(lgWarmTimer);"
                    "if(typeof lgRetryTimer!=='undefined')clearTimeout(lgRetryTimer);"
                    "++sequence;busy=false;query=value;"
                    "if(current){player.close();current=null;connection='idle';}"
                    "lgSearchTimer=setTimeout(function(){if(!active)return;"
                    "if(category==='extras'){applyExtraFilter(false);if(done)done(null);return;}"
                    "loadPage(1,false,done);},450);}")
        src=replace_exact(src,old_search,new_search,"debounced live search")
        raw=src.encode("utf8")
        changes.append("live-view.js")
    elif is_webos6 and n==app+"lite-catalog.js":
        src=raw.decode("utf8")
        from_=(" var images=w.CACTUS_IMAGES;\n"
               " if(images&&typeof images.attach==='function'){\n"
               "   var attach=images.attach;\n"
               "   images.attach=function(node,url){if(titles())return node;return attach.apply(this,arguments);};\n"
               " }\n")
        to_=(" /* El modo Solo títulos solo afecta las listas del catálogo;\n"
             "    nunca bloquear imágenes de fichas, episodios o detalles. */\n")
        src=replace_exact(src,from_,to_,"limit light mode to catalog")
        raw=src.encode("utf8")
        changes.append("lite-catalog.js")
    elif is_webos6 and n==app+"main.js":
        src=raw.decode("utf8")
        src=replace_exact(src,
           "var poster=el('span','poster'),image=posterFor(x);if(safeImage(image)){",
           "var poster=el('span','poster'),image=posterFor(x);if(safeImage(image)&&!(window.CACTUS_LIGHT&&window.CACTUS_LIGHT.titles())){",
           "light mode only for grid posters")
        src=replace_exact(src,
           "art=safeImage(url)?url:'logo.svg',img=cover.querySelector('img');",
           "art=safeImage(url)&&!(window.CACTUS_LIGHT&&window.CACTUS_LIGHT.titles())?url:'logo.svg',img=cover.querySelector('img');",
           "light mode continue watching")
        raw=src.encode("utf8")
        changes.append("main.js")
    elif is_webos6 and n==app+"browse-shelves.js":
        src=raw.decode("utf8")
        src=replace_exact(src,
          "if(api.safeImage(src)){var img=document.createElement('img');",
          "if(api.safeImage(src)&&!(window.CACTUS_LIGHT&&window.CACTUS_LIGHT.titles())){var img=document.createElement('img');",
          "light mode shelf posters")
        raw=src.encode("utf8")
        changes.append("browse-shelves.js")
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
expected={"poster-images.js","direct-api.js","live-view.js","appinfo.json","services.json","packageinfo.json"}
if is_webos6:expected|={"lite-catalog.js","main.js","browse-shelves.js"}
assert set(changes)==expected,(changes,expected)
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
