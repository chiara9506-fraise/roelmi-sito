document.querySelectorAll('.tech-acc-trigger').forEach(function(btn){
  btn.addEventListener('click',function(){
    var body=btn.nextElementSibling;
    var isOpen=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    body.classList.toggle('is-open', !isOpen);
  });
});

/* ── Arco sezione descrizione: si disegna in funzione dello scroll ── */
(function(){
  var arc=document.getElementById('prodDescArc');
  if(!arc)return;
  var sec=arc.closest('.prod-desc');
  function draw(){
    var r=sec.getBoundingClientRect(),vh=window.innerHeight;
    var p=(vh*0.92-r.top)/(vh*0.6); // parte quando la sezione entra, completa a ~1/3 dal top
    p=Math.max(0,Math.min(1,p));
    arc.style.strokeDashoffset=String(1-p);
  }
  addEventListener('scroll',draw,{passive:true});
  addEventListener('resize',draw);
  draw();
})();
