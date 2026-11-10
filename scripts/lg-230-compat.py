#!/usr/bin/env python3
"""Run verified LG 230 packager with Standard (immediate preview) compatibility."""
import importlib.util,sys
from pathlib import Path
if len(sys.argv)!=4:raise SystemExit('usage: lg-230-compat.py packager.py base_229.ipk output_230.ipk')
sp=importlib.util.spec_from_file_location('lg230_patcher',sys.argv[1])
p=importlib.util.module_from_spec(sp)
sp.loader.exec_module(p)
orig=p.fix_live
def compatible_live(s):
    if 'function warmPreview(' in s:return orig(s)
    old_a='if(playable.length&&autoPreview)preview(playable[0]);else if(!playable.length)'
    new_a='if(playable.length&&autoPreview)warmPreview(playable[0]);else if(!playable.length)'
    old_b='if(next===1&&!query&&rows.length&&(!current||!rows.some(function(x){return x.id===current.id;})))preview(rows[0]);'
    new_b='if(next===1&&!query&&rows.length&&(!current||!rows.some(function(x){return x.id===current.id;})))warmPreview(rows[0]);'
    assert s.count(old_a)==1 and s.count(old_b)==1,'standard preview markers changed'
    updated=orig(s.replace(old_a,new_a).replace(old_b,new_b))
    assert updated.count('warmPreview(')>=3
    return updated.replace('warmPreview(','preview(')
p.fix_live=compatible_live
p.main(Path(sys.argv[2]),Path(sys.argv[3]))
