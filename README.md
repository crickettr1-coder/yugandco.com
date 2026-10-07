# Yug & Co

An original, static HTML/CSS/JavaScript agency website. Source lives in `scripts/build.mjs`, `content/services.js`, `src/` and `site.config.js`; generated deployable files live in `dist/`.

## Run locally

With Node.js 20 or newer:

```sh
npm install
npm run build
npm run dev
```

Open http://127.0.0.1:4173. Stop with Ctrl+C. No application dependencies or backend are required for the static website. The development dependency is used only for browser validation.

## Edit

- Homepage, FAQs, process and concept project text: `scripts/build.mjs`.
- Six service pages: `content/services.js`.
- Colours, typography, spacing and mobile layouts: `src/styles.css`.
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

Fonts use Google Fonts with local system fallbacks. The blue ribbon is original generated artwork; portfolio visuals are original typographic design concepts. No assets from the reference theme were copied.
