#!/usr/bin/env python3
"""Reconstruct LG 2.0.36 artwork fix from published LG 2.0.35 packages.
Only code differences from the previously prepared 2.0.36 beta are applied.
Abort on any mismatch rather than publish a different build.
"""
import base64, copy, gzip, hashlib, io, json, pathlib, sys, tarfile

if len(sys.argv) != 4:
    raise SystemExit("Uso: build-lg-236.py BASE.ipk OUTPUT.ipk Standard|webOS6")
BASE, OUT, KIND = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]), sys.argv[3]
if KIND not in ("Standard", "webOS6"):
    raise SystemExit("Plataforma no admitida")
SCRIPTS = pathlib.Path(__file__).resolve().parent
PATCHES = json.loads(gzip.decompress(base64.b64decode((SCRIPTS/"lg-236-poster-patch.b64").read_text())).decode("utf-8"))
EXPECTED_SHA = {
    "Standard": {
        "direct-api.js": ("1bf076ea826ae893f96856bad4b1dc947f5876ceda11074228b7242d206f0505", "be9e881d6fca4c51841577a9e6c8589e233f9e2a8573821dca46954993430beb"),
        "details-view.js": ("951911f22c5990390795e9e88bcd535558b94154235d19e9e739f5d8267b5679", "04fcd6c373bffe9b89a300f38d0fdda26273af22a5578c89657a32b0e07556b5"),
    },
    "webOS6": {
        "direct-api.js": ("52c6b5401b84199e522dc53656520572e91d2c9239fa7f8c775a92f18d0130ce", "a2c19cb0f286f430dc4382e699aae0c50ffcbe376e07f10a149c9e17ec6cb9ab"),
        "details-view.js": ("951911f22c5990390795e9e88bcd535558b94154235d19e9e739f5d8267b5679", "04fcd6c373bffe9b89a300f38d0fdda26273af22a5578c89657a32b0e07556b5"),
    }
}
META = {"index.html", "appinfo.json", "packageinfo.json", "services.json", "lg-update-check.js"}

def sha(b): return hashlib.sha256(b).hexdigest()
def get_ar(data):
    assert data.startswith(b"!<arch>\n")
    pos=8; parts=[]
    while pos<len(data):
        h=data[pos:pos+60]
        assert len(h)==60 and h[58:60]==b"`\n"
        name=h[:16].decode("ascii").strip().rstrip("/")
        size=int(h[48:58])
        parts.append((name, data[pos+60:pos+60+size]))
        pos+=60+size+size%2
    assert pos==len(data)
    return parts
def put_ar(parts):
    buf=io.BytesIO();buf.write(b"!<arch>\n")
    for name,b in parts:
        h=f"{name:<16}{1794192000:<12}{0:<6}{0:<6}{'100644':<8}{len(b):<10}"+chr(96)+"\n"
        assert len(h)==60
        buf.write(h.encode("ascii"));buf.write(b)
        if len(b)%2:buf.write(b"\n")
    return buf.getvalue()
def untar(data):
    with tarfile.open(fileobj=io.BytesIO(data),mode="r:gz") as f:
        return [(copy.copy(m), f.extractfile(m).read() if m.isfile() else None) for m in f]
def retar(items):
    b=io.BytesIO()
    with tarfile.open(fileobj=b,mode="w:gz",format=tarfile.USTAR_FORMAT,compresslevel=6) as t:
        for m,data in items:
            m=copy.copy(m)
            m.uid=m.gid=0;m.uname=m.gname=""
            if data is not None:m.size=len(data)
            t.addfile(m,io.BytesIO(data) if data is not None else None)
    v=b.getvalue()
    return v[:4]+bytes(4)+v[8:]  # reproducible gzip timestamp
parts=dict(get_ar(BASE.read_bytes()))
assert set(parts)=={"debian-binary","control.tar.gz","data.tar.gz"}
files=untar(parts["data.tar.gz"]);controls=untar(parts["control.tar.gz"])
changed=set()
for i,(member,blob) in enumerate(files):
    if blob is None: continue
    name=member.name.split("/")[-1]
    if name in PATCHES:
        oldhash,newhash=EXPECTED_SHA[KIND][name]
        assert sha(blob)==oldhash,(name,"base SHA unexpected",sha(blob))
        s=blob.decode("utf-8")
        for old,new in PATCHES[name]:
            assert s.count(old)==1,(name,"missing/duplicate hunk",old[:100])
            s=s.replace(old,new,1)
        blob=s.encode("utf-8")
        assert sha(blob)==newhash,(name,"target SHA mismatch",sha(blob))
        changed.add(name)
    elif name in META and b"2.0.35" in blob:
        blob=blob.replace(b"2.0.35",b"2.0.36")
        if name=="appinfo.json":
            info=json.loads(blob)
            assert info["version"]=="2.0.36"
            info["appDescription"]="LG 2.0.36: prioridad de carátulas actuales y respaldo de episodios."
            blob=json.dumps(info,ensure_ascii=False,indent=2).encode()
        changed.add(name)
    member.size=len(blob);files[i]=(member,blob)

assert set(PATCHES).issubset(changed),changed
assert {"appinfo.json","packageinfo.json","services.json","index.html","lg-update-check.js"}.issubset(changed),changed
for i,(member,blob) in enumerate(controls):
    if member.name.endswith("control"):
        assert b"Version: 2.0.35" in blob,blob[:200]
        blob=blob.replace(b"Version: 2.0.35",b"Version: 2.0.36")
        member.size=len(blob);controls[i]=(member,blob)
out=put_ar([("debian-binary",parts["debian-binary"]),("control.tar.gz",retar(controls)),("data.tar.gz",retar(files))])
assert [(m.name,sha(v) if v is not None else None) for m,v in untar(dict(get_ar(out))["data.tar.gz"])] == [(m.name,sha(v) if v is not None else None) for m,v in files]
OUT.write_bytes(out)
print("RESULT",KIND,OUT.name,"size",len(out),"sha256",sha(out),"changed",sorted(changed))
