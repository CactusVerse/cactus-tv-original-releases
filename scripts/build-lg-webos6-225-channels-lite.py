#!/usr/bin/env python3
"""Crear variante LG webOS 6 con nuevos canales y modo ligero opcional."""
import io,tarfile,json,pathlib,hashlib,re
from copy import copy

src=pathlib.Path("lg224.ipk")
dest=pathlib.Path("CactusTV_LG_webOS6_2.0.25_Canales_Ligero_Beta.ipk")
appdir="usr/palm/services/com.cocotecnico.cactustv.lgtest.service/backend/app/"
light_js=b"""/* LG webOS 6: modo ligero sin solicitudes de caratulas en las listas. */
(function(w,d){'use strict';
 function titles(){try{return w.CACTUS_SETTINGS.get().artwork==='titles';}catch(e){return false;}}
 function sync(){d.body.classList.toggle('cactus-titles-only',titles());}
 var images=w.CACTUS_IMAGES;
 if(images&&typeof images.attach==='function'){
   var attach=images.attach;
   images.attach=function(node,url){if(titles())return node;return attach.apply(this,arguments);};
 }
 w.CACTUS_LIGHT={titles:titles,sync:sync};
 d.addEventListener('cactussettingschange',sync);
 d.addEventListener('cactusprofilechange',sync);
 sync();
})(window,document);
"""
css=r"""
/* LG webOS6: modo solo títulos, preferencia voluntaria sin descarga de pósteres. */
body.cactus-titles-only .catalog .media-card,
body.cactus-titles-only .shelf-cards .media-card{min-height:120px;height:auto;background:#33261e;border-color:#785b40;}
body.cactus-titles-only .catalog .media-card .poster,
body.cactus-titles-only .shelf-cards .media-card .poster{display:none!important;}
body.cactus-titles-only .catalog .card-info,
body.cactus-titles-only .shelf-cards .card-info{flex:1;min-height:120px;padding:16px;justify-content:center;gap:9px;}
body.cactus-titles-only .catalog .card-info strong,
body.cactus-titles-only .shelf-cards .card-info strong{font-size:20px;line-height:1.25;}
body.cactus-titles-only .continue-card .continue-art{display:none!important;}
body.cactus-titles-only .continue-card{min-height:130px;}
body.cactus-titles-only .hero-reel #reel-image{display:none!important;}
body.cactus-titles-only .hero-reel{background:#211812!important;}
"""

def arread(b):
    assert b.startswith(b'!<arch>\n')
    p=8;items={}
    while p<len(b):
        h=b[p:p+60];size=int(h[48:58]);name=h[:16].decode().strip().rstrip('/')
        items[name]=b[p+60:p+60+size];p+=60+size+size%2
    assert p==len(b)
    return items
def tarread(b):
    with tarfile.open(fileobj=io.BytesIO(b),mode='r:gz') as t:
        return [(copy(m),t.extractfile(m).read() if m.isfile() else None) for m in t]
def tarwrite(items):
    out=io.BytesIO()
    with tarfile.open(fileobj=out,mode='w:gz',format=tarfile.USTAR_FORMAT,compresslevel=6) as z:
        for m,b in items:
            x=copy(m);x.uid=x.gid=0;x.uname=x.gname=''
            if b is not None:x.size=len(b)
            z.addfile(x,io.BytesIO(b) if b is not None else None)
    b=out.getvalue()
    return b[:4]+bytes(4)+b[8:]
def arwrite(rows):
    out=io.BytesIO();out.write(b'!<arch>\n')
    for n,b in rows:
        h=f'{n:<16}{1794192000:<12}{0:<6}{0:<6}{"100644":<8}{len(b):<10}'+chr(96)+'\n'
        assert len(h)==60
        out.write(h.encode());out.write(b)
        if len(b)%2:out.write(b'\n')
    return out.getvalue()
def once(s,a,b):
    assert s.count(a)==1,(a,s.count(a))
    return s.replace(a,b)

