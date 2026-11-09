#!/usr/bin/env python3
"""Cactus TV LG 2.0.26: rendimiento para navegación por control remoto.
A partir de las compilaciones 2.0.24 (LG estándar) y 2.0.25 (webOS 6).
No altera código de reproducción ni fuentes ni proveedores.
"""
import io,sys,tarfile,json,pathlib,hashlib,re
from copy import copy
if len(sys.argv)!=3:raise SystemExit("uso: build-lg-226-performance.py base.ipk resultado.ipk")
SOURCE=pathlib.Path(sys.argv[1])
OUT=pathlib.Path(sys.argv[2])
APP="usr/palm/services/com.cocotecnico.cactustv.lgtest.service/backend/app/"
EXPECTED_VERSION="2.0.25" if "webOS6" in SOURCE.name else "2.0.24"
VERSION="2.0.26"

def replace_one(s,old,new,why):
    count=s.count(old)
    if count!=1:raise RuntimeError("%s: ocurrencias %d"%(why,count))
    return s.replace(old,new)
def segment(s,start,end):
    a=s.find(start)
    b=s.find(end,a+len(start))
    if a<0 or b<0:raise RuntimeError("No encontrado segmento %s ... %s"%(start,end))
    return a,b,s[a:b]
def patch_live(s):
    # 1. Las flechas del mando ya no escanean todos los botones del canal.
    a,b,_=segment(s," function channelButton(id){"," function visible(n){")
    s=s[:a]+""" var channelCache={};
 function channelButton(id){return channelCache[String(id)]||null;}
 """+s[b:]
    # 2. Renderizar con DocumentFragment; las páginas adicionales se agregan
    #    sin volver a destruir las páginas anteriores ni perder el foco.
    a,b,old=segment(s," function renderChannels(){"," function preview(")
    assert "right.appendChild(b)" in old and "current&&current.id===x.id" in old
    new=""" function renderChannels(from){
   var focused=document.activeElement&&document.activeElement.dataset.liveId;
   var append=typeof from==='number'&&from>0&&right.children.length>0&&Object.keys(channelCache).length>=from;
   if(!append){right.textContent='';channelCache={};}
   var fragment=document.createDocumentFragment();
   for(var i=append?from:0;i<rows.length;i++){
    var x=rows[i],b=node('button','live-channel-choice');b.type='button';
    b.dataset.liveId=x.id;b.dataset.index=String(i);
    b.setAttribute('aria-pressed',String(current&&current.id===x.id));
    b.appendChild(node('span','live-channel-number',String(i+1)));
    b.appendChild(node('strong','',x.title));
    b.appendChild(node('span','live-on-air','●'));
    channelCache[String(x.id)]=b;fragment.appendChild(b);
   }
   right.appendChild(fragment);
   el('live-channel-count').textContent=String(total);
   el('live-more').hidden=!hasMore;el('live-more').disabled=busy;
   if(focused&&!append){var keep=channelButton(focused);if(keep)visible(keep);}
 }
 function updateChannelSelection(prev,next){
   var old=channelButton(prev),now=channelButton(next);
   if(old&&old!==now)old.setAttribute('aria-pressed','false');
   if(now)now.setAttribute('aria-pressed','true');
 }
 """
    s=s[:a]+new+s[b:]
    # 3. Cambiar solo el atributo del canal activo, sin redibujar la lista al
    #    enfocar o cambiar canal. La selección, reproducción y el mando siguen igual.
    a,b,preview=segment(s," function preview("," function requestPreview(")
    assert "renderChannels();" in preview,preview[:1500]
    brace=preview.find('{')
    if brace<0:raise RuntimeError("preview sin cuerpo")
    preview=preview[:brace+1]+"var previousId=current&&current.id;"+preview[brace+1:]
    redraws=preview.count("renderChannels();")
    if redraws<1 or redraws>4:raise RuntimeError("preview redibujos inesperados: %d"%redraws)
    preview=preview.replace("renderChannels();","updateChannelSelection(previousId,item.id);")
    s=s[:a]+preview+s[b:]
    # 4. Al cargar la siguiente página, no reconstruir todos los canales previos.
    a,b,load=segment(s," function loadPage("," function selectCategory(")
    needle="page=next;total=data.total;hasMore=data.hasMore===true;renderChannels();"
    assert load.count(needle)==1
    load=load.replace(needle,"page=next;total=data.total;hasMore=data.hasMore===true;renderChannels(next===1?0:old);")
    s=s[:a]+load+s[b:]
    assert "updateChannelSelection(previousId,item.id)" in s
    assert "renderChannels(next===1?0:old)" in s
    return s

