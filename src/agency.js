const toggle=document.querySelector('.menu-toggle');
document.documentElement.classList.add('js-ready');
const nav=document.querySelector('#navigation');
const groups=[...document.querySelectorAll('.nav-group')];
const hoverMedia=matchMedia('(min-width: 1101px) and (hover: hover) and (pointer: fine)');
const closeTimers=new WeakMap();
const cancelClose=group=>{const timer=closeTimers.get(group);if(timer){clearTimeout(timer);closeTimers.delete(group);}};
const closeGroup=group=>{cancelClose(group);group.querySelector('.nav-trigger')?.setAttribute('aria-expanded','false');const panel=group.querySelector('.nav-panel');if(panel)panel.hidden=true;};
const closeGroups=except=>groups.forEach(group=>{if(group!==except)closeGroup(group);});
const openGroup=group=>{closeGroups(group);cancelClose(group);group.querySelector('.nav-trigger')?.setAttribute('aria-expanded','true');const panel=group.querySelector('.nav-panel');if(panel)panel.hidden=false;};
const scheduleClose=group=>{cancelClose(group);closeTimers.set(group,setTimeout(()=>{if(!group.matches(':focus-within')&&!group.matches(':hover'))closeGroup(group);},180));};
const closeMenu=()=>{closeGroups();toggle?.setAttribute('aria-expanded','false');nav?.classList.remove('open');document.body.classList.remove('nav-open');};
const openMenu=()=>{toggle?.setAttribute('aria-expanded','true');nav?.classList.add('open');document.body.classList.add('nav-open');};
toggle?.addEventListener('click',()=>toggle.getAttribute('aria-expanded')==='true'?closeMenu():openMenu());
groups.forEach(group=>{const trigger=group.querySelector('.nav-trigger');const panel=group.querySelector('.nav-panel');trigger?.addEventListener('click',()=>{const open=trigger.getAttribute('aria-expanded')==='true';if(open)closeGroup(group);else openGroup(group);});group.addEventListener('pointerenter',()=>{if(hoverMedia.matches)openGroup(group);});group.addEventListener('pointerleave',()=>{if(hoverMedia.matches)scheduleClose(group);});group.addEventListener('focusin',()=>cancelClose(group));group.addEventListener('focusout',event=>{if(!group.contains(event.relatedTarget))scheduleClose(group);});panel?.addEventListener('pointerenter',()=>cancelClose(group));});
nav?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('click',event=>{if(!event.target.closest('.nav-group'))closeGroups();if(nav?.classList.contains('open')&&!event.target.closest('.header'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){const openGroup=groups.find(group=>group.querySelector('.nav-trigger')?.getAttribute('aria-expanded')==='true');if(openGroup){closeGroups();openGroup.querySelector('.nav-trigger')?.focus();}else if(toggle?.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}}});

const goalTabs=[...document.querySelectorAll('[data-goal]')];
function activateGoal(index){goalTabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=i!==index;});}
goalTabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activateGoal(index));tab.addEventListener('keydown',event=>{let next;if(['ArrowRight','ArrowDown'].includes(event.key))next=(index+1)%goalTabs.length;else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(index+goalTabs.length-1)%goalTabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=goalTabs.length-1;else return;event.preventDefault();activateGoal(next);goalTabs[next].focus();});});

