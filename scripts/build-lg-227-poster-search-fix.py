#!/usr/bin/env python3
"""Restaurar carátulas originales LG y evitar congelamientos del buscador de TV.
   Versiones de prueba separadas; conserva categorías/streaming de los paquetes 224 y 225.
"""
import io, tarfile, json, pathlib, hashlib, re
from copy import copy

BASES=[
    ('lg224.ipk','CactusTV_LG_Standard_2.0.27_Posters_Busqueda_Beta.ipk','2.0.24'),
    ('lg225.ipk','CactusTV_LG_webOS6_2.0.27_Posters_Busqueda_Beta.ipk','2.0.25')
]
LEGACY=pathlib.Path('lg212.ipk')
VERSION='2.0.27'

def arread(raw):
    assert raw.startswith(b'!<arch>\n')
    p=8; result={}
    while p<len(raw):
        head=raw[p:p+60]
        assert head[58:60]==bytes((96,10))
        name=head[:16].decode('ascii').strip().rstrip('/')
        size=int(head[48:58]); result[name]=raw[p+60:p+60+size]
        p+=60+size+size%2
    assert p==len(raw)
    return result

def arwrite(items):
    out=io.BytesIO();out.write(b'!<arch>\n')
    for name,raw in items:
        head=f'{name:<16}{1794192000:<12}{0:<6}{0:<6}{"100644":<8}{len(raw):<10}'+chr(96)+'\n'
        assert len(head)==60
        out.write(head.encode());out.write(raw)
        if len(raw)%2:out.write(b'\n')
    return out.getvalue()

def untar(raw):
    with tarfile.open(fileobj=io.BytesIO(raw),mode='r:gz') as src:
        return [(copy(m),src.extractfile(m).read() if m.isfile() else None) for m in src]

def totar(entries):
    out=io.BytesIO()
    with tarfile.open(fileobj=out,mode='w:gz',format=tarfile.USTAR_FORMAT,compresslevel=6) as tar:
        for m,raw in entries:
            item=copy(m);item.uid=item.gid=0;item.uname=item.gname=''
            if raw is not None:item.size=len(raw)
            tar.addfile(item,io.BytesIO(raw) if raw is not None else None)
    b=out.getvalue()
    return b[:4]+bytes(4)+b[8:]

def replace_once(data,from_,to_):
    n=data.count(from_)
    assert n==1,(from_[:110],n)
    return data.replace(from_,to_,1)

base_212=arread(LEGACY.read_bytes())
legacy_entries=untar(base_212['data.tar.gz'])
lg_api=next(raw.decode('utf8') for m,raw in legacy_entries if m.name.endswith('/backend/app/direct-api.js'))
start=lg_api.index(' function withCatalogueArtwork(r,id){')
end=lg_api.index(' function remember(',start)
restore_fallback=lg_api[start:end]
assert 'if(cover)merged.poster=cover;' in restore_fallback
assert 'if(wide)merged.wide=wide;' in restore_fallback

