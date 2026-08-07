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
- Demonstrate a setting, do not list it. A page of option names is raw data, not
  design. Lead with the question a person arrives with, answer it in one line,
  then show the thing working.
- Real option names belong inside a demo, not in a table of their own.
- A grid of identical chips is a data dump wearing rounded corners. On the home
  page, show a short row of two-tone badges (the shape used in the Plozz README)
  and send anyone who wants the full list to /formats.
- Reference material belongs on its own page. A list nobody reads in a marketing
  section is a page that ranks on its own.
- Subtext must change the answer. If a line only restates the heading, cut it.
- One keyline. Text inside a panel sits on the same vertical line as text
  outside one, so panels pull outward by their own inset plus their border
  rather than sitting inside the text column. --panel-inset owns both numbers,
  and no panel should ever set padding-inline directly.
- Interactive things need a 44px tap target. Give it with padding and pull the
  box back with a negative margin, so the visible mark stays on the column.
- The Plozz mark's antennas carry almost no visual weight, so its solid body
  reads about 2px below the box centre. Lift the image, not the text.
- Follow the natural-writing rules: no promotional verbs, no rule of three, no false
  ranges, sparing em dashes, sentence case headings.
- Use contractions. Copy without them reads like a machine wrote it.
- Vary sentence length. Never three of the same length in a row, and let a short
  one land after a long one.
- Don't explain your own homework. "Profile 7" is enough for anyone who owns
  those files; "the profile a UHD Blu-ray remux uses" is a lecture.
- The donate section speaks as Brandon, in first person, because a person is
  doing the asking. Everywhere else addresses the reader as you.
- Never justify the donation ask. Listing what the money pays for reads as an
  invoice, so stay vague about costs, keep the ask conditional, and always say
  the app is free either way. Brandon's own GitHub Sponsors wording is the
  reference for tone: warm, humble, and easy to walk past.

## Never name a competitor's price

Say what Plozz does and that it is free. Do not name another app's paid tier,
do not frame a feature as "they charge for this", and do not run a comparison
table. It reads as punching sideways, it puts someone else's brand on our
page, and it goes stale the moment they change their pricing. The features are
the argument on their own.

## Competitor research, for our own reference only, verified 2026-08-07

Infuse Pro ($1.99/mo, $16.99/yr, $99.99 lifetime) gates Dolby Atmos, TrueHD and
DTS-HD MA, AirPlay, cloud storage and library sync. Emby's iPhone app stops
after one minute without an unlock or Premiere, and gates downloads and
in-player subtitle search. Plex Pass gates offline downloads. Jellyfin is fully
free. Infuse's Dolby Vision tier and Plex's remote-streaming policy could not be
verified from a primary source, so neither is claimed anywhere on the site.

## Claims we must not make

- Trakt. It is being removed from the app.
- Music playback of any kind, including Last.fm scrobbling.
- "Ratings with no API key." Only AniList is keyless. IMDb, Rotten Tomatoes and
  Metacritic need the user's own OMDb key.
- "Atmos passthrough" without qualification. E-AC-3 with JOC is stream-copied and
  is real Atmos. TrueHD Atmos is bridged and loses its object metadata, so say
  where Atmos comes from rather than implying every source survives.
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
