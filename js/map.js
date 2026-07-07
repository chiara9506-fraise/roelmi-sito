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
    {name:'Gerenzano',lat:45.65,lng:8.99,sub:'ROELMI BIOTECH',desc:'Polo dedicato alla ricerca e sviluppo di soluzioni biotech, ingredienti fermentativi e probiotici avanzati.',grad:'linear-gradient(135deg,#009CC4 0%,#007C8F 100%)',href:'#'},
    {name:'Lainate',lat:45.57,lng:8.75,sub:'Polo produttivo — Varese, Italia',desc:'Stabilimento produttivo dedicato allo sviluppo e produzione di ingredienti attivi per il personal care.',grad:'linear-gradient(135deg,#78c0a0 0%,#3a8a60 100%)',href:'#'},
    {name:'Solaro',lat:45.62,lng:9.07,sub:'Polo produttivo — Milano, Italia',desc:'Centro di produzione specializzato nella trasformazione di materie prime attive per il mercato nutraceutico e food.',grad:'linear-gradient(135deg,#7ab8d4 0%,#2e7fa0 100%)',href:'#'},
    {name:'Napoli',lat:40.84,lng:14.27,sub:'Polo produttivo — Campania, Italia',desc:'Sede produttiva nel sud Italia, specializzata nella lavorazione di ingredienti di origine naturale e bioattivi marini.',grad:'linear-gradient(135deg,#f0b87a 0%,#c07832 100%)',href:'#'},
    {name:'RK Colors',lat:34.05,lng:-118.24,sub:'Polo produttivo — USA',desc:'Stabilimento americano dedicato allo sviluppo e produzione di pigmenti funzionalizzati e ingredienti per il make-up attivo.',grad:'linear-gradient(135deg,#9b7fca 0%,#5a3d8a 100%)',href:'#'}
  ];

  function makeIcon(){
    return L.divIcon({
      className:'pm-leaf-wrap',
      html:'<span class="pm-dot"></span>',
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
    var m=L.marker([site.lat,site.lng],{icon:makeIcon()});
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