const filterButtons=[...document.querySelectorAll('.filter-button')];
const projectCards=[...document.querySelectorAll('.project-grid-all .project-card')];
filterButtons.forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.filter;filterButtons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));projectCards.forEach(card=>{const show=filter==='all'||card.dataset.category===filter;card.hidden=!show;});}));

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused=reducedMotion.matches;
const motionButton=document.querySelector('.motion-control');
const statementStrip=document.querySelector('.statement-strip');
const stripToggle=document.querySelector('.strip-toggle');
function setStripPaused(paused){if(!statementStrip||!stripToggle)return;statementStrip.dataset.paused=String(paused);stripToggle.setAttribute('aria-pressed',String(paused));stripToggle.textContent=paused?'Resume strip':'Pause strip';}
setStripPaused(reducedMotion.matches);
stripToggle?.addEventListener('click',()=>setStripPaused(statementStrip.dataset.paused!=='true'));
function setMotion(paused){motionPaused=paused;document.documentElement.dataset.motion=paused?'paused':'playing';if(motionButton){motionButton.setAttribute('aria-pressed',String(paused));motionButton.innerHTML=paused?'Resume motion <span aria-hidden="true">▶</span>':'Pause motion <span aria-hidden="true">Ⅱ</span>';}if(paused)document.querySelectorAll('.reveal-ready').forEach(el=>el.classList.add('is-visible'));}
setMotion(motionPaused);
motionButton?.addEventListener('click',()=>setMotion(!motionPaused));
reducedMotion.addEventListener('change',event=>{setMotion(event.matches);setStripPaused(event.matches);});
if(!reducedMotion.matches&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.section-heading,.principles article,.service-card,.work-preview,.insight-card,.process-grid article,.delivery-list article').forEach((el,i)=>{el.classList.add('reveal-ready');el.style.setProperty('--reveal-delay',`${i%3*60}ms`);observer.observe(el);});}

const art=document.querySelector('.creative-art');
art?.addEventListener('pointermove',event=>{if(motionPaused||event.pointerType==='touch'||!matchMedia('(hover: hover)').matches)return;const r=art.getBoundingClientRect();art.style.setProperty('--tilt-x',`${(event.clientX-r.left-r.width/2)/r.width*12}deg`);art.style.setProperty('--tilt-y',`${-(event.clientY-r.top-r.height/2)/r.height*8}deg`);});
art?.addEventListener('pointerleave',()=>{art.style.setProperty('--tilt-x','0deg');art.style.setProperty('--tilt-y','0deg');});

const track=(name,params={})=>window.gtag?.('event',name,params);
document.querySelectorAll('a[href^="tel:"]').forEach(link=>link.addEventListener('click',()=>track('phone_click')));
document.querySelectorAll('a[href*="wa.me"],a[href*="whatsapp"]').forEach(link=>link.addEventListener('click',()=>track('whatsapp_click')));
document.querySelectorAll('a[href="/contact/"],a[href^="/contact/?"]').forEach(link=>link.addEventListener('click',()=>track('main_cta_click')));

const form=document.querySelector('#enquiry-form');
const status=document.querySelector('#form-status');
if(form){
 const selected=new URLSearchParams(location.search).get('service');
 if(selected&&[...form.elements.service.options].some(option=>option.value===selected))form.elements.service.value=selected;
 let config;
 let submissionId=crypto.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
 try{const response=await fetch('/config.json');if(!response.ok)throw Error();config=await response.json();}catch{status.textContent='The enquiry form is temporarily unavailable. Please reload before continuing.';}
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity()){form.querySelectorAll(':invalid').forEach(field=>field.setAttribute('aria-invalid','true'));status.textContent='Please check the highlighted fields before sending your enquiry.';return;}
  if(!config)return;
  const button=form.querySelector('button[type="submit"]');
  if(button.disabled)return;
  const data={...Object.fromEntries(new FormData(form)),submission_id:submissionId};
  button.disabled=true;button.setAttribute('aria-busy','true');status.textContent='Sending your enquiry…';
  try{
   const response=await fetch(config.enquiryEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});
   const result=await response.json().catch(()=>({accepted:false}));
   if(!response.ok||result.accepted!==true)throw Error(result.error||'delivery_failed');
   status.textContent='Thanks — your enquiry has been accepted. We will be in touch soon.';
   form.reset();submissionId=crypto.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;track('enquiry_accepted',{service:data.service});
  }catch(error){status.textContent=error.message==='rate_limited'?'Please wait before trying again.':'We could not confirm delivery. Your details remain here; please try again later.';}
  finally{button.disabled=false;button.removeAttribute('aria-busy');}
 });
 form.addEventListener('input',event=>{if(event.target.matches('input,select,textarea')&&event.target.checkValidity())event.target.removeAttribute('aria-invalid');});
}
