(function(){
  /* Quanto scroll serve per percorrere l'intero video, in vh.
     Taratura dell'effetto: va tenuto uguale all'altezza di .hero in css/hero.css. */
  var HERO_SCROLL_VH=300;
  var LERP=0.12;          // inseguimento morbido del target (0 = fermo, 1 = istantaneo)
  var READY_TIMEOUT=5000; // oltre questa soglia si resta sul poster
  var MOBILE_BP=768;
  var TEXT_FADE_START=0.35,TEXT_FADE_END=0.55; // il video schiarisce: il testo bianco esce prima
  var WHITE_FADE_START=0.90;                  // il video finisce gia. bianco: serve solo un raccordo finale
  // Fondo del video, campionato a inizio e fine: le bande ai lati devono seguirlo
  var BG_FROM=[13,61,71],BG_TO=[245,245,245];

  var video=document.getElementById('heroVideo');
  var hero=document.getElementById('hero');
  var sticky=document.getElementById('sticky');
  var content=document.getElementById('heroContent');
  if(!video||!hero)return;

  // Una sola sorgente, scelta prima del caricamento
  video.src=(window.innerWidth<MOBILE_BP?'video/hero-mobile.mp4':'video/hero.mp4');

  // "SCROLL DOWN" si ritira appena si scrolla e torna se si risale (vedi loop)
  var scrollDown=hero.querySelector(".scroll-down");

  // Reduced motion: nessuno scrubbing. Non toccando currentTime il video
  // resta sul poster, e .hero e' alta 100vh via CSS.
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;

  var heroTop=0,range=1,duration=0,ready=false;
  var target=0,current=0;
  var seeking=false,pending=null;

  // Misure di layout: solo qui, mai dentro il listener di scroll
  function measure(){
    heroTop=hero.getBoundingClientRect().top+window.pageYOffset;
    range=Math.max(1,hero.offsetHeight-window.innerHeight);
  }

  function updateTarget(){
    var p=(window.pageYOffset-heroTop)/range;
    target=p<0?0:(p>1?1:p);
  }

  // Un solo seek in volo: su iOS accodarne altri li fa fallire in silenzio
  function seek(t){
    if(seeking){pending=t;return;}
    seeking=true;
    try{video.currentTime=t;}catch(e){seeking=false;}
  }
  video.addEventListener('seeked',function(){
    seeking=false;
    if(pending!==null){var t=pending;pending=null;seek(t);}
  });
  video.addEventListener('error',function(){ready=false;});

  function clamp(v){return v<0?0:(v>1?1:v);}

  function loop(){
    requestAnimationFrame(loop);
    var p=target;
    if(ready){
      current+=(target-current)*LERP;
      var t=current*duration;
      if(Math.abs(video.currentTime-t)>0.02)seek(t);
      p=current;
    }
    if(scrollDown)scrollDown.classList.toggle("is-hidden",p>0.02);
    // Il testo si ritira verso la fine, per lasciare pulito il raccordo con la sezione sotto
    if(content)content.style.opacity=(1-clamp((p-TEXT_FADE_START)/(TEXT_FADE_END-TEXT_FADE_START))).toFixed(3);
    // Le bande ai lati del video (object-fit:contain) prendono il colore del suo fondo,
    // che schiarisce nel corso della clip: cosi. non si vede dove finisce il fotogramma
    var bg="rgb("+BG_FROM.map(function(c,i){return Math.round(c+(BG_TO[i]-c)*p)}).join(",")+")";
    if(sticky.style.backgroundColor!==bg)sticky.style.backgroundColor=bg;
    // Gli ultimi fotogrammi sfumano nel bianco e si saldano con la sezione sotto
    sticky.style.setProperty("--hero-fade",clamp((p-WHITE_FADE_START)/(1-WHITE_FADE_START)).toFixed(3));
  }

  video.addEventListener('loadedmetadata',function(){
    duration=video.duration||0;
    if(!duration)return;
    measure();
    updateTarget();
    current=target;              // ricarica a meta' pagina: si parte dal fotogramma giusto
    ready=true;
    seek(current*duration);
  });

  setTimeout(function(){
    if(!ready&&window.console&&console.warn)console.warn('Hero video non pronto: resta il poster.');
  },READY_TIMEOUT);

  addEventListener('scroll',updateTarget,{passive:true});

  var rt=null;
  function remeasure(){measure();updateTarget();}
  addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(remeasure,150);},{passive:true});
  addEventListener('orientationchange',function(){setTimeout(remeasure,300);},{passive:true});

  measure();
  updateTarget();
  current=target;
  requestAnimationFrame(loop);
})();

