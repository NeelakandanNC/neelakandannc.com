/* ============================================================
   main.js — interactions
   theme · header · mobile menu · reveals · hero entrance ·
   count-up · 3D tilt (portrait + cards) · scroll parallax

   NOTE: IntersectionObserver is unreliable in some sandboxed
   preview iframes (callbacks never fire), so reveals + count-up
   are driven by getBoundingClientRect on a rAF-throttled scroll
   loop — works everywhere.
   ============================================================ */
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // robust scroll position (handles window OR body/html as scroller)
  const scrollTopOf = () =>
    window.scrollY || window.pageYOffset ||
    document.documentElement.scrollTop || document.body.scrollTop || 0;
  const vh = () => window.innerHeight || document.documentElement.clientHeight;

  /* ---------- THEME ---------- */
  const saved = localStorage.getItem('nc-theme');
  if (saved) root.setAttribute('data-theme', saved);
  $('#themeToggle')?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('nc-theme', next);
    requestAnimationFrame(() => window.HeroGL && window.HeroGL.setTheme());
  });

  /* ---------- MOBILE MENU ---------- */
  const menu = $('#mobileMenu');
  $('#hamburger')?.addEventListener('click', () => menu.classList.toggle('open'));
  $$('#mobileMenu a').forEach((a) => a.addEventListener('click', () => menu.classList.remove('open')));

  /* ---------- HERO title word entrance ---------- */
  const words = $$('.hero-title .word');
  words.forEach((w, i) => {
    w.style.transform = 'translateY(110%)';
    w.style.opacity = '0';
    w.style.transition = `transform 1s cubic-bezier(.16,1,.3,1) ${0.15 + i * 0.12}s, opacity .8s ease ${0.15 + i * 0.12}s`;
  });
  const showWords = () => words.forEach((w) => { w.style.transform = 'none'; w.style.opacity = '1'; });
  if (reduce) showWords();
  else { requestAnimationFrame(() => requestAnimationFrame(showWords)); setTimeout(showWords, 700); }

  /* ---------- COUNT-UP ---------- */
  function countUp(el) {
    const to = parseFloat(el.dataset.to);
    if (reduce) { el.textContent = to; return; }
    const dur = 1400, t0 = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = to;
    })(performance.now());
  }

  /* ---------- REVEAL + COUNT via scroll position ---------- */
  const revs = $$('.reveal');
  const counters = $$('.count');
  function isVisible(el, margin) {
    const r = el.getBoundingClientRect();
    if (r.height === 0 && r.width === 0) return false;
    return r.top < vh() * (1 - (margin || 0.06)) && r.bottom > 0;
  }
  function checkReveals() {
    for (const el of revs) {
      if (!el.classList.contains('in') && isVisible(el)) el.classList.add('in');
    }
    for (const el of counters) {
      if (!el.__counted && isVisible(el, 0.15)) { el.__counted = true; countUp(el); }
    }
  }
  if (reduce) {
    revs.forEach((r) => r.classList.add('in'));
    counters.forEach((c) => (c.textContent = c.dataset.to));
  } else {
    // engage the hidden-by-default state, then reveal in-view items
    root.classList.add('js-reveal');
    checkReveals();
    // hard failsafe: never let a reveal stay hidden longer than 4s
    setTimeout(() => revs.forEach((r) => r.classList.add('in')), 4000);
  }

  /* ---------- HEADER scroll state ---------- */
  const header = $('#header');
  const setHeader = () => header.classList.toggle('scrolled', scrollTopOf() > 24);
  setHeader();

  /* ---------- SCROLL PARALLAX (layered depth) ---------- */
  const layers = [
    { el: $('.hero-grid-tex'), speed: 0.12 },
  ].filter((l) => l.el);
  function parallax(y) {
    if (reduce || y >= vh() * 1.25) return;
    layers.forEach((l) => { l.el.style.transform = `translate3d(0, ${y * l.speed}px, 0)`; });
  }

  /* ---------- unified rAF-throttled scroll handler ---------- */
  let ticking = false;
  function onScrollFrame() {
    const y = scrollTopOf();
    setHeader();
    if (!reduce) checkReveals();
    parallax(y);
    ticking = false;
  }
  function requestScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); }
  }
  // listen broadly so it works whether window, html, or body is the scroller
  window.addEventListener('scroll', requestScroll, { passive: true });
  document.addEventListener('scroll', requestScroll, { passive: true, capture: true });
  window.addEventListener('resize', requestScroll);
  window.addEventListener('load', () => { onScrollFrame(); setTimeout(onScrollFrame, 250); });
  // a few delayed passes catch late layout/font shifts
  setTimeout(onScrollFrame, 120);
  setTimeout(onScrollFrame, 500);

  /* ---------- LIVE CLOCK (hero meta) ---------- */
  const clock = $('#localClock');
  if (clock) {
    const tick = () => {
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      clock.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
    };
    tick();
    setInterval(tick, 1000);
  }
})();
