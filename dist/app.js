const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
const closeMenu=()=>{toggle?.setAttribute('aria-expanded','false');nav?.classList.remove('open');};
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav?.classList.toggle('open',open);});
nav?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused=reducedMotion.matches;
const motionButton=document.querySelector('.motion-control');
function setMotion(paused){
 motionPaused=paused;document.documentElement.dataset.motion=paused?'paused':'playing';
 if(motionButton){motionButton.setAttribute('aria-pressed',String(paused));motionButton.innerHTML=paused?'Resume motion <span aria-hidden="true">▶</span>':'Pause motion <span aria-hidden="true">Ⅱ</span>';}
 if(paused){document.querySelectorAll('.reveal-ready').forEach(el=>el.classList.add('is-visible'));}
}
setMotion(motionPaused);
motionButton?.addEventListener('click',()=>setMotion(!motionPaused));
reducedMotion.addEventListener('change',event=>setMotion(event.matches));
if(!reducedMotion.matches&&'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});
 document.querySelectorAll('.section-heading,.principles article,.service-card,.showcase-card,.insight-card,.process-grid article,.delivery-list article').forEach((el,i)=>{el.classList.add('reveal-ready');el.style.setProperty('--reveal-delay',`${i%3*60}ms`);observer.observe(el);});
}
const art=document.querySelector('.creative-art');
art?.addEventListener('pointermove',event=>{
 if(motionPaused||event.pointerType==='touch'||!matchMedia('(hover: hover)').matches)return;
 const r=art.getBoundingClientRect();art.style.setProperty('--tilt-x',`${(event.clientX-r.left-r.width/2)/r.width*12}deg`);art.style.setProperty('--tilt-y',`${-(event.clientY-r.top-r.height/2)/r.height*8}deg`);
});
art?.addEventListener('pointerleave',()=>{art.style.setProperty('--tilt-x','0deg');art.style.setProperty('--tilt-y','0deg');});
const form=document.querySelector('#enquiry-form');
const status=document.querySelector('#form-status');
if(form){
 const selected=new URLSearchParams(location.search).get('service');
 if(selected&&[...form.elements.service.options].some(o=>o.value===selected))form.elements.service.value=selected;
 let config;
 try{const r=await fetch('/config.json');if(!r.ok)throw Error();config=await r.json();}catch{status.textContent='The project brief is temporarily unavailable. Please reload before continuing.';}
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!form.reportValidity()||!config)return;
  const data=Object.fromEntries(new FormData(form));
  const brief=`YUG & CO — PROJECT BRIEF\n\nName: ${data.name}\nEmail: ${data.email}\nCompany / website: ${data.company}\nService: ${data.service}\n\nProject details\n${data.message}\n`;
  if(!config.enquiryEndpoint){
   if(config.email){location.href=`mailto:${encodeURIComponent(config.email)}?subject=${encodeURIComponent('Project enquiry: '+data.service)}&body=${encodeURIComponent(brief)}`;status.textContent='Your email app has been requested. Review and send the message there; this website has not sent it.';}
   else{const url=URL.createObjectURL(new Blob([brief],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='yug-and-co-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Your brief is ready to save. No enquiry has been sent and your details remain here.';}
   return;
  }
  const button=form.querySelector('button[type="submit"]');button.disabled=true;status.textContent='Sending your enquiry…';
  try{const r=await fetch(config.enquiryEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});const result=await r.json();if(!r.ok||result.accepted!==true)throw Error();status.textContent='Your enquiry has been accepted. Thank you for sharing your project.';form.reset();}catch{status.textContent='We could not confirm delivery. Your details remain here; please try again later.';}finally{button.disabled=false;}
 });
}
