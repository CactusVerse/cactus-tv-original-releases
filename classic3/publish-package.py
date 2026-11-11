import pathlib,hashlib,io,tarfile,json,zipfile,base64,gzip,copy
P=pathlib.Path
payload=b''.join(p.read_bytes() for p in sorted(P('classic3/payload').glob('part-*.bin')))
assert hashlib.sha256(payload).hexdigest()=='55ba826d79349e71350f650b88216ad7255df75cad85c8a994b1e1db01b5f13b'
def ar(b):
 p=8;o={}
 while p<len(b):
  h=b[p:p+60];z=int(h[48:58]);o[h[:16].decode().strip().rstrip('/')]=b[p+60:p+60+z];p+=60+z+z%2
 return o
base=next(P('base').glob('*Standard*.ipk')).read_bytes()
assert hashlib.sha256(base).hexdigest()=='4aff5222dbff5aff755f3d36d13146edd98778578da3d5ac25ecd9106cdfeb9f'
known={}
with tarfile.open(fileobj=io.BytesIO(ar(base)['data.tar.gz']),mode='r:gz') as t:
 for m in t:
  if m.isfile():
   b=t.extractfile(m).read();known[hashlib.sha256(b).hexdigest()]=b
with zipfile.ZipFile(io.BytesIO(payload)) as z:
 manifest=json.loads(z.read('manifest.json'))
 for name in z.namelist():
  if name.startswith('objects/'):
   b=z.read(name);h=name.split('/')[1];assert hashlib.sha256(b).hexdigest()==h;known[h]=b
buf=io.BytesIO()
with tarfile.open(fileobj=buf,mode='w',format=tarfile.USTAR_FORMAT) as t:
 for row in manifest['rows']:
  m=tarfile.TarInfo(row['name'])
  for k,v in row.items():
   if k not in ['sha','type','name']:setattr(m,k,v)
  m.type=row['type'].encode('latin1');b=known[row['sha']] if row['sha'] else None
  if b is not None:assert len(b)==m.size
  t.addfile(m,io.BytesIO(b) if b is not None else None)
body=gzip.compress(buf.getvalue(),compresslevel=6,mtime=0)
with tarfile.open(fileobj=io.BytesIO(body),mode='r:gz') as t:
 rows=list(t);assert len(rows)==len(manifest['rows'])
 for m,row in zip(rows,manifest['rows']):
  assert m.name==row['name']
  if m.isfile():assert hashlib.sha256(t.extractfile(m).read()).hexdigest()==row['sha']
assert not any('tmdb-credential' in row['name'] for row in manifest['rows'])
out=io.BytesIO();out.write(b'!<arch>\n')
for n,b in [('debian-binary',b'2.0\n'),('control.tar.gz',base64.b64decode(manifest['control'])),('data.tar.gz',body)]:
 h=f'{n:<16}{1794192000:<12}{0:<6}{0:<6}{"100644":<8}{len(b):<10}'+chr(96)+'\n';out.write(h.encode());out.write(b)
 if len(b)%2:out.write(b'\n')
P('dist').mkdir(exist_ok=True)
dest=P('dist/CactusTV_LG_Clasico_3.0.0_webOS4_ARMv7.ipk');dest.write_bytes(out.getvalue())
P('dist/SHA256SUMS.txt').write_text(hashlib.sha256(dest.read_bytes()).hexdigest()+'  '+dest.name+'\n')
print('PASS: every file matches the locally verified 3.0.0 installer; embedded TMDB credential absent',dest.stat().st_size)
