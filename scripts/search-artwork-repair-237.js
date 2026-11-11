/* LG 2.0.37: recover only missing/failed search artwork, two requests at a time. */
(function(w){'use strict';
 var api=w.CACTUS_API,original=api.search,seq=0,queue=[],active=0,items={},attempted={};
 function present(x){var input=document.getElementById('search');if(input&&!input.value.trim())return false;var cards=document.querySelectorAll('#catalog button.media-card');for(var i=0;i<cards.length;i++)if(cards[i].getAttribute('data-id')===x.id)return true;return false;}
 function notify(){var e=document.createEvent('Event');e.initEvent('cactusartworkchange',false,false);document.dispatchEvent(e);}
 function enqueue(x){if(!x||!x.isSearchResult||attempted[x.id]||!present(x))return;attempted[x.id]=true;queue.push({item:x,seq:seq});pump();}
 function pump(){while(active<2&&queue.length){var job=queue.shift();if(job.seq!==seq||!present(job.item))continue;run(job);}}
 function run(job){active++;var finished=false,timer,request;
  function end(err,data){if(finished)return;finished=true;clearTimeout(timer);active--;
   if(!err&&data&&job.seq===seq&&present(job.item)){if(data.poster)job.item.posterUrl=data.poster;if(data.wide)job.item.backdropUrl=data.wide;notify();}
   pump();
  }
  timer=setTimeout(function(){if(request&&request.abort)request.abort();end(new Error('artwork_timeout'));},10000);
  try{request=api.refreshArtwork(job.item,end);}catch(e){end(e);}
 }
 api.search=function(q,done,page,section){var current=++seq;queue=[];items={};attempted={};
  return original.call(api,q,function(err,data){if(current!==seq)return done(err,data);
   if(!err&&data&&Array.isArray(data.items))data.items.forEach(function(x){items[x.id]=x;});
   done(err,data);
   if(!err)Object.keys(items).forEach(function(id){var x=items[id];if(!api.safeImage(x.posterUrl))enqueue(x);});
  },page,section);
 };
 document.addEventListener('cactusimagefailed',function(e){var n=e.target;while(n&&n!==document&&!n.getAttribute('data-id'))n=n.parentNode;if(n&&n!==document)enqueue(items[n.getAttribute('data-id')]);});
 document.addEventListener('cactusprofilewillchange',function(){seq++;queue=[];items={};attempted={};});
})(window);
