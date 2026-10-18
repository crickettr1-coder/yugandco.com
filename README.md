# Yug & Co

An original, static HTML/CSS/JavaScript digital marketing company website with 24 pages. Shared page templates live in `templates/agency.mjs`; `templates/growth.mjs` and `content/growth.js` add service explanations, business solutions and an interactive goal selector. Public business details live in `site.config.js`. `npm run build` runs `scripts/build-agency.mjs` and generates deployable files in `dist/`.

## Current agency design

## SEO implementation

`content/seo.js` contains page-specific search titles and descriptions. `templates/seo.mjs` adds consistent social metadata, visible breadcrumbs and Organization, WebSite, WebPage, Service, Article and collection structured data using verified site content. It also links the practical guides to relevant service pages. No address, reviews, client results or author dates are invented.

`npm run check:seo` checks all 24 pages, schema JSON, canonical URLs, sitemap coverage, robots rules and responsive image assets. `npm run check` covers layouts, navigation and interactions. The original hero is re-encoded into 480, 800 and 1254 pixel WebP files by `node scripts/optimize-hero.mjs`; the build uses those committed assets without requiring regeneration.

`templates/hosting.htaccess` is copied to `dist/.htaccess`. It canonicalises www and explicit index.html requests, redirects Hostinger’s default.php placeholder, disables directory listing and returns 404 for the duplicate release directory on the main domain. Hostinger already supplies the HTTP-to-HTTPS redirect. Deployment must copy `.htaccess` explicitly as well as the visible production files. The sitemap contains the 24 canonical pages and robots.txt references it.

Search Console submission was not completed: the connected GSC Wizard account reports an expired trial/no active subscription. Submit `https://yugandco.com/sitemap.xml` in a verified Google Search Console property when account access is available. Target locations and public business contact details remain unconfirmed, so no local-business address or location-targeted claims are added.

## Creative design

The current creative agency version uses lavender, cobalt, peach and warm white. `templates/creative.mjs` adds an original sculptural ribbon hero, illustrative campaign previews and the Work navigation link to the shared company pages. `src/creative.css` adds the creative visual system, responsive layouts and motion. The existing original `assets/blue-ribbon.png` is the hero artwork. Motion has an explicit pause/resume control and follows reduced-motion preferences.

The 24 pages include Home, About, Services, eight individual service pages, Approach, Campaign Thinking, Insights, three guides, Contact, Privacy, a Solutions hub, three business-specific solution pages and Working Together. Each service page has a practical visual explanation, customer journey, measurement definitions and four FAQs. Campaign plans and design previews are explicitly illustrative; no client commissions, results, team members or testimonials are invented.

Without a delivery endpoint or verified business email, the contact form downloads a local text brief and does not send an enquiry. Add approved public contact details to `site.config.js` and rebuild. With an email configured, the form opens a prepared email for the visitor to review and send. With an endpoint configured, success requires an HTTP 2xx response and `{ "accepted": true }`.

`npm run check` runs `scripts/check-agency.mjs`, checks all 24 routes at 1440, 1024, 768, 390 and 320 pixels, internal links and anchors, metadata, mobile navigation, FAQ, goal tabs and keyboard controls, motion preferences, brief downloads and mocked submission outcomes. Screenshots and reports are written to ignored `qa/`. Optional `AGENCY_TEST_URL` changes the test origin. `src/growth.css` styles the newer service, solution and engagement sections.

The GitHub `main` branch contains source and build output. The `production` branch contains only the `dist/` tree for Hostinger deployment. Do not publish source directories into the domain document root.

The following historical notes describe the preceding portrait-led design; its files remain available for reference. The current build does not use `templates/home.mjs`, `src/reference.css`, `src/refinement.css`, `src/motion.css` or `src/app.js`.

## Run locally

With Node.js 20 or newer:

```sh
npm install
npm run build
npm run dev
```

Open http://127.0.0.1:4173. Stop with Ctrl+C. No application dependencies or backend are required for the static website. The development dependency is used only for browser validation.

## Edit

- Homepage, FAQs, process and concept gallery text: `templates/home.mjs`.
- Shared header, footer, enquiry form and page generation: `scripts/build.mjs`.
- Original practical guides: `content/insights.js`.
- Six service pages: `content/services.js`.
- Colours, typography, spacing and mobile layouts: `src/reference.css`.
- Reference-aligned proportions and final design refinements: `src/refinement.css`.
- Motion and hover styling: `src/motion.css`. The site has a visible motion toggle; it follows the system reduced-motion setting by default and remembers an explicit choice on this device.
- Navigation, scroll reveals and form handling: `src/app.js`.
- Confirmed domain, email, phone and enquiry endpoint: `site.config.js`. Email and phone are deliberately blank and not displayed. Never put secrets in this public configuration.
- Original hero artwork: `assets/blue-ribbon.png`. The build copies it into the deployable asset directory.

Run `npm run build` after edits. Upload the contents of `dist/` to a static host with directory-index support. Root-relative links require deployment at the domain root. Canonicals and sitemap target https://yugandco.com; domain registration, DNS and public hosting are separate from the private review deployment.

## Connect enquiries

1. Choose a backend or form provider that accepts JSON POST with `name`, `email`, `service`, `message`.
2. Configure delivery or storage, server-side validation, spam protection and rate limiting. Keep provider credentials on the server.
3. The endpoint must return HTTP 2xx and JSON `{ "accepted": true }` only after durably accepting the enquiry. Any other response shows an error and preserves the fields. Cross-origin endpoints need appropriate CORS.
4. Put the HTTPS endpoint in `site.config.js` as `enquiryEndpoint`, then rebuild.
5. Update the privacy notice with verified contact details, provider and retention information before enabling live enquiries. Verify an actual enquiry reaches the configured destination.

Without an endpoint, submitting never sends information or claims success. No phone, email, clients, testimonials, awards, experience figures or performance results are invented. Both portfolio projects are explicitly fictional concepts.

## Validate

Keep the local server running, then run `npm run check`. The check uses installed Microsoft Edge in headless mode. It checks 1440, 768, 390 and 320 pixel widths, images, internal navigation, metadata, mobile menu, unconnected form, mocked rejection/acceptance responses and reduced motion. Screenshots and the report are saved in ignored `qa/`.

Run `node scripts/check-motion.mjs` to verify actual movement over time, hover lifts and photo zoom, gallery autoplay, scroll reveals, pause/resume and reduced-motion behaviour.

The current design recreates the composition of Choicy Home 04 for Yug & Co with original HTML, CSS, JavaScript and copy. Reference photography and decorative assets are saved locally in `assets/choicy/`; source URLs are recorded in `assets/choicy/sources.json`. These are third-party theme-demo assets, not original Yug & Co photography. Portraits are illustrative and do not identify Yug & Co staff. Portfolio gallery entries are independent concepts, not client commissions or results. Theme logos, client claims, testimonials and fabricated metrics are omitted. Urbanist fonts are self-hosted in `assets/fonts/` with system fallbacks; styling and typography need no external font request. Original functional SVG service icons live in `templates/icons.mjs`.

The preceding ivory-and-blue version is preserved outside the project in `../previous-version/`, and its source remains available in Git history at commit `030bffce5c089147e2739f87b3e79bdfb2651b0a`.
