# stillxp.gg

Portfolio site built on [Lock In](https://github.com/StillXP/lock-in-design-system). Vite + React; every control is a Lock In component and every style is a semantic token.

```bash
npm install
npm run dev          # http://localhost:5173
npm run lint:tokens  # fails on hex values, raw colors or non --ds-* variables
npm run build
```

## Lock In dependency

`@stillxp/*` are linked from `../lock-in-design-system/packages` (run `npm run build` there first). To deploy from CI, switch to the published packages on GitHub Packages: add an `.npmrc` with `@stillxp:registry=https://npm.pkg.github.com` and a `read:packages` token, then change the `file:` versions to the released version.

## Content

All copy is in `src/content.json`. To edit it in the browser, run `npm run dev` and open http://localhost:5173/#edit (or click **Edit content** in the header). Save writes straight to `src/content.json`; the editor only exists in dev and is left out of the production build. Items marked `[TODO: ...]` need the owner's own words.

## Case studies

Each case study is one JSON file in `src/case-studies/`, with its images in `public/case-studies/<slug>/`. To add one, copy `src/case-studies/cbs-sports-tokens.json`, change `slug`, `order`, `name` and the content, and drop the images in the matching folder. It appears on the home page (sorted by `order`) and at `/work/<slug>/`; the build writes `dist/work/<slug>/index.html` so the page works on any static host. To link it from a job in the Work section, set that job's `caseStudy` to the slug in `src/content.json`.

Blocks in `sections[].blocks`: `{ "type": "p", "text" }` (text may include `[label](/url)` links), `{ "type": "h", "text" }` (subheading), `{ "type": "list", "ordered": true, "items": [] }` and `{ "type": "image", "src", "alt", "caption", "width", "height" }`.
