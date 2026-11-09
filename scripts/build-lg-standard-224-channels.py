#!/usr/bin/env python3
"""Portar módulos de canales de Samsung 049 a LG 2.0.12, conservando webOS, reproductor y barra LG."""
import io,tarfile,json,zipfile,hashlib,pathlib,re
from copy import copy

BASE=pathlib.Path("lg-base.ipk")
SAMSUNG=pathlib.Path("samsung049.wgt")
OUT=pathlib.Path("CactusTV_LG_Standard_2.0.24_Canales_Beta.ipk")
APPID="com.cocotecnico.cactustv.lgtest"
DEST="usr/palm/services/"+APPID+".service/backend/app/"
SOURCE_NAMES=['live-catalog.js','live-view.js','providers.js','provider-worker.js','direct-api.js']
NEW_NAMES=['cactus-wepa.js','wepa-catalog.json','sports-extras.json']

def arread(raw):
    assert raw.startswith(b'!<arch>\n')
    p=8;items=[]
    while p<len(raw):
        h=raw[p:p+60];sz=int(h[48:58]);name=h[:16].decode().strip().rstrip('/')
        assert h[58:60]==bytes((96,10))
        items.append((name,raw[p+60:p+60+sz]));p+=60+sz+sz%2
    assert p==len(raw)
    return dict(items)
def arwrite(rows):
    out=io.BytesIO();out.write(b'!<arch>\n')
    for name,body in rows:
        hdr=f'{name:<16}{1794192000:<12}{0:<6}{0:<6}{"100644":<8}{len(body):<10}'+chr(96)+'\n'
        assert len(hdr)==60
        out.write(hdr.encode());out.write(body)
        if len(body)%2:out.write(b'\n')
    return out.getvalue()
def readtar(blob):
    with tarfile.open(fileobj=io.BytesIO(blob),mode='r:gz') as t:
        return [(copy(m),t.extractfile(m).read() if m.isfile() else None) for m in t]
def writetar(items):
    out=io.BytesIO()
    with tarfile.open(fileobj=out,mode='w:gz',format=tarfile.USTAR_FORMAT,compresslevel=6) as t:
        for m,b in items:
            item=copy(m);item.uid=item.gid=0;item.uname=item.gname=''
            if b is not None:item.size=len(b)
            t.addfile(item,io.BytesIO(b) if b is not None else None)
    value=out.getvalue()
    # Avoid gzip extended flags that older webOS package extractors reject.
    return value[:4]+bytes(4)+value[8:]

parts=arread(BASE.read_bytes())
assert list(parts)==['debian-binary','control.tar.gz','data.tar.gz']
assert parts['debian-binary']==b'2.0\n'
entries=readtar(parts['data.tar.gz'])
controls=readtar(parts['control.tar.gz'])
with zipfile.ZipFile(SAMSUNG) as samsung:
    assert samsung.testzip() is None
    present=set(samsung.namelist())
    assert set(SOURCE_NAMES+NEW_NAMES)<=present
    fresh={name:samsung.read(name) for name in SOURCE_NAMES+NEW_NAMES}
    channels=json.loads(fresh['wepa-catalog.json'])
    assert channels['schema']==1 and len(channels['channels'])>=1700
    sports=json.loads(fresh['sports-extras.json'])
    assert 'linked' in sports and 'additional' in sports
    assert len(sports['additional'])>=10

# Preserve LG image proxy / fallback logic. It is a platform-specific patch
# missing from Samsung; do not regress the already fixed LG poster loading.
original={}
for m,body in entries:
    base=m.name.lstrip('./').split('/backend/app/')
    if len(base)==2:original[base[1]]=body
lg_api=original['direct-api.js'].decode('utf8')
fresh_api=fresh['direct-api.js'].decode('utf8')
start=' function image(v){'
stop=' function cid(r){'
assert lg_api.count(start)==1 and lg_api.count(stop)==1
assert fresh_api.count(start)==1 and fresh_api.count(stop)==1
a=lg_api.index(start);b=lg_api.index(stop)
newa=fresh_api.index(start);newb=fresh_api.index(stop)
lg_artwork=lg_api[a:b]
fresh_api=fresh_api[:newa]+lg_artwork+fresh_api[newb:]
assert 'function imagePath(' in fresh_api
assert 'sportsExtras' in fresh_api and 'sportsExtrasRefresh' in fresh_api
fresh['direct-api.js']=fresh_api.encode('utf8')

