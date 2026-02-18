# Eye ED Algorithms (static web app)

## What this is
A small static web app that runs decision-tree algorithms (wizard-style) from JSON files.

- No backend required.
- Offline-capable via a Service Worker.
- Designed for personal clinical reference (avoid patient-identifiable data).

## Add / edit algorithms
1. Add a new JSON file in `/data/`.
2. Add an entry in `ALGOS` inside `app.js` to point to that JSON.

## Hosting
This is a static site. You can host it free on GitHub Pages, Cloudflare Pages, or Netlify.
For real access control, use hosting-level protection (Cloudflare Access / Netlify Basic Auth / etc).

## iPhone install
Open the site in Safari → Share → Add to Home Screen.
