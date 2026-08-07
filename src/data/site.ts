export const GITHUB_URL = 'https://github.com/thatcube/Plozz';
export const DONATE_URL = 'https://github.com/sponsors/thatcube';
export const TESTFLIGHT_URL = 'https://testflight.apple.com/join/EKfReNMu';
export const SITE = 'https://plozz.app';
export const GITHUB_STARS_SEED = 7;

export const NAV_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/formats', label: 'Formats' },
  { href: '/network-shares', label: 'Network shares' },
];

export const SERVER_LINKS = [
  { href: '/jellyfin', label: 'Jellyfin' },
  { href: '/plex', label: 'Plex' },
  { href: '/emby', label: 'Emby' },
];

/**
 * Read from AetherEngine's format matrix and its documented limitations.
 * https://github.com/superuser404notfound/AetherEngine/blob/main/docs/formats.md
 * Nothing here is claimed beyond what those docs support.
 */
export const HEADLINE_BADGES = [
  { label: 'Dolby Vision', value: 'P5 · P7 · P8.1 · P8.4' },
  { label: 'HDR', value: 'HDR10 · HDR10+ · HLG' },
  { label: 'Dolby Atmos', value: 'Stream-copied' },
  { label: 'Video', value: 'HEVC · H.264 · AV1 · VP9' },
  { label: 'Lossless audio', value: 'TrueHD · DTS-HD MA' },
  { label: 'Discs', value: 'DVD · Blu-ray ISO' },
];

export const FORMAT_TABLE = [
  {
    group: 'Video',
    rows: [
      { name: 'HEVC / H.265', note: 'Main and Main10, hardware decoded' },
      { name: 'H.264 / AVC', note: 'Including interlaced and High 4:2:2, 4:4:4 and 10-bit' },
      { name: 'AV1', note: 'Hardware where the chip has it, software everywhere else' },
      { name: 'VP9 and VP8', note: '' },
      { name: 'MPEG-2', note: 'DVD rips and broadcast recordings' },
      { name: 'MPEG-4 Part 2', note: 'XVID and DIVX' },
      { name: 'VC-1', note: '' },
    ],
  },
  {
    group: 'High dynamic range',
    rows: [
      { name: 'Dolby Vision Profile 5', note: '' },
      { name: 'Dolby Vision Profile 7', note: 'Converted to Profile 8.1 during playback, which Apple hardware cannot do alone' },
      { name: 'Dolby Vision Profile 8.1 and 8.4', note: '' },
      { name: 'Dolby Vision on AV1', note: 'Profiles 10.1 and 10.4' },
      { name: 'HDR10', note: '' },
      { name: 'HDR10+', note: 'Per-frame ST 2094-40 metadata passed through' },
      { name: 'HLG', note: '' },
    ],
  },
  {
    group: 'Audio',
    rows: [
      { name: 'Dolby Atmos', note: 'E-AC-3 with JOC, copied without re-encoding' },
      { name: 'Dolby TrueHD and MLP', note: 'Decoded on device to surround or lossless FLAC' },
      { name: 'DTS, DTS-HD MA', note: 'Decoded on device to surround or lossless FLAC' },
      { name: 'E-AC-3 and AC-3', note: 'Copied without re-encoding' },
      { name: 'FLAC and ALAC', note: 'Copied without re-encoding' },
      { name: 'AAC, HE-AAC, HE-AACv2', note: '' },
      { name: 'MP3, MP2, Opus, Vorbis, PCM', note: '' },
      { name: '5.1 and 7.1', note: 'Channel layout preserved' },
    ],
  },
  {
    group: 'Subtitles',
    rows: [
      { name: 'SRT, ASS, SSA, WebVTT', note: 'Styling and positioning honoured' },
      { name: 'PGS', note: 'Blu-ray image subtitles, rendered on device' },
      { name: 'DVB and DVD', note: 'Image subtitles' },
      { name: 'CEA-608', note: 'Broadcast closed captions, including captions buried in the video stream' },
      { name: 'DVB teletext', note: 'Broadcaster colours preserved' },
      { name: 'Sidecar files', note: 'Picked up from the same folder or a Subs folder beside it' },
    ],
  },
  {
    group: 'Containers and sources',
    rows: [
      { name: 'MKV', note: '' },
      { name: 'MP4 and MOV', note: '' },
      { name: 'WebM, AVI, OGG, FLV', note: '' },
      { name: 'MPEG-TS', note: 'Including live broadcast' },
      { name: 'DVD and Blu-ray images', note: 'Decrypted ISO, with titles and chapters' },
    ],
  },
];

/** Stated plainly, because a support list nobody can trust is worth nothing. */
export const FORMAT_CAVEATS = [
  {
    name: 'TrueHD Atmos loses its object metadata',
    note: 'The surround bed and channel layout survive. Atmos objects only pass through untouched from E-AC-3 sources.',
  },
  {
    name: 'AV1 is software decoded on Apple TV',
    note: 'No Apple TV chip has AV1 in hardware yet. It plays, but it works the processor harder than HEVC does.',
  },
  {
    name: 'Dolby Vision Profile 7 becomes Profile 8.1',
    note: 'The enhancement layer is dropped, which no Apple device could decode anyway. You get Dolby Vision instead of the HDR10 fallback.',
  },
];

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
