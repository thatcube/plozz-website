# Screenshot originals

Pristine, unmodified captures for everything in `public/screenshots/`. These are
the masters — never edit them in place.

They are **not** part of the build: Astro only ships `src/` and `public/`, so
this folder costs nothing at runtime.

**These are captured automatically now.** See "Refreshing the captures" below;
you should not need a capture card or a physical Apple TV again.

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

## Refreshing the captures

The masters used to be photographed off a real Apple TV over HDMI, which is why
they went stale: refreshing one meant setting up hardware. The app photographs
itself now.

```sh
cd ../Plozz && ./tools/capture-shots.sh   # drive a Simulator, write PNGs
cd -        && npm run shots              # copy the changed ones, re-encode
```

`npm run shots` is `tools/sync-shots.mjs`. It copies any capture whose bytes
differ from the master of the same name and then runs the re-encode, so the two
steps above are the whole loop. A capture with no master here is reported and
skipped — pass `--adopt` to take it — because a new master only earns a place
once something on the site renders it. `--dry-run` shows what would change.

The app-side script is the interesting half. It runs Plozz on a tvOS Simulator
against a real NFS share, waits for the library to finish scanning and
enriching, and then asks the app for each screen **by name** — the app searches
its own libraries and pushes the page a tap would have pushed. Nothing walks the
focus engine, so a shelf reordering cannot silently produce a screenshot of the
wrong title. Its output is named after the masters in this folder, which is why
the sync needs no mapping table.

Simulator captures are the same 3840x2160 as the device captures they replace,
and come from the framebuffer, so they are lossless and free of HDMI capture
artefacts.

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

Every Apple TV master is a full **3840x2160** capture straight from the device,
and the iPad and iPhone masters are their native device resolutions. Because the
ladders are sized per context, that is comfortably more than any of them needs:
the hero paints at 1148 CSS px and tops out at a 2296px rung for a true 2x.

| Master group | Native | Widest rung shipped |
| --- | --- | --- |
| `plozz-tv-*` | 3840x2160 | 2296 (hero) / 1600 (figure) / 1080 (marquee) |
| `plozz-ipad` | 2388x1668 | 1400 |
| `plozz-iphone` | 1320x2868 | 420 |
| `plozz-ipad-*`, `plozz-iphone-detail`, `plozz-iphone-library` | 2000x1397 / 921x2000 | 1080 / 921 / 420 |

The only case that does not reach a full 1:1 match is a 3x display at a viewport
wide enough to put the hero in its desktop layout — a large phone in landscape,
which wants 2712px and gets 2296. That is still 2.5x effective density, so it is
left alone deliberately: the extra rung would cost ~400 KB for something nobody
can see.

### Do not re-import these through anything that resizes

The masters were briefly committed as downscaled copies — `plozz-tv-lotr` was
1099x618 instead of 3840x2160 — because they had been round-tripped through a
tool that quietly resizes images. Nothing about the file looks wrong afterwards,
and the resulting screenshots were soft on every retina display.

Copy captures straight from disk. To check one before committing it:

```sh
magick identify -format '%wx%h %[bit-depth]-bit\n' screenshots-src/plozz-tv-lotr.png
# 3840x2160 8-bit
```

Anything arriving at an odd width like 1099, 1125 or 1202 has been resized and
should be replaced with the original capture.

Several of the Apple TV captures arrive from the device as **16-bit HDR** PNGs,
which makes them 25-40 MB each. They are stored here converted to 8-bit sRGB at
their full 3840x2160 instead, which costs nothing: every rung is encoded from
8-bit sRGB anyway, so the shipped files are byte-for-byte equivalent (measured:
PSNR 45.7 dB between a rung built from the 16-bit master and the same rung built
from the 8-bit one, with output sizes within 0.06%). It takes the folder from
293 MB to 109 MB. Convert on import:

```sh
magick <capture>.png -colorspace sRGB -depth 8 -define png:compression-level=9 \
  screenshots-src/<name>.png
```

Resolution is what matters here, not bit depth — keep the full 3840x2160.

The 16-to-8-bit conversion is measured, not assumed: the shipped 2296px AVIF of
`plozz-tv-lotr` scores DSSIM 0.0051 / PSNR 42.9 dB against the master, against
0.0229 / 30.7 dB for the downscaled master it replaced.

Older masters carry a fully opaque alpha channel that `avifenc` drops. That is
correct and saves bytes, but it means a naive `compare` between such a master
and its encode reads as a huge difference purely from the channel-count
mismatch — DSSIM 0.13 where the truth is 0.005. Flatten both before measuring.
Captures produced by `capture-shots.sh` are already flattened, because App Store
Connect rejects a screenshot that has an alpha channel at all.
