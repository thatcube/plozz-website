# Screenshot originals

Pristine, unmodified captures for everything in `public/screenshots/`. These are
the masters — never edit them in place. They are **not** part of the build:
Astro only ships `src/` and `public/`, so this folder costs nothing at runtime.

Each file here shares its name with its published counterpart:

```
screenshots-src/plozz-tv-home.png  ->  public/screenshots/plozz-tv-home.webp
```

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

Only the hero (`plozz-tv.webp`) loads eagerly; the other 18 are lazy, so the size
increase costs the initial page load very little.

## Source resolutions

Most captures are 2000px wide, which covers a 2x display at the site's 1200px
container. Three are not, and cannot be sharpened by re-encoding — they need a
fresh capture at full resolution:

| File | Source | Needed for 2x |
| --- | --- | --- |
| `plozz-tv.png` | 1088x612 | 2296px wide |
| `plozz-ipad.png` | 1084x757 | ~1500px wide |
| `plozz-iphone.png` | 738x1603 | ~1050px wide |

Seven of the Apple TV shots (`episodes`, `library`, `player`, `profile-edit`,
`profiles`, `ratings`, `settings`, `show`) arrived as JPEG, so they were already
lossy before we touched them. Re-shoot them as PNG if you ever want a clean
master.