def patch_wepa(s):
    # Pre-indexar por categoría y nombre una sola vez durante la carga diferida.
    assert "function getPage(group,page,query,cb)" in s
    s=replace_one(s,"rows=[],sports={},PAGE=40","rows=[],sports={},byKind={},allVisible=[],PAGE=40","wepa.index")
    s=replace_one(s,"rows=[];sports={};for(var i=0;","rows=[];sports={};byKind={};allVisible=[];for(var i=0;","wepa.init")
    s=replace_one(s,"var r=convert(x,i);rows.push(r);if(x.kind==='sports')",
                      "var r=convert(x,i);r._search=normal(r.title);rows.push(r);(byKind[r.kind]||(byKind[r.kind]=[])).push(r);if(r.kind!=='adult')allVisible.push(r);if(x.kind==='sports')","wepa.push")
    a,b,get=segment(s," function getPage(group,page,query,cb){"," function findSport(")
    assert "if(g==='all'&&r.kind==='adult')continue" in get
    new=""" function getPage(group,page,query,cb){ensure(function(err){if(err){cb(err);return;}
  var g=String(group||'all'),q=normal(query),base=g==='all'?allVisible:(byKind[g]||[]),selected=base;
  if(q){selected=[];for(var i=0;i<base.length;i++)if(base[i]._search.indexOf(q)>=0)selected.push(base[i]);}
  var p=Math.max(1,Math.floor(Number(page)||1)),start=(p-1)*PAGE;
  cb(null,{items:selected.slice(start,start+PAGE),page:p,total:selected.length,hasMore:start+PAGE<selected.length});
 });}
 """
    s=s[:a]+new+s[b:]
    return s

def patch_images(s):
    # Evitar comprobaciones de geometría después de cada pulsación de flecha.
    s=replace_one(s,"(window.CACTUS_LG_PERF?85:35)","(window.CACTUS_LG_PERF?150:100)","images.timer")
    s=replace_one(s,"while(active.length<3&&visible.length)","while(active.length<2&&visible.length)","images.concurrency")
    s=replace_one(s,"setInterval(schedule,1600);","setInterval(schedule,4000);","images.interval")
    s=replace_one(s,"document.addEventListener('keydown',schedule);","document.addEventListener('focusin',schedule);","images.nav")
    return s

def patch_browse(s):
    s=replace_one(s,"},100);","},180);","browse.scroll")
    s=replace_one(s,"while(keys.length>(window.CACTUS_LG_PERF?2:3))","while(keys.length>2)","browse.cache")
    return s

def patch_main(s):
    # Inserción agrupada de tarjetas: menos modificaciones del DOM y menos
    # repintados durante un cambio de sección. Restaurar foco tras insertarlas.
    s=replace_one(s,"var items=shown();","var items=shown(),batch=document.createDocumentFragment(),restoreFocus=null;","main.batch")
    s=replace_one(s,"grid.appendChild(card);if(focusedId===x.id){card.focus();lastFocused=card;}",
                 "batch.appendChild(card);if(focusedId===x.id){restoreFocus=card;lastFocused=card;}","main.cards")
    s=replace_one(s,"    }\n  }\n  function mergeData(list)", 
                 "    }\n    grid.appendChild(batch);if(restoreFocus)restoreFocus.focus();\n  }\n  function mergeData(list)","main.commit")
    return s

