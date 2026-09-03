document.querySelectorAll('.tech-acc-trigger').forEach(function(btn){
  btn.addEventListener('click',function(){
    var body=btn.nextElementSibling;
    var isOpen=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    body.classList.toggle('is-open', !isOpen);
  });
});

/* ── Goccia del logomark nelle sezioni descrizione: diventa via via piu'
   visibile scrollando verso il basso ── */
(function(){
  var secs=[];
  document.querySelectorAll('.prod-desc').forEach(function(sec){
    var mark=sec.querySelector('.prod-desc-mark');
    if(mark)secs.push({sec:sec,mark:mark});
  });
  if(!secs.length)return;
  function draw(){
    var vh=window.innerHeight;
    secs.forEach(function(s){
      var r=s.sec.getBoundingClientRect();
      var p=(vh*0.92-r.top)/(vh*0.6); // parte quando la sezione entra, completa a ~1/3 dal top
      p=Math.max(0,Math.min(1,p));
      s.mark.style.opacity=String(p);
    });
  }
  addEventListener('scroll',draw,{passive:true});
  addEventListener('resize',draw);
  draw();
})();
