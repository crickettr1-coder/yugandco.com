import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const origin=process.env.MOTION_TEST_URL||'http://127.0.0.1:4173';
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(origin,{waitUntil:'networkidle'});await page.waitForTimeout(1200);
 const transform=()=>page.locator('.planning-card').evaluate(e=>getComputedStyle(e).transform);
 const start=await transform();await page.waitForTimeout(700);assert.notEqual(await transform(),start,'Hero card must visibly float');
 const button=page.locator('.hero-actions .button');await button.hover();await page.waitForTimeout(400);assert((await button.evaluate(e=>getComputedStyle(e).transform))!=='none','Button hover lift');
 const card=page.locator('.service-card').first();await card.scrollIntoViewIfNeeded();await page.waitForTimeout(1000);await card.hover();await page.waitForTimeout(400);assert((await card.evaluate(e=>getComputedStyle(e).transform))!=='none','Service hover lift');assert.equal(await card.evaluate(e=>getComputedStyle(e).opacity),'1');
 const photo=page.locator('.gallery-card').first();await photo.scrollIntoViewIfNeeded();await photo.hover();await page.waitForTimeout(800);assert((await photo.locator('img').evaluate(e=>getComputedStyle(e).transform))!=='none','Gallery image hover zoom');
 await page.mouse.move(0,0);const gallery=page.locator('.gallery-first');const before=await gallery.evaluate(e=>e.scrollLeft);await page.waitForTimeout(1000);assert.notEqual(await gallery.evaluate(e=>e.scrollLeft),before,'Gallery autoplay');
 await page.getByRole('button',{name:'Pause motion'}).click();assert.equal(await page.locator('html').getAttribute('data-motion'),'off');assert.equal(await page.locator('.marquee>div').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 await page.getByRole('button',{name:'Enable motion'}).click();assert.equal(await page.locator('html').getAttribute('data-motion'),'on');
 await page.evaluate(()=>localStorage.removeItem('yug-motion'));await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('html').getAttribute('data-motion'),'off');assert.equal(await page.locator('.will-reveal').count(),0);
 await page.getByRole('button',{name:'Enable motion'}).click();assert.equal(await page.locator('html').getAttribute('data-motion'),'on');assert.notEqual(await page.locator('.planning-card').evaluate(e=>getComputedStyle(e).animationName),'none','Explicit motion opt-in');
 await page.setViewportSize({width:390,height:844});await page.reload({waitUntil:'networkidle'});const overflow=await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth,elements:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+1&&!e.closest('.marquee,.gallery');}).map(e=>({tag:e.tagName,class:e.className,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})).slice(0,15)}));if(overflow.width>overflow.viewport)console.log(overflow);assert(overflow.width<=overflow.viewport);
 assert.deepEqual(errors,[]);console.log('PASS: floating hero, button/service hovers, gallery photo zoom and autoplay, scroll reveals, pause/resume, system reduced motion, explicit opt-in, mobile overflow and browser errors.');
}finally{await browser.close();}