/* ───────────────────────────────── */

// reveal del contenuto
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
},{threshold:0});
document.querySelectorAll('.r-up,.r-img').forEach(function(el){io.observe(el)});


/* ───────────────────────────────── */

var header=document.getElementById('siteHeader');
var heroEl=document.getElementById('hero');
var heroIsLight=!!document.querySelector(".hero-light");
function onScroll(){
  // Su hero chiara l.header resta sempre in versione scura, altrimenti
  // logo e voci bianche sparirebbero sul fondo bianco del video
  if(heroIsLight){header.classList.add("solid");return;}
  var heroBottom = heroEl ? Math.round(0.95 * (heroEl.offsetHeight - innerHeight)) : 40;
  header.classList.toggle("solid", window.scrollY > heroBottom);
}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

// mobile nav
(function(){
  var burger=document.getElementById('burger');
  var nav=document.getElementById('mobNav');
  var overlay=document.getElementById('mobOverlay');
  if(!burger||!nav) return;
  nav.inert=true;
  function focusables(){return nav.querySelectorAll('a[href],button:not([disabled])');}
  function open(){
    burger.classList.add('is-open');nav.classList.add('is-open');overlay.classList.add('is-open');
    burger.setAttribute('aria-expanded','true');
    nav.setAttribute('aria-hidden','false');nav.inert=false;document.body.style.overflow='hidden';
    var f=focusables();if(f.length)f[0].focus();
  }
  function close(){
    burger.classList.remove('is-open');nav.classList.remove('is-open');overlay.classList.remove('is-open');
    burger.setAttribute('aria-expanded','false');
    nav.setAttribute('aria-hidden','true');nav.inert=true;document.body.style.overflow='';
    burger.focus();
  }
  nav.querySelectorAll('.mob-nav-group-toggle').forEach(function(btn){
    var panel=document.getElementById(btn.getAttribute('aria-controls'));
    if(panel)panel.inert=true;
    btn.addEventListener('click',function(){
      var expanded=btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded',expanded?'false':'true');
      panel.classList.toggle('is-collapsed',expanded);
      panel.inert=!expanded;
    });
  });
  var closeBtn=document.getElementById('mobNavClose');
  burger.addEventListener('click',function(){nav.classList.contains('is-open')?close():open();});
  if(closeBtn) closeBtn.addEventListener('click',close);
  overlay.addEventListener('click',close);
  nav.addEventListener('keydown',function(e){
    if(e.key==='Escape'){close();return;}
    if(e.key!=='Tab')return;
    var f=focusables();if(!f.length)return;
    var first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
})();

// Dropdown nav: Escape dismisses without needing to move mouse/focus away
document.querySelectorAll('.nav-item.has-drop').forEach(function(item){
  var trigger=item.querySelector('.nav-link');
  item.addEventListener('keydown',function(e){
    if(e.key!=='Escape')return;
    item.classList.add('dd-dismissed');
    if(trigger)trigger.focus();
  });
  item.addEventListener('mouseleave',function(){item.classList.remove('dd-dismissed');});
  item.addEventListener('focusout',function(e){
    if(!item.contains(e.relatedTarget))item.classList.remove('dd-dismissed');
  });
});

// search toggle
var sw=document.getElementById('searchWrap'),sb=document.getElementById('searchBtn'),sf=document.getElementById('searchField');
sb.addEventListener('click',function(e){
  if(sw.classList.contains('open')&&sf.value.trim()===''){sw.classList.remove('open');sf.tabIndex=-1;}
  else{sw.classList.add('open');sf.tabIndex=0;sf.focus();}
});
document.addEventListener('click',function(e){if(!sw.contains(e.target)&&sf.value.trim()===''){sw.classList.remove('open');sf.tabIndex=-1;}});

/* ───────────────────────────────── */

(function(){
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
},{threshold:.18});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

// top line draws on scroll
(function(){
  var sec=document.getElementById('divisions'),ln=document.getElementById('divLn');
  if(!ln) return;
  function onScroll(){
    var r=sec.getBoundingClientRect(),vh=innerHeight;
    var p=(vh*0.9-r.top)/(vh*0.5);p=Math.min(1,Math.max(0,p));
    ln.style.width=(p*100)+'%';
  }
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
})();
})();

