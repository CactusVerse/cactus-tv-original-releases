import pathlib,tarfile,io,json,copy,gzip,base64,hashlib,subprocess
P=pathlib.Path
def sha(b):return hashlib.sha256(b).hexdigest()
def ar(b):
 assert b.startswith(b'!<arch>\n');p=8;out=[]
 while p<len(b):
  h=b[p:p+60];assert len(h)==60 and h[58:60]==b'`\n';z=int(h[48:58]);out.append((h[:16].decode().strip().rstrip('/'),b[p+60:p+60+z]));p+=60+z+z%2
 assert p==len(b);return out
def untar(b):
 with tarfile.open(fileobj=io.BytesIO(b),mode='r:gz') as t:return [(copy.copy(m),t.extractfile(m).read() if m.isfile() else None) for m in t]
def tar(rows):
 b=io.BytesIO()
 with tarfile.open(fileobj=b,mode='w:gz',format=tarfile.USTAR_FORMAT,compresslevel=6) as t:
  for m,v in rows:
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
def build():
 manifest=json.loads(gzip.decompress(base64.b64decode(P('scripts/lg239-changes.b64').read_text())))
 for kind,cfg in manifest.items():
  base=next(P('base').glob('*'+kind+'*.ipk'));data=base.read_bytes();assert sha(data)==cfg['base_sha'],(kind,'base mismatch')
  parts=dict(ar(data));rows=untar(parts['data.tar.gz']);old={m.name:v for m,v in rows};control=untar(parts['control.tar.gz']);changes=cfg['files'];changed=set();out=[];template=None;removed=[]
  for m,v in rows:
   name=m.name.rsplit('/',1)[-1]
   if '/backend/app/' in m.name and name=='catalog-bootstrap.json':removed.append(m.name);continue
   if v is not None and '/backend/app/' in m.name and name in changes:
    entry=changes[name];assert sha(v)==entry['old_sha'];v=entry['text'].encode();changed.add(name)
   if v is not None and name in {'appinfo.json','packageinfo.json','services.json','lg-update-check.js','index.html'}:v=v.replace(b'2.0.38',b'2.0.39')
   if name=='appinfo.json':assert json.loads(v)['version']=='2.0.39'
   if '/backend/app/' in m.name and name=='index.html':template=copy.copy(m)
   if v is not None:m.size=len(v)
   out.append((m,v))
  for name,entry in changes.items():
   if name in changed:continue
   assert entry['old_sha'] is None;v=entry['text'].encode();m=copy.copy(template);m.name=m.name.rsplit('/',1)[0]+'/'+name;m.size=len(v);out.append((m,v));changed.add(name)
  assert changed==set(changes);assert len(removed)==1
  inspect=P('inspection')/kind;inspect.mkdir(parents=True,exist_ok=True)
  for m,v in out:
   name=m.name.rsplit('/',1)[-1]
   if v is not None and '/backend/app/' in m.name and name.endswith(('.js','.html','.css')):
    (inspect/name).write_bytes(v)
    if name.endswith('.js'):subprocess.run(['node','--check',str(inspect/name)],check=True)
  for i,(m,v) in enumerate(control):
   if v is not None and m.name.endswith('control'):
    assert b'Version: 2.0.38' in v;v=v.replace(b'Version: 2.0.38',b'Version: 2.0.39');m.size=len(v);control[i]=(m,v)
  result=pack([('debian-binary',parts['debian-binary']),('control.tar.gz',tar(control)),('data.tar.gz',tar(out))]);verified=untar(dict(ar(result))['data.tar.gz']);assert [(m.name,v) for m,v in verified]==[(m.name,v) for m,v in out]
  for name in ['media-engine.js','direct-media.js','playback-controls.js','live-view.js','live-quick-panel.js','parental-control.js','favorites.js','details-view.js','sports-extras.json','profiles.js','settings.js']:
   a=next(v for p,v in old.items() if p.endswith('/app/'+name));b=next(v for m,v in out if m.name.endswith('/app/'+name));assert a==b,(name,'unexpected change')
  P('dist').mkdir(exist_ok=True);dest=P('dist')/('CactusTV_LG_'+kind+'_2.0.39_Fluidez_Desierto.ipk');dest.write_bytes(result);print('BUILT',kind,len(result),sha(result),'playback/live/parental/favorites preserved byte-for-byte')
if __name__=='__main__':build()

