const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){toggle?.setAttribute('aria-expanded','false');nav?.classList.remove('open');}
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('will-reveal');observer.observe(el);});}
const form=document.querySelector('#enquiry-form');
const status=document.querySelector('#form-status');
let config;
try {const response=await fetch('/config.json');if(!response.ok)throw Error();config=await response.json();}catch {if(status)status.textContent='Enquiries are temporarily unavailable. Your details have not been sent.';}
if(config?.enquiryEndpoint&&status)status.textContent='Tell us about your project using the form above.';
form?.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;if(!config?.enquiryEndpoint){status.textContent='Your enquiry has not been sent. An enquiry service needs to be connected before we can receive messages.';return;}const submit=form.querySelector('button[type="submit"]');submit.disabled=true;status.textContent='Sending your enquiry…';try{const response=await fetch(config.enquiryEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form))),signal:AbortSignal.timeout(15000)});const result=await response.json();if(!response.ok||result.accepted!==true)throw Error();status.textContent='Your enquiry has been accepted. Thank you for telling us about your project.';form.reset();}catch{status.textContent='We could not confirm your enquiry was accepted. Your details remain here; please try again later.';}finally{submit.disabled=false;}});
