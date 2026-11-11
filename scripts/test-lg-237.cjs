const fs=require('fs'),vm=require('vm'),assert=require('assert'),{JSDOM}=require('jsdom');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function dom(){let d=new JSDOM('<body><div id="catalog"></div></body>',{url:'http://localhost/'}),w=d.window;w.HTMLElement.prototype.getClientRects=function(){return this.hidden||!this.isConnected?[]:[this.getBoundingClientRect()];};w.HTMLElement.prototype.getBoundingClientRect=function(){let top=+(this.dataset.top||0);return {top,bottom:top+200,left:0,right:150,width:150,height:200};};w.scrollBy=()=>{};return d;}
function evaluate(w,s){vm.runInContext(s,vm.createContext(w));}
async function run(kind){
 const read=n=>fs.readFileSync('inspection/'+kind+'/'+n,'utf8');
 let d=dom(),w=d.window,pend=[],events=0;
 Object.defineProperty(w.HTMLImageElement.prototype,'src',{set(v){this._src=v;pend.push(this);},get(){return this._src||'';}});
 Object.defineProperty(w.HTMLImageElement.prototype,'naturalWidth',{get(){return this._ok?150:0;}});
 w.document.addEventListener('cactusimagefailed',()=>events++);
 evaluate(w,read('poster-images.js'));let grid=w.document.getElementById('catalog'),imgs=[];
 for(let i=0;i<10;i++){let box=w.document.createElement('span');box.className='poster';if(i===9)box.dataset.top='4000';let im=w.document.createElement('img');box.appendChild(im);grid.appendChild(box);imgs.push(im);w.CACTUS_IMAGES.attach(im,'https://img.example/a'+i+'.jpg',['https://img.example/fallback.jpg']);}
 await wait(150);assert.equal(w.CACTUS_IMAGES.status().active,4);assert(!imgs[9]._src,'offscreen deferred');
 let first=pend.shift();first.onerror();for(let im of imgs.slice(1)){im._ok=true;}let drain=setInterval(()=>{for(let im of imgs.slice(1))if(im.onload)im.onload();},20);await wait(400);clearInterval(drain);assert.equal(first._src,'https://img.example/fallback.jpg');
 first.onerror();await wait(50);assert.equal(events,1);assert.equal(first._cactusTask.state,'failed');
 w.CACTUS_IMAGES.release(grid);assert.equal(w.CACTUS_IMAGES.status().active,0);assert.equal(w.CACTUS_IMAGES.status().queued,0);assert(imgs.every(x=>!x._cactusTask));d.window.close();
 d=dom();w=d.window;let raw={contentId:'ABC',name:'Example',type:'1',description:'Example',poster:'https://img.example/archive.jpg',wide:'https://img.example/archive-wide.jpg'};
 let boot={categories:{series:{defaultColumnId:'1'}},records:{'xuper-ABC':raw},sections:{},totals:{}};
 w.XMLHttpRequest=function(){this.open=()=>{};this.send=()=>{this.responseText=JSON.stringify(Object.assign({format:1},boot));this.onload();};};w.CACTUS_RUNTIME={direct:true};w.XuperConfig={};w.fetch=()=>Promise.resolve({ok:true,json:()=>Promise.resolve(boot)});
 w.CACTUS_BACKGROUND={enabled:()=>true,on:()=>{},call:(method,arg)=>{
  if(method==='catalog')return Promise.resolve({categories:boot.categories});
  if(method==='lookupBatch')return Promise.resolve({'xuper-ABC':{poster:'/__cactus__/image?u='+encodeURIComponent(raw.poster),wide:raw.wide}});
  if(method==='api'&&arg.path==='v3/searchByName')return Promise.resolve({searchItemList:[{itemList:[{contentId:'ABC',name:'Example',description:'Example',type:'1',poster:'https://img.example/current.jpg'}]}],totalSize:1});
  if(method==='api'&&arg.path==='v4/getItemData')return Promise.resolve({assetData:{posterList:[{fileType:'icon',fileUrl:'https://img.example/fresh.jpg'}]}});
  return Promise.resolve({});
 }};
 evaluate(w,read('direct-api.js'));await w.CACTUS_DIRECT.ready;
 const data=await new Promise((res,rej)=>w.CACTUS_API.search('Example',(e,v)=>e?rej(e):res(v),1,'all'));
 assert(data.items[0].posterUrl.includes('current.jpg'));assert(data.items[0].posterAlternates.some(x=>x.includes('archive.jpg')),'proxied backup preserved');
 const refreshed=await new Promise((res,rej)=>w.CACTUS_API.refreshArtwork(data.items[0],(e,v)=>e?rej(e):res(v)));
 assert(refreshed.poster.includes('fresh.jpg'));d.window.close();
 d=dom();w=d.window;let pending=[],calls=0,changed=0;
 let rows=Array.from({length:8},(_,i)=>({id:'xuper-'+i,isSearchResult:true,posterUrl:'',title:'Item '+i}));
 w.CACTUS_API={safeImage:u=>!!u,search:(q,done)=>done(null,{items:rows}),refreshArtwork:(x,done)=>{calls++;pending.push(()=>done(null,{poster:'https://img.example/'+x.id}));return {abort(){}};}};
 for(let x of rows){let b=w.document.createElement('button');b.className='media-card';b.dataset.id=x.id;w.document.getElementById('catalog').appendChild(b);}
 w.document.addEventListener('cactusartworkchange',()=>changed++);
 evaluate(w,fs.readFileSync('scripts/search-artwork-repair-237.js','utf8'));
 w.CACTUS_API.search('abc',()=>{},1,'all');assert.equal(calls,2);pending.shift()();assert.equal(calls,3);assert.equal(changed,1);
 let e=w.document.createEvent('Event');e.initEvent('cactusprofilewillchange',false,false);w.document.dispatchEvent(e);
 while(pending.length)pending.shift()();assert.equal(changed,1);assert.equal(calls,3);d.window.close();
 console.log('PASS',kind,'bounded image queue, offscreen deferral, alternate retry, failure event, disposal, proxy backups, fresh details, repair concurrency and profile isolation');
}
(async()=>{for(let k of ['Standard','webOS6'])await run(k);})().catch(e=>{console.error(e);process.exitCode=1;});
