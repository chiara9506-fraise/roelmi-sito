(function(){
  var grid=document.getElementById('finderGrid');
  var countEl=document.getElementById('finderCount');
  var searchInput=document.getElementById('finderSearch');
  var resetBtn=document.getElementById('finderReset');
  var allData=[];

  function getChecked(name){
    return Array.from(document.querySelectorAll('input[data-filter="'+name+'"]:checked')).map(function(el){return el.value;});
  }

  function render(data){
    countEl.innerHTML='<b>'+data.length+'</b> ingredient'+(data.length!==1?'s':'')+' found';
    if(!data.length){
      grid.innerHTML='<div class="finder-empty"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg><p>No ingredients match your filters.<br>Try a different search or clear the filters.</p></div>';
      return;
    }
    grid.innerHTML=data.map(function(d){
      var tags=d.market.map(function(m){return '<span class="ing-card-tag market">'+m+'</span>';}).join('')+
               d.technology.map(function(t){return '<span class="ing-card-tag tech">'+t+'</span>';}).join('');
      var img=d.image?'<img src="'+d.image+'" alt="'+d.name+'">'
        :'<svg viewBox="0 0 80 80" style="width:64px;opacity:.2"><rect width="80" height="80" rx="8" fill="#009CC4"/></svg>';
      return '<a class="ing-card" href="'+d.link+'">'
        +'<div class="ing-card-img">'+img+'</div>'
        +'<div class="ing-card-body">'
        +'<div class="ing-card-tags">'+tags+'</div>'
        +'<h3>'+d.name.replace(/®/g,'<sup>®</sup>')+'</h3>'
        +'<div class="ing-card-function">'+d.function+'</div>'
        +'<p class="ing-card-desc">'+d.description+'</p>'
        +'<span class="ing-card-more">Learn more <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>'
        +'</div></a>';
    }).join('');
  }

  function filter(){
    var q=searchInput.value.trim().toLowerCase();
    var lines=getChecked('line');
    var markets=getChecked('market');
    var techs=getChecked('tech');
    var types=getChecked('type');
    var cats=getChecked('category');
    var benefits=getChecked('benefit');
    var certs=getChecked('cert');
    var result=allData.filter(function(d){
      if(q&&d.name.toLowerCase().indexOf(q)<0&&d.description.toLowerCase().indexOf(q)<0&&d.function.toLowerCase().indexOf(q)<0)return false;
      if(lines.length&&lines.indexOf(d.line)<0)return false;
      if(markets.length&&!markets.some(function(m){return d.market.indexOf(m)>-1;}))return false;
      if(techs.length&&!techs.some(function(t){return d.technology.indexOf(t)>-1;}))return false;
      if(types.length&&types.indexOf(d.active_functional)<0)return false;
      if(cats.length&&cats.indexOf(d.category)<0)return false;
      if(benefits.length&&!benefits.some(function(b){return (d.benefits||[]).indexOf(b)>-1;}))return false;
      if(certs.length&&!certs.every(function(c){return d.certifications.indexOf(c)>-1;}))return false;
      return true;
    });
    render(result);
  }

  function reset(){
    searchInput.value='';
    document.querySelectorAll('.finder-sidebar input[type="checkbox"]').forEach(function(el){el.checked=false;});
    render(allData);
  }

  document.querySelectorAll('.filter-group-toggle').forEach(function(btn){
    var body=btn.nextElementSibling;
    btn.addEventListener('click',function(){
      var open=btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded',open?'false':'true');
      body.classList.toggle('is-collapsed',open);
    });
  });

  var INGREDIENTS=[
    {"id":1,"name":"CytoFruit®","line":"CytoFruit","function":"Biologically active waters","market":["Personal Care"],"technology":["Nature"],"active_functional":"Active","category":"","benefits":[],"certifications":["COSMOS/ICEA","Palm oil free"],"description":"Fruit-derived active waters that replace demineralized water in formulations. Naturally processed and enriched in oligoelements, with protective and cell-vitality benefits for sustainable, high-performance formulas.","image":"images/CYTOFRUIT - INIZIO.png","link":"cytofruit.html"},
    {"id":2,"name":"SelectSIEVE® HopE","line":"SelectSIEVE","function":"GLP-1 natural support","market":["Nutraceutical"],"technology":["Nature"],"active_functional":"Active","category":"","benefits":["Weight management"],"certifications":["RSPO","Palm oil free"],"description":"Hop cone bioactives via supercritical CO₂ extraction, stabilised in powder form — supporting weight management, insulin sensitivity and natural GLP-1 release for metabolic health applications.","image":"images/SELECT SIEVE - HOPE.png","link":"#"},
    {"id":3,"name":"TechnoHYAL® HyaPearl","line":"TechnoHYAL","function":"Active Make-Up","market":["Personal Care"],"technology":["Biotech"],"active_functional":"Active","category":"","benefits":["Active make up","Hydration (Long Term)"],"certifications":["NATRUE","COSMOS/ICEA"],"description":"Olive glycerides and hyaluronic acid combined in a patented matrix — delivering hydration and skin nourishment in anhydrous color cosmetic formulations for active make-up.","image":"images/HYAPEARL.png","link":"#"},
    {"id":4,"name":"ColorGLAM®","line":"ColorGLAM","function":"Color portfolio","market":["Personal Care"],"technology":["Nature"],"active_functional":"Functional","category":"Pigments","benefits":["Active make up","Pigments dispersant"],"certifications":["RSPO","Palm oil free"],"description":"Ester-coated pigments functionalized with Tripelargonin, an upcycled sustainable ester — for high color release, formulation stability and a weightless, refined skin feel.","image":"images/COLORGLAM.png","link":"#"}
  ];
  allData=INGREDIENTS;
  render(allData);
  searchInput.addEventListener('input',filter);
  document.querySelectorAll('.finder-sidebar input[type="checkbox"]').forEach(function(el){
    el.addEventListener('change',filter);
  });
  resetBtn.addEventListener('click',reset);

  /* ── Mobile filter sheet ── */
  var mobSearch=document.getElementById('mobFinderSearch');
  var mobBtn=document.getElementById('mobFilterBtn');
  var mobBackdrop=document.getElementById('mobFilterBackdrop');
  var mobClose=document.getElementById('mobSidebarClose');
  var mobApply=document.getElementById('mobSidebarApply');
  var sidebar=document.querySelector('.finder-sidebar');
  var mobCount=document.getElementById('mobFilterCount');

  function openSheet(){sidebar.classList.add('mob-open');mobBackdrop.classList.add('is-open');document.body.style.overflow='hidden';}
  function closeSheet(){sidebar.classList.remove('mob-open');mobBackdrop.classList.remove('is-open');document.body.style.overflow='';}
  function updateCount(){
    var n=document.querySelectorAll('.finder-sidebar input[type="checkbox"]:checked').length;
    if(mobCount){mobCount.textContent=n;mobCount.classList.toggle('visible',n>0);}
    if(mobBtn){mobBtn.classList.toggle('has-active',n>0);}
  }

  if(mobBtn){mobBtn.addEventListener('click',openSheet);}
  if(mobBackdrop){mobBackdrop.addEventListener('click',closeSheet);}
  if(mobClose){mobClose.addEventListener('click',closeSheet);}
  if(mobApply){mobApply.addEventListener('click',closeSheet);}

  if(mobSearch){
    mobSearch.addEventListener('input',function(){
      searchInput.value=mobSearch.value;
      filter();
    });
  }

  document.querySelectorAll('.finder-sidebar input[type="checkbox"]').forEach(function(el){
    el.addEventListener('change',updateCount);
  });
  resetBtn.addEventListener('click',function(){
    updateCount();
    if(mobSearch)mobSearch.value='';
  });
})();

/* ── Hero: arco + linea che si disegnano allo scroll ── */
(function(){
  var els=document.querySelectorAll('.finder-hero-arc [pathLength]');
  if(!els.length)return;
  function draw(){
    var p=Math.min(1,0.3+window.scrollY/420); // 30% al load, completo dopo ~300px di scroll
    els.forEach(function(el){el.style.strokeDashoffset=String(1-p);});
  }
  addEventListener('scroll',draw,{passive:true});
  // doppio rAF: lascia applicare lo stato iniziale (offset 1) così il primo draw è animato
  requestAnimationFrame(function(){requestAnimationFrame(draw);});
})();