# Keep app-specific styles and launcher. Add only modest category decoration,
# without pulling Samsung AVPlay CSS or replacing the webOS video engine.
style=r"""
/* Nuevos apartados de canales — paginados, adecuados para mando LG */
.live-category-sports{border-color:#c79a5e!important;}
.live-channel-choice[data-source="wepa"]{min-height:44px;}
/* Botón Regresar acompaña al HUD de reproducción (LG 2.0.23). */
body.is-playing #player .lg-back-player{transition:opacity .2s ease}
body.is-playing.controls-hidden #player .lg-back-player{opacity:0;visibility:hidden;pointer-events:none}
"""
count={};copied=set()
rewritten=[]
for m,body in entries:
    name=m.name.lstrip('./')
    suffix=name[len(DEST):] if name.startswith(DEST) else None
    if suffix in SOURCE_NAMES:
        body=fresh[suffix];count[suffix]=count.get(suffix,0)+1;copied.add(suffix)
    elif suffix=='index.html':
        html=body.decode('utf8')
        needle='<script src="live-view.js"></script>'
        assert html.count(needle)==1
        html=html.replace(needle,'<script src="cactus-wepa.js"></script>\n  '+needle)
        body=html.encode('utf8');count['index.html']=1
    elif suffix=='lg-tv-enhancements.css':
        css=body.decode('utf8')
        assert 'body.is-playing.controls-hidden #player .lg-back-player' not in css
        body=(css+'\n'+style).encode('utf8')
        count['lg-tv-enhancements.css']=1
    elif name.endswith('/appinfo.json'):
        data=json.loads(body)
        assert data['version']=='2.0.12' and data['resolution']=='1920x1080'
        data['version']='2.0.24'
        data['title']='Cactus TV LG Beta R9'
        data['appDescription']='Beta LG: canales adicionales de Samsung 049, Wepa por paginas y regreso ocultable.'
        body=json.dumps(data,ensure_ascii=False,indent=2).encode('utf8')
        count['appinfo.json']=count.get('appinfo.json',0)+1
    elif name.endswith('/services.json') or name.endswith('/packageinfo.json'):
        data=json.loads(body)
        if 'version' in data:data['version']='2.0.24'
        body=json.dumps(data,ensure_ascii=False,indent=2).encode('utf8')
        count[name.split('/')[-1]]=1
    if body is not None:m.size=len(body)
    rewritten.append((m,body))
assert copied==set(SOURCE_NAMES),copied
assert count['index.html']==1 and count['lg-tv-enhancements.css']==1
assert count['appinfo.json']==1

# Include Samsung-derived catalog adapter and metadata; preserve source credits.
for name in NEW_NAMES:
    rel=DEST+name
    assert not any(m.name.lstrip('./')==rel for m,_ in rewritten)
    m=tarfile.TarInfo(rel);m.mode=0o644;m.mtime=1794192000;m.size=len(fresh[name])
    rewritten.append((m,fresh[name]))
for i,(m,body) in enumerate(controls):
    if m.name.endswith('control'):
        assert b'Version: 2.0.12' in body
        body=body.replace(b'Version: 2.0.12',b'Version: 2.0.24')
        m.size=len(body);controls[i]=(m,body)
output=arwrite([('debian-binary',parts['debian-binary']),
                ('control.tar.gz',writetar(controls)),
                ('data.tar.gz',writetar(rewritten))])
verified=readtar(arread(output)['data.tar.gz'])
check={m.name.lstrip('./'):body for m,body in verified if m.isfile()}
assert len(verified)==len(rewritten)
assert all(name in check for name in [DEST+n for n in SOURCE_NAMES+NEW_NAMES])
assert b'cactus-wepa.js' in check[DEST+'index.html']
assert b'function imagePath' in check[DEST+'direct-api.js']
assert len(json.loads(check[DEST+'wepa-catalog.json'])['channels'])==len(channels['channels'])
assert json.loads(next(b for n,b in check.items() if n.endswith('/appinfo.json')))['version']=='2.0.24'
OUT.write_bytes(output)
print('NEW_VERSION',OUT)
print('SHA256',hashlib.sha256(output).hexdigest(),'SIZE',len(output))
print('UPDATED_FILES',sorted(count))
print('ADDED_FILES',NEW_NAMES)
print('CHANNEL_RECORDS',len(channels['channels']),'EXTRA_SPORTS',len(sports['additional']))
