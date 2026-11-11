#!/usr/bin/env python3
"""Patch the pinned LG 2.0.36 packages; leave playback and providers byte-identical."""
import io,tarfile,copy,pathlib,hashlib,json,re,subprocess
ROOT=pathlib.Path('.')
def read_ar(b):
 assert b.startswith(b'!<arch>\n')
 p=8;out=[]
 while p<len(b):
  h=b[p:p+60];assert len(h)==60 and h[58:60]==b'\x60\n'
  z=int(h[48:58]);out.append((h[:16].decode().strip().rstrip('/'),b[p+60:p+60+z]));p+=60+z+z%2
 assert p==len(b)
 return out
def write_ar(parts):
 b=io.BytesIO();b.write(b'!<arch>\n')
 for n,v in parts:
  h=f'{n:<16}{1794192000:<12}{0:<6}{0:<6}{"100644":<8}{len(v):<10}'+'\x60\n'
  assert len(h)==60;b.write(h.encode());b.write(v)
  if len(v)%2:b.write(b'\n')
 return b.getvalue()
def untar(b):
 with tarfile.open(fileobj=io.BytesIO(b),mode='r:gz') as t:return [(copy.copy(m),t.extractfile(m).read() if m.isfile() else None) for m in t]
def tar(items):
 b=io.BytesIO()
 with tarfile.open(fileobj=b,mode='w:gz',format=tarfile.USTAR_FORMAT,compresslevel=6) as t:
  for m,v in items:
   m=copy.copy(m);m.uid=m.gid=0;m.uname=m.gname=''
   if v is not None:m.size=len(v)
   t.addfile(m,io.BytesIO(v) if v is not None else None)
 v=b.getvalue();return v[:4]+bytes(4)+v[8:]
def one(s,a,b):
 assert s.count(a)==1,(a[:150],s.count(a))
 return s.replace(a,b,1)
def patch(name,s):
 if name=='direct-api.js':
  s=one(s,"function alternative(u){if(image(u)&&alternatives.indexOf(u)<0)alternatives.push(u);}","function alternative(u){var p=imagePath(u);if(p&&alternatives.indexOf(p)<0)alternatives.push(p);}")
  s=one(s,"poster:function(x,wide,episode)","refreshArtwork:function(x,done){delete detailCache[x.parentId||x.id];return callback(asset(x).then(function(raw){var r=record(x);remember(raw,r.section,r.column);return {poster:artwork(raw,false),wide:artwork(raw,true)};}),done);},poster:function(x,wide,episode)")
 elif name=='poster-images.js':
  # Always release removed cards; a disposed task can never be requeued.
  s=one(s,"if(task.state==='queued'||task.state==='active'","if(task.disposed||task.state==='queued'||task.state==='active'")
  s=one(s,"else{failed++;task.state='failed';img.hidden=true;","else{failed++;task.state='failed';img.hidden=true;")
  # notify asynchronously after fallback DOM is settled; preserve bubbling target.
  s=one(s,"if(img.parentNode)img.parentNode.classList.toggle('poster-unavailable',task.state==='failed');","if(img.parentNode)img.parentNode.classList.toggle('poster-unavailable',task.state==='failed');if(task.state==='failed')setTimeout(function(){if(connected(img)&&!task.disposed){var e=document.createEvent('Event');e.initEvent('cactusimagefailed',true,false);img.dispatchEvent(e);}},0);")
  s=one(s,"(window.CACTUS_LG_PERF?85:35)","(window.CACTUS_LG_PERF?100:60)")
  # IO, focus, scroll, resize and attach wake the queue; no geometry scan per arrow.
  s=one(s,"setInterval(schedule,650);","setInterval(function(){if(!observer||queue.length||active.length)schedule();},2000);")
  s=one(s,"document.addEventListener('keydown',schedule);","")
  s=one(s,"if(observer&&box){observer.unobserve(box);delete box._cactusImage;}","if(observer&&box){observer.unobserve(box);delete box._cactusImage;}if(task.state!=='done')images[i].removeAttribute('src');")
 elif name=='main.js':
  s=one(s,"while(grid.firstChild)grid.removeChild(grid.firstChild);","if(window.CACTUS_IMAGES)window.CACTUS_IMAGES.release(grid);while(grid.firstChild)grid.removeChild(grid.firstChild);")
  # Hide textual placeholder only after the image actually loads.
  s=one(s,"var fallback=holder.querySelector('.cactus-art-missing');if(fallback)fallback.hidden=true;","var fallback=holder.querySelector('.cactus-art-missing');if(fallback&&img._cactusTask&&img._cactusTask.state==='done')fallback.hidden=true;")
 elif name=='browse-shelves.js':
  s=one(s,"while(cards.firstChild)cards.removeChild(cards.firstChild);","if(window.CACTUS_IMAGES)window.CACTUS_IMAGES.release(cards);while(cards.firstChild)cards.removeChild(cards.firstChild);")
  old="function refreshVisibleArtwork(){if(current&&enabled){current.rows.forEach(function(entry){if(entry.data){entry.signature='';fill(current,entry,entry.data);}});}}"
  new="""function refreshVisibleArtwork(){if(!current||!enabled||(window.CACTUS_LIGHT&&window.CACTUS_LIGHT.titles()))return;current.rows.forEach(function(entry){if(!entry.data)return;var cards=entry.row.querySelectorAll('.media-card');for(var i=0;i<cards.length;i++){var card=cards[i],id=card.dataset.id,item=null;for(var j=0;j<entry.data.items.length;j++)if(entry.data.items[j].id===id){item=entry.data.items[j];break;}if(!item)continue;var holder=card.querySelector('.poster'),img=holder&&holder.querySelector('img'),src=api.poster(item);if(!holder||!api.safeImage(src))continue;if(!img){img=document.createElement('img');holder.appendChild(img);}if(!img._cactusTask||img.getAttribute('data-art')!==src){img.setAttribute('data-art',src);window.CACTUS_IMAGES.attach(img,src,item.posterAlternates||[]);}}});}"""
  if old not in s:
   legacy="document.addEventListener('cactusartworkchange',function(){if(current&&enabled){current.rows.forEach(function(entry){if(entry.data){entry.signature='';fill(current,entry,entry.data);}});}});"
   s=one(s,legacy,old+"\n document.addEventListener('cactusartworkchange',refreshVisibleArtwork);\n document.addEventListener('cactussettingschange',refreshVisibleArtwork);")
  s=one(s,old,new)
  # Settings can change titles-only mode, and must rebuild the view.
  s=one(s,"document.addEventListener('cactussettingschange',refreshVisibleArtwork);","document.addEventListener('cactussettingschange',function(){if(current&&enabled)current.rows.forEach(function(e){if(e.data){e.signature='';fill(current,e,e.data);}});});")
  s=one(s,"window.CACTUS_IMAGES.attach(img,src,alts.slice(0,5));","img.setAttribute('data-art',src);window.CACTUS_IMAGES.attach(img,src,alts.slice(0,5));")
  # No background section request based on a hidden flag unreliable in webOS iframe.
  s=one(s,"if(!enabled||!current||document.hidden)return;","if(!enabled||!current)return;")
 elif name=='navigation.js':
  # Image onload/fallback changes don't change available focus targets.
  s=one(s,"new MutationObserver(function(){revision++;})","new MutationObserver(invalidate)")
  s=one(s," function ancestor(n,attribute)"," function invalidate(changes){for(var i=0;i<changes.length;i++){var c=changes[i],n=c.target;if(c.type==='attributes'&&(n.tagName==='IMG'||n.classList&&n.classList.contains('cactus-art-missing')))continue;if(c.type==='childList'&&n.classList&&n.classList.contains('poster'))continue;revision++;break;}}\n function ancestor(n,attribute)")
  s=one(s,"if(observer&&observer.takeRecords().length)revision++;","if(observer)invalidate(observer.takeRecords());")
 return s