def ar_read(blob):
    assert blob.startswith(b'!<arch>\n')
    p=8;items=[]
    while p<len(blob):
        h=blob[p:p+60]
        assert len(h)==60 and h[58:60]==bytes((96,10))
        n=h[:16].decode().strip().rstrip('/')
        sz=int(h[48:58]);items.append((n,blob[p+60:p+60+sz]))
        p+=60+sz+sz%2
    assert p==len(blob)
    return dict(items)
def ar_write(items):
    out=io.BytesIO();out.write(b'!<arch>\n')
    for n,b in items:
        h=f'{n:<16}{1794192000:<12}{0:<6}{0:<6}{"100644":<8}{len(b):<10}'+chr(96)+'\n'
        assert len(h)==60
        out.write(h.encode());out.write(b)
        if len(b)%2:out.write(b'\n')
    return out.getvalue()
def tar_read(b):
    with tarfile.open(fileobj=io.BytesIO(b),mode='r:gz') as t:
        return [(copy(m),t.extractfile(m).read() if m.isfile() else None) for m in t]
def tar_write(items):
    out=io.BytesIO()
    with tarfile.open(fileobj=out,mode='w:gz',format=tarfile.USTAR_FORMAT,compresslevel=6) as t:
        for m,b in items:
            x=copy(m);x.uid=x.gid=0;x.uname=x.gname=''
            if b is not None:x.size=len(b)
            t.addfile(x,io.BytesIO(b) if b is not None else None)
    value=out.getvalue()
    return value[:4]+bytes(4)+value[8:]

parts=ar_read(SOURCE.read_bytes())
assert list(parts)==['debian-binary','control.tar.gz','data.tar.gz']
entries=tar_read(parts['data.tar.gz']);control=tar_read(parts['control.tar.gz'])
patchers={"live-view.js":patch_live,"cactus-wepa.js":patch_wepa,"poster-images.js":patch_images,
          "browse-shelves.js":patch_browse,"main.js":patch_main}
changed=[]
for i,(m,data) in enumerate(entries):
    if data is None:continue
    n=m.name.lstrip('./')
    suffix=n[len(APP):] if n.startswith(APP) else ""
    if suffix in patchers:
        updated=patchers[suffix](data.decode('utf8')).encode('utf8')
        assert updated!=data
        data=updated;changed.append(suffix)
    elif n.endswith('/appinfo.json'):
        meta=json.loads(data)
        assert meta['version']==EXPECTED_VERSION, (meta['version'],EXPECTED_VERSION)
        meta['version']=VERSION
        meta['appDescription']="Beta LG de rendimiento: navegación fluida y listas de canales eficientes."
        data=json.dumps(meta,indent=2,ensure_ascii=False).encode()
        changed.append("appinfo.json")
    elif n.endswith('/services.json') or n.endswith('/packageinfo.json'):
        meta=json.loads(data)
        if 'version' in meta:meta['version']=VERSION
        data=json.dumps(meta,indent=2,ensure_ascii=False).encode()
        changed.append(n.rsplit('/',1)[-1])
    m.size=len(data);entries[i]=(m,data)
assert set(patchers).issubset(set(changed)),changed
for i,(m,b) in enumerate(control):
    if m.name.endswith('control'):
        original=("Version: "+EXPECTED_VERSION).encode()
        assert original in b
        b=b.replace(original,("Version: "+VERSION).encode())
        m.size=len(b);control[i]=(m,b)
output=ar_write([('debian-binary',parts['debian-binary']),
                 ('control.tar.gz',tar_write(control)),
                 ('data.tar.gz',tar_write(entries))])
verified=tar_read(ar_read(output)['data.tar.gz'])
assert len(verified)==len(entries)
assert [(m.name,b) for m,b in verified]==[(m.name,b) for m,b in entries]
OUT.write_bytes(output)
print("BUILT",OUT,"SHA256",hashlib.sha256(output).hexdigest(),"SIZE",len(output))
print("MODIFIED",sorted(changed))
