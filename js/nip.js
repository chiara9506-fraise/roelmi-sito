/* Controlli delle animazioni della pagina NIP.
   - hero: la sequenza dura ~3s e finisce da sola, quindi il bottone la rimette da capo
   - prodotti: il fluttuare e' continuo, quindi il bottone lo ferma e lo riavvia
     (richiesto da WCAG 2.2.2 per ogni movimento automatico che supera i 5 secondi) */
(function(){
  var ridotto=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- hero: rigioca la sequenza --- */
  var replay=document.getElementById('nipHeroReplay');
  var tri=document.querySelector('.nip-tri');
  if(replay&&tri){
    if(ridotto)replay.hidden=true;              // con il movimento ridotto non c'e' sequenza
    replay.addEventListener('click',function(){
      tri.classList.add('anim-off');
      void tri.offsetWidth;                     // forza il ricalcolo: senza, il browser
      tri.classList.remove('anim-off');         // non riavvia le animazioni
    });
  }

  /* --- prodotti: ferma e riavvia il fluttuare --- */
  var btn=document.getElementById('nipFloatBtn');
  var sezione=document.querySelector('.nip-action');
  if(btn&&sezione){
    var pausa=document.querySelector('.ic-pause'),play=document.querySelector('.ic-play');
    var aggiorna=function(fermo){
      sezione.classList.toggle('anim-paused',fermo);
      btn.setAttribute('aria-pressed',fermo?'true':'false');
      btn.setAttribute('aria-label',fermo?'Play animation':'Pause animation');
      if(pausa)pausa.hidden=fermo;
      if(play)play.hidden=!fermo;
    };
    if(ridotto)btn.hidden=true;                 // niente da fermare: il movimento e' gia' off
    btn.addEventListener('click',function(){aggiorna(!sezione.classList.contains('anim-paused'));});
  }
})();
