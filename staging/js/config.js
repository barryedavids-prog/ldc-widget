/* ==========================================================================
   CONFIG FILE - settings (not wording). Edited by the site owner.
   ========================================================================== */

window.LDC_CONFIG = {

  /* Where the "Book a free introductory call" button goes.
     Replace this placeholder with the real booking or contact page URL. */
  bookingUrl: "https://www.lianedavidscounselling.co.uk/home#contact",

  /* Breathing pause: seconds to breathe in, seconds to breathe out,
     and how many times to repeat. 4 + 6 seconds x 6 = one minute. */
  breathing: {
    inSeconds: 4,
    outSeconds: 6,
    cycles: 6
  },

  /* Start as a small collapsed box (see content.js: teaser) instead of
     opening straight onto the first screen. Useful for a busy page like
     the homepage; leave false for a page whose only job is the check-in.
     This can be overridden per embed without changing this file, by adding
     ?start=collapsed or ?start=open to the iframe's src URL in
     docs/squarespace-embed.html. */
  startCollapsed: false
};
