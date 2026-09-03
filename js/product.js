document.querySelectorAll('.tech-acc-trigger').forEach(function(btn){
  btn.addEventListener('click',function(){
    var body=btn.nextElementSibling;
    var isOpen=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    body.classList.toggle('is-open', !isOpen);
  });
});

/* ── Goccia del logomark nelle sezioni descrizione: il contorno si traccia
   in funzione dello scroll, poi si riempie ── */
(function(){
  var secs=[];
  document.querySelectorAll('.prod-desc').forEach(function(sec){
    var mark=sec.querySelector('.prod-desc-mark path');
    if(mark)secs.push({sec:sec,mark:mark});
  });
  if(!secs.length)return;
  function draw(){
    var vh=window.innerHeight;
    secs.forEach(function(s){
      var r=s.sec.getBoundingClientRect();
      var p=(vh*0.92-r.top)/(vh*0.6); // parte quando la sezione entra, completa a ~1/3 dal top
      p=Math.max(0,Math.min(1,p));
      var stroke=Math.max(0,Math.min(1,p/0.75));   // il contorno si traccia per primo
      var fill=Math.max(0,Math.min(1,(p-0.6)/0.4)); // il riempimento arriva quando il contorno e' quasi finito
      s.mark.style.strokeDashoffset=String(1-stroke);
      s.mark.style.fillOpacity=String(fill*0.85);
    });
  }
  addEventListener('scroll',draw,{passive:true});
  addEventListener('resize',draw);
  draw();
})();
