#!/usr/bin/env node
/**
 * Pulls freshly captured screenshots out of the Plozz app repo and re-encodes
 * the site's images from them.
 *
 * The masters in screenshots-src/ used to be captured by hand off a real Apple
 * TV with a capture card, which is why they went stale: refreshing one meant
 * setting up hardware. Plozz can now photograph itself — `tools/capture-shots.sh`
 * in the app repo drives a Simulator to each screen by name and writes lossless
 * PNGs at native device resolution — so keeping the site current is a copy plus
 * a re-encode, and that is what this does.
 *
 * The capture script deliberately names its output after the site's masters, so
 * this needs no mapping table. A capture that has no counterpart here is
 * reported and skipped rather than silently added: a new master only earns a
 * place on the site once something renders it.
 *
 *   node tools/sync-shots.mjs                 # copy changed masters, re-encode
 *   node tools/sync-shots.mjs --from DIR      # non-default capture directory
 *   node tools/sync-shots.mjs --dry-run       # show what would change
 *   node tools/sync-shots.mjs --adopt         # also take captures we don't have
 *
 * Requires the app repo to have produced captures already:
 *   cd ../Plozz && ./tools/capture-shots.sh
 */

import { copyFile, mkdir, readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import os from 'node:os';

const run = promisify(execFile);

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC_DIR = path.join(ROOT, 'screenshots-src');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const adopt = args.includes('--adopt');
const fromIndex = args.indexOf('--from');

/**
 * Where the app repo leaves its captures. Checked in order; the first that
 * exists wins. A worktree of the app repo is included because that is how the
 * app is usually checked out.
 */
const DEFAULT_SOURCES = [
  path.resolve(ROOT, '..', 'Plozz', 'build', 'shots'),
  path.resolve(os.homedir(), 'Development', 'Plozz', 'build', 'shots'),
];

function resolveSource() {
  if (fromIndex !== -1) {
    const explicit = args[fromIndex + 1];
    if (!explicit) throw new Error('--from needs a directory');
    return path.resolve(explicit);
  }
  const found = DEFAULT_SOURCES.find((dir) => existsSync(dir));
  if (!found) {
    throw new Error(
      'No capture directory found. Run ./tools/capture-shots.sh in the Plozz ' +
        'repo first, or pass --from DIR.\nLooked in:\n  ' +
        DEFAULT_SOURCES.join('\n  ')
    );
  }
  return found;
}

async function sha256(file) {
  return createHash('sha256').update(await readFile(file)).digest('hex');
}

async function dimensions(file) {
  const { stdout } = await run('magick', ['identify', '-format', '%wx%h', file]);
  return stdout.trim();
}

/** Rounded so a 2048x2732 and a 2064x2752 iPad master count as the same shape. */
function aspectOf(size) {
  const [width, height] = size.split('x').map(Number);
  return (width / height).toFixed(2);
}

async function main() {
  const source = resolveSource();
  const captures = (await readdir(source))
    .filter((name) => name.endsWith('.png') && !name.startsWith('.'))
    .sort();

  if (captures.length === 0) {
    throw new Error(`No screenshots in ${source}`);
  }

  await mkdir(SRC_DIR, { recursive: true });
  const existing = new Set(
    (await readdir(SRC_DIR)).filter((name) => name.endsWith('.png'))
  );

  const copied = [];
  const unchanged = [];
  const skipped = [];
  const reshaped = [];

  for (const name of captures) {
    const from = path.join(source, name);
    const to = path.join(SRC_DIR, name);

    if (!existing.has(name) && !adopt) {
      skipped.push(name);
      continue;
    }

    if (existing.has(name) && (await sha256(from)) === (await sha256(to))) {
      unchanged.push(name);
      continue;
    }

    const size = await dimensions(from);

    // A capture may only replace a master of the same shape. The site sizes
    // every image from its master's aspect — `sizes` strings, device frames,
    // the marquee's fixed-height tiles — so a portrait capture landing on a
    // landscape master does not look wrong in this directory, it looks wrong
    // three layouts away. The iPad masters are landscape and the iPad simulator
    // captures portrait, which is exactly this case.
    if (existing.has(name)) {
      const before = await dimensions(to);
      if (aspectOf(before) !== aspectOf(size)) {
        reshaped.push({ name, before, after: size });
        continue;
      }
    }
    const bytes = (await stat(from)).size;
    if (!dryRun) await copyFile(from, to);
    copied.push({ name, size, bytes });
  }

  console.log(`Captures in ${path.relative(ROOT, source) || source}\n`);
  for (const { name, size, bytes } of copied) {
    console.log(
      `  ${dryRun ? 'would update' : 'updated'}  ${name.padEnd(28)} ${size}  ${(bytes / 1e6).toFixed(1)} MB`
    );
  }
  if (unchanged.length) console.log(`\n  ${unchanged.length} unchanged`);
  if (reshaped.length) {
    console.log(
      `\n  ${reshaped.length} capture(s) refused — a different shape to the master they would replace.`
    );
    console.log('  The site sizes its layouts from these, so swapping them breaks pages elsewhere:');
    for (const { name, before, after } of reshaped) {
      console.log(`    ${name.padEnd(28)} master ${before}  capture ${after}`);
    }
  }
  if (skipped.length) {
    console.log(
      `\n  ${skipped.length} capture(s) the site has no master for — pass --adopt to take them:`
    );
    for (const name of skipped) console.log(`    ${name}`);
  }

  if (copied.length === 0) {
    console.log('\nNothing to re-encode.');
    return;
  }
  if (dryRun) {
    console.log('\n--dry-run: nothing written.');
    return;
  }

  console.log('\nRe-encoding…\n');
  await run('node', [path.join(ROOT, 'tools', 'build-images.mjs')], {
    stdio: 'inherit',
  }).then(({ stdout }) => process.stdout.write(stdout));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
