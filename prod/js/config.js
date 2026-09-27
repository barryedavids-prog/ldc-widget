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
  startCollapsed: false,

  /* Anonymous usage counts: how many visits open the check-in, how far they
     get, whether they finish, try the breathing pause or click a link.
     Never which answers were chosen, and nothing about who the visitor is.
     Uses GoatCounter (goatcounter.com): no cookies, nothing stored on the
     visitor's device. To switch it on, put your GoatCounter code here (the
     "yourcode" part of yourcode.goatcounter.com). Leave it "" to switch it off.
     Only the live /prod/ copy sends counts, so testing staging doesn't muddy
     the numbers (staging just lists them in the browser console instead). */
  goatcounterCode: "barrydavids"
};
