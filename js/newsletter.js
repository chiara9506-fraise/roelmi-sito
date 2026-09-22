/* Newsletter: validazione accessibile. Il form NON e' ancora collegato a un servizio
   (Mailchimp, Brevo...): quando il cliente lo sceglie, sostituire il blocco
   "invio" in fondo con la chiamata al servizio. */
(function(){
  var form=document.getElementById('nlForm');
  if(!form)return;
  var email=document.getElementById('nlEmail');
  var consent=document.getElementById('nlConsent');
  var topics=form.querySelectorAll('input[name="topics"]');
  var status=document.getElementById('nlStatus');
  var errs={
    email:document.getElementById('nlEmailErr'),
    topics:document.getElementById('nlTopicErr'),
    consent:document.getElementById('nlConsentErr')
  };

  function setErr(key,field,msg){
    errs[key].textContent=msg;
    if(field)field.setAttribute('aria-invalid',msg?'true':'false');
  }

  form.addEventListener('submit',function(e){
    e.preventDefault();
    status.textContent='';
    var first=null;

    var v=email.value.trim();
    if(!v)setErr('email',email,'Please enter your email address.');
    else if(!email.checkValidity())setErr('email',email,'Please enter a valid email address, e.g. name@company.com.');
    else setErr('email',email,'');
    if(errs.email.textContent)first=first||email;

    var anyTopic=Array.prototype.some.call(topics,function(t){return t.checked;});
    setErr('topics',null,anyTopic?'':'Please choose at least one topic.');
    if(!anyTopic)first=first||topics[0];

    setErr('consent',consent,consent.checked?'':'Please accept the Privacy Policy to subscribe.');
    if(!consent.checked)first=first||consent;

    if(first){first.focus();return;}

    // invio: da collegare al servizio newsletter
    form.reset();
    status.textContent='Thank you for subscribing!';
  });
})();
