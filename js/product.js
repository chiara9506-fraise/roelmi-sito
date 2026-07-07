document.querySelectorAll('.tech-acc-trigger').forEach(function(btn){
  btn.addEventListener('click',function(){
    var body=btn.nextElementSibling;
    var isOpen=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    body.classList.toggle('is-open', !isOpen);
  });
});
