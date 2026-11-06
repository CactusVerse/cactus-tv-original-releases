#!/usr/bin/env python3
"""Pack Cactus LG Legacy HD 2.0.14 with 1280x720 graphics and Chromium38-compatible CSS."""
import io,json,tarfile,pathlib,hashlib
from copy import copy
src=pathlib.Path("origen.ipk").read_bytes()
app="com.cocotecnico.cactustv.lgtest"
s_id=app+".service"
a="usr/palm/applications/"+app+"/"
s="usr/palm/services/"+s_id+"/"
def ar_parts(raw):
    assert raw[:8]==b'!<arch>\n'
    pos=8;ans={}
    while pos<len(raw):
        h=raw[pos:pos+60];z=int(h[48:58]);name=h[:16].decode().strip().rstrip('/')
        ans[name]=raw[pos+60:pos+60+z];pos+=60+z+z%2
    assert pos==len(raw)
    return ans
def tar_parts(raw):
    with tarfile.open(fileobj=io.BytesIO(raw),mode="r:gz") as t:
        ans=[]
        for m in t:
            n=m.name
            while n.startswith("./"):n=n[2:]
            if n in ("","."):continue
            v=copy(m);v.name=n
            ans.append((v,t.extractfile(m).read() if m.isfile() else None))
        return ans
def tar_build(entries,control=False):
    out=io.BytesIO()
    with tarfile.open(fileobj=out,mode="w:gz",format=tarfile.USTAR_FORMAT,compresslevel=6) as t:
        if control:
            root=tarfile.TarInfo(".");root.type=tarfile.DIRTYPE;root.mode=0o755;t.addfile(root)
        for m,contents in entries:
            x=copy(m);x.uid=x.gid=0;x.uname=x.gname=""
            if control:x.name="./"+x.name
            if x.isdir():x.mode=0o755
            t.addfile(x,io.BytesIO(contents) if contents is not None else None)
    raw=out.getvalue()
    return raw[:4]+bytes(4)+raw[8:]
def pack_ar(entries):
    out=io.BytesIO();out.write(b'!<arch>\n')
    for n,c in entries:
        h=f'{n:<16}{1794000000:<12}{0:<6}{0:<6}{"100644":<8}{len(c):<10}'+chr(96)+'\n'
        assert len(h)==60
        out.write(h.encode());out.write(c)
        if len(c)%2:out.write(b'\n')
    return out.getvalue()
parts=ar_parts(src)
files=tar_parts(parts["data.tar.gz"])
byname={m.name:(m,d) for m,d in files}
def patch(name,original,new):
    m,b=byname[name];body=b.decode()
    assert original in body,"Expected signature missing: "+name
    body=body.replace(original,new)
    byname[name]=(m,body.encode())
