import {seo} from '../content/seo.js';
import {services} from '../content/services.js';
import {insights} from '../content/insights.js';
import {solutions} from '../content/growth.js';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={'/':'Home','/about/':'About','/services/':'Services','/work/':'Work','/solutions/':'Solutions','/insights/':'Insights','/approach/':'Our approach','/contact/':'Contact','/privacy/':'Privacy','/working-together/':'Working together'};
for(const s of services)labels[`/services/${s.slug}/`]=s.name;
for(const s of solutions)labels[`/solutions/${s.slug}/`]=s.name;
for(const a of insights)labels[`/insights/${a.slug}/`]=a.title;
export function optimizeSEO(pages,config){return pages.map(p=>{
 const [shortTitle,description]=seo[p.route]||[p.title,p.description];
 const title=shortTitle+' | '+config.brand;
 let html=p.html.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(title)}</title>`)
 .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(description)}">`)
 .replace(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${escape(title)}">`)
 .replace(/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${escape(description)}">`)
 .replace(/<meta name="theme-color" content="[^"]*">/,'<meta name="theme-color" content="#2448ff">')
 .replaceAll('creative-v3-20261018','seo-v1-20261018')
 .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g,'');
 const root=config.domain;const url=root+p.route;const orgId=root+'/#organization';const websiteId=root+'/#website';
 const crumbs=[{name:'Home',route:'/'}];
 const segments=p.route.split('/').filter(Boolean);
 if(segments.length>1)crumbs.push({name:labels['/'+segments[0]+'/'],route:'/'+segments[0]+'/'});
 if(p.route!=='/')crumbs.push({name:labels[p.route]||shortTitle,route:p.route});
 const type=p.route==='/about/'?'AboutPage':p.route==='/contact/'?'ContactPage':['/services/','/solutions/','/insights/'].includes(p.route)?'CollectionPage':'WebPage';
 const webPage={'@type':type,'@id':url+'#webpage',url,name:title,description,inLanguage:'en',isPartOf:{'@id':websiteId},about:{'@id':orgId}};
 const graph=[{'@type':'Organization','@id':orgId,name:config.brand,url:root+'/',description:'A digital marketing company offering strategy, SEO, paid media, social content, websites, creative and analytics.',...(config.email?{email:config.email}:{}),...(config.phone?{telephone:config.phone}:{})},{'@type':'WebSite','@id':websiteId,url:root+'/',name:config.brand,inLanguage:'en',publisher:{'@id':orgId}},webPage];
 if(p.route!=='/'){
  const id=url+'#breadcrumb';webPage.breadcrumb={'@id':id};graph.push({'@type':'BreadcrumbList','@id':id,itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:root+c.route}))});
  const trail=`<nav class="seo-breadcrumb wrap" aria-label="Breadcrumb"><ol>${crumbs.map((c,i)=>`<li>${i===crumbs.length-1?`<span aria-current="page">${escape(c.name)}</span>`:`<a href="${c.route}">${escape(c.name)}</a>`}</li>`).join('')}</ol></nav>`;
  html=html.replace('<main id="main">','<main id="main">'+trail);
 }
 const s=services.find(s=>p.route===`/services/${s.slug}/`);
 if(s){const id=url+'#service';webPage.mainEntity={'@id':id};graph.push({'@type':'Service','@id':id,name:s.name,serviceType:s.name,description:s.description,url,provider:{'@id':orgId},mainEntityOfPage:{'@id':webPage['@id']}});}
 const a=insights.find(a=>p.route===`/insights/${a.slug}/`);
 if(a){const id=url+'#article';webPage.mainEntity={'@id':id};graph.push({'@type':'Article','@id':id,headline:a.title,description:a.intro,inLanguage:'en',url,author:{'@id':orgId},publisher:{'@id':orgId},mainEntityOfPage:{'@id':webPage['@id']}});}
 const list=p.route==='/services/'?services.map(s=>({name:s.name,url:root+`/services/${s.slug}/`})) :p.route==='/solutions/'?solutions.map(s=>({name:s.name,url:root+`/solutions/${s.slug}/`})) :p.route==='/insights/'?insights.map(a=>({name:a.title,url:root+`/insights/${a.slug}/`})) :null;
 if(list){const id=url+'#list';webPage.mainEntity={'@id':id};graph.push({'@type':'ItemList','@id':id,itemListElement:list.map((v,i)=>({'@type':'ListItem',position:i+1,...v}))});}
 const json=JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c');
 const robots=['/reviews/','/404/'].includes(p.route)?'noindex,nofollow':'index,follow,max-image-preview:large';
 html=html.replace('</head>',`<meta name="robots" content="${robots}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${root}/assets/blue-ribbon-1254.webp"><link rel="preload" href="/assets/fonts/urbanist-14.woff2" as="font" type="font/woff2" crossorigin><script type="application/ld+json">${json}</script></head>`);
 html=html.replace(/<meta property="og:image" content="[^"]*">/,`<meta property="og:image" content="${root}/assets/blue-ribbon-1254.webp">`);
 if(p.route==='/'){
  html=html.replace('STRATEGY MEETS A LITTLE SPARK','DIGITAL MARKETING &amp; CREATIVE AGENCY');
  html=html.replace('You bring the ambition. We connect strategy, design and digital marketing to give your business a more distinctive presence.','You bring the ambition. We connect SEO, paid media, website design and creative to help your business get found, understood and chosen.');
  html=html.replace('src="/assets/blue-ribbon.png"','src="/assets/blue-ribbon-1254.webp" srcset="/assets/blue-ribbon-480.webp 480w, /assets/blue-ribbon-800.webp 800w, /assets/blue-ribbon-1254.webp 1254w" sizes="(max-width: 640px) 90vw, (max-width: 1100px) 55vw, 650px"');
 }
 if(a){const related=a.slug==='seo-or-paid-search'?['search-engine-optimisation','google-ads']:a.slug==='social-content-with-a-purpose'?['social-media-management','content-creative']:['content-creative','digital-marketing-strategy'];const links=related.map(slug=>services.find(s=>s.slug===slug));html=html.replace('<div class="article-next">',`<section class="article-related"><p class="eyebrow">PUT THE IDEAS TO WORK</p><h2>Explore related services.</h2><div class="route-links">${links.map(s=>`<a href="/services/${s.slug}/">${s.name}<span aria-hidden="true">↗</span></a>`).join('')}</div></section><div class="article-next">`);}
 return {...p,title:shortTitle,description,html};
});}
