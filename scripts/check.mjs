import {chromium} from '@playwright/test';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {services} from '../content/services.js';
import {insights} from '../content/insights.js';
const origin='http://127.0.0.1:4173';
const browser=await chromium.launch({channel:'msedge',headless:true});
await mkdir('qa',{recursive:true});
const report=[];
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1440,768,390,320]){
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width,height:900});await page.goto(origin,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}window.scrollTo(0,0);});
  await page.waitForTimeout(250);
  assert(!/[âÃ�]/.test(await page.locator('body').innerText()),'Corrupted text encoding');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`);
  assert(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),'Broken image');
  await page.screenshot({path:`qa/home-${width}.png`,fullPage:true});
  if(width===390){await page.getByRole('button',{name:'Menu'}).click();assert(await page.locator('#navigation').isVisible());await page.locator('#navigation').getByRole('link',{name:'Services',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Menu'}).getAttribute('aria-expanded'),'false');}
  report.push(`Homepage ${width}px: no overflow; image loaded; screenshot saved.`);
 }
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:1440,height:1000});
 await page.goto(origin);
 await page.locator('.service-card').first().scrollIntoViewIfNeeded();await page.waitForTimeout(1100);
 assert.equal(await page.locator('.service-card').first().evaluate(e=>getComputedStyle(e).opacity),'1','Scroll reveal');
 await page.goto(origin);let links=await page.locator('a[href]').evaluateAll(els=>els.map(a=>a.getAttribute('href')));
 for(const href of [...new Set(links)]){if(href.startsWith('#')){assert(await page.locator(href).count(),`Missing ${href}`);}else if(href.startsWith('/')){const [route,hash]=href.split('#');const response=await page.request.get(origin+route);assert.equal(response.status(),200,href);if(hash){await page.goto(origin+route);assert(await page.locator('#'+hash).count(),href);}}}
 const titles=new Set();
 for(const route of ['/',...services.map(s=>'/services/'+s.slug+'/'),...insights.map(i=>'/insights/'+i.slug+'/'),'/privacy/']){
  await page.goto(origin+route);const title=await page.title();assert(!titles.has(title),'Duplicate title');titles.add(title);assert(await page.locator('meta[name="description"]').getAttribute('content'));assert(await page.locator('link[rel="canonical"]').getAttribute('href'));assert.equal(await page.locator('h1').count(),1);
  await page.setViewportSize({width:390,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route);if(route.includes('google-ads'))await page.screenshot({path:'qa/service-mobile.png',fullPage:true});
 }
 await page.goto(origin);await page.locator('[name="name"]').fill('Test Visitor');await page.locator('[name="email"]').fill('test@example.com');await page.locator('[name="service"]').selectOption({label:'Google Ads'});await page.locator('[name="message"]').fill('Test enquiry; never send.');
 await page.getByRole('button',{name:'Send Project Enquiry'}).click();assert((await page.locator('#form-status').innerText()).includes('has not been sent'));assert.equal(await page.locator('[name="name"]').inputValue(),'Test Visitor');
 report.push('11 pages: unique metadata, one H1, working homepage navigation, service and article links. Unconfigured form does not claim success or erase input.');
 for(const [payload,code,expected] of [[{accepted:false},200,'could not confirm'],[{accepted:true},500,'could not confirm'],[{accepted:true},200,'has been accepted']]){
  await page.route('**/config.json',r=>r.fulfill({json:{enquiryEndpoint:'/test-enquiry'}}));await page.route('**/test-enquiry',r=>r.fulfill({status:code,json:payload}));await page.reload();await page.locator('[name="name"]').fill('Test Visitor');await page.locator('[name="email"]').fill('test@example.com');await page.locator('[name="service"]').selectOption({label:'Google Ads'});await page.locator('[name="message"]').fill('Local mocked acceptance test.');await page.getByRole('button',{name:'Send Project Enquiry'}).click();await page.waitForTimeout(150);assert((await page.locator('#form-status').innerText()).includes(expected));await page.unroute('**/config.json');await page.unroute('**/test-enquiry');
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();assert.equal(await page.locator('.will-reveal').count(),0);
 await page.getByRole('tab',{name:'Plan',exact:true}).click();assert.equal(await page.locator('#process-panel-1').isVisible(),true);assert.equal(await page.locator('#process-panel-0').isVisible(),false);
 await page.getByRole('tab',{name:'Plan',exact:true}).press('ArrowRight');assert.equal(await page.getByRole('tab',{name:'Create',exact:true}).getAttribute('aria-selected'),'true');
 await page.getByRole('button',{name:'Next concepts'}).click();await page.waitForTimeout(100);assert(await page.locator('.gallery-first').evaluate(e=>e.scrollLeft>0));
 await page.setViewportSize({width:1440,height:1000});await page.locator('.services-toggle').click();assert(await page.locator('#services-dropdown').isVisible());await page.keyboard.press('Escape');assert(!(await page.locator('#services-dropdown').isVisible()));
 await page.locator('details').first().locator('summary').click();assert(await page.locator('details').first().getAttribute('open')!==null);
 report.push('Process tabs: click and arrow-key navigation work. Gallery controls, service dropdown, Escape dismissal and FAQ expansion work.');
 assert.deepEqual(errors,[],'Browser errors');
 report.push('Mocked endpoint: rejects unaccepted payloads and HTTP failures; success only after 2xx + accepted:true. Reduced motion verified. No browser JavaScript errors.');
 await writeFile('qa/report.txt',report.join('\n'));console.log(report.join('\n'));
}finally{await browser.close();}
