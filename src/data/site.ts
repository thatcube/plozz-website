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
 * Every claim below was read out of the Plozz source, so the option names and
 * counts match what a person actually sees in Settings.
 */
export const CONTROL_ROWS = [
  {
    label: 'Warmth',
    detail: 'Circadian mode',
    options: ['None', 'Kinda Warm', 'Warm', 'Toasty', 'Roasting', 'On Fire'],
    active: 3,
  },
  {
    label: 'Darkness',
    detail: 'Circadian mode',
    options: ['None', 'Low', 'Sorta Dark', 'Dark', 'Squinting', 'Can’t See'],
    active: 2,
  },
  {
    label: 'Subtitle font',
    detail: '7 faces',
    options: ['Atkinson Hyperlegible', 'System', 'SF Rounded', 'Roboto', 'Lexend', 'Fredoka', 'OpenDyslexic'],
    active: 0,
  },
  {
    label: 'Density',
    detail: '10 columns down to 5',
    options: ['Micro', 'Tiny', 'Small', 'Default', 'Large', 'Huge'],
    active: 3,
  },
  {
    label: 'Rewind on resume',
    detail: '17 steps',
    options: ['0s', '1s', '2s', '3s', '5s', '10s', '20s', '45s', '60s'],
    active: 4,
  },
];
