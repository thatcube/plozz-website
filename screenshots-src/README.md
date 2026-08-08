# Screenshot originals

Pristine, unmodified captures for everything in `public/screenshots/`. These are
the masters — never edit them in place. They are **not** part of the build:
Astro only ships `src/` and `public/`, so this folder costs nothing at runtime.

Each file here shares its name with its published counterpart:

```
screenshots-src/plozz-tv-home.png  ->  public/screenshots/plozz-tv-home.webp
```

A few masters are kept purely for safekeeping and have no published counterpart
yet — they are still worth holding onto for future use:

| File | Why it isn't published |
| --- | --- |
| `plozz-iphone-player-info.png` | Landscape iPhone player, 2000x921 (19.5:9) with letterboxing baked in. Too wide for the height-sized marquee, where it reads as a black slab. |
| `plozz-iphone-player-cast.png` | Same shape and same reason. |

Regenerating (below) globs the whole folder, so it will emit WebPs for these too.
Delete any WebP that nothing references — unused files still get deployed.

## Regenerating the published WebPs

```sh
for src in screenshots-src/*.{png,jpg}; do
  [ -e "$src" ] || continue
  name=$(basename "${src%.*}")
  cwebp -q 95 -m 6 -sharp_yuv "$src" -o "public/screenshots/$name.webp"
done
```

`-q 95 -m 6 -sharp_yuv` was picked by sweeping the encoder: it buys roughly +4 dB
PSNR over the q82 encode the site originally shipped, for about 2x the bytes.
Near-lossless and lossless are 5-10x the bytes for no visible gain. `-sharp_yuv`
matters here because these frames are full of small UI text, which is exactly
what chroma subsampling smears.

Only the hero's first slide (`plozz-tv-featured.webp`) loads eagerly; everything
else is lazy, so the size increase costs the initial page load very little.

## Source resolutions

Most captures are 2000px wide, which covers a 2x display at the site's 1200px
container. The rest are not, and cannot be sharpened by re-encoding — they need a
fresh capture at full resolution:

| File | Source | Needed for 2x |
| --- | --- | --- |
| `plozz-tv.png` | 1088x612 | 2296px wide |
| `plozz-ipad.png` | 1084x757 | ~1500px wide |
| `plozz-iphone.png` | 738x1603 | ~1050px wide |
| `plozz-tv-mario.png` | 1318x741 | 2296px wide |
| `plozz-tv-office.png` | 1202x676 | 2296px wide |
| `plozz-tv-oppenheimer.png` | 1125x633 | 2296px wide |
| `plozz-tv-lotr.png` | 1099x618 | 2296px wide |
| `plozz-tv-lastofus.png` | 1812x1019 | 2296px wide |

The hero displays at 1148 CSS px, so 2296px is the target for a crisp 2x. The
Apple TV shots above land near 1:1 at 1x — crisp on a standard display, soft
on retina. They are mostly photographic artwork, which upscales far more
gracefully than fine UI text, so they are acceptable but not ideal.
`plozz-tv-featured.png` and `plozz-tv-cast.png` are both a full 2000x1125 and
are the two sharpest frames in the hero, which is why the featured shot leads.

Several of the Apple TV captures are **16-bit HDR** PNGs (`mario`, `office`,
`oppenheimer`, `lotr`, `lastofus`). That makes them 4-5 MB despite the low
pixel count, so file size is a useless proxy for resolution here — check
`sips -g pixelWidth -g bitsPerSample <file>` instead. None carries an embedded ICC
profile, so `cwebp`'s 16-to-8-bit conversion needs no color management (verified:
PSNR 39.7-53.1 dB). If these are ever re-shot, plain 8-bit PNG at full resolution
is strictly better for the web.

Seven of the Apple TV shots (`episodes`, `library`, `player`, `profile-edit`,
`profiles`, `ratings`, `settings`, `show`) arrived as JPEG, so they were already
lossy before we touched them. Re-shoot them as PNG if you ever want a clean
master.
