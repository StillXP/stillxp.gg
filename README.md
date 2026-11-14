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

All copy is in `src/content.ts`. Items marked `[TODO: ...]` need the owner's own words.
