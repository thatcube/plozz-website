# Screenshot originals

Pristine, unmodified captures for everything in `public/screenshots/`. These are
the masters — never edit them in place. They are **not** part of the build:
Astro only ships `src/` and `public/`, so this folder costs nothing at runtime.

Each file here shares its name with its published counterpart:

```
screenshots-src/plozz-tv-home.png  ->  public/screenshots/plozz-tv-home-<width>.<hash>.{avif,webp}
```

A few masters are kept purely for safekeeping and have no published counterpart
yet — they are still worth holding onto for future use:

| File | Why it isn't published |
| --- | --- |
| `plozz-iphone-player-info.png` | Landscape iPhone player, 2000x921 (19.5:9) with letterboxing baked in. Too wide for the height-sized marquee, where it reads as a black slab. |
| `plozz-iphone-player-cast.png` | Same shape and same reason. |
| `plozz-tv-pin.png` | Nothing on the site links to the pairing screen. |

These are listed in `UNPUBLISHED` in `tools/build-images.mjs`, so regenerating
skips them rather than quietly deploying screenshots nothing links to.

## Regenerating the published images

```sh
npm run images          # only re-encodes what changed
npm run images -- --force
npm run images -- --only plozz-tv-home
```

`tools/build-images.mjs` reads every master in this folder and writes a ladder
of widths into `public/screenshots/`, in two formats:

```
plozz-tv-home-360.7f2a91c4.avif   plozz-tv-home-360.b3e10d55.webp
plozz-tv-home-560.….avif           plozz-tv-home-560.….webp
plozz-tv-home-800.….avif           plozz-tv-home-800.….webp
plozz-tv-home-1080.….avif          plozz-tv-home-1080.….webp
```

The suffix is a hash of that rung's build inputs — the master's bytes, the
width, and the encoder settings. It is what lets `public/_headers` serve
`/screenshots/*` as `immutable` for a year without ever stranding a visitor on
a stale image: re-shooting a master or changing a quality setting produces a new
filename instead of new bytes at an old URL. Stale rungs from a previous ladder
are pruned automatically on a full run.

It also writes `src/data/screenshots.json`, which the `Shot` component reads to
build its `srcset` and its intrinsic `width`/`height`. Nothing about the srcsets
is hand-maintained, so they cannot drift from the files on disk.

Every rung is resized from the master by ImageMagick and encoded from those
pristine pixels — never by downscaling an already-lossy WebP.

### Why AVIF, and why these settings

`avifenc -q 85 -s 2 --yuv 444` was picked by measuring DSSIM against the master
rather than by eye. It beats the `cwebp -q 95 -sharp_yuv` encode this file used
to describe on *both* axes — better measured quality for ~40% fewer bytes:

| Image | encode | size | DSSIM (lower is better) |
| --- | --- | --- | --- |
| `plozz-tv-featured` (2000px) | webp q95 | 339 KB | 0.00949 |
| | **avif q85** | **207 KB** | **0.00790** |
| `plozz-tv-subtitles` (1400px) | webp q95 | 162 KB | 0.00588 |
| | **avif q85** | **105 KB** | **0.00482** |

`--yuv 444` matters for the same reason `-sharp_yuv` did: these frames are full
of small UI text, which is exactly what chroma subsampling smears.

WebP is still emitted at `-q 94 -m 6 -sharp_yuv` as the fallback for browsers
without AVIF (Safari older than 16.4 and friends). Dropping it to q90 would have
saved bytes on that path but measured *worse* than what the site shipped before,
so it stays at parity.

### Widths are per-context, and are measured

`LADDERS` in the script holds a width ladder per display context, and `USAGE`
maps each master onto the contexts it appears in. A marquee tile never paints
wider than 532 CSS px, so it stops at a 1080px rung; the hero fills 1148 CSS px
and goes to 2000.

The CSS px figures behind those ladders, and the matching `sizes` strings in
`src/data/imageSizes.ts`, were measured in a real browser at eight viewport
widths — not derived by reading the stylesheet. That distinction is not
academic: the iPad mockup is scaled by `transform` inside a sized slot, so the
frame width in `device-frames.css` suggests 324 CSS px when it actually paints
463, and trusting the CSS shipped it at a third of the resolution it needed.

**If you change a layout, re-measure.** The check that catches this is
comparing each image's painted width times the device pixel ratio against the
rung the browser actually chose; every image should be at or above 1.0x.

Masters with no published counterpart are listed in `UNPUBLISHED` and are
skipped, so an unreferenced screenshot never reaches the deploy.

## Source resolutions

Because the ladders are sized per context, "is this master big enough?" depends
entirely on where the shot is used, not on its pixel count alone. A 1084px iPad
capture is more than enough for a mockup that paints at 463 CSS px, and nowhere
near enough for the hero.

Only the hero is currently short. It paints at 1148 CSS px, so a crisp 2x wants
2296px and these masters cannot get there by re-encoding — they need a fresh
capture:

| File | Source | Shortfall at 2x |
| --- | --- | --- |
| `plozz-tv-lastofus.png` | 1812x1019 | 0.79x |
| `plozz-tv-mario.png` | 1318x741 | 0.57x |
| `plozz-tv-office.png` | 1202x676 | 0.52x |
| `plozz-tv-oppenheimer.png` | 1125x633 | 0.49x |
| `plozz-tv-lotr.png` | 1099x618 | 0.48x |

They land near 1:1 at 1x — crisp on a standard display, soft on retina. They are
mostly photographic artwork, which upscales far more gracefully than fine UI
text, so they are acceptable but not ideal. `plozz-tv-featured.png` and
`plozz-tv-cast.png` are both a full 2000x1125 and are the two sharpest frames in
the hero, which is why the featured shot leads and is the one that gets
preloaded.

Everything else clears its contexts at 2x today, including `plozz-tv.png`
(1088px, marquee and spoiler card) and `plozz-ipad.png` (1084px, marquee and the
iPad mockup). Re-shooting them would only help if they were moved somewhere
larger.

Several of the Apple TV captures are **16-bit HDR** PNGs (`mario`, `office`,
`oppenheimer`, `lotr`, `lastofus`). That makes them 4-5 MB despite the low pixel
count, so file size is a useless proxy for resolution here — check
`sips -g pixelWidth -g bitsPerSample <file>` instead. None carries an embedded
ICC profile, so the 16-to-8-bit conversion needs no color management. If these
are ever re-shot, plain 8-bit PNG at full resolution is strictly better for the
web.

Seven of the Apple TV shots (`episodes`, `library`, `player`, `profile-edit`,
`profiles`, `ratings`, `settings`, `show`) arrived as JPEG, so they were already
lossy before we touched them. Re-shoot them as PNG if you ever want a clean
master.