for base_file,out_file,old_version in BASES:
    ar=arread(pathlib.Path(base_file).read_bytes())
    assert list(ar)==['debian-binary','control.tar.gz','data.tar.gz']
    entries=untar(ar['data.tar.gz']);control=untar(ar['control.tar.gz'])
    is_webos6=old_version=='2.0.25'
    changed=[]
    updated=[]
    for m,body in entries:
        if body is None:updated.append((m,body));continue
        name=m.name.lstrip('./')
        if name.endswith('/backend/app/direct-api.js'):
            source=body.decode('utf8')
            assert 'function withCatalogueArtwork(' not in source
            source=replace_once(source,' function supplementArtwork(',restore_fallback+' function supplementArtwork(')
            source=replace_once(source,
               'r=supplementArtwork(r,records[id]&&records[id].raw);r=supplementArtwork(r,boot&&boot.records[id]);records[id]={raw:r,',
               'r=withCatalogueArtwork(r,id);records[id]={raw:r,')
            assert source.count('function withCatalogueArtwork(')==1
            assert source.count('r=withCatalogueArtwork(r,id);')==1
            body=source.encode('utf8');changed.append('direct-api.js')
        elif name.endswith('/backend/app/live-view.js'):
            source=body.decode('utf8')
            source=replace_once(source,
                ' function el(id){',
                ' var lgSearchTimer=null;\n function el(id){')
            source=replace_once(source,
                ' function selectCategory(id,done){',
                ' function selectCategory(id,done){clearTimeout(lgSearchTimer);')
            source=replace_once(source,
                ' function close(){',
                ' function close(){clearTimeout(lgSearchTimer);')
            source=replace_once(source,
                'applyExtraFilter(Boolean(data));',
                'applyExtraFilter(Boolean(data)&&!query);')
            # Loading results must never open a channel when a search is active.
            from_='if(next===1&&rows.length&&(!current||!rows.some(function(x){return x.id===current.id;})))'
            to_='if(next===1&&!query&&rows.length&&(!current||!rows.some(function(x){return x.id===current.id;})))'
            source=replace_once(source,from_,to_)
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
            source=replace_once(source,old_search,new_search)
            assert source.count('lgSearchTimer=setTimeout(')==1
            assert source.count('applyExtraFilter(false)')>=1
            body=source.encode('utf8');changed.append('live-view.js')
        elif is_webos6 and name.endswith('/backend/app/lite-catalog.js'):
            source=body.decode('utf8')
            from_=(" var images=w.CACTUS_IMAGES;\n"
                   " if(images&&typeof images.attach==='function'){\n"
                   "   var attach=images.attach;\n"
                   "   images.attach=function(node,url){if(titles())return node;return attach.apply(this,arguments);};\n"
                   " }\n")
            to_=(" /* Limitar 'Solo títulos' a las tarjetas del catálogo: nunca bloquear\n"
                 "    imágenes en fichas, episodios, búsquedas o detalles. */\n")
            source=replace_once(source,from_,to_)
            assert 'images.attach=function' not in source
            body=source.encode('utf8');changed.append('lite-catalog.js')
        elif is_webos6 and name.endswith('/backend/app/main.js'):
            source=body.decode('utf8')
            source=replace_once(source,
              'var poster=el(\'span\',\'poster\'),image=posterFor(x);if(safeImage(image)){',
              'var poster=el(\'span\',\'poster\'),image=posterFor(x);if(safeImage(image)&&!(window.CACTUS_LIGHT&&window.CACTUS_LIGHT.titles())){')
            # Continue section may use the logo instead of a hidden poster in light mode.
            source=replace_once(source,
              "art=safeImage(url)?url:'logo.svg',img=cover.querySelector('img');",
              "art=safeImage(url)&&!(window.CACTUS_LIGHT&&window.CACTUS_LIGHT.titles())?url:'logo.svg',img=cover.querySelector('img');")
            body=source.encode('utf8');changed.append('main.js')
        elif is_webos6 and name.endswith('/backend/app/browse-shelves.js'):
            source=body.decode('utf8')
            source=replace_once(source,
              'if(api.safeImage(src)){var img=document.createElement(\'img\');',
              "if(api.safeImage(src)&&!(window.CACTUS_LIGHT&&window.CACTUS_LIGHT.titles())){var img=document.createElement('img');")
            body=source.encode('utf8');changed.append('browse-shelves.js')
        elif name.endswith('/appinfo.json'):
            obj=json.loads(body)
            assert obj['version']==old_version
            obj['version']=VERSION
            obj['appDescription']='Beta LG: carátulas recuperadas y búsqueda TV en vivo sin reproducción automática.'
            body=json.dumps(obj,ensure_ascii=False,indent=2).encode('utf8');changed.append('appinfo.json')
        elif name.endswith('/services.json') or name.endswith('/packageinfo.json'):
            obj=json.loads(body)
            if obj.get('version')==old_version:obj['version']=VERSION
            body=json.dumps(obj,ensure_ascii=False,indent=2).encode('utf8');changed.append(name.rsplit('/',1)[-1])
        m.size=len(body);updated.append((m,body))
    mandatory={'direct-api.js','live-view.js','appinfo.json'}
    if is_webos6:mandatory|={'lite-catalog.js','main.js','browse-shelves.js'}
    assert mandatory<=set(changed),(changed,mandatory)
    for i,(m,body) in enumerate(control):
        if m.name.endswith('control'):
            needle=('Version: '+old_version).encode('ascii')
            assert needle in body
            body=body.replace(needle,('Version: '+VERSION).encode('ascii'))
            m.size=len(body);control[i]=(m,body)
    result=arwrite([('debian-binary',ar['debian-binary']),
                    ('control.tar.gz',totar(control)),
                    ('data.tar.gz',totar(updated))])
    check=untar(arread(result)['data.tar.gz'])
    assert [(m.name,x) for m,x in check]==[(m.name,x) for m,x in updated]
    pathlib.Path(out_file).write_bytes(result)
    print('OUTPUT',out_file,'BYTES',len(result),'SHA256',hashlib.sha256(result).hexdigest(),'CHANGED',sorted(changed))