A=a+"launcher.js"
patch(A,"$('launch').hidden=true;$('app-frame').hidden=false;$('app-frame').focus();","$('launch').hidden=true;$('app-frame').hidden=false;$('app-frame').style.opacity='1';$('app-frame').style.pointerEvents='auto';$('app-frame').focus();")
patch(A,"$('app-frame').src=ORIGIN+'/?tv=lg&launch='+encodeURIComponent(token);","$('app-frame').hidden=false;$('app-frame').style.opacity='0';$('app-frame').style.pointerEvents='none';$('app-frame').src=ORIGIN+'/?tv=lg&launch='+encodeURIComponent(token);")
patch(A,"function error(t){clear();$('launch').hidden=false;","function error(t){clear();$('app-frame').style.opacity='0';$('app-frame').style.pointerEvents='none';$('launch').hidden=false;")
patch(A,"var sub=null,token='',seq=0,timer=null,phase='solicitud';","var sub=null,token='',seq=0,timer=null,phase='solicitud',childError='';")
patch(A,"function start(){var current=++seq;drop();phase='solicitud';","function start(){var current=++seq;drop();phase='solicitud';childError='';")
patch(A,"error('La interfaz no respondió. Comprueba la versión del televisor.');","error('La interfaz no respondió en webOS 3.0. '+(childError?('Error JS: '+childError):'Revisa compatibilidad del navegador.'));")
patch(A,"if(e.data.type==='cactus:ready'){clear();","if(e.data.type==='cactus:js-error'){childError=String(e.data.error||'Error desconocido').slice(0,200);$('status').textContent='Diagnóstico: '+childError;return;} if(e.data.type==='cactus:ready'){clear();")
patch(a+"index.html","main{display:flex;height:100%;","main{position:fixed;z-index:3;top:0;right:0;bottom:0;left:0;width:100%;height:100%;display:flex;")
patch(a+"index.html","iframe{position:fixed;inset:0;","iframe{position:fixed;z-index:1;top:0;right:0;bottom:0;left:0;")
patch(a+"index.html","html,body{height:100%;width:100%;margin:0;","html,body{height:100%;width:100%;margin:0;overflow:hidden;")
patch(s+"backend/app/webos-child.js","var p=new URLSearchParams(w.location.search),token=p.get('launch')||'';","var query=String(w.location.search||'').replace(/^\\?/,''),parts=query.split('&'),token='';for(var qi=0;qi<parts.length;qi++){var pair=parts[qi].split('=');if(pair[0]==='launch'){try{token=decodeURIComponent((pair.slice(1).join('=')||'').replace(/\\+/g,' '));}catch(e){token='';}break;}}")
preflight="""(function(w){'use strict';var old=w.onerror;w.onerror=function(message,source,line,column,err){var m=String(message||'Error JS')+' ('+String((source||'').split('/').pop())+':'+String(line||0)+')';try{if(w.parent!==w){var s=w.location.search||'',a=s.match(/[?&]launch=([^&]*)/),token=a?decodeURIComponent(a[1]):'';w.parent.postMessage({type:'cactus:js-error',token:token,error:m},'*');}}catch(e){}if(typeof old==='function')return old.apply(this,arguments);return false;};})(window);\n"""
patch(s+"backend/app/index.html",'  <script src="runtime-config.js"></script>','  <script src="webos3-preflight.js"></script>\n  <script src="runtime-config.js"></script>')
new_name=s+"backend/app/webos3-preflight.js"
new_info=tarfile.TarInfo(new_name);new_info.size=len(preflight.encode());new_info.mode=0o644;new_info.mtime=1794000000
byname[new_name]=(new_info,preflight.encode())
for name in [a+"appinfo.json",s+"services.json"]:
    m,b=byname[name];v=json.loads(b)
    v["version"]="2.0.14"
    if name.endswith("appinfo.json"):
        v["resolution"]="1280x720"
        v["title"]="Cactus TV LG Legacy HD"
        v["appDescription"]="Beta LG LH6000 HD 1280x720; compatibilidad CSS Chrome38; motor y catalogo de 2.0.12"
    else:v["description"]="Servicio Cactus TV para LG webOS 3.x HD ARMv7"
    byname[name]=(m,json.dumps(v,indent=2,ensure_ascii=False).encode())
data_entries=[]
for m,b in files:
    newm,newb=byname[m.name]
    newm.size=len(newb) if newb is not None else 0
    data_entries.append((newm,newb))
data_entries.append(byname[new_name])
control=tar_parts(parts["control.tar.gz"])
for j,(m,b) in enumerate(control):
    if m.name=="control":
        b=b.replace(b"Version: 2.0.12",b"Version: 2.0.14")
        m.size=len(b)
        control[j]=(m,b)
built=pack_ar([("debian-binary",b"2.0\n"),("control.tar.gz",tar_build(control,True)),("data.tar.gz",tar_build(data_entries))])
dst=pathlib.Path("CactusTV_LG_2.0.14_webOS3_LH6000_HD.ipk")
dst.write_bytes(built)
check=tar_parts(ar_parts(built)["data.tar.gz"])
assert len(check)==len(files)+1
assert dict((m.name,b) for m,b in check)[new_name]==preflight.encode()
print("Created",dst,len(built),hashlib.sha256(built).hexdigest(),"files",len(check))
