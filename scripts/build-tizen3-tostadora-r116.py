#!/usr/bin/env python3
"""Rebuild Cactus TV Tizen 3 Tostadora R11.6 from the verified public R9 legacy WGT.
The patch is a binary delta between uncompressed WGT members, not a change to credentials
or stream endpoints; this script intentionally leaves all unchanged files intact.
"""
import base64
import hashlib
import io
import pathlib
import struct
import sys
import zipfile
import zlib

ROOT = pathlib.Path(__file__).resolve().parent
BASE = ROOT / "CactusTV_Samsung_Legacy_R9.wgt"
PATCH = ROOT / "delta-tizen3-tostadora-r116.b64"
OUT = ROOT / "CactusTV_Tizen3_Tostadora_R11.6.wgt"
EXPECTED_BASE_SHA = "96d35769b34d07b7f18aa51706353f9a9fac6876abe635935a842fe9d9f3db3b"
EXPECTED_PAYLOAD_SHA = "1f58b4409230f6044eb5ae493551a77260b9e439655d4b8630998c6e2237856d"

def sha(data):
    return hashlib.sha256(data).hexdigest()

def read_u16(b, pos):
    return struct.unpack_from('<H',b,pos)[0],pos+2

def read_u32(b, pos):
    return struct.unpack_from('<I',b,pos)[0],pos+4

def patch_member(source, ops):
    p=0
    out=bytearray()
    while p<len(ops):
        op=ops[p:p+1];p+=1
        if op==b'C':
            off,p=read_u32(ops,p)
            size,p=read_u32(ops,p)
            if off+size>len(source): raise ValueError('copy outside source')
            out.extend(source[off:off+size])
        elif op==b'I':
            size,p=read_u32(ops,p)
            if p+size>len(ops): raise ValueError('insert outside patch')
            out.extend(ops[p:p+size]);p+=size
        else: raise ValueError('unknown operation')
    return bytes(out)

def load_patch():
    packed=base64.b64decode(PATCH.read_text().strip(), validate=True)
    blob=zlib.decompress(packed)
    if not blob.startswith(b'CTXDELTA01'):raise ValueError('invalid delta header')
    p=len(b'CTXDELTA01'); changed={}
    while True:
        size,p=read_u16(blob,p)
        if size==0:break
        key=blob[p:p+size].decode('utf-8');p+=size
        datalen,p=read_u32(blob,p)
        ops=blob[p:p+datalen];p+=datalen
        if len(ops)!=datalen or key in changed:raise ValueError('bad delta entry')
        changed[key]=ops
    if p!=len(blob):raise ValueError('extra delta data')
    return changed

def main():
    if sha(BASE.read_bytes())!=EXPECTED_BASE_SHA:raise ValueError('Legacy R9 source checksum mismatch')
    updates=load_patch()
    if len(updates)!=13:raise ValueError('Expected 13 changed members')
    ordered=[]
    with zipfile.ZipFile(BASE,'r') as zin:
        if zin.testzip() is not None:raise ValueError('source ZIP is corrupt')
        names=set(zin.namelist())
        if not set(updates).issubset(names):raise ValueError('delta names not in source')
        for info in zin.infolist():
            contents=zin.read(info.filename)
            if info.filename in updates:
                contents=patch_member(contents,updates[info.filename])
            ordered.append((info,contents))
    digest=hashlib.sha256()
    for info,data in sorted(ordered,key=lambda x:x[0].filename):
        digest.update(info.filename.encode('utf-8')+b'\0'+data)
    actual=digest.hexdigest()
    if actual!=EXPECTED_PAYLOAD_SHA:raise ValueError(f'payload mismatch {actual}')
    with zipfile.ZipFile(OUT,'w') as zout:
        for info,data in ordered:
            zout.writestr(info,data,compress_type=info.compress_type,compresslevel=9)
    with zipfile.ZipFile(OUT) as z:
        if z.testzip() is not None:raise ValueError('rebuilt WGT is corrupt')
        config=z.read('config.xml').decode('utf-8')
        if 'version="0.2.12"' not in config or 'required_version="2.3"' not in config:
            raise ValueError('Unexpected manifest')
    print(f'Rebuilt {OUT.name}: {OUT.stat().st_size:,} bytes, SHA256 {sha(OUT.read_bytes())}')
    print(f'Validated {len(ordered)} ZIP entries, {len(updates)} patched members, content digest {actual}')

if __name__=='__main__':main()