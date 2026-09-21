/* ==========================================================================
   App logic. Reads wording from LDC_CONTENT and settings from LDC_CONFIG.
   Runs entirely in the browser: no storage, no network requests.
   ========================================================================== */
(function () {
  'use strict';

  var C = window.LDC_CONTENT;
  var CFG = window.LDC_CONFIG;

  var stage = document.getElementById('stage');
  var crisisBox = document.getElementById('crisis');
  var widget = document.getElementById('widget');
  var announcer = document.getElementById('announcer');

  var questions = C.questions.items;
  var answers = [];        // answers[i] = index of the chosen option (memory only)
  var breathTimer = null;  // handle for the breathing pause timer
  var firstScreen = true;  // true until the first screen has been drawn

  /* ---------- Small helpers ---------- */

  /* Build an element. Text goes in via textContent, so it is always treated as
     plain text, never as HTML. */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(label, className, onClick) {
    var b = el('button', className, label);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
  }

  function paragraphs(container, lines, className) {
    lines.forEach(function (line) { container.appendChild(el('p', className, line)); });
  }

  function announce(message) {
    announcer.textContent = '';
    // A tiny delay makes screen readers reliably notice the change
    setTimeout(function () { announcer.textContent = message; }, 50);
  }

  /* Swap in a new screen and move keyboard/screen-reader focus to its heading.
     preventScroll stops the parent Squarespace page jumping around. */
  function show(card, heading) {
    stopBreathing();
    stage.textContent = '';
    stage.appendChild(card);
    heading.setAttribute('tabindex', '-1');
    /* Don't grab focus on the very first screen: the visitor hasn't interacted
       yet, and stealing focus as an embedded page loads is disorienting. */
    if (!firstScreen) heading.focus({ preventScroll: true });
    firstScreen = false;
    postHeight();   // report the new height straight away (function is defined below)
  }

  /* ---------- Screens ---------- */

  function showIntro() {
    var card = el('section', 'card');
    var h = el('h1', null, C.intro.title);
    card.appendChild(h);
    paragraphs(card, C.intro.body);
    card.appendChild(el('p', 'privacy-note', C.intro.privacy));
    var row = el('div', 'btn-row');
    row.appendChild(button(C.intro.startButton, 'btn', function () { showQuestion(0); }));
    card.appendChild(row);
    show(card, h);
  }

  function showQuestion(i) {
    var Q = C.questions;
    var total = questions.length;
    var card = el('section', 'card');

    var progressText = Q.progressLabel
      .replace('{current}', i + 1)
      .replace('{total}', total);
    card.appendChild(el('p', 'progress-text', progressText));

    var bar = el('div', 'progress-bar');
    bar.setAttribute('aria-hidden', 'true'); // the text above already says it
    var fill = el('div', 'progress-fill');
    fill.style.width = ((i + 1) / total * 100) + '%';
    bar.appendChild(fill);
    card.appendChild(bar);

    /* A fieldset + legend groups the radio buttons so screen readers read the
       question together with each answer. */
    var fs = el('fieldset');
    var legend = el('legend');
    legend.appendChild(el('span', 'q-prompt', Q.prompt));
    var statement = el('span', 'q-statement', questions[i].statement);
    legend.appendChild(statement);
    fs.appendChild(legend);

    var radios = [];
    Q.options.forEach(function (opt, idx) {
      var label = el('label', 'option');
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = idx;
      if (answers[i] === idx) input.checked = true;
      radios.push(input);
      label.appendChild(input);
      label.appendChild(el('span', null, opt.label));
      fs.appendChild(label);
    });
    card.appendChild(fs);

    var hint = el('p', 'hint', Q.unansweredHint);
    hint.hidden = true;
    hint.setAttribute('role', 'status');
    card.appendChild(hint);

    var row = el('div', 'btn-row');
    row.appendChild(button(Q.backButton, 'btn btn-secondary', function () {
      if (i === 0) showIntro(); else showQuestion(i - 1);
    }));
    var isLast = i === total - 1;
    row.appendChild(button(isLast ? Q.finishButton : Q.nextButton, 'btn', function () {
      var chosen = radios.filter(function (r) { return r.checked; })[0];
      if (!chosen) {
        hint.hidden = false;
        radios[0].focus({ preventScroll: true });
        return;
      }
      answers[i] = Number(chosen.value);
      if (isLast) showResults(); else showQuestion(i + 1);
    }));
    card.appendChild(row);

    /* Focus the question itself (not a button) so it is read out first */
    show(card, statement);
  }

  function totalPoints() {
    return answers.reduce(function (sum, optIndex) {
      return sum + C.questions.options[optIndex].points;
    }, 0);
  }

  function pickBand(points) {
    var chosen = C.results.bands[0];
    C.results.bands.forEach(function (band) {
      if (points >= band.minPoints) chosen = band;
    });
    return chosen;
  }

  /* Reflections: kind sentences for statements the visitor said were "Often"
     true (most points). If there are none, use the "Sometimes" ones. Max 3. */
  function pickReflections() {
    var opts = C.questions.options;
    var maxPoints = Math.max.apply(null, opts.map(function (o) { return o.points; }));
    function collect(target) {
      return questions.filter(function (q, i) {
        return C.questions.options[answers[i]].points === target && q.reflection;
      }).map(function (q) { return q.reflection; });
    }
    var list = collect(maxPoints);
    if (list.length === 0) list = collect(maxPoints - 1);
    return list.slice(0, 3);
  }

  function showResults() {
    var band = pickBand(totalPoints());
    var R = C.results;
    var card = el('section', 'card');

    var h = el('h2', null, band.title);
    card.appendChild(h);
    paragraphs(card, band.body);

    var reflections = pickReflections();
    if (reflections.length) {
      card.appendChild(el('h3', null, R.reflectionsHeading));
      var ul = el('ul', 'reflections');
      reflections.forEach(function (r) { ul.appendChild(el('li', null, r)); });
      card.appendChild(ul);
    }

    card.appendChild(buildBreathing());

    /* Call to action: a soft invitation, not a hard sell */
    var cta = el('div', 'panel');
    cta.appendChild(el('h3', null, C.cta.heading));
    cta.appendChild(el('p', null, C.cta.body));
    var link = el('a', 'btn', C.cta.button + ' ');
    link.href = CFG.bookingUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.appendChild(el('span', 'sr-only', C.cta.opensInNewTab));
    cta.appendChild(link);
    card.appendChild(cta);

    card.appendChild(el('p', 'muted small', R.disclaimer));

    var row = el('div', 'btn-row');
    row.appendChild(button(R.restartButton, 'btn btn-secondary', function () {
      answers = [];
      showIntro();
    }));
    card.appendChild(row);

    show(card, h);
  }

  /* ---------- Breathing pause ---------- */

  function stopBreathing() {
    clearTimeout(breathTimer);
    breathTimer = null;
  }

  function buildBreathing() {
    var B = C.breathing;
    var b = CFG.breathing;
    var panel = el('div', 'panel');
    panel.appendChild(el('h3', null, B.heading));
    panel.appendChild(el('p', null, B.intro));

    var startBtn = button(B.startButton, 'btn btn-secondary', begin);
    panel.appendChild(startBtn);

    var stageBox = el('div', 'breath-stage');
    stageBox.hidden = true;
    var circleWrap = el('div', 'breath-circle-wrap');
    circleWrap.setAttribute('aria-hidden', 'true'); // decorative; the words carry the meaning
    var circle = el('div', 'breath-circle');
    circleWrap.appendChild(circle);
    var cue = el('p', 'breath-cue');
    var stopBtn = button(B.stopButton, 'btn btn-secondary', function () { finish(B.stopped, false); });
    stageBox.appendChild(circleWrap);
    stageBox.appendChild(cue);
    stageBox.appendChild(stopBtn);
    panel.appendChild(stageBox);

    function begin() {
      startBtn.hidden = true;
      stageBox.hidden = false;
      stopBtn.hidden = false;
      announce(B.announceStart);
      step(0, true);
      postHeight();
    }

    /* One step = one breath in or one breath out. Each step schedules the next. */
    function step(count, breatheIn) {
      if (count >= b.cycles * 2) { finish(B.done, true); return; }
      var seconds = breatheIn ? b.inSeconds : b.outSeconds;
      cue.textContent = breatheIn ? B.breatheIn : B.breatheOut;
      circle.style.transitionDuration = seconds + 's';
      circle.classList.toggle('expanded', breatheIn);
      breathTimer = setTimeout(function () { step(count + 1, !breatheIn); }, seconds * 1000);
    }

    function finish(message, completed) {
      stopBreathing();
      circle.style.transitionDuration = '1s';
      circle.classList.remove('expanded');
      cue.textContent = message;
      stopBtn.hidden = true;
      startBtn.textContent = B.againButton;
      startBtn.hidden = false;
      if (completed) announce(B.announceDone);
      postHeight();
    }

    return panel;
  }

  /* ---------- Crisis support (always visible, on every screen) ---------- */

  function renderCrisis() {
    var X = C.crisis;
    var region = el('section');
    region.setAttribute('aria-labelledby', 'crisis-heading');
    var h = el('h2', null, X.heading);
    h.id = 'crisis-heading';
    region.appendChild(h);
    region.appendChild(el('p', null, X.intro));
    var ul = el('ul');
    X.services.forEach(function (s) {
      var li = el('li');
      /* "NHS 111" and "999" already contain their number, so don't repeat it */
      var linkText = s.name.indexOf(s.phone) === -1 ? s.name + ' ' + s.phone : s.name;
      var a = el('a', null, linkText);
      a.href = 'tel:' + s.phone.replace(/\s+/g, '');
      li.appendChild(a);
      li.appendChild(document.createTextNode(': ' + s.detail));
      ul.appendChild(li);
    });
    region.appendChild(ul);
    crisisBox.appendChild(region);
  }

  /* ---------- Tell the parent page how tall we are ----------
     Squarespace embeds us in an iframe, and an iframe can't size itself to its
     content. So we measure ourselves and post the number to the parent, which
     has a small script (see docs/squarespace-embed.html) that applies it.
     The message contains only a number: no personal data. */

  var lastHeight = 0;
  function postHeight() {
    var height = Math.ceil(widget.getBoundingClientRect().height);
    if (height === lastHeight) return;
    lastHeight = height;
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'ldc-widget-height', height: height }, '*');
    }
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(postHeight).observe(widget);   // fires whenever our size changes
  }
  window.addEventListener('load', postHeight);
  window.addEventListener('resize', postHeight);

  /* ---------- Go ---------- */
  renderCrisis();
  showIntro();
  postHeight();
})();
