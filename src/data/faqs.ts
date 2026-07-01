// Shared FAQ source of truth. Rendered visibly by SavedSections.astro and also
// emitted as FAQPage JSON-LD in index.astro — keep them driven by this one list
// so the structured data always matches the visible content (a Google
// requirement for FAQ rich results).

export const GITHUB_URL = 'https://github.com/thatcube/Plozz';

export interface Faq {
  q: string;
  /** May contain HTML (rendered with set:html in the visible list). */
  a: string;
}

export const faqs: Faq[] = [
  {
    q: 'Is Plozz really free?',
    a: 'Yes. Plozz is free software, licensed under the GPL-3.0 and open source — no subscriptions, no ads, no upsells. If it\u2019s useful to you, sponsorship is welcome but never required.',
  },
  {
    q: 'Do I need my own server?',
    a: 'Yes. Plozz is a player for a Jellyfin or Plex server that you run. It doesn\u2019t host, provide, or stream any media itself.',
  },
  {
    q: 'Does Plozz collect my data or track me?',
    a: 'No accounts and no analytics. Your credentials live in the Apple TV Keychain and are only ever sent to your own server.',
  },
  {
    q: 'How do I install it?',
    a: 'Join the Apple TV TestFlight beta to install it today. A public App Store release is planned after the beta.',
  },
  {
    q: 'Will there be an iPhone or iPad app?',
    a: 'Maybe. tvOS is the focus today, but the codebase is structured so iOS and iPadOS are possible later. No promises yet.',
  },
  {
    q: 'Jellyfin or Plex \u2014 which should I use?',
    a: 'Either. Plozz treats both the same, so just use whichever server you already run.',
  },
  {
    q: 'I found a bug or want a feature.',
    a: `Open an issue on <a href="${GITHUB_URL}/issues" target="_blank" rel="noopener">GitHub</a> \u2014 that\u2019s the best place to report bugs and request features.`,
  },
];

/** Strip HTML tags for plain-text contexts (e.g. JSON-LD answers). */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}
