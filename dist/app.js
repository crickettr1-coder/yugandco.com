const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){toggle?.setAttribute('aria-expanded','false');nav?.classList.remove('open');}
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
const serviceToggle=document.querySelector('.services-toggle');
const serviceDropdown=document.querySelector('#services-dropdown');
function setServices(open){serviceToggle?.setAttribute('aria-expanded',String(open));serviceDropdown?.classList.toggle('open',open);}
serviceToggle?.addEventListener('click',()=>setServices(serviceToggle.getAttribute('aria-expanded')!=='true'));
document.addEventListener('click',e=>{if(!e.target.closest('.nav-services'))setServices(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&serviceToggle?.getAttribute('aria-expanded')==='true'){setServices(false);serviceToggle.focus();}});
const processTabs=[...document.querySelectorAll('[role="tab"][data-step]')];
function activateStep(index){processTabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=i!==index;});}
processTabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activateStep(index));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%processTabs.length;else if(event.key==='ArrowLeft')next=(index+processTabs.length-1)%processTabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=processTabs.length-1;else return;event.preventDefault();activateStep(next);processTabs[next].focus();});});
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{const direction=button.dataset.gallery==='next'?1:-1;document.querySelectorAll('.gallery').forEach(gallery=>{const card=gallery.querySelector('.gallery-card');gallery.scrollBy({left:direction*(card.getBoundingClientRect().width+30),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});}));
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('will-reveal');observer.observe(el);});}
const form=document.querySelector('#enquiry-form');
const status=document.querySelector('#form-status');
let config;
try {const response=await fetch('/config.json');if(!response.ok)throw Error();config=await response.json();}catch {if(status)status.textContent='Enquiries are temporarily unavailable. Your details have not been sent.';}
if(config?.enquiryEndpoint&&status)status.textContent='Tell us about your project using the form above.';
form?.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;if(!config?.enquiryEndpoint){status.textContent='Your enquiry has not been sent. An enquiry service needs to be connected before we can receive messages.';return;}const submit=form.querySelector('button[type="submit"]');submit.disabled=true;status.textContent='Sending your enquiry…';try{const response=await fetch(config.enquiryEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form))),signal:AbortSignal.timeout(15000)});const result=await response.json();if(!response.ok||result.accepted!==true)throw Error();status.textContent='Your enquiry has been accepted. Thank you for telling us about your project.';form.reset();}catch{status.textContent='We could not confirm your enquiry was accepted. Your details remain here; please try again later.';}finally{submit.disabled=false;}});