expected={'Standard':'cd1385f779b107e4b75e1afd87d472e51ffee4577a5843208a583853e15537ff','webOS6':'3717303c7d4b40cddbc37c199b0cb3b529b3f785f9ca33539004a75e6ff9f39d'}
for kind in ('Standard','webOS6'):
 base=next(pathlib.Path('base').glob('*'+kind+'*.ipk'));raw=base.read_bytes();assert hashlib.sha256(raw).hexdigest()==expected[kind]
 ar=dict(read_ar(raw));files=untar(ar['data.tar.gz']);controls=untar(ar['control.tar.gz']);original={m.name:d for m,d in files};changed=[];app=None
 targets={'direct-api.js','poster-images.js','main.js','browse-shelves.js','navigation.js'}
 for i,(m,d) in enumerate(files):
  if d is None:continue
  name=m.name.rsplit('/',1)[-1]
  if '/backend/app/' in m.name and name in targets:
   d=patch(name,d.decode()).encode();assert d!=original[m.name];changed.append(name)
   path=pathlib.Path('inspection')/kind/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(d)
   subprocess.run(['node','--check',str(path)],check=True)
  elif name in {'appinfo.json','packageinfo.json','services.json','lg-update-check.js','index.html'}:
   d=d.replace(b'2.0.36',b'2.0.37')
  if '/backend/app/' in m.name and name=='index.html':
   d=one(d.decode(),'<script src="main.js"></script>','<script src="search-artwork-repair.js"></script>\n  <script src="main.js"></script>').encode();app=copy.copy(m)
  m.size=len(d);files[i]=(m,d)
 assert set(changed)==targets
 add=(ROOT/'scripts/search-artwork-repair-237.js').read_bytes();app.name=app.name.rsplit('/',1)[0]+'/search-artwork-repair.js';app.size=len(add);files.append((app,add))
 for i,(m,d) in enumerate(controls):
  if d and m.name.endswith('control'):d=d.replace(b'Version: 2.0.36',b'Version: 2.0.37');m.size=len(d);controls[i]=(m,d)
 out=write_ar([('debian-binary',ar['debian-binary']),('control.tar.gz',tar(controls)),('data.tar.gz',tar(files))])
 check=untar(dict(read_ar(out))['data.tar.gz']);assert [(m.name,d) for m,d in check]==[(m.name,d) for m,d in files]
 allowed=targets|{'appinfo.json','packageinfo.json','services.json','lg-update-check.js','index.html','search-artwork-repair.js'}
 for m,d in check:
  if m.name in original and d!=original[m.name]:assert m.name.rsplit('/',1)[-1] in allowed
 outpath=pathlib.Path('dist')/('CactusTV_LG_'+kind+'_2.0.37_Navegacion_Busqueda_BETA.ipk');outpath.parent.mkdir(exist_ok=True);outpath.write_bytes(out)
 print('BUILT',kind,len(out),hashlib.sha256(out).hexdigest(),'patches',sorted(changed))
