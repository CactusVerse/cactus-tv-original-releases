from pathlib import Path
import io,tarfile,copy,json,hashlib,re,subprocess
BASE=Path(__file__).parent;SOURCE=Path(r'D:\CACTUS ANTIGUO\CactusTV_LG_Desierto_1.2.0_webOS4_ARMv7.ipk')
OLD='com.cocotecnico.cactustv.desierto';NEW='com.cocotecnico.cactustv.clasico'
def one(s,a,b):
 assert s.count(a)==1,(a[:90],s.count(a));return s.replace(a,b,1)
def ar(b):
 assert b.startswith(b'!<arch>\n');out=[];p=8
 while p<len(b):
  h=b[p:p+60];z=int(h[48:58]);out.append((h[:16].decode().strip().rstrip('/'),b[p+60:p+60+z]));p+=60+z+z%2
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
  h=f'{n:<16}{1794192000:<12}{0:<6}{0:<6}{"100644":<8}{len(v):<10}'+'`\n';b.write(h.encode());b.write(v)
  if len(v)%2:b.write(b'\n')
 return b.getvalue()
data=SOURCE.read_bytes();assert hashlib.sha256(data).hexdigest()=='1a72b8e740617b70666cc60421a77c07ecb583047689778a59cfe2092298f5e7'
parts=dict(ar(data));original=untar(parts['data.tar.gz']);oldbytes={m.name:v for m,v in original};control=untar(parts['control.tar.gz']);out=[];removed=[];checks=BASE/'classic3-check';checks.mkdir(exist_ok=True)
for m,v in original:
 name=m.name.rsplit('/',1)[-1]
 if name in {'tmdb-credential.json','tmdb-credential.js','host.js'}:removed.append(m.name);continue
 m.name=m.name.replace(OLD,NEW).replace('collateral_bgimage','cactus_bgimage').replace('collateral_splash','cactus_splash').replace('/collateral.css','/cactus-base.css')
 if v is not None and name.endswith(('.js','.css','.html','.json','.webmanifest')) and '/node_modules/' not in m.name:
  s=v.decode('utf8');s=s.replace(OLD,NEW).replace('47879','47903')
  # Change the internal namespaces consistently. This is inherited code, not a claim of new authorship.
  s=s.replace('COLLATERAL','CACTUS_CLASSIC').replace('Collateral','CactusClassic').replace('collateral','cactus-classic')
  s=s.replace('cactus-classic.css','cactus-base.css').replace('cactus-classic_bgimage','cactus_bgimage').replace('cactus-classic_splash','cactus_splash')
  if m.name.endswith('/backend/server.js'):
   s=one(s,'bundledKey=require("./src/tmdb-credential").read(path.join(__dirname,"tmdb-credential.json"))','bundledKey=""')
   a=s.index('const activeTmdbKey=');b=s.index(',audiences=audienceRegistry()',a)
   s=s[:a]+'''function readCactusKey(){return chooseKey({env:process.env.CACTUS_TMDB_KEY,written:readKeyFile(path.join(dataDir,"tmdb-key"))})}const artwork=tmdbService({cacheFile:path.join(dataDir,"tmdb-own.json"),readKey:readCactusKey})'''+s[b:]
   s=one(s,'"artworkStatus","artworkClear"','"artworkStatus","artworkClear","cactusTmdbStatus","cactusTmdbSave"')
   anchor='if(/^download(List|Start|Remove|Play)$/.test(n))'
   route='''if("cactusTmdbStatus"===n)return json(t,200,{data:{configured:!!readCactusKey()}});if("cactusTmdbSave"===n){const key=String(a[0]||"").trim();if(!/^[0-9a-f]{32}$/i.test(key))return json(t,400,{error:"Introduce tu API Key v3 de TMDB (32 caracteres)."});let check;try{check=await fetch("https://api.themoviedb.org/3/configuration?api_key="+encodeURIComponent(key),{signal:AbortSignal.timeout(7000)})}catch(err){return json(t,502,{error:"No se pudo verificar TMDB. Revisa la conexi�n."})}if(!check.ok)return json(t,400,{error:"TMDB no acept� la clave."});await check.arrayBuffer();fs.mkdirSync(dataDir,{recursive:true});fs.writeFileSync(path.join(dataDir,"tmdb-key"),key,{mode:384});artwork.clear();return json(t,200,{data:{configured:true}});}'''
   s=one(s,anchor,route+anchor)
   # Serve only these two fixed additions through the existing static allowlist.
   s=one(s,'const server=http.createServer', 'Object.assign(files,{"/cactus-account.js":["cactus-account.js","text/javascript"],"/cactus-classic3.css":["cactus-classic3.css","text/css"]});const server=http.createServer')
  if name=='service.js':s=s.replace('var PORT = 47879;','var PORT = 47903;')
  if name=='appinfo.json':
   obj=json.loads(s);obj.update(id=NEW,title='Cactus TV Cl�sico',version='3.0.0',vendor='Coco T�cnico',appDescription='Base Desierto 1.2.0 adaptada. TMDB propio configurable. Instalaci�n independiente.');s=json.dumps(obj,ensure_ascii=False,indent=2)
  elif name in {'packageinfo.json','package.json','services.json'}:
   try:
    obj=json.loads(s)
    if 'version' in obj:obj['version']='3.0.0'
    s=json.dumps(obj,ensure_ascii=False,indent=2)
   except ValueError:pass
  if name=='index.html' and '/backend/app/' in m.name:
   s=one(s,'</head>','<link rel="stylesheet" href="cactus-classic3.css"></head>')
   s=one(s,'</body>','<script src="cactus-account.js"></script></body>')
  s=s.replace('Cactus TV Desierto 1.2.0','Cactus TV Cl�sico 3.0.0')
  v=s.encode('utf8')
  if name.endswith('.js'):
   check=checks/m.name.lstrip('./');check.parent.mkdir(parents=True,exist_ok=True)
   if not check.exists() or check.read_bytes()!=v:
    check.write_bytes(v);subprocess.run(['node','--check',str(check)],check=True,stdout=subprocess.DEVNULL)
 if v is not None:m.size=len(v)
 out.append((m,v))