/* ───────────────────────────────── */

(function(){
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

(function(){
  var data=[
    {pill:"Biologically active waters",name:"CytoFruit<b>\u00ae</b>",desc:"Fruit-derived active waters that replace demineralized water. Naturally processed, enriched in oligoelements, with protective and cell-vitality benefits for sustainable formulas.",tags:["Sustainable","Cellular protection","Water-free option"]},
    {pill:"GLP-1 natural support",name:"SelectSIEVE<b>\u00ae</b> HopE",desc:"Hop cone bioactives via supercritical CO\u2082 extraction, stabilised in powder form \u2014 supporting weight management, insulin sensitivity and natural GLP-1 release.",tags:["Metabolic health","Weight management","GLP-1 support"]},
    {pill:"Active Make-Up",name:"TechnoHYAL<b>\u00ae</b> HyaPearl",desc:"Olive glycerides and hyaluronic acid combined in a patented matrix \u2014 delivering hydration and skin nourishment in anhydrous color cosmetic formulations.",tags:["Active Make-Up","Hydration","Anhydrous"]},
    {pill:"Color portfolio",name:"ColorGLAM<b>\u00ae</b>",desc:"Ester-coated pigments functionalized with Tripelargonin, an upcycled sustainable ester \u2014 for high color release, formulation stability and a weightless, refined skin feel.",tags:["High color release","Formulation stability","Upcycled ester"]}
  ];
  var i=0,total=data.length;
  var imgs=document.querySelectorAll('#ingFloat img');
  var cap=document.getElementById('ingCaption');
  var pill=document.getElementById('ingPill'),nm=document.getElementById('ingName'),desc=document.getElementById('ingDesc'),tags=document.getElementById('ingTags'),num=document.getElementById('ingNum');
  var numMob=document.getElementById('ingNumMob');
  document.getElementById('ingTot').textContent=String(total).padStart(2,'0');
  var totMob=document.getElementById('ingTotMob');if(totMob)totMob.textContent=String(total).padStart(2,'0');
  function render(){
    cap.classList.add('swap');
    setTimeout(function(){
      var d=data[i];
      pill.textContent=d.pill;nm.innerHTML=d.name;desc.innerHTML=d.desc;
      tags.innerHTML=d.tags.map(function(t){return '<span>'+t+'</span>'}).join('');
      var n=String(i+1).padStart(2,'0');
      num.textContent=n;if(numMob)numMob.textContent=n;
      imgs.forEach(function(im){im.classList.toggle('active',+im.dataset.i===i)});
      cap.classList.remove('swap');
    },210);
  }
  function step(d){i=(i+d+total)%total;render();}
  document.getElementById('ingNext').addEventListener('click',function(){step(1)});
  document.getElementById('ingPrev').addEventListener('click',function(){step(-1)});
  var pMob=document.getElementById('ingPrevMob'),nMob=document.getElementById('ingNextMob');
  if(pMob)pMob.addEventListener('click',function(){step(-1)});
  if(nMob)nMob.addEventListener('click',function(){step(1)});
  var touchX=null;
  var stageEl=document.getElementById('ingStage');
  stageEl.addEventListener('touchstart',function(e){touchX=e.touches[0].clientX;},{passive:true});
  stageEl.addEventListener('touchend',function(e){if(touchX===null)return;var dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>40)step(dx<0?1:-1);touchX=null;},{passive:true});
  var stage=document.getElementById('ingStage'),fl=document.getElementById('ingParallax');
  var pauseBtn=document.getElementById('ingPauseBtn');
  if(pauseBtn){
    var reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduceMotion)fl.classList.add('is-paused');
    pauseBtn.setAttribute('aria-pressed',reduceMotion?'true':'false');
    if(reduceMotion){pauseBtn.querySelector('.ic-pause').hidden=true;pauseBtn.querySelector('.ic-play').hidden=false;pauseBtn.setAttribute('aria-label','Play animation');}
    pauseBtn.addEventListener('click',function(){
      var paused=fl.classList.toggle('is-paused');
      pauseBtn.setAttribute('aria-pressed',paused?'true':'false');
      pauseBtn.setAttribute('aria-label',paused?'Play animation':'Pause animation');
      pauseBtn.querySelector('.ic-pause').hidden=paused;
      pauseBtn.querySelector('.ic-play').hidden=!paused;
      if(paused){
        rx=0;ry=0;tx=0;ty=0;
        if(raf){cancelAnimationFrame(raf);raf=null;}
        fl.style.transform='none';
      }
    });
  }
  var rx=0,ry=0,tx=0,ty=0,raf=null;
  function loop(){tx+=(rx-tx)*.08;ty+=(ry-ty)*.08;fl.style.transform='translate('+tx+'px,'+ty+'px) rotateX('+(-ty*0.08)+'deg) rotateY('+(tx*0.08)+'deg)';if(Math.abs(rx-tx)>.1||Math.abs(ry-ty)>.1){raf=requestAnimationFrame(loop);}else{raf=null;}}
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    stage.addEventListener('mousemove',function(e){if(fl.classList.contains('is-paused'))return;var r=stage.getBoundingClientRect();rx=((e.clientX-r.left)/r.width-.5)*46;ry=((e.clientY-r.top)/r.height-.5)*40;if(!raf)raf=requestAnimationFrame(loop);});
    stage.addEventListener('mouseleave',function(){if(fl.classList.contains('is-paused'))return;rx=0;ry=0;if(!raf)raf=requestAnimationFrame(loop);});
  }
})();
})();

