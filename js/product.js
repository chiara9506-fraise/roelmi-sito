document.querySelectorAll('.tech-acc-trigger').forEach(function(btn){
  btn.addEventListener('click',function(){
    var body=btn.nextElementSibling;
    var isOpen=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    body.classList.toggle('is-open', !isOpen);
  });
});

/* ── Linea + arco nelle sezioni descrizione: si disegnano in funzione dello scroll ── */
(function(){
  var secs=[];
  document.querySelectorAll('.prod-desc').forEach(function(sec){
    var ln=sec.querySelector('.prod-desc-line');
    var arc=sec.querySelector('.prod-desc-arc path');
    if(ln||arc)secs.push({sec:sec,ln:ln,arc:arc});
  });
  if(!secs.length)return;
  function draw(){
    var vh=window.innerHeight;
    secs.forEach(function(s){
      var r=s.sec.getBoundingClientRect();
      var p=(vh*0.92-r.top)/(vh*0.6); // parte quando la sezione entra, completa a ~1/3 dal top
      p=Math.max(0,Math.min(1,p));
      if(s.ln)s.ln.style.transform='scaleY('+p+')'; // prima la linea, dall'alto
      var pa=Math.max(0,Math.min(1,(p-0.15)/0.85)); // l'arco parte poco dopo
      if(s.arc)s.arc.style.strokeDashoffset=String(1-pa);
    });
  }
  addEventListener('scroll',draw,{passive:true});
  addEventListener('resize',draw);
  draw();
})();
