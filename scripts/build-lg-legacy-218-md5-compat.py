#!/usr/bin/env python3
"""Genera LG Legacy HD 2.0.18 corrigiendo MD5 no disponible en webOS 3.0."""
import io, tarfile, json, pathlib, hashlib
from copy import copy

SOURCE=pathlib.Path('base.ipk')
TARGET=pathlib.Path('CactusTV_LG_Legacy_HD_2.0.18_MD5_Compat.ipk')
MD5_JS = r"""
function cactusMd5(input){
  var value=unescape(encodeURIComponent(String(input))),bytes=[],i,j;
  for(i=0;i<value.length;i++)bytes.push(value.charCodeAt(i));
  var bitLength=bytes.length*8,lo=bitLength>>>0,hi=Math.floor(bitLength/4294967296)>>>0;
  bytes.push(128);while(bytes.length%64!==56)bytes.push(0);
  for(i=0;i<4;i++)bytes.push(lo>>>8*i&255);
  for(i=0;i<4;i++)bytes.push(hi>>>8*i&255);
  var shifts=[],rounds=[],base=[[7,12,17,22],[5,9,14,20],[4,11,16,23],[6,10,15,21]];
  for(i=0;i<64;i++){shifts[i]=base[i>>4][i%4];rounds[i]=Math.floor(Math.abs(Math.sin(i+1))*4294967296)>>>0;}
  var a0=0x67452301,b0=0xefcdab89,c0=0x98badcfe,d0=0x10325476;
  for(j=0;j<bytes.length;j+=64){
    var words=[];
    for(i=0;i<16;i++)words[i]=(bytes[j+4*i]|bytes[j+4*i+1]<<8|bytes[j+4*i+2]<<16|bytes[j+4*i+3]<<24)>>>0;
    var a=a0,b=b0,c=c0,d=d0;
    for(i=0;i<64;i++){
      var f,g;
      if(i<16){f=(b&c)|(~b&d);g=i;}
      else if(i<32){f=(d&b)|(~d&c);g=(5*i+1)%16;}
      else if(i<48){f=b^c^d;g=(3*i+5)%16;}
      else{f=c^(b|~d);g=(7*i)%16;}
      var sum=(a+f+rounds[i]+words[g])>>>0,rotated=(sum<<shifts[i]|sum>>>(32-shifts[i]))>>>0;
      a=d;d=c;c=b;b=(b+rotated)>>>0;
    }
    a0=(a0+a)>>>0;b0=(b0+b)>>>0;c0=(c0+c)>>>0;d0=(d0+d)>>>0;
  }
  function hex(n){var str='',i,v;for(i=0;i<4;i++){v=(n>>>i*8&255).toString(16);str+=(v.length===1?'0':'')+v;}return str;}
  return hex(a0)+hex(b0)+hex(c0)+hex(d0);
}
""".strip()

def read_ar(b):
    assert b.startswith(b'!<arch>\n')
    pos=8;out={}
    while pos<len(b):
        h=b[pos:pos+60];n=h[:16].decode('ascii').strip().rstrip('/')
        assert h[58:60]==bytes((96,10))
        size=int(h[48:58]);out[n]=b[pos+60:pos+60+size]
        pos+=60+size+(size%2)
    assert pos==len(b)
    return out

def write_ar(items):
    out=io.BytesIO();out.write(b'!<arch>\n')
    for name,body in items:
        hdr=f'{name:<16}{1794000000:<12}{0:<6}{0:<6}{"100644":<8}{len(body):<10}'+chr(96)+'\n'
        assert len(hdr)==60
        out.write(hdr.encode('ascii'));out.write(body)
        if len(body)%2:out.write(b'\n')
    return out.getvalue()

def tar_read(b):
    with tarfile.open(fileobj=io.BytesIO(b),mode='r:gz') as f:
        return [(copy(m),f.extractfile(m).read() if m.isfile() else None) for m in f]

def tar_write(members):
    out=io.BytesIO()
    with tarfile.open(fileobj=out,mode='w:gz',format=tarfile.USTAR_FORMAT,compresslevel=6) as f:
        for member,body in members:
            m=copy(member);m.uid=m.gid=0;m.uname=m.gname=''
            if body is not None:m.size=len(body)
            f.addfile(m,io.BytesIO(body) if body is not None else None)
    b=out.getvalue()
    return b[:4]+bytes(4)+b[8:]

chunks=read_ar(SOURCE.read_bytes())
assert list(chunks)==['debian-binary','control.tar.gz','data.tar.gz']
data=tar_read(chunks['data.tar.gz']);control=tar_read(chunks['control.tar.gz'])
changed=[]
for idx,(m,body) in enumerate(data):
    if body is None:continue
    if m.name.endswith('/xuper/device.js'):
        s=body.decode('utf-8')
        anchor='var t="function"==typeof require?require("./config.js"):e.XuperConfig;'
        needle=':e.CryptoJS.MD5(i).toString()'
        assert s.count(anchor)==1 and s.count(needle)==1
        s=s.replace(anchor,anchor+MD5_JS)
        s=s.replace(needle,':cactusMd5(i)')
        body=s.encode('utf-8');changed.append('device.js')
    elif m.name.endswith('/appinfo.json'):
        obj=json.loads(body)
        assert obj['version']=='2.0.17'
        assert obj['resolution']=='1280x720'
        obj['version']='2.0.18'
        obj['title']='Cactus TV LG Legacy HD'
        obj['appDescription']='Beta webOS 3.0: MD5 autónomo compatible con Chromium 38.'
        body=json.dumps(obj,indent=2,ensure_ascii=False).encode('utf-8')
        changed.append('appinfo.json')
    elif m.name.endswith('/services.json'):
        obj=json.loads(body)
        assert obj['version']=='2.0.17'
        obj['version']='2.0.18'
        body=json.dumps(obj,indent=2,ensure_ascii=False).encode('utf-8')
        changed.append('services.json')
    m.size=len(body);data[idx]=(m,body)
assert set(changed)=={'device.js','appinfo.json','services.json'},changed
for idx,(m,body) in enumerate(control):
    if m.name.endswith('control'):
        assert b'Version: 2.0.17' in body
        body=body.replace(b'Version: 2.0.17',b'Version: 2.0.18')
        m.size=len(body);control[idx]=(m,body)

built=write_ar([('debian-binary',chunks['debian-binary']),
                ('control.tar.gz',tar_write(control)),
                ('data.tar.gz',tar_write(data))])
out=read_ar(built)
verified=tar_read(out['data.tar.gz'])
assert len(verified)==len(data)
assert [(m.name,b) for m,b in verified]==[(m.name,b) for m,b in data]
TARGET.write_bytes(built)
print('OK',TARGET,'size',len(built),'SHA-256',hashlib.sha256(built).hexdigest())
