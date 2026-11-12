"use strict";
const crypto=require('crypto');
function describe(m){
 let width=Number(m.width||m.videoWidth)||0,height=Number(m.height||m.videoHeight)||0;
 const declared=String(m.resolution||m.videoResolution||m.definitionName||m.qualityName||m.definition||m.quality||'');
 let pair=declared.match(/(\d{3,5})\s*[x×]\s*(\d{3,5})/i),p=declared.match(/(2160|1440|1080|720|480|360)p?/i);
 if(!height&&pair){width=+pair[1];height=+pair[2];}else if(!height&&p)height=+p[1];else if(!height&&/\b(4k|uhd)\b/i.test(declared))height=2160;
 const codec=String(m.encodeFormat||m.codec||'').slice(0,30),container=String(m.videoFormat||m.AVFormat||'').slice(0,20);
 return {width,height,codec,container,label:(height>=2160?'4K / '+height+'p':height?height+'p':'Resolución no informada')+(codec?' · '+codec:''),evidence:height?'declarada por la fuente':'sin datos'};
}
function entries(data,live){let out=[];function add(movie,subtitleList){if(live?!movie.license:!(movie.licenseList||[]).some(x=>x.license))return;const id=crypto.createHash('sha256').update(JSON.stringify({contentId:movie.contentId||movie.playCode||'',info:describe(movie),index:out.length})).digest('hex').slice(0,20);if(!out.some(x=>x.id===id))out.push(Object.assign({id,movie,subtitleList:subtitleList||[]},describe(movie)));}
 if(live)(data.liveAddressList||[]).forEach(m=>add(m));else for(const e of data.episodeList||[])for(const g of e.totalMovieList||[])for(const m of g.movieList||[])add(m,e.subtitleList);
 return out;}
function publicList(data,live){return entries(data,live).map(({movie,subtitleList,...safe})=>safe);}
function select(data,id,live){const list=entries(data,live);if(id){const x=list.find(x=>x.id===id);if(!x)throw Error('La calidad seleccionada ya no está disponible. Vuelve a abrir Calidad.');return x;}if(live)return list.find(x=>x.movie.tag==='free')||list[0];return list.sort((a,b)=>rank(a.movie)-rank(b.movie))[0];}
function rank(m){return(String(m.encodeFormat||'').toLowerCase()==='h264'?0:2)+(String(m.videoFormat||'').toLowerCase()==='mp4'?0:1);}
module.exports={entries,publicList,select,describe};
