#!/usr/bin/env python3
"""LG 2.0.29: corregir rechazo de proxy de imágenes, HUD y teclado webOS.
Requiere base Standard o webOS6 2.0.28; conserva fuentes y reproductor.
"""
import io,sys,tarfile,json,pathlib,hashlib
from copy import copy

if len(sys.argv)!=3:raise SystemExit("Uso: build-lg-229-correcciones.py base_228.ipk salida_229.ipk")
SOURCE=pathlib.Path(sys.argv[1]);DEST=pathlib.Path(sys.argv[2])
VERSION='2.0.29'
APP='usr/palm/services/com.cocotecnico.cactustv.lgtest.service/backend/app/'

def exactly(src,before,after,label):
  c=src.count(before)
  if c!=1:raise RuntimeError('%s: esperado 1, observado %s'%(label,c))
  return src.replace(before,after)

def fix_api(s):
  # El API de LG devolvía ruta /__cactus__/image?u=URL, pero safeImage
  # la rechazaba por no comenzar con http. Reusar validación estricta
  # imagePath valida cada URL que el proxy contiene, sin aceptar rutas arbitrarias.
  s=exactly(s,'safeImage:function(url){return !!image(url);}', 'safeImage:function(url){return !!imagePath(url);}', 'proxy/validator')
  assert 'function imagePath(value)' in s
  return s

def fix_hud(s):
  # Espera/suspensión del video NO debe cancelar indefinidamente la desaparición
  # de la interfaz, especialmente si webOS cambia a un player nativo.
  s=exactly(s,'function loading(){if(!opened||!visible)return;clearTimeout(timer);}',
               'function loading(){if(!opened||!visible)return;later();}', 'hide/on-waiting')
  s=exactly(s,"open:function(){opened=true;visible=true;document.body.classList.remove('controls-hidden');clearTimeout(timer);}",
               "open:function(){opened=true;visible=true;document.body.classList.remove('controls-hidden');clearTimeout(timer);later();}",
               'hide/initial-start')
  return s

def fix_keyboard(s):
  old="""  function completeSearch(){clearTimeout(timer);timer=setTimeout(function(){loadSection(selected,false,function(){leaveSearch(true);});},0);search.blur();}"""
  new="""  var lgSearchCommitPending=false;
  function completeSearch(){
    if(lgSearchCommitPending)return;
    lgSearchCommitPending=true;clearTimeout(timer);
    var text=search.value;
    /* Ocultar teclado/foco ANTES de solicitar y dibujar resultados. */
    search.blur();
    var tab=selectedTab();if(tab&&tab.focus)tab.focus();
    timer=setTimeout(function(){
      lgSearchCommitPending=false;
      if(text!==search.value)return;
      loadSection(selected,false,function(){leaveSearch(true);});
    },300);
  }"""
  s=exactly(s,old,new,'search/commit')
  old_input="""search.addEventListener('input',function(){currentPage=1;loadedPage=1;hasNext=false;++reqNum;clearTimeout(timer);timer=setTimeout(function(){if(api.enabled&&selected!=='favorites'&&(selected!=='live'||api.source==='Xuper'))loadSection(selected);else render();},320);});"""
  new_input="""search.addEventListener('input',function(){
    currentPage=1;loadedPage=1;hasNext=false;++reqNum;clearTimeout(timer);
    /* LG: evitar llamadas de red y reconstruir el catálogo por cada tecla del teclado virtual.
       La búsqueda se realiza una vez al pulsar Ingresar/Buscar. */
  });"""
  s=exactly(s,old_input,new_input,'search/input-throttle')
  old_enter="  search.addEventListener('search',completeSearch);"
  new_enter="""  search.addEventListener('search',completeSearch);
  search.addEventListener('keydown',function(e){
    var code=e.keyCode||e.which;
    if((code===13||code===65376||e.key==='Enter')&&!e.isComposing){
      e.preventDefault();e.stopPropagation();completeSearch();
    }
  });"""
  s=exactly(s,old_enter,new_enter,'search/capture-submit')
  return s

