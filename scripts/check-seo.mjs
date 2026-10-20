import assert from 'node:assert/strict';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {createAgency} from '../templates/agency.mjs';
import {services} from '../content/services.js';
import {insights} from '../content/insights.js';
import {seo} from '../content/seo.js';
import config from '../site.config.js';
const pages=createAgency(config).filter(p=>p.route!=='/reviews/'),titles=new Set(),descriptions=new Set(),report=[];
for(const p of pages){
 const html=await readFile('dist'+p.route+'index.html','utf8');
 const title=html.match(/<title>(.*?)<\/title>/)[1];
 const description=html.match(/<meta name="description" content="([^"]*)">/)[1];
 assert(seo[p.route],p.route+' explicit search copy');assert(!titles.has(title),p.route+' duplicate title');titles.add(title);assert(!descriptions.has(description),p.route+' duplicate description');descriptions.add(description);
 assert.equal((html.match(/<link rel="canonical"/g)||[]).length,1);assert(html.includes(`href="${config.domain}${p.route}"`));assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 const unpublished=['/reviews/','/404/'].includes(p.route);if(unpublished)assert(html.includes('name="robots" content="noindex,nofollow"'));else {assert(html.includes('name="robots" content="index,follow,max-image-preview:large"'));assert(!html.includes('noindex'));}
 assert(html.includes('name="twitter:card"'));assert(html.includes('property="og:image"'));
 const scripts=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,1);
 const graph=JSON.parse(scripts[0][1])['@graph'];assert(graph.find(n=>n['@type']==='Organization'));assert(graph.find(n=>n['@type']==='WebSite'));const web=graph.find(n=>n['@id']===config.domain+p.route+'#webpage');assert(web);assert.equal(web.url,config.domain+p.route);
 if(p.route!=='/'){assert(html.includes('aria-label="Breadcrumb"'));const bc=graph.find(n=>n['@type']==='BreadcrumbList');assert(bc);assert.equal(bc.itemListElement.at(-1).item,web.url);assert.equal(bc.itemListElement[0].item,config.domain+'/');}
 if(services.some(s=>p.route===`/services/${s.slug}/`))assert(graph.find(n=>n['@type']==='Service'));
 if(insights.some(a=>p.route===`/insights/${a.slug}/`)){assert(graph.find(n=>n['@type']==='Article'));assert(html.includes('class="article-related"'));}
 report.push({route:p.route,title,description,titleLength:title.length,descriptionLength:description.length,schemaTypes:graph.map(n=>n['@type'])});
}
const sitemap=await readFile('dist/sitemap.xml','utf8');const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);const published=pages.filter(p=>!['/reviews/','/404/'].includes(p.route));assert.equal(urls.length,published.length);assert.equal(new Set(urls).size,published.length);for(const p of published)assert(urls.includes(config.domain+p.route));assert(!sitemap.includes('/reviews/'));assert(!sitemap.includes('/404/'));assert(!sitemap.includes('yug-production-release'));
const robots=await readFile('dist/robots.txt','utf8');assert(robots.includes('Allow: /'));assert(robots.includes('Disallow: /yug-production-release/'));assert(robots.includes(config.domain+'/sitemap.xml'));
const htaccess=await readFile('dist/.htaccess','utf8');assert(htaccess.includes('THE_REQUEST'));assert(htaccess.includes('R=301'));assert(htaccess.includes('yug-production-release'));assert(htaccess.includes('R=404'));
const home=await readFile('dist/index.html','utf8');assert(home.includes('srcset='));assert(home.includes('fetchpriority="high"'));const original=(await stat('assets/blue-ribbon.png')).size;for(const width of [480,800,1254])assert((await stat(`dist/assets/blue-ribbon-${width}.webp`)).size<original*.1);
await mkdir('qa',{recursive:true});await writeFile('qa/seo-report.json',JSON.stringify(report,null,2));
console.log(`${pages.length} pages: unique search metadata, canonical URLs, indexability and JSON-LD passed.\nBreadcrumbs, eight service entities, three articles and related-service links passed.\nSitemap, robots, routing configuration and responsive WebP asset checks passed.`);
