export const GITHUB_URL = 'https://github.com/thatcube/Plozz';
export const DONATE_URL = 'https://github.com/sponsors/thatcube';
export const TESTFLIGHT_URL = 'https://testflight.apple.com/join/EKfReNMu';
export const SITE = 'https://plozz.app';
export const GITHUB_STARS_SEED = 7;

export const NAV_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/network-shares', label: 'Network shares' },
];

export const SERVER_LINKS = [
  { href: '/jellyfin', label: 'Jellyfin' },
  { href: '/plex', label: 'Plex' },
  { href: '/emby', label: 'Emby' },
];

/**
 * Read from AetherEngine's own format matrix, the engine Plozz plays through.
 * https://github.com/superuser404notfound/AetherEngine/blob/main/docs/formats.md
 * The three marquee formats carry what they mean for the viewer; the long tail
 * is one quiet line, because nobody chose a player over VC-1 support.
 */
export const MARQUEE_FORMATS = [
  {
    name: 'Dolby Vision',
    claim: 'Including Profile 7',
    detail: 'The profile a UHD Blu-ray remux uses. No Apple device can decode it, so Plozz converts it as it plays.',
  },
  {
    name: 'HDR10+',
    claim: 'Per-frame metadata',
    detail: 'The scene-by-scene tone curves survive the trip to your TV instead of being flattened to static HDR10.',
  },
  {
    name: 'Dolby Atmos',
    claim: 'Never re-encoded',
    detail: 'E-AC-3 with JOC is copied through untouched, so your receiver lights up the Atmos indicator.',
  },
];

export const LONG_TAIL =
  'H.264, HEVC, AV1, VP9, VP8, MPEG-2, MPEG-4, VC-1, XVID, HLG, TrueHD, DTS-HD MA, DTS, AC-3, FLAC, ALAC, AAC, Opus, PCM, SRT, ASS, PGS, DVB, DVD, teletext, CEA-608, MKV, MP4, WebM, MPEG-TS, AVI, and DVD and Blu-ray images.';

/**
 * Verified against firecore.com/infuse and emby.media's Premiere feature matrix
 * on 2026-08-07. Only claims with a primary source are listed. Plex's remote
 * streaming policy and Infuse's Dolby Vision tier could not be verified, so
 * neither appears here.
 */
export const PAYWALLED = [
  { feature: 'Dolby Atmos', who: 'Infuse Pro' },
  { feature: 'TrueHD and DTS-HD MA', who: 'Infuse Pro' },
  { feature: 'AirPlay', who: 'Infuse Pro' },
  { feature: 'Library sync across devices', who: 'Infuse Pro' },
  { feature: 'Offline downloads', who: 'Plex Pass and Emby Premiere' },
  { feature: 'Subtitle search in the player', who: 'Emby Premiere' },
  { feature: 'Playing past one minute on iPhone', who: 'Emby' },
];

// GitHub Sponsors prefills its checkout from these, so one tap is one donation.
export const DONATION_AMOUNTS = [3, 5, 10, 25];