def fix_css(s):
  marker='/* LG 2.0.29: vídeo inmersivo sin barras persistentes en fullscreen. */'
  assert marker not in s
  s+='\n'+marker+"""
body.is-playing{overflow:hidden!important;}
body.is-playing #player{overflow:hidden!important;}
body.is-playing ::-webkit-scrollbar{width:0!important;height:0!important;display:none!important;}
body.is-playing.controls-hidden #player .lg-back-player,
body.is-playing.controls-hidden #player .playback-toolbar,
body.is-playing.controls-hidden #player #close-player,
body.is-playing.controls-hidden #player #player-title,
body.is-playing.controls-hidden #player #player-status{
 opacity:0!important;visibility:hidden!important;pointer-events:none!important;
}
body.is-playing:not(.controls-hidden) #player .lg-back-player{visibility:visible;pointer-events:auto;}
"""
  return s

def read_ar(blob):
  assert blob.startswith(b'!<arch>\n')
  p=8;parts=[]
  while p<len(blob):
    h=blob[p:p+60];assert h[58:60]==bytes((96,10))
    name=h[:16].decode('ascii').strip().rstrip('/')
    z=int(h[48:58]);parts.append((name,blob[p+60:p+60+z]))
    p+=60+z+z%2
  assert p==len(blob)
  return dict(parts)
def write_ar(items):
  out=io.BytesIO();out.write(b'!<arch>\n')
  for n,b in items:
    h=f'{n:<16}{1794192000:<12}{0:<6}{0:<6}{"100644":<8}{len(b):<10}'+chr(96)+'\n'
    assert len(h)==60
    out.write(h.encode());out.write(b)
    if len(b)%2:out.write(b'\n')
  return out.getvalue()
def read_tar(b):
  with tarfile.open(fileobj=io.BytesIO(b),mode='r:gz') as tar:
    return [(copy(m),tar.extractfile(m).read() if m.isfile() else None) for m in tar]
def write_tar(items):
  out=io.BytesIO()
  with tarfile.open(fileobj=out,mode='w:gz',format=tarfile.USTAR_FORMAT,compresslevel=6) as tar:
    for m,b in items:
      it=copy(m);it.uid=it.gid=0;it.uname=it.gname=''
      if b is not None:it.size=len(b)
      tar.addfile(it,io.BytesIO(b) if b is not None else None)
  z=out.getvalue()
  return z[:4]+bytes(4)+z[8:]

parts=read_ar(SOURCE.read_bytes())
assert list(parts)==['debian-binary','control.tar.gz','data.tar.gz']
files=read_tar(parts['data.tar.gz']);control=read_tar(parts['control.tar.gz'])
fixers={'direct-api.js':fix_api,'player-chrome.js':fix_hud,'main.js':fix_keyboard,'lg-tv-enhancements.css':fix_css}
changes=[]
for i,(m,b) in enumerate(files):
  if b is None:continue
  name=m.name.lstrip('./')
  rel=name[len(APP):] if name.startswith(APP) else ''
  if rel in fixers:
    newer=fixers[rel](b.decode('utf8')).encode('utf8')
    assert newer!=b,rel
    b=newer;changes.append(rel)
  elif name.endswith('/appinfo.json'):
    j=json.loads(b);assert j['version']=='2.0.28'
    j['version']=VERSION
    j['appDescription']='LG 2.0.29: carátulas proxy, teclado webOS y HUD inmersivo corregidos.'
    b=json.dumps(j,ensure_ascii=False,indent=2).encode()
    changes.append('appinfo.json')
  elif name.endswith('/services.json') or name.endswith('/packageinfo.json'):
    j=json.loads(b)
    if 'version' in j:j['version']=VERSION
    b=json.dumps(j,ensure_ascii=False,indent=2).encode()
    changes.append(name.rsplit('/',1)[-1])
  m.size=len(b);files[i]=(m,b)

assert set(changes)==set(fixers)|{'appinfo.json','services.json','packageinfo.json'},changes
for i,(m,b) in enumerate(control):
  if m.name.endswith('control'):
    assert b'Version: 2.0.28' in b
    b=b.replace(b'Version: 2.0.28',b'Version: 2.0.29');m.size=len(b)
    control[i]=(m,b)
output=write_ar([('debian-binary',parts['debian-binary']),('control.tar.gz',write_tar(control)),('data.tar.gz',write_tar(files))])
assert [(m.name,x) for m,x in read_tar(read_ar(output)['data.tar.gz'])]==[(m.name,x) for m,x in files]
DEST.write_bytes(output)
print('BUILD',DEST,'BYTES',len(output),'SHA256',hashlib.sha256(output).hexdigest(),'MODIFIED',sorted(changes))
