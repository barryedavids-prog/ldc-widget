# A gentle check-in: embeddable reflection widget

A short, private reflection tool ("Is counselling right for me?") followed by an
optional one-minute breathing pause, crisis signposting, and a soft invitation to
book an introductory call. Plain HTML, CSS and JavaScript. No build step, no
frameworks, no cookies. Nothing a visitor chooses is stored or sent anywhere.
The only outside request is optional anonymous usage counting (see below).

## What's where

| Path | Purpose |
|---|---|
| `staging/` | The version you work on and test. Embedded on the hidden test page. |
| `prod/` | The live version. Only ever changed by `promote.ps1`. Embedded on the live page. |
| `staging/js/content.js` | **All wording.** The counsellor edits this. |
| `staging/js/config.js` | Settings: booking URL, breathing timings, usage counting. |
| `staging/css/styles.css` | Look and feel. Brand colours and fonts are variables at the top. |
| `staging/js/app.js` | The logic. Shouldn't need editing for wording changes. |
| `docs/squarespace-embed.html` | The snippet to paste into a Squarespace Code Block. |
| `docs/embed-test.html` | A local fake "Squarespace page" to test auto-resizing. |
| `serve.ps1` / `promote.ps1` | Local preview / staging-to-prod promotion. |

## 1. Editing the wording

Open `staging/js/content.js`. Change text between the quote marks. Keep the quote
marks and the commas at the end of lines. Use an apostrophe (`'`) rather than a
double quote inside a sentence. The file's comments explain each section.

The **booking link** is in `staging/js/config.js` (`bookingUrl`).

**Collapsed teaser box:** for a busy page like the homepage, the widget can start
as a small box with a short question and a button, expanding to the full check-in
when clicked (crisis/safety links appear once expanded, not on the collapsed box).
Wording is `content.js` (`teaser`). Turn it on for every embed by setting
`config.js` (`startCollapsed: true`), or per embed by adding `?start=collapsed`
(or `?start=open` to force it off) to the end of the iframe's `src` URL in
`docs/squarespace-embed.html`.

**Brand colours and fonts:** the variables at the top of `staging/css/styles.css`.
Check text/background pairs stay readable (4.5:1 contrast) with a contrast checker.
Fonts are system fonts on purpose: a font loaded from Google Fonts or Squarespace
would be a third-party request. To use a specific font, put the font file in the
repo and load it with `@font-face`.

## 2. Testing locally

```powershell
.\serve.ps1
```

Then open:
- http://localhost:8000/staging/ : the widget on its own
- http://localhost:8000/docs/embed-test.html : inside a fake page, to check resizing

Stop with Ctrl+C. Things to check: work through with the keyboard only (Tab, Space,
Enter), try a narrow phone-width window, and turn on "reduce motion" in your OS
settings to see the breathing circle stop animating.

## 3. Saving your work (git)

```powershell
git status                     # what has changed?
git add staging                # stage the changes
git commit -m "Reword intro"   # save a snapshot with a short, clear message
git push                       # upload to GitHub
```

Pushing `staging/` updates the staging URL within a minute or two.

## 4. Promoting staging to production

When staging looks right on the hidden Squarespace test page:

```powershell
git status                     # should be clean (everything committed)
.\promote.ps1                  # copies staging over prod and commits
git push                       # makes it live
```

The script refuses to run if `staging/` has uncommitted changes, so prod always
matches a saved version. To undo a bad promotion: `git revert HEAD`, then `git push`.

## 5. Embedding in Squarespace

1. Edit the page, add a **Code** block, and untick "Display Source".
2. Paste `docs/squarespace-embed.html`, replacing `YOUR-USERNAME` and `YOUR-REPO`
   (twice) and choosing `/staging/` (test page) or `/prod/` (live page).
3. Save. The frame resizes itself as visitors move through the screens.

Squarespace only runs JavaScript in Code Blocks on plans that allow it (check your
plan). Without it the frame still shows, but won't auto-resize.

## 6. Usage counts (GoatCounter)

The widget can count, anonymously, how visits move through it, so you can see
what gets used and where people drop off. It never records which answers were
chosen or anything about who the visitor is: no cookies, nothing stored on their
device, no IDs.

To switch it on:
1. Sign up at https://www.goatcounter.com (free for small sites). Choose a code,
   e.g. `ldc-checkin`, which gives you `ldc-checkin.goatcounter.com`.
2. Put that code in `staging/js/config.js` (`goatcounterCode: "ldc-checkin"`),
   commit, promote and push.
3. Only the live `/prod/` copy sends counts. On staging and localhost the events
   are listed in the browser console (F12 > Console, lines starting `[ldc count]`)
   so you can check them without muddying the numbers.

Each event counts at most once per visit, so read the totals as "how many visits
got this far". In the GoatCounter dashboard they appear as:

| Event | Meaning |
|---|---|
| `viewed` / `viewed-teaser` | The widget loaded (open, or as the collapsed box) |
| `teaser-opened` | Collapsed box expanded |
| `started` | "Begin" pressed |
| `question-1` ... `question-6` | Reached that question |
| `finished` | Reached the results |
| `breathing-started` / `breathing-completed` | Breathing pause begun / run to the end |
| `booking-clicked` | Booking button clicked |
| `crisis-samaritans-clicked`, `crisis-nhs-111-clicked`, `crisis-999-clicked` | Crisis phone link tapped |
| `restarted` | "Start again" pressed |

Example: `started` 40, `question-4` 30, `finished` 25 means most who begin finish,
and a quarter of them drop off by question 4.

Mention anonymous visit counting (via GoatCounter) in the website's privacy policy.

## Privacy and safety notes

- A Content-Security-Policy in `index.html` makes the browser block any request to
  other sites except GoatCounter, so nothing else can sneak in.
- Messages sent out: the widget's height (a number) to the parent page, and, if
  switched on, the anonymous event names above to GoatCounter.
- Crisis signposting (Samaritans 116 123, NHS 111, 999) is shown on every screen,
  including all results. Please re-check the details in `content.js` occasionally.
- The wording avoids diagnosis, scores and labels. Keep it that way when editing.
