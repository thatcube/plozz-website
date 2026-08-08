# plozz.app

The marketing website for **[Plozz](https://github.com/thatcube/Plozz)** — a free,
open-source player for Jellyfin, Plex, Emby and network shares, on Apple TV,
iPhone and iPad.

Live at **[plozz.app](https://plozz.app)**.

## Stack

- **[Astro](https://astro.build)** — static output, zero JavaScript shipped by default.
- **Hosting:** [Cloudflare Pages](https://pages.cloudflare.com) (unlimited bandwidth, global CDN, free SSL).

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
```

## Build

```bash
npm run build    # outputs static site to dist/
npm run preview  # preview the production build locally
```

## Deploy (Cloudflare Pages)

Connected to this repo. On every push to `main`, Cloudflare builds and deploys automatically.

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |

## Editing content

- Copy, features, and links live in [`src/pages/index.astro`](src/pages/index.astro).
- Replace `TESTFLIGHT_URL` in that file with the public TestFlight invite link.
- Styles are in [`src/styles/global.css`](src/styles/global.css).
- Static assets (logo, social card, headers) are in [`public/`](public/).

### Social share card

`public/og-image.png` and `public/og-image.svg` are **generated**, not edited by
hand — an earlier hand-patched card went on advertising a Jellyfin-and-Plex
tvOS-only app long after that stopped being true. Both are built from the live
`logo.svg` and `plozz-wordmark.svg`, so a logo change can't leave a stale one in
the share card.

```bash
npm run og           # rewrite both files
node tools/build-og.mjs --check   # fail if the committed pair is stale
```

The wording lives in `COPY` at the top of
[`tools/build-og.mjs`](tools/build-og.mjs); keep it in step with the default
title and description in [`src/layouts/Layout.astro`](src/layouts/Layout.astro).

## License

MIT — see [LICENSE](LICENSE).
