# Product

## Register

brand

## Users

People with personal media libraries who are evaluating Plozz as a native player for Apple TV, iPhone, and iPad. They may use Jellyfin, Plex, Emby, or connect directly to network storage.

## Product Purpose

Explain what Plozz supports, establish trust in the open-source project, and drive visitors to join the TestFlight beta or view the source on GitHub.

## Brand Personality

Dark, precise, and slightly dry. Plozz is a media player for people who care about
settings, so the site should sound like it was written by the person who built it.
The Plozz logo keeps its pixel-art identity; everything else is modern Apple-like
interface chrome.

## Anti-references

Gradient-heavy SaaS pages, dense marketing-section stacks, excessive accent colors, glassmorphism, generic card grids, and navigation or copy that distracts from the primary actions.

## Design Principles

- Give each viewport one dominant idea.
- Use rich black, white, and neutral gray as the foundation.
- Reserve color for authentic brand artwork, the Plozz logo light, and primary actions.
- Keep pixel art in the Plozz artwork; use modern Apple-like interface chrome everywhere else.
- Distinguish media-server support from direct network-share support.
- Use authentic provider assets without altering their artwork.
- Make every visible word earn its place; prefer short labels over explanatory copy.
- Vary section treatment by importance instead of repeating the same container pattern.
- Round every surface. The radius scale is --r-xl / --r-lg / --r-md / --r-sm / --r-pill.
- Quote the app's real option names instead of describing them. "Toasty" beats "warmth control".
- Follow the natural-writing rules: no promotional verbs, no rule of three, no false
  ranges, sparing em dashes, sentence case headings.

## Claims we must not make

- Trakt. It is being removed from the app.
- Music playback of any kind, including Last.fm scrobbling.
- "Ratings with no API key." Only AniList is keyless. IMDb, Rotten Tomatoes and
  Metacritic need the user's own OMDb key.
- "Professionally localized." The 36 languages ship, but they are machine
  translated and machine reviewed, and every string is tagged needs_review.
- Sign-in flows as a selling point. Quick Connect, Plex Link and discovery are
  real, but people set them up once and never think about them again. Lead with
  what someone touches every session.

## Verified against source

Audited at thatcube/Plozz commit 8d12bbc. Targets are Plozz (tvOS 18),
PlozziOS (iOS 18, iPhone and iPad) and PlozzTopShelf. Downloads, Picture in
Picture and AirPlay are iOS only. Top Shelf and the sidebar/top-bar navigation
choice are tvOS only.

## Accessibility & Inclusion

Maintain WCAG AA contrast for body text and controls, semantic structure and image alternatives, visible keyboard focus, and reduced-motion behavior.
