import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createAgency} from '../templates/agency.mjs';
import config from '../site.config.js';
const origin=process.env.AGENCY_TEST_URL||'http://127.0.0.1:4173';
const pages=createAgency(config);
const browser=await chromium.launch({channel:'msedge',headless:true});
await mkdir('qa',{recursive:true});
const report=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const titles=new Set();const links=new Set();
 for(const p of pages){
  const r=await page.goto(origin+p.route,{waitUntil:'networkidle'});assert.equal(r.status(),200,p.route);
  const title=await page.title();assert(!titles.has(title),'Duplicate title: '+title);titles.add(title);
  assert.equal(await page.locator('h1').count(),1,p.route+' H1');
  assert(await page.locator('meta[name="description"]').getAttribute('content'));
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),config.domain+p.route);
  assert(!/[\uFFFD]|â€|Ã¢/.test(await page.locator('body').innerText()),p.route+' text encoding');
  for(const width of [1440,768,390,320]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),p.route+' overflow '+width);}
  (await page.locator('a[href]').evaluateAll(a=>a.map(e=>e.getAttribute('href')))).filter(h=>h.startsWith('/')||h.startsWith('#')).forEach(h=>links.add(new URL(h,origin+p.route).href));
  if(['/','/about/','/services/google-ads/','/contact/','/insights/seo-or-paid-search/'].includes(p.route)){
   for(const width of [1440,390]){await page.setViewportSize({width,height:1000});await page.screenshot({path:'qa/agency-'+(p.route==='/'?'home':p.route.replaceAll('/','-'))+'-'+width+'.png',fullPage:true});}
  }
  report.push(p.route+' — desktop, tablet and mobile layout, metadata and H1 passed');
 }
 for(const href of links){const u=new URL(href);const r=await page.request.get(u.href);assert.equal(r.status(),200,'Link '+href);if(u.hash){await page.goto(u.href);assert(await page.locator(u.hash).count(),'Anchor '+href);}}
 await page.setViewportSize({width:390,height:900});await page.goto(origin+'/');
 await page.getByRole('button',{name:'Menu'}).click();assert(await page.locator('#navigation').isVisible());await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'Menu'}).getAttribute('aria-expanded'),'false');
 await page.getByRole('button',{name:'Menu'}).click();await page.locator('#navigation').getByRole('link',{name:'About',exact:true}).click();await page.waitForURL('**/about/');
 await page.goto(origin+'/');await page.locator('summary').first().click();assert.notEqual(await page.locator('details').first().getAttribute('open'),null);
 await page.goto(origin+'/contact/?service=Google%20Ads');assert.equal(await page.locator('[name="service"]').inputValue(),'Google Ads');
 const fill=async()=>{await page.locator('[name="name"]').fill('Local QA');await page.locator('[name="email"]').fill('test@example.com');await page.locator('[name="company"]').fill('QA only');await page.locator('[name="service"]').selectOption('Google Ads');await page.locator('[name="message"]').fill('Local validation only. No real enquiry.');};
 await fill();
 if(!config.enquiryEndpoint&&!config.email){const downloadPromise=page.waitForEvent('download');await page.locator('form button').click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),'yug-and-co-project-brief.txt');await download.saveAs('qa/project-brief.txt');assert((await readFile('qa/project-brief.txt','utf8')).includes('Local QA'));assert((await page.locator('#form-status').innerText()).includes('No enquiry has been sent'));assert.equal(await page.locator('[name="name"]').inputValue(),'Local QA');}
 for(const [accepted,status,text] of [[false,200,'could not confirm'],[true,500,'could not confirm'],[true,200,'has been accepted']]){
  await page.route('**/config.json',r=>r.fulfill({json:{enquiryEndpoint:'/qa-enquiry'}}));await page.route('**/qa-enquiry',r=>r.fulfill({status,json:{accepted}}));await page.reload();await fill();await page.locator('form button').click();await page.waitForFunction(t=>document.querySelector('#form-status').textContent.toLowerCase().includes(t),text);await page.unroute('**/config.json');await page.unroute('**/qa-enquiry');
 }
 assert.deepEqual(errors,[],'Browser errors');
 report.push('All internal links, mobile menu, Escape, FAQ and service selection passed.');
 report.push('Local brief download and mocked enquiry failure/acceptance checks passed. No actual enquiries sent.');
 await writeFile('qa/agency-report.txt',report.join('\n'));console.log(report.join('\n'));
}finally{await browser.close();}