template=next(copy.copy(m) for m,v in out if m.name.endswith('/backend/app/app.js'));appbase=template.name.rsplit('/',1)[0]
for name in ['cactus-account.js','cactus-classic3.css']:
 v=(BASE/name).read_bytes();m=copy.copy(template);m.name=appbase+'/'+name;m.size=len(v);out.append((m,v))
for i,(m,v) in enumerate(control):
 if v is not None:
  v=v.replace(OLD.encode(),NEW.encode()).replace(b'Version: 1.2.0',b'Version: 3.0.0');m.size=len(v);control[i]=(m,v)
result=pack([('debian-binary',parts['debian-binary']),('control.tar.gz',tar(control)),('data.tar.gz',tar(out))]);verified=untar(dict(ar(result))['data.tar.gz']);assert [(m.name,v) for m,v in verified]==[(m.name,v) for m,v in out]
assert not any('tmdb-credential' in m.name for m,v in out)
# Native runtime and playback transport stay exactly as in the working reference.
for m,v in out:
 if m.isfile() and ('/bin/' in m.name or '/node_modules/' in m.name):
  assert oldbytes[m.name.replace(NEW,OLD)]==v
dest=BASE/'dist/CactusTV_LG_Clasico_3.0.0_webOS4_ARMv7.ipk';dest.parent.mkdir(exist_ok=True);dest.write_bytes(result)
print('BUILT',dest.resolve(),len(result),hashlib.sha256(result).hexdigest());print('Removed',len(removed),'legacy credential/unused host files; native runtime preserved')

