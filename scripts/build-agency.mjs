import {mkdir,writeFile,copyFile,cp,readFile} from 'node:fs/promises';
import config from '../site.config.js';
import {createAgency} from '../templates/agency.mjs';
import {addCreativeLayer} from '../templates/creative.mjs';
import {enrichPages} from '../templates/growth.mjs';
const pages=enrichPages(addCreativeLayer(createAgency(config)));
await mkdir('dist/assets',{recursive:true});
for(const page of pages){const dir='dist'+page.route;await mkdir(dir,{recursive:true});await writeFile(dir+'index.html',page.html);}
await writeFile('dist/styles.css',(await readFile('assets/fonts/urbanist.css','utf8'))+'\n'+await readFile('src/agency.css','utf8')+'\n'+await readFile('src/creative.css','utf8')+'\n'+await readFile('src/growth.css','utf8'));
await copyFile('src/agency.js','dist/app.js');
await copyFile('assets/blue-ribbon.png','dist/assets/blue-ribbon.png');
await cp('assets/fonts','dist/assets/fonts',{recursive:true});
await writeFile('dist/config.json',JSON.stringify(config,null,2));
await writeFile('dist/assets/favicon.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#6842d6"/><text x="14" y="45" font-family="Arial" font-size="45" font-weight="bold" fill="#ffffff">y.</text></svg>');
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${config.domain}${p.route}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${config.domain}/sitemap.xml\n`);
console.log(`Built ${pages.length} agency pages in dist.`);