chunks=arread(src.read_bytes())
files=tarread(chunks['data.tar.gz']);ctrl=tarread(chunks['control.tar.gz'])
names={m.name.lstrip('./') for m,_ in files}
assert appdir+'lite-catalog.js' not in names
changes=[]
updated=[]
for m,b in files:
    if b is None:updated.append((m,b));continue
    n=m.name.lstrip('./')
    if n==appdir+'settings.js':
        s=b.decode('utf8')
        a="  {key:'autoNext',tab:'playback',name:'Reproducir el siguiente capítulo',values:['on','off'],labels:['Activado','Desactivado'],value:'on'},"
        x="  {key:'artwork',tab:'performance',name:'Carátulas del catálogo',values:['full','titles'],labels:['Con imágenes','Solo títulos (menos memoria y datos)'],value:'full'},"
        s=once(s,a,a+'\n'+x)
        b=s.encode();changes.append('settings.js')
    elif n==appdir+'index.html':
        s=b.decode('utf8')
        a='  <script src="settings.js"></script>'
        s=once(s,a,a+'\n  <script src="lite-catalog.js"></script>')
        s=s.replace('Cactus TV · LG Beta 2.0.11 · Revisión 9','Cactus TV · LG Beta 2.0.25 · webOS 6 · Revisión 9')
        b=s.encode();changes.append('index.html')
    elif n==appdir+'lg-tv-enhancements.css':
        b=(b.decode('utf8')+'\n'+css).encode('utf8');changes.append('lg-tv-enhancements.css')
    elif n==appdir+'main.js':
        s=b.decode('utf8')
        a="document.addEventListener('cactusartworkchange',renderContinue);"
        new="document.addEventListener('cactussettingschange',function(){if(window.CACTUS_IMAGES&&window.CACTUS_IMAGES.release)window.CACTUS_IMAGES.release(grid);render();renderContinue();});"
        s=once(s,a,new+a)
        b=s.encode('utf8');changes.append('main.js')
    elif n==appdir+'browse-shelves.js':
        s=b.decode('utf8')
        a='window.CACTUS_BROWSE={'
        extra="document.addEventListener('cactussettingschange',function(){if(current&&enabled){current.rows.forEach(function(entry){if(entry.data){entry.signature='';fill(current,entry,entry.data);}});}});"
        s=once(s,a,extra+a)
        b=s.encode('utf8');changes.append('browse-shelves.js')
    elif n==appdir+'live-view.js':
        s=b.decode('utf8')
        s=once(s,' function el(id){'," var lgWarmTimer=null,lgRetryTimer=null,lgInitial=false,lgRetried=false;\n function el(id){")
        s=once(s,' function preview(item){'," function preview(item,initial){clearTimeout(lgWarmTimer);clearTimeout(lgRetryTimer);lgInitial=!!initial;lgRetried=false;")
        a=' function requestPreview(item){'
        extra=(" function warmPreview(item){clearTimeout(lgWarmTimer);if(!item)return;"
               "lgWarmTimer=setTimeout(function(){if(active&&item&&rows.some(function(x){return x.id===item.id;}))preview(item,true);},950);}\n")
        s=once(s,a,extra+a)
        # Keep user-triggered selection immediate. Delay only the default first channel.
        s=s.replace('preview(rows[0]);','warmPreview(rows[0]);')
        s=s.replace('preview(playable[0]);','warmPreview(playable[0]);')
        # Guard timeouts when categories or the live panel change.
        s=once(s,' function selectCategory(id,done){'," function selectCategory(id,done){clearTimeout(lgWarmTimer);clearTimeout(lgRetryTimer);lgInitial=false;")
        s=once(s,' function close(){'," function close(){clearTimeout(lgWarmTimer);clearTimeout(lgRetryTimer);lgInitial=false;")
        guard="function failed(error){if(!active||!current||player.currentId()!==current.id)return;"
        retry=("if(lgInitial&&!lgRetried&&!fullscreen){lgRetried=true;lgInitial=false;"
               "connection='error';el('live-preview-state').textContent='Reintentando canal…';"
               "var retryId=current.id;clearTimeout(lgRetryTimer);"
               "lgRetryTimer=setTimeout(function(){if(active&&current&&current.id===retryId&&!document.hidden)preview(current,false);},1250);return;}")
        s=once(s,guard,guard+retry)
        a="document.getElementById('video').addEventListener('playing',function(){if(active){"
        s=once(s,a,a+"clearTimeout(lgRetryTimer);lgInitial=false;")
        b=s.encode('utf8');changes.append('live-view.js')
    elif n.endswith('/appinfo.json'):
        v=json.loads(b)
        assert v['version']=='2.0.24'
        v['version']='2.0.25'
        v['appDescription']='Beta LG webOS 6.0: canales actualizados, arranque controlado y modo solo títulos.'
        b=json.dumps(v,ensure_ascii=False,indent=2).encode('utf8');changes.append('appinfo.json')
    elif n.endswith('/services.json') or n.endswith('/packageinfo.json'):
        v=json.loads(b)
        if v.get('version')=='2.0.24':v['version']='2.0.25'
        b=json.dumps(v,ensure_ascii=False,indent=2).encode('utf8');changes.append(n.rsplit('/',1)[-1])
    m.size=len(b);updated.append((m,b))

assert {'settings.js','main.js','browse-shelves.js','live-view.js','lg-tv-enhancements.css','index.html','appinfo.json'}<=set(changes)
m=tarfile.TarInfo(appdir+'lite-catalog.js');m.mode=0o644;m.mtime=1794192000;m.size=len(light_js)
updated.append((m,light_js))
for i,(m,b) in enumerate(ctrl):
    if m.name.endswith('control'):
        assert b'Version: 2.0.24' in b
        b=b.replace(b'Version: 2.0.24',b'Version: 2.0.25');m.size=len(b);ctrl[i]=(m,b)
output=arwrite([('debian-binary',chunks['debian-binary']),('control.tar.gz',tarwrite(ctrl)),('data.tar.gz',tarwrite(updated))])
check=tarread(arread(output)['data.tar.gz'])
assert len(check)==len(updated)
assert any(m.name.lstrip('./')==appdir+'lite-catalog.js' for m,_ in check)
dest.write_bytes(output)
print('BUILT',dest,'SIZE',len(output),'SHA256',hashlib.sha256(output).hexdigest())
print('CHANGED',changes,'ADDED lite-catalog.js')
