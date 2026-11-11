import pathlib,io,tarfile,copy,json,hashlib,subprocess,sys
P=pathlib.Path
payload=json.loads(P('scripts/lg238-ui.json').read_text())
def ar(b):
 assert b.startswith(b'!<arch>\n');p=8;out=[]
 while p<len(b):
  h=b[p:p+60];assert len(h)==60 and h[58:60]==b'`\n';z=int(h[48:58]);out.append((h[:16].decode().strip().rstrip('/'),b[p+60:p+60+z]));p+=60+z+z%2
 assert p==len(b);return out
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
def pack(parts):
 b=io.BytesIO();b.write(b'!<arch>\n')
 for n,v in parts:
  h=f'{n:<16}{1794192000:<12}{0:<6}{0:<6}{"100644":<8}{len(v):<10}'+'`\n';assert len(h)==60;b.write(h.encode());b.write(v)
  if len(v)%2:b.write(b'\n')
 return b.getvalue()
targets={'main.js','direct-api.js','poster-images.js','search-artwork-repair.js','navigation.js','browse-shelves.js'}
P('scripts/patch238.py').write_text(payload['patch238.py'])
P('scripts/test-lg-238.cjs').write_text(payload['test-lg-238.cjs'])
for kind in ['Standard','webOS6']:
 base=next(P('base').glob('*'+kind+'*.ipk'));parts=dict(ar(base.read_bytes()));files=untar(parts['data.tar.gz']);controls=untar(parts['control.tar.gz']);original={m.name:v for m,v in files};work=P('work')/kind;work.mkdir(parents=True,exist_ok=True)
 for m,v in files:
  name=m.name.rsplit('/',1)[-1]
  if v is not None and '/backend/app/' in m.name and name in targets:(work/name).write_bytes(v)
 subprocess.run([sys.executable,'scripts/patch238.py',str(work)],check=True)
 for name in ['poster-images.js','search-artwork-repair.js']:(work/'patched'/name).write_text(payload[name])
 changed=set();seen=set();inspect=P('inspection')/kind;inspect.mkdir(parents=True,exist_ok=True)
 for i,(m,v) in enumerate(files):
  if v is None:continue
  name=m.name.rsplit('/',1)[-1]
  if '/backend/app/' in m.name and name in targets:
   v=(work/'patched'/name).read_bytes();assert v!=original[m.name];changed.add(name);(inspect/name).write_bytes(v);subprocess.run(['node','--check',str(inspect/name)],check=True)
  elif name in {'appinfo.json','packageinfo.json','services.json','index.html','lg-update-check.js'}:
   if name=='appinfo.json':assert json.loads(v)['version']=='2.0.37'
   v=v.replace(b'2.0.37',b'2.0.38')
  m.size=len(v);files[i]=(m,v)
 assert changed==targets,(kind,changed)
 for i,(m,v) in enumerate(controls):
  if v and m.name.endswith('control'):
   assert b'Version: 2.0.37' in v;v=v.replace(b'Version: 2.0.37',b'Version: 2.0.38');m.size=len(v);controls[i]=(m,v)
 result=pack([('debian-binary',parts['debian-binary']),('control.tar.gz',tar(controls)),('data.tar.gz',tar(files))]);verified=untar(dict(ar(result))['data.tar.gz']);assert [(m.name,v) for m,v in verified]==[(m.name,v) for m,v in files]
 allowed=targets|{'appinfo.json','packageinfo.json','services.json','index.html','lg-update-check.js'}
 for m,v in verified:
  if v!=original[m.name]:assert m.name.rsplit('/',1)[-1] in allowed
 P('dist').mkdir(exist_ok=True);dest=P('dist')/('CactusTV_LG_'+kind+'_2.0.38_Busqueda_Fluida.ipk');dest.write_bytes(result);print('BUILT',kind,len(result),hashlib.sha256(result).hexdigest(),'preserved playback and provider modules')
