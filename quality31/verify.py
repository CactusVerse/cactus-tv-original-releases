from pathlib import Path
import tarfile,io,json,subprocess

def data(path):
 raw=Path(path).read_bytes();pos=8
 while pos<len(raw):
  h=raw[pos:pos+60];size=int(h[48:58]);name=h[:16].decode().strip().rstrip('/');payload=raw[pos+60:pos+60+size];pos+=60+size+size%2
  if name.startswith('data.tar'):
   with tarfile.open(fileobj=io.BytesIO(payload),mode='r:*') as t:return {e.name.lstrip('./'):t.extractfile(e).read() for e in t if e.isfile()}
old=data('/tmp/cactus-classic3.ipk');new=data(Path(__file__).parent/'CactusTV_LG_Clasico_3.1.0_Calidad_webOS4_ARMv7.ipk')
allowed={'server.js','app/app.js','app/index.html','src/cactus-quality.js','app/cactus-quality-ui.js'}
for p,b in old.items():
 if new.get(p)!=b:
  assert any(p.endswith('/'+x) for x in allowed) or p.endswith(('appinfo.json','packageinfo.json','package.json')),p
for p,b in new.items():
 if '/bin/' in p:assert old[p]==b,p
 if any(p.endswith('/'+x) for x in ['server.js','app/app.js','src/cactus-quality.js','app/cactus-quality-ui.js']):
  temp=Path('/tmp/quality-syntax-check.js');temp.write_bytes(b);subprocess.run(['node','--check',str(temp)],check=True)
 if p.endswith('appinfo.json'):assert json.loads(b)['version']=='3.1.0'
print('PASS: packaged JavaScript syntax, app version, native binaries and unrelated files preserved')