/* ───────────────────────────────── */

(function(){
  var sec=document.getElementById('sustainability');if(!sec)return;
  var card=sec.querySelector('.sust-card');
  var nums=sec.querySelectorAll('.num');
  function countUp(el){
    var target=parseFloat(el.getAttribute('data-target'));
    var suf=el.getAttribute('data-suffix')||'';
    var dur=1200,t0=null;
    function step(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/dur);
      var ease=1-Math.pow(1-p,3);
      var val=Math.round(target*ease);
      el.textContent=val+suf;
      if(p<1)requestAnimationFrame(step);else el.textContent=target+suf;}
    requestAnimationFrame(step);
  }
  var io=new IntersectionObserver(function(es){es.forEach(function(en){
    if(en.isIntersecting){card.classList.add('in');nums.forEach(countUp);io.disconnect();}
  });},{threshold:.3});
  io.observe(card);
})();

/* ───────────────────────────────── */

(function(){
  var sec=document.getElementById('impact');if(!sec)return;
  var nums=sec.querySelectorAll('.impact-num');
  function countUp(el){
    var target=parseFloat(el.getAttribute('data-target'));
    var suf=el.getAttribute('data-suffix')||'';
    var dur=1200,t0=null;
    function step(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/dur);
      var ease=1-Math.pow(1-p,3);
      var val=Math.round(target*ease);
      el.textContent=val+suf;
      if(p<1)requestAnimationFrame(step);else el.textContent=target+suf;}
    requestAnimationFrame(step);
  }
  var grid=sec.querySelector('.impact-grid');
  var io=new IntersectionObserver(function(es){es.forEach(function(en){
    if(en.isIntersecting){nums.forEach(countUp);io.disconnect();}
  });},{threshold:.3});
  io.observe(grid);
})();

