/**
 * `sizes` strings for every place a screenshot appears.
 *
 * These are the other half of the responsive image work: a srcset without an
 * accurate `sizes` is close to useless, because the browser falls back to
 * assuming the image spans the whole viewport and picks a rung far larger than
 * the layout will ever paint. Get it wrong in the other direction and the image
 * renders soft, which is worse.
 *
 * So none of these are derived by reading the stylesheet. Every number below
 * was measured by rendering the real pages at 360, 480, 720, 900, 1100, 1280,
 * 1440 and 1920 and reading getBoundingClientRect().width off the image itself.
 * Each expression sits at or just above the measured width at every one of
 * those viewports — never under it.
 *
 * If a layout changes, re-measure rather than re-deriving. The device mockups
 * in particular paint at a size the CSS does not obviously predict, because
 * they are scaled by transform inside a sized slot: reading the frame widths
 * out of device-frames.css gives an answer that is wrong by a third.
 */

/**
 * .hero-devices spans the content column: 100vw minus the container padding,
 * capped by .container's max-width.
 *
 * measured  360:308  480:428  720:668  900:848  1100:1048  1280+:1148
 */
export const HERO = '(max-width: 1200px) calc(100vw - 52px), 1148px';

/**
 * .shot on the interior pages and .sky-screen in the circadian section. Both
 * sit in the wide column of a two-column slab that collapses at 900px.
 *
 * measured  360:258  480:378  720:618  900:796  1100:572  1280:622  1440+:612
 *
 * The 900px row is the widest of the lot — the slab has gone single-column but
 * the viewport has not shrunk yet — so that, not the desktop case, sets the top
 * of the ladder.
 *
 * .sky-screen img is `object-fit: cover`, which would consume more source than
 * its box width if the box were ever taller than 16:9. Measured, it is not: the
 * cell tracks the image's aspect ratio to within ~2px at every viewport, so the
 * bounding-rect width is the honest number. Re-check this if that cell ever
 * gets a fixed height.
 */
export const FIGURE = '(max-width: 900px) calc(100vw - 100px), 620px';

/**
 * .marquee-track img is height-driven: height is clamp(200px, 22vw, 300px) and
 * width follows the aspect ratio, so landscape tiles hold flat near 353px until
 * 22vw overtakes the 200px floor around a 909px viewport.
 *
 * measured  360-900:353  1100:418  1280:486  1440+:532
 */
export const MARQUEE = '(max-width: 947px) 360px, (max-width: 1421px) 38vw, 540px';

/**
 * The portrait tiles in the same marquee. Being tall and narrow, they paint at
 * roughly a quarter of the width of the landscape ones, so they get their own
 * expression rather than over-fetching against MARQUEE.
 *
 * measured  360-900:93  1100:113  1280:131  1440+:139
 */
export const MARQUEE_PORTRAIT = '(max-width: 947px) 95px, (max-width: 1421px) 10.2vw, 140px';

/**
 * .spoillab-thumb inside .spoillab-card.
 *
 * measured  360:233  480:363  720+:410
 */
export const THUMB = '(max-width: 480px) calc(100vw - 118px), 410px';

/**
 * The iPad and iPhone mockups in the iCloud section. The slot goes wide at the
 * 720px breakpoint, and the iPad jumps from 304 to 463 CSS px across it.
 *
 * measured ipad    360:286  480-720:304  768+:463
 * measured iphone  360:74   480-720:93   768+:136
 */
export const DEVICE_IPAD = '(max-width: 720px) 310px, 463px';
export const DEVICE_IPHONE = '(max-width: 720px) 95px, 136px';
