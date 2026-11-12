from pathlib import Path
import re,json,tarfile,io,hashlib
root=Path(__file__).parent/"base/usr/palm/services/com.cocotecnico.cactustv.clasico.service/backend"
# Package from original archive, preserving every native binary.
raw=Path('/tmp/cactus-classic3.ipk').read_bytes();assert raw[:8]==b'!<arch>\n';pos=8;parts=[]
while pos<len(raw):
 h=raw[pos:pos+60];size=int(h[48:58]);name=h[:16].decode().strip().rstrip('/');data=raw[pos+60:pos+60+size];parts.append((name,data));pos+=60+size+(size%2)
out=[];changed=[]
for name,data in parts:
 if name.startswith(('data.tar','control.tar')):
  dest=io.BytesIO()
  with tarfile.open(fileobj=io.BytesIO(data),mode='r:*') as src,tarfile.open(fileobj=dest,mode='w:gz') as dst:
   seen=set()
   for entry in src:
    payload=src.extractfile(entry).read() if entry.isfile() else None
    path=entry.name.lstrip('./');seen.add(path);local=Path(__file__).parent/'base'/path
    if payload is not None and local.is_file() and '/bin/' not in path:payload=local.read_bytes()
    if payload is not None and path.endswith(('appinfo.json','packageinfo.json','package.json')):
     try:
      obj=json.loads(payload)
      if obj.get('version')=='3.0.0':obj['version']='3.1.1';payload=(json.dumps(obj,ensure_ascii=False,indent=2)+'\n').encode()
     except (ValueError,UnicodeDecodeError):pass
    if name.startswith('control.tar') and path=='control':payload=re.sub(rb'(?m)^Version: .*',b'Version: 3.1.1',payload)
    if payload is not None:entry.size=len(payload)
    dst.addfile(entry,io.BytesIO(payload) if payload is not None else None)
   if name.startswith('data.tar'):
    for rel in ['src/cactus-quality.js','app/cactus-quality-ui.js']:
     path='usr/palm/services/com.cocotecnico.cactustv.clasico.service/backend/'+rel
     if path not in seen:
      payload=(root/rel).read_bytes();entry=tarfile.TarInfo('./'+path);entry.size=len(payload);entry.mode=0o644;dst.addfile(entry,io.BytesIO(payload))
  data=dest.getvalue()
 out.append((name,data))
result=bytearray(b'!<arch>\n')
for name,data in out:
 h=f'{name+"/":<16}{0:<12}{0:<6}{0:<6}{"100644":<8}{len(data):<10}`\n'.encode();assert len(h)==60;result.extend(h);result.extend(data)
 if len(data)%2:result.extend(b'\n')
output=Path(__file__).parent/'CactusTV_LG_Clasico_3.1.1_Calidad_webOS4_ARMv7.ipk';output.write_bytes(result)
print(output, len(result), hashlib.sha256(result).hexdigest())
