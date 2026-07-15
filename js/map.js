(function(){
  if(!window.L) return;
  var mapEl=document.getElementById('globalMap');
  if(!mapEl) return;

  var map=L.map('globalMap',{
    minZoom:2,
    zoomControl:false,
    scrollWheelZoom:false
  });
  map.fitWorld();

  L.control.zoom({position:'bottomright'}).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains:'abcd',
    maxZoom:19
  }).addTo(map);

  var sites=[
    {type:'biotech',name:'ROELMI BIOTECH',lat:45.6438,lng:8.9958,sub:'Ricerca & Sviluppo Biotech — Italia',desc:'Polo dedicato alla ricerca e sviluppo di soluzioni biotech, ingredienti fermentativi e probiotici avanzati. Via Roberto Lepetit 34, 21040 Gerenzano (VA), Italia.',href:'#'},
    {type:'site',name:'Lainate',lat:45.57,lng:8.75,sub:'Polo produttivo — Varese, Italia',desc:'Stabilimento produttivo dedicato allo sviluppo e produzione di ingredienti attivi per il personal care.',href:'#'},
    {type:'lab',name:'Solaro',lat:45.62,lng:9.07,sub:'Laboratorio — Milano, Italia',desc:'Laboratorio specializzato nell\'analisi e nella lavorazione di materie prime attive per il mercato nutraceutico e food.',href:'#'},
    {type:'site',name:'Napoli',lat:40.84,lng:14.27,sub:'Polo produttivo — Campania, Italia',desc:'Sede produttiva nel sud Italia, specializzata nella lavorazione di ingredienti di origine naturale e bioattivi marini.',href:'#'},
    {type:'site',name:'RK Colors',lat:34.05,lng:-118.24,sub:'Polo produttivo — USA',desc:'Stabilimento americano dedicato allo sviluppo e produzione di pigmenti funzionalizzati e ingredienti per il make-up attivo.',href:'#'},
    {type:'lab',name:'Origgio',lat:45.5985,lng:8.9655,sub:'Laboratorio — Origgio (VA), Italia',desc:'ROELMI HPC — Via Celeste Milani 224, 21040 Origgio (VA), Italia.',href:'#'},
    {type:'branch',name:'Paris',lat:48.8720,lng:2.3235,sub:'Filiale — Francia',desc:'ROELMI HPC France SARL — 32, rue de l\'Arcade, 75008 Paris, Francia.',href:'#'},
    {type:'branch',name:'Saddle Brook',lat:40.9060,lng:-74.0960,sub:'Filiale — USA',desc:'ROELMI HPC USA, LLC — 250 Pehle Avenue, Suite 200, Saddle Brook, New Jersey 07663, USA.',href:'#'},
    {type:'branch',name:'Hangzhou',lat:30.2460,lng:120.1750,sub:'Filiale — Cina (Asia-Pacific)',desc:'Hangzhou ROELMI HPC Biotech Co., Ltd — Room 505, Building 4, No. 199 Shimin Street, Shangcheng District, Hangzhou, Zhejiang, Cina.',href:'#'},
    {type:'branch',name:'Seongnam-si',lat:37.3830,lng:127.1190,sub:'Filiale — Corea del Sud',desc:'ROELMI HPC Korea Ltd. — 918 & 919, 9F, 36 Hwangsaeul-ro 200beon-gil, Bundang-gu, Seongnam-si, Gyeonggi-do, Corea del Sud (13595).',href:'#'},
    {type:'production',name:'Vortex SRL SB',lat:45.0500,lng:7.9000,sub:'Produzione — Piemonte, Italia',desc:'Vortex SRL SB — Sito produttivo in Piemonte, Italia.',href:'#'},
    {type:'production',name:'Isuschem srl',lat:41.0680,lng:14.3480,sub:'Produzione — Caserta, Italia',desc:'Isuschem srl — Via Thomas Alva Edison, 81100 Caserta (CE), Italia.',href:'#'}
  ];

  var markSvg='<svg viewBox="0 0 36 54" xmlns="http://www.w3.org/2000/svg"><path d="M0.783 39.064C0.604 39.192 0.437 39.326 0.271 39.462C1.516 46.663 7.005 52.404 14.073 54.018C17.088 50.618 17.516 45.489 14.811 41.594C11.643 37.032 5.383 35.892 0.816 39.043C7.738 34.260 17.231 35.981 22.035 42.894C24.220 46.043 25.054 49.721 24.669 53.252C26.399 52.577 27.999 51.650 29.427 50.512C28.940 48.127 27.974 45.802 26.499 43.681C20.857 35.561 9.872 33.355 1.568 38.521C12.380 31.535 26.339 32.932 35.553 41.298C36.000 39.726 36.243 38.067 36.243 36.354C36.243 34.389 35.920 32.503 35.339 30.730C32.009 18.408 18.119 0.018 18.119 0.018C18.119 0.018 4.230 18.408 0.900 30.730C0.325 32.503 0 34.389 0 36.354C0 37.405 0.096 38.439 0.266 39.443C0.437 39.313 0.606 39.187 0.783 39.064Z" fill="currentColor" fill-rule="evenodd"/></svg>';

  function makeIcon(type){
    return L.divIcon({
      className:'pm-leaf-wrap',
      html:'<span class="pm-mark pm-mark--'+(type||'site')+'">'+markSvg+'</span>',
      iconSize:[22,33],
      iconAnchor:[11,33]
    });
  }

  var typeImg={
    site:'images/INDUSTRIA.jpg',
    branch:'images/filiale.jpg',
    biotech:'images/biotech.jpg',
    lab:'images/lab.jpg',
    production:'images/production.jpg'
  };

  function buildPopup(site){
    var img=typeImg[site.type]||typeImg.site;
    return '<div class="pm-lp-img" style="background-image:url(\''+img+'\')"></div>'
      +'<div class="pm-popup-body">'
      +'<div class="pm-popup-sub">'+site.sub+'</div>'
      +'<h3 class="pm-popup-name">'+site.name+'</h3>'
      +'<p class="pm-popup-desc">'+site.desc+'</p>'
      +'<a class="pm-popup-link" href="'+(site.href||'#')+'">Scopri di più '
      +'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>'
      +'</div>';
  }

  var clusterGroup=L.markerClusterGroup({
    maxClusterRadius:40,
    iconCreateFunction:function(c){
      return L.divIcon({
        html:'<div class="pm-cluster-icon"><b>'+c.getChildCount()+'</b></div>',
        className:'',
        iconSize:[34,34],
        iconAnchor:[17,17]
      });
    },
    spiderfyOnMaxZoom:true,
    spiderfyDistanceMultiplier:2.5
  });

  var typeLabels={
    site:'Polo produttivo',
    branch:'Filiale',
    biotech:'ROELMI BIOTECH',
    lab:'Lab',
    production:'Produzione'
  };

  sites.forEach(function(site){
    var m=L.marker([site.lat,site.lng],{icon:makeIcon(site.type)});
    m.bindTooltip(
      '<b>'+site.name+'</b><span>'+(typeLabels[site.type]||'')+'</span>',
      {direction:'top',offset:[0,-34],className:'pm-tooltip',opacity:1}
    );
    m.bindPopup(buildPopup(site),{
      className:'pm-map-popup',
      maxWidth:260,
      minWidth:260,
      offset:[0,-4],
      autoPan:true,
      autoPanPaddingTopLeft:[20,20],
      autoPanPaddingBottomRight:[20,20],
      closeButton:true
    });
    clusterGroup.addLayer(m);
  });

  map.addLayer(clusterGroup);

  // Ingresso animato: i marker cadono in sequenza quando la mappa entra in viewport
  var wrap=document.querySelector('.presence-map-wrap');
  if(wrap&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting)return;
        io.disconnect();
        wrap.querySelectorAll('.pm-mark,.pm-cluster-icon').forEach(function(el,i){
          el.style.animationDelay=(i*0.13)+'s';
        });
        wrap.classList.add('pm-anim-go');
      });
    },{threshold:0.3});
    io.observe(wrap);
  }else if(wrap){
    wrap.classList.add('pm-anim-go');
  }

  // Hover incrociato legenda <-> marker
  var TYPES=['site','branch','biotech','lab','production'];
  var legItems={};
  document.querySelectorAll('.presence-legend .leg-item').forEach(function(item){
    TYPES.forEach(function(t){
      if(item.querySelector('.leg-mark--'+t)){
        legItems[t]=item;
        item.addEventListener('mouseenter',function(){if(wrap)wrap.classList.add('pm-hl-'+t);});
        item.addEventListener('mouseleave',function(){if(wrap)wrap.classList.remove('pm-hl-'+t);});
      }
    });
  });
  if(wrap){
    wrap.addEventListener('mouseover',function(e){
      var mk=e.target.closest('.pm-mark');
      if(!mk)return;
      TYPES.forEach(function(t){
        if(mk.classList.contains('pm-mark--'+t)&&legItems[t])legItems[t].classList.add('is-hl');
      });
    });
    wrap.addEventListener('mouseout',function(e){
      if(!e.target.closest('.pm-mark'))return;
      Object.keys(legItems).forEach(function(t){legItems[t].classList.remove('is-hl');});
    });
  }
})();
