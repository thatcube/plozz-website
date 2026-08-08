import manifest from './screenshots.json';

export interface ShotRung {
  w: number;
  avif: string;
  webp: string;
}

export interface ShotEntry {
  /** Intrinsic size of the widest rung, used for the <img> width/height. */
  width: number;
  height: number;
  rungs: ShotRung[];
}

const shots = manifest as Record<string, ShotEntry>;

export function shot(name: string): ShotEntry {
  const entry = shots[name];
  if (!entry) {
    throw new Error(
      `No screenshot named "${name}". Run \`npm run images\` after adding a master to screenshots-src/.`
    );
  }
  return entry;
}

/**
 * Filenames carry a build-input hash, so they are safe to serve as immutable
 * and are never hand-written — tools/build-images.mjs puts them in the manifest
 * and everything here reads them back out.
 */
export function shotSrcset(name: string, extension: 'avif' | 'webp'): string {
  return shot(name)
    .rungs.map((rung) => `/screenshots/${rung[extension]} ${rung.w}w`)
    .join(', ');
}

/** The widest rung, used as the plain <img> fallback inside <picture>. */
export function shotFallback(name: string, extension: 'avif' | 'webp' = 'webp'): string {
  const { rungs } = shot(name);
  return `/screenshots/${rungs[rungs.length - 1][extension]}`;
}
