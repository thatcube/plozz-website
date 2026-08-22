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

## Deploy (Cloudflare Workers)

Connected to this repo through Workers Builds. On every push to `main`,
Cloudflare runs the build and deploys.

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

Everything else — the static assets, the KV binding, the public client IDs —
is in [`wrangler.toml`](wrangler.toml) rather than in dashboard settings.

This was a Pages project until Pages stopped receiving new features and
Cloudflare began pointing static sites at Workers instead.

### Running it the way it deploys

`npm run dev` is the Astro dev server, which is what you want for writing
pages. It doesn't know about the auth relay, so use Wrangler when touching
anything under `worker/`:

```bash
npm run build
npm run worker      # serves dist/ and the relay together on :8787
```

### The auth relay

`worker/` holds the OAuth relay for the AniList and MyAnimeList trackers.
Static assets are served ahead of it, so it only runs for the handful of paths
in `worker/index.js` that aren't files.

`MAL_CLIENT_SECRET` is the one value not in the repo:

```bash
npx wrangler secret put MAL_CLIENT_SECRET
```

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
