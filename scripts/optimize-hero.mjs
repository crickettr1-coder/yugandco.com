// Re-encode the existing artwork without changing its composition.
import {chromium} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
const source=await readFile('assets/blue-ribbon.png');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{const page=await browser.newPage();for(const width of [480,800,1254]){
 const encoded=await page.evaluate(async({base64,width})=>{const img=new Image();img.src='data:image/png;base64,'+base64;await img.decode();const c=document.createElement('canvas');c.width=width;c.height=Math.round(img.height*width/img.width);c.getContext('2d').drawImage(img,0,0,c.width,c.height);return c.toDataURL('image/webp',.88).split(',')[1];},{base64:source.toString('base64'),width});
 const result=Buffer.from(encoded,'base64');await writeFile(`assets/blue-ribbon-${width}.webp`,result);console.log(`${width}px WebP: ${result.length} bytes (original ${source.length})`);
}}finally{await browser.close();}
