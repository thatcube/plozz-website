/**
 * Renders the same page once per candidate typeface and lays the results out as
 * a labelled contact sheet.
 *
 * The switcher in FontPreview.astro is the right tool for living with a face —
 * scrolling it, reading it, seeing it at every size. This is the other half:
 * eleven crops of identical layout, side by side, where the face is the only
 * thing changing. Judgements about character are much easier to make against a
 * neighbour than against a memory.
 *
 *   npm run font-sheet
 *
 * It starts its own preview server on a spare port and stops it again, so there
 * is no second terminal to remember and no way to shoot a page that is not in
 * preview mode.
 */

import { mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'build', 'font-sheet');

const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/** Off the default 4321 so a dev server already in use is left alone. */
const PORT = Number(process.env.FONT_SHEET_PORT || 4399);
const BASE = `http://localhost:${PORT}`;

/** Kept in step with CANDIDATES in src/components/FontPreview.astro. */
const FONTS = [
  ['system', 'System — today'],
  ['inter', 'Inter'],
  ['geist', 'Geist'],
  ['space-grotesk', 'Space Grotesk'],
  ['manrope', 'Manrope'],
  ['jakarta', 'Plus Jakarta Sans'],
  ['outfit', 'Outfit'],
  ['sora', 'Sora'],
  ['bricolage', 'Bricolage Grotesque'],
  ['instrument', 'Instrument Sans'],
  ['archivo', 'Archivo'],
];

/** Tall enough to carry the hero plus the line beneath it, which is where a
    face's body-copy behaviour actually shows. */
const W = 1440;
const H = 950;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForPreview(timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE);
      if (res.ok && (await res.text()).includes('fontbar')) return;
    } catch {
      /* not up yet */
    }
    await sleep(400);
  }
  throw new Error(`Preview server never came up on ${BASE}.`);
}

async function shoot(id, file) {
  await run(CHROME, [
    // The new headless is the one that shares the real renderer, and so the
    // real font stack. The old one shot system fallbacks for every panel.
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--window-size=${W},${H}`,
    // Fonts arrive over the network. Without a budget Chrome shoots before they
    // land and every panel comes out identical.
    '--virtual-time-budget=10000',
    `--screenshot=${file}`,
    `${BASE}/?font=${id}`,
  ]);
}

const digest = (f) => createHash('md5').update(readFileSync(f)).digest('hex');

async function main() {
  if (!existsSync(CHROME)) {
    throw new Error(`Google Chrome is required and was not at:\n  ${CHROME}`);
  }

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  console.log(`Starting a preview server on ${BASE}…`);
  const server = spawn('npx', ['astro', 'dev', '--port', String(PORT)], {
    cwd: ROOT,
    env: { ...process.env, PLOZZ_FONT_PREVIEW: '1' },
    stdio: 'ignore',
  });
  const stop = () => {
    if (!server.killed) server.kill('SIGTERM');
  };
  process.on('exit', stop);
  process.on('SIGINT', () => {
    stop();
    process.exit(130);
  });

  try {
    await waitForPreview();

    console.log(`Rendering ${FONTS.length} panels…\n`);
    const seen = new Map();
    const cells = [];

    for (const [id, label] of FONTS) {
      const file = path.join(OUT, `${id}.png`);
      await shoot(id, file);

      // A face that failed to load falls back to the system stack and produces
      // a pixel-identical panel. Silently shipping eleven copies of one
      // screenshot would be worse than failing.
      const sum = digest(file);
      const clash = seen.get(sum);
      if (clash) {
        throw new Error(
          `"${label}" rendered identically to "${clash}" — the webfont did not load.`
        );
      }
      seen.set(sum, label);

      console.log(`  ${label.padEnd(22)} ${path.basename(file)}`);
      cells.push(
        `<figure><img src="${id}.png" alt="${label}" width="${W}" height="${H}" loading="lazy" />` +
          `<figcaption>${label}</figcaption></figure>`
      );
    }

    await writeFile(
      path.join(OUT, 'index.html'),
      `<!doctype html>
<meta charset="utf-8" />
<title>Plozz — typeface candidates</title>
<style>
  body {
    margin: 0;
    padding: 40px clamp(16px, 4vw, 56px) 80px;
    background: #07080b;
    color: #fff;
    font: 15px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  h1 { font-size: 30px; letter-spacing: -0.02em; margin: 0 0 6px; }
  p.lede { margin: 0 0 40px; opacity: 0.5; font-size: 13px; }
  .grid {
    display: grid;
    gap: 34px;
    grid-template-columns: repeat(auto-fit, minmax(520px, 1fr));
  }
  figure { margin: 0; }
  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  figcaption {
    margin-top: 10px;
    font-size: 13px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.72;
  }
</style>
<h1>Typeface candidates</h1>
<p class="lede">Same page, same layout, eleven faces. Open any image on its own for full size.</p>
<div class="grid">${cells.join('')}</div>
`,
      'utf8'
    );

    console.log(`\nWrote to ${OUT}\n  open ${path.join(OUT, 'index.html')}`);
  } finally {
    stop();
  }
}

main().catch((err) => {
  console.error(`\n${err.message}\n`);
  process.exit(1);
});
