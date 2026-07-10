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

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains:'abcd',
    maxZoom:19
  }).addTo(map);

  var sites=[
    {type:'site',name:'Gerenzano',lat:45.65,lng:8.99,sub:'ROELMI BIOTECH',desc:'Polo dedicato alla ricerca e sviluppo di soluzioni biotech, ingredienti fermentativi e probiotici avanzati.',href:'#'},
    {type:'site',name:'Lainate',lat:45.57,lng:8.75,sub:'Polo produttivo — Varese, Italia',desc:'Stabilimento produttivo dedicato allo sviluppo e produzione di ingredienti attivi per il personal care.',href:'#'},
    {type:'site',name:'Solaro',lat:45.62,lng:9.07,sub:'Polo produttivo — Milano, Italia',desc:'Centro di produzione specializzato nella trasformazione di materie prime attive per il mercato nutraceutico e food.',href:'#'},
    {type:'site',name:'Napoli',lat:40.84,lng:14.27,sub:'Polo produttivo — Campania, Italia',desc:'Sede produttiva nel sud Italia, specializzata nella lavorazione di ingredienti di origine naturale e bioattivi marini.',href:'#'},
    {type:'site',name:'RK Colors',lat:34.05,lng:-118.24,sub:'Polo produttivo — USA',desc:'Stabilimento americano dedicato allo sviluppo e produzione di pigmenti funzionalizzati e ingredienti per il make-up attivo.',href:'#'},
    {type:'branch',name:'Origgio',lat:45.5985,lng:8.9655,sub:'Filiale — Italia',desc:'ROELMI HPC — Via Celeste Milani 224, 21040 Origgio (VA), Italia.',href:'#'},
    {type:'branch',name:'Paris',lat:48.8720,lng:2.3235,sub:'Filiale — Francia',desc:'ROELMI HPC France SARL — 32, rue de l\'Arcade, 75008 Paris, Francia.',href:'#'},
    {type:'branch',name:'Saddle Brook',lat:40.9060,lng:-74.0960,sub:'Filiale — USA',desc:'ROELMI HPC USA, LLC — 250 Pehle Avenue, Suite 200, Saddle Brook, New Jersey 07663, USA.',href:'#'},
    {type:'branch',name:'Hangzhou',lat:30.2460,lng:120.1750,sub:'Filiale — Cina (Asia-Pacific)',desc:'Hangzhou ROELMI HPC Biotech Co., Ltd — Room 505, Building 4, No. 199 Shimin Street, Shangcheng District, Hangzhou, Zhejiang, Cina.',href:'#'},
    {type:'branch',name:'Seongnam-si',lat:37.3830,lng:127.1190,sub:'Filiale — Corea del Sud',desc:'ROELMI HPC Korea Ltd. — 918 & 919, 9F, 36 Hwangsaeul-ro 200beon-gil, Bundang-gu, Seongnam-si, Gyeonggi-do, Corea del Sud (13595).',href:'#'}
  ];

  function makeIcon(type){
    return L.divIcon({
      className:'pm-leaf-wrap',
      html:'<span class="pm-dot pm-dot--'+(type||'site')+'"></span>',
      iconSize:[13,13],
      iconAnchor:[6,6]
    });
  }

  function buildPopup(site){
    return '<div class="pm-lp-img"></div>'
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

  sites.forEach(function(site){
    var m=L.marker([site.lat,site.lng],{icon:makeIcon(site.type)});
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
})();
