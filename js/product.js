document.querySelectorAll('.tech-acc-trigger').forEach(function(btn){
  btn.addEventListener('click',function(){
    var body=btn.nextElementSibling;
    var isOpen=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    body.classList.toggle('is-open', !isOpen);
  });
});

/* ── Linea + arco sezione descrizione: si disegnano in funzione dello scroll ── */
(function(){
  var arc=document.getElementById('prodDescArc');
  var ln=document.getElementById('prodDescLine');
  if(!arc&&!ln)return;
  var sec=(arc||ln).closest('.prod-desc');
  function draw(){
    var r=sec.getBoundingClientRect(),vh=window.innerHeight;
    var p=(vh*0.92-r.top)/(vh*0.6); // parte quando la sezione entra, completa a ~1/3 dal top
    p=Math.max(0,Math.min(1,p));
    if(ln)ln.style.transform='scaleY('+p+')'; // prima la linea, dall'alto
    var pa=Math.max(0,Math.min(1,(p-0.15)/0.85)); // l'arco parte poco dopo
    if(arc)arc.style.strokeDashoffset=String(1-pa);
  }
  addEventListener('scroll',draw,{passive:true});
  addEventListener('resize',draw);
  draw();
})();
