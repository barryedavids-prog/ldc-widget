/* ==========================================================================
   CONTENT FILE - all the wording lives here.

   For the counsellor reviewing this: you can change any text between the
   quote marks ("like this"). Please keep the quote marks, and the commas
   at the ends of lines, exactly as they are. If a sentence needs a quote
   mark inside it, use an apostrophe (') rather than a double quote (").

   Nothing in this file is stored or sent anywhere. It is only shown on the
   page.
   ========================================================================== */

window.LDC_CONTENT = {

  /* ---- Teaser (the small collapsed box, shown instead of the opening
     screen when the widget starts collapsed - see config.js). Keep this
     short: it's meant to declutter a busy page like the homepage. Clicking
     the button reveals the opening screen below. ---- */
  teaser: {
    heading: "Not sure if counselling's right for you?",
    body: "A short, private check-in can help you reflect on how things have been feeling lately. It takes about 2 minutes.",
    button: "Start the check-in"
  },

  /* ---- Opening screen ---- */
  intro: {
    title: "Take a moment to check in",
    body: [
      "Life can feel 'a lot' sometimes.",
      "This isn't a test. There are no right or wrong answers. It takes about 2 minutes to do."
    ],
    privacy: "Everything stays on your device. Nothing you choose here is saved, sent or tracked.",
    startButton: "Begin"
  },

  /* ---- Questions ----
     "prompt" is shown above every statement.
     "statements" are the things to reflect on, one per screen.
     "reflection" is a kind sentence that may appear in the results if the
     visitor felt this statement was true for them.
     You can add, remove or reorder questions freely (about 5 to 8 works well). */
  questions: {
    prompt: "In the last 2 weeks, how true does this feel for you?",
    options: [
      { label: "Not really", points: 0 },
      { label: "Sometimes",  points: 1 },
      { label: "Often",      points: 2 }
    ],
    unansweredHint: "There is no right or wrong answer",
    items: [
      {
        statement: "I've been feeling overwhelmed or stretched thin.",
        reflection: "Feeling overwhelmed can make even small things seem like a lot."
      },
      {
        statement: "My mind keeps going over the same worries, especially in quiet moments.",
        reflection: "A busy mind that struggles to switch off can be really tiring."
      },
      {
        statement: "I find it hard to talk openly about how I'm really feeling.",
        reflection: "It can be hard to put feelings into words, even with the people closest to us."
      },
      {
        statement: "I feel like I'm coping on my own more than I'd like to be.",
        reflection: "Carrying things alone for a long time can feel very heavy."
      },
      {
        statement: "Something in my life has changed, or is changing, and I'm finding it hard to adjust.",
        reflection: "Change, even when it's expected, can shake our sense of steadiness."
      },
      {
        statement: "I've been putting my own needs last.",
        reflection: "Looking after everyone else can leave very little room for you."
      }
    ],
    backButton: "Back",
    nextButton: "Next",
    finishButton: "See my reflection",
    progressLabel: "Question {current} of {total}"
  },

  /* ---- Result messages ----
     Which message appears depends on how the visitor answered. No score or
     label is ever shown to them. "minPoints" is the lowest total (Not really = 0,
     Sometimes = 1, Often = 2, added up) at which that message is used. With six
     questions the total runs from 0 to 12. Keep the first one at 0. */
  results: {
    reflectionsHeading: "Some things you told us",
    bands: [
      {
        minPoints: 0,
        title: "It sounds like you're holding steady",
        body: [
          "Your answers suggest things feel fairly manageable at the moment, and that's worth noticing.",
          "You don't have to be struggling to benefit from counselling. It can simply be a space to think, check in with yourself and look after your wellbeing."
        ]
      },
      {
        minPoints: 4,
        title: "It sounds like there's a fair bit on your plate",
        body: [
          "Your answers suggest some things have been weighing on you, and that's completely understandable.",
          "Talking with someone who listens without judgement can help you make a bit more sense of it all. You don't have to wait until things feel unmanageable."
        ]
      },
      {
        minPoints: 8,
        title: "It sounds like you've been carrying a lot",
        body: [
          "Thank you for taking the time to reflect. Your answers suggest things have been hard for a while, and it takes care and courage to notice that.",
          "You don't have to work it all out alone. Counselling can offer a steady, confidential space where you're listened to at your own pace."
        ]
      }
    ],
    disclaimer: "This reflection isn't a diagnosis or an assessment. It's just a gentle prompt, and only you know what's right for you.",
    restartButton: "Start again"
  },

  /* ---- Breathing pause (shown on the results screen) ---- */
  breathing: {
    heading: "Would a minute to breathe help first?",
    intro: "A slow breath out can help your body settle. Follow the circle, or just the words.",
    startButton: "Take a one-minute breathing pause",
    stopButton: "Stop",
    againButton: "Do it again",
    breatheIn: "Breathe in…",
    breatheOut: "Breathe out…",
    done: "Notice how you feel now.",
    stopped: "That's fine. You can come back to this whenever you like.",
    /* Read out by screen readers */
    announceStart: "Breathing pause started.",
    announceDone: "Breathing pause finished."
  },

  /* ---- Call to action (the button link itself is set in config.js) ---- */
  cta: {
    heading: "If you'd like to talk",
    body: "A free introductory call is a chance to say hello, ask any questions and get a feel for whether working together could suit you. There's no pressure and no commitment.",
    button: "Book a free introductory session"
  },

  /* ---- Crisis support: shown on every screen, including every result.
     Please check these are still correct from time to time. ---- */
  crisis: {
    heading: "If you urgently need support right now",
    intro: "Please contact one of the following:",
    services: [
      { name: "Samaritans", detail: "free, any time, day or night", phone: "116 123" },
      { name: "NHS 111",    detail: "for urgent help that isn't an emergency", phone: "111" },
      { name: "999",        detail: "in an emergency, or if you or someone else is in immediate danger", phone: "999" }
    ]
  },

  /* ---- Small print for screen readers / page ---- */
  page: {
    iframeTitle: "A gentle check-in",
    noScript: "This check-in needs JavaScript to run. If you'd like to talk to someone, please get in touch using the contact details on this website."
  }
};
