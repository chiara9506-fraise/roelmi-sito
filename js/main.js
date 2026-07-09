(function(){
  var canvas=document.getElementById('cv');
  if(!canvas||!window.THREE){canvas&&(canvas.style.display='none');return;}
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scene=new THREE.Scene();
  var camera=new THREE.PerspectiveCamera(45,1,0.1,100);camera.position.z=12;
  var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});
  renderer.setClearColor(0x001D29,1);
  var mol=new THREE.Group();scene.add(mol);

  var CYAN=0x009CC4, LIGHT=0x7cc7dc, WHITE=0xeef7fa, TEAL=0x007C8F;

  function atomMat(color){
    return new THREE.MeshStandardMaterial({color:color,roughness:.42,metalness:.12,emissive:0x000000,emissiveIntensity:0});
  }
  var nodes=[], meshes=[];
  function atom(x,y,z,r,color){
    var mat=atomMat(color);
    var m=new THREE.Mesh(new THREE.SphereGeometry(r,48,48),mat);
    m.position.set(x,y,z);mol.add(m);nodes.push(new THREE.Vector3(x,y,z));meshes.push(m);return nodes.length-1;
  }
  var bondMat=new THREE.MeshPhysicalMaterial({color:0xeaf6fa,roughness:.06,metalness:0,
    clearcoat:1,clearcoatRoughness:.05,reflectivity:.9,transparent:true,opacity:.42,
    emissive:0x0a7fa0,emissiveIntensity:.06,side:THREE.DoubleSide});
  var bondMeshes=[];
  function bond(i,j,rad){
    var a=nodes[i],b=nodes[j],dir=new THREE.Vector3().subVectors(b,a),len=dir.length();
    var c=new THREE.Mesh(new THREE.CylinderGeometry(rad||.07,rad||.07,len,20,1),bondMat);
    c.position.copy(a).add(b).multiplyScalar(.5);
    c.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize());
    mol.add(c);bondMeshes.push(c);
  }

  var R=1.85, ring=[];
  for(var k=0;k<6;k++){
    var ang=k/6*Math.PI*2;
    var x=Math.cos(ang)*R, y=Math.sin(ang)*R, z=(k%2?.45:-.45);
    ring.push(atom(x,y,z,.5,[CYAN,TEAL,LIGHT][k%3]));
  }
  for(var k=0;k<6;k++) bond(ring[k],ring[(k+1)%6],.08);
  (function(){
    var i=ring[0],j=ring[1],a=nodes[i],b=nodes[j];
    var off=new THREE.Vector3(0,0,1).multiplyScalar(.16);
    var dir=new THREE.Vector3().subVectors(b,a),len=dir.length();
    var c=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,len*.8,16,1),bondMat);
    c.position.copy(a).add(b).multiplyScalar(.5).add(off);
    c.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize());
    mol.add(c);bondMeshes.push(c);
  })();

  var branches=[
    {from:0,dir:[1.5,1.3,.7],r:.36,c:WHITE,tip:.2},
    {from:2,dir:[-1.7,1.1,-.5],r:.40,c:TEAL,tip:.22},
    {from:4,dir:[-.3,-1.9,.8],r:.34,c:WHITE,tip:0},
    {from:1,dir:[1.8,-.7,-.7],r:.30,c:TEAL,tip:.16},
    {from:5,dir:[-1.3,-1.2,.9],r:.28,c:WHITE,tip:0}
  ];
  branches.forEach(function(bd){
    var base=nodes[ring[bd.from]];
    var nx=base.x+bd.dir[0],ny=base.y+bd.dir[1],nz=base.z+bd.dir[2];
    var idx=atom(nx,ny,nz,bd.r,bd.c);
    bond(ring[bd.from],idx,.075);
    if(bd.tip>0){
      var idx2=atom(nx+bd.dir[0]*.5,ny+bd.dir[1]*.5,nz+bd.dir[2]*.5,bd.tip,WHITE);
      bond(idx,idx2,.05);
    }
  });

  var pC=360,pg=new THREE.BufferGeometry(),pp=new Float32Array(pC*3);
  for(var i=0;i<pC;i++){var rr=3.4+Math.random()*3,th=Math.random()*6.28,ph=Math.acos(2*Math.random()-1);
    pp[i*3]=rr*Math.sin(ph)*Math.cos(th);pp[i*3+1]=rr*Math.sin(ph)*Math.sin(th);pp[i*3+2]=rr*Math.cos(ph);}
  pg.setAttribute('position',new THREE.BufferAttribute(pp,3));
  var ptMat=new THREE.PointsMaterial({color:0x7cc7dc,size:.05,transparent:true,opacity:.65});
  var points=new THREE.Points(pg,ptMat);
  mol.add(points);

  scene.add(new THREE.AmbientLight(0xffffff,.4));
  var key=new THREE.DirectionalLight(0xffffff,.7);key.position.set(5,7,9);scene.add(key);
  var rim=new THREE.DirectionalLight(CYAN,.85);rim.position.set(-7,-2,3);scene.add(rim);
  var top2=new THREE.DirectionalLight(0xffffff,.35);top2.position.set(0,8,-3);scene.add(top2);
  mol.position.x=3.4;

  // Target determinato dinamicamente: l'anello più vicino alla camera quando si ferma
  var lockedTarget=null;

  function resize(){
    var rc=canvas.getBoundingClientRect();if(!rc.width||!rc.height)return;
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(rc.width,rc.height,false);
    camera.aspect=rc.width/rc.height;camera.updateProjectionMatrix();
    mol.position.x=rc.width<760?0:3.4;
  }
  addEventListener('resize',resize);
  var mx=0,my=0,tmx=0,tmy=0;
  if(!reduce)addEventListener('mousemove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;});

  var hero=document.getElementById('hero'),sticky=document.getElementById('sticky'),content=document.getElementById('heroContent');
  var expander=document.getElementById('heroExpander');
  var prog=0;
  var isMobile=window.innerWidth<640;
  addEventListener('resize',function(){isMobile=window.innerWidth<640;},{ passive:true });
  function cp(){
    if(isMobile){prog=0;return;}
    var r=hero.getBoundingClientRect();var tot=hero.offsetHeight-innerHeight;
    if(tot<=0){prog=0;return;}
    prog=Math.min(1,Math.max(0,(-r.top)/tot));
  }
  addEventListener('scroll',cp,{passive:true});

  function eoc(t){return 1-Math.pow(1-t,3);}

  var rotY=0;

  var t=0;
  function anim(){
    requestAnimationFrame(anim);
    t+=.005;

    var slowF=prog<0.10?1:Math.max(0,1-(prog-0.10)/0.25);
    rotY+=0.005*0.55*slowF;
    tmx+=(mx-tmx)*.05;tmy+=(my-tmy)*.05;
    mol.rotation.y=rotY+tmx*.5*slowF;
    mol.rotation.x=Math.sin(t*.4)*.12*slowF+tmy*.3*slowF;
    points.rotation.y=-rotY*(3/5.5)*slowF;
    var scaleP=Math.min(prog,0.44);mol.scale.setScalar(1+scaleP*scaleP*1.2);
    camera.position.z=12-prog*1.5;

    renderer.render(scene,camera);

    // Quando la rotazione si ferma, trova l'atomo dell'anello piu' vicino alla camera
    if(!lockedTarget && slowF<0.02){
      var bestZ=-Infinity;
      ring.forEach(function(ri){
        var wp=new THREE.Vector3();
        meshes[ri].getWorldPosition(wp);
        if(wp.z>bestZ){bestZ=wp.z;lockedTarget=meshes[ri];}
      });
      if(!lockedTarget) lockedTarget=meshes[ring[0]];
      lockedTarget._origColor=lockedTarget.material.color.getHex();
    }

    // Fade testo
    if(content){
      var cf=Math.max(0,1-prog/0.35);
      content.style.opacity=cf;
      content.style.transform='translateY('+(prog*-40)+'px)';
    }

    // Espansione — parte al 70% (molecola già ingrandita), veloce negli ultimi 30%
    var zoomT=Math.max(0,Math.min(1,(prog-0.70)/0.30));

    if(lockedTarget && zoomT>0){
      camera.near=0.001;
      camera.updateProjectionMatrix();

      var expandT=Math.min(1,zoomT*2);
      var otherFade=Math.max(0,1-zoomT*5);

      lockedTarget.scale.setScalar(1+eoc(expandT)*14);
      lockedTarget.material.side=THREE.FrontSide;
      if(!lockedTarget.material.transparent)lockedTarget.material.transparent=true;
      lockedTarget.material.color.setHex(0xffffff);
      lockedTarget.material.emissive.setHex(0xffffff);
      lockedTarget.material.emissiveIntensity=2.0;
      lockedTarget.material.opacity=Math.max(0,1-Math.max(0,(zoomT-0.50)/0.50));

      // Sfondo: transizione da scuro (#001D29) a bianco quando gli atomi scompaiono
      // La palla è già bianca — svanisce invisibilmente sul fondo bianco, zero dead zone
      var bgT=Math.max(0,Math.min(1,(zoomT-0.20)/0.80));
      var bgR=Math.round(0x00+(0xff-0x00)*bgT);
      var bgG=Math.round(0x1d+(0xff-0x1d)*bgT);
      var bgB=Math.round(0x29+(0xff-0x29)*bgT);
      renderer.setClearColor((bgR<<16)|(bgG<<8)|bgB,1);
      canvas.style.opacity='';

      meshes.forEach(function(m){
        if(m!==lockedTarget){
          if(!m.material.transparent)m.material.transparent=true;
          m.material.opacity=Math.max(0,otherFade);
        }
      });
      bondMat.opacity=Math.max(0,0.42*otherFade);
      ptMat.opacity=Math.max(0,0.65*otherFade);

    } else if(lockedTarget && zoomT===0){
      camera.near=0.1;
      camera.updateProjectionMatrix();
      renderer.setClearColor(0x001D29,1);
      canvas.style.opacity='';
      lockedTarget.scale.setScalar(1);
      lockedTarget.material.transparent=false;
      lockedTarget.material.opacity=1;
      lockedTarget.material.color.setHex(lockedTarget._origColor||0x009CC4);
      lockedTarget.material.emissiveIntensity=0;
      lockedTarget.material.side=THREE.FrontSide;
      meshes.forEach(function(m){
        if(m!==lockedTarget){m.material.transparent=false;m.material.opacity=1;}
      });
      bondMat.opacity=0.42;
      ptMat.opacity=0.65;
    }

    if(expander) expander.style.display='none';
    sticky.classList.toggle('near-end',false);

    // Gradiente fondo: invisibile a scroll=0, compare subito dopo
    sticky.style.setProperty('--hero-fade', Math.min(1, prog * 15).toFixed(2));

    // Quando la palla è quasi completamente esplosa (95%), fai sparire la sticky
    if(!isMobile){
      var done=zoomT>=0.95;
      sticky.style.opacity=done?'0':'1';
      sticky.style.pointerEvents=done?'none':'';
    }
  }

    function start(){try{resize();cp();anim();}catch(e){console.warn(e);canvas.style.display='none';}}
  if(document.readyState!=='loading')start();else addEventListener('DOMContentLoaded',start);
  setTimeout(resize,300);
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
function onScroll(){
  // Diventa solid quando la sticky svanisce (zoomT>=0.95 con formula 0.70/0.30 = prog 0.985)
  var heroBottom = heroEl ? Math.round(0.985 * (heroEl.offsetHeight - innerHeight)) : 40;
  header.classList.toggle('solid', window.scrollY > heroBottom);
}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

// mobile nav
(function(){
  var burger=document.getElementById('burger');
  var nav=document.getElementById('mobNav');
  var overlay=document.getElementById('mobOverlay');
  if(!burger||!nav) return;
  function open(){burger.classList.add('is-open');nav.classList.add('is-open');overlay.classList.add('is-open');nav.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
  function close(){burger.classList.remove('is-open');nav.classList.remove('is-open');overlay.classList.remove('is-open');nav.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  var closeBtn=document.getElementById('mobNavClose');
  burger.addEventListener('click',function(){nav.classList.contains('is-open')?close():open();});
  if(closeBtn) closeBtn.addEventListener('click',close);
  overlay.addEventListener('click',close);
})();

// search toggle
var sw=document.getElementById('searchWrap'),sb=document.getElementById('searchBtn'),sf=document.getElementById('searchField');
sb.addEventListener('click',function(e){
  if(sw.classList.contains('open')&&sf.value.trim()===''){sw.classList.remove('open');}
  else{sw.classList.add('open');sf.focus();}
});
document.addEventListener('click',function(e){if(!sw.contains(e.target)&&sf.value.trim()===''){sw.classList.remove('open');}});

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
  document.getElementById('ingTot').textContent=String(total).padStart(2,'0');
  function render(){
    cap.classList.add('swap');
    setTimeout(function(){
      var d=data[i];
      pill.textContent=d.pill;nm.innerHTML=d.name;desc.innerHTML=d.desc;
      tags.innerHTML=d.tags.map(function(t){return '<span>'+t+'</span>'}).join('');
      num.textContent=String(i+1).padStart(2,'0');
      imgs.forEach(function(im){im.classList.toggle('active',+im.dataset.i===i)});
      cap.classList.remove('swap');
    },210);
  }
  function step(d){i=(i+d+total)%total;render();}
  document.getElementById('ingNext').addEventListener('click',function(){step(1)});
  document.getElementById('ingPrev').addEventListener('click',function(){step(-1)});
  var stage=document.getElementById('ingStage'),fl=document.getElementById('ingParallax');
  var rx=0,ry=0,tx=0,ty=0,raf=null;
  function loop(){tx+=(rx-tx)*.08;ty+=(ry-ty)*.08;fl.style.transform='translate('+tx+'px,'+ty+'px) rotateX('+(-ty*0.08)+'deg) rotateY('+(tx*0.08)+'deg)';if(Math.abs(rx-tx)>.1||Math.abs(ry-ty)>.1){raf=requestAnimationFrame(loop);}else{raf=null;}}
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    stage.addEventListener('mousemove',function(e){var r=stage.getBoundingClientRect();rx=((e.clientX-r.left)/r.width-.5)*46;ry=((e.clientY-r.top)/r.height-.5)*40;if(!raf)raf=requestAnimationFrame(loop);});
    stage.addEventListener('mouseleave',function(){rx=0;ry=0;if(!raf)raf=requestAnimationFrame(loop);});
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
