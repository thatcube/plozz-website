# plozz.app

The marketing website for **[Plozz](https://github.com/thatcube/Plozz)** — a free,
open-source Apple TV app for Jellyfin & Plex.

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

## License

MIT — see [LICENSE](LICENSE).