/* ───────────────────────────────── */

(function(){
  var sec=document.getElementById('news'),ln=document.getElementById('newsLn');
  if(!sec||!ln)return;
  function onScroll(){
    var r=sec.getBoundingClientRect(),vh=innerHeight;
    var p=(vh*0.9-r.top)/(vh*0.5);p=Math.min(1,Math.max(0,p));
    ln.style.width=(p*100)+'%';
  }
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
})();

/* Alternativa a click/tap allo swipe orizzontale del carosello news (mobile) */
(function(){
  var grid=document.getElementById('newsGrid');
  var prev=document.getElementById('newsPrev'),next=document.getElementById('newsNext');
  if(!grid||!prev||!next)return;
  function step(dir){
    var card=grid.querySelector('.news-card');
    var gap=parseFloat(getComputedStyle(grid).columnGap||getComputedStyle(grid).gap)||20;
    var dist=(card?card.getBoundingClientRect().width:280)+gap;
    grid.scrollBy({left:dir*dist,behavior:'smooth'});
  }
  prev.addEventListener('click',function(){step(-1)});
  next.addEventListener('click',function(){step(1)});
})();

/* ───────────────────────────────── */

(function(){
  var mapWrap=document.querySelector('.presence-map-wrap');
  if(!mapWrap)return;
  var popup=document.getElementById('pmPopup');
  var pmName=document.getElementById('pmName');
  var pmSub=document.getElementById('pmSub');
  var pmDesc=document.getElementById('pmDesc');
  var pmLink=document.getElementById('pmLink');
  var pmImg=document.getElementById('pmImg');
  var pmClose=document.getElementById('pmClose');

  mapWrap.querySelectorAll('.pm-site').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      var d=btn.dataset;
      pmName.textContent=d.name||'';
      pmSub.textContent=d.sub||'';
      pmDesc.textContent=d.desc||'';
      pmImg.style.background='url("images/INDUSTRIA.jpg") center/cover no-repeat';
      if(d.href){pmLink.href=d.href;pmLink.style.display='inline-flex';}
      else{pmLink.style.display='none';}
      popup.removeAttribute('hidden');
      var wRect=mapWrap.getBoundingClientRect();
      var bRect=btn.getBoundingClientRect();
      var cx=bRect.left-wRect.left+bRect.width/2;
      var cy=bRect.top-wRect.top+bRect.height/2;
      var pw=260;var ph=popup.offsetHeight||290;
      var left=cx-pw/2;var top=cy-ph-16;
      left=Math.max(8,Math.min(left,wRect.width-pw-8));
      if(top<8)top=cy+20;
      popup.style.left=left+'px';popup.style.top=top+'px';
    });
  });

  pmClose.addEventListener('click',function(){popup.setAttribute('hidden','');});
  document.addEventListener('click',function(e){
    if(!popup.hasAttribute('hidden')&&!popup.contains(e.target))popup.setAttribute('hidden','');
  });
})();
// Footer accordion (mobile)
(function(){
  document.querySelectorAll('.ft-col h4').forEach(function(h4){
    h4.addEventListener('click', function(){
      h4.closest('.ft-col').classList.toggle('is-open');
    });
  });
})();
