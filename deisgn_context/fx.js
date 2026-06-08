/* ============================================================
   fx.js — premium motion layer
   Lenis smooth scroll · anchor scroll-to · custom cursor ·
   magnetic buttons · velocity marquee · horizontal pinned work ·
   scroll progress · hero line reveals
   ============================================================ */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- LENIS smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1.0, smoothWheel: true, touchMultiplier: 1.4 });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
  const scrollY = () => (lenis ? lenis.scroll : (window.scrollY || document.documentElement.scrollTop || 0));
  const vw = () => window.innerWidth;
  const vh = () => window.innerHeight;

  /* ---------- anchor scroll-to (fixes nav + Get in touch) ---------- */
  function scrollToTarget(hash) {
    if (hash === '#top' || hash === '#') {
      lenis ? lenis.scrollTo(0, { duration: 1.1 }) : window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(hash);
    if (!el) return;
    const offset = -68;
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.2, easing: (x) => 1 - Math.pow(1 - x, 3) });
    else {
      const y = el.getBoundingClientRect().top + (window.scrollY || 0) + offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
  $$('a[href^="#"]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href.length < 2 && href !== '#') return;
    a.addEventListener('click', (e) => {
      if (a.getAttribute('href') === '#') { e.preventDefault(); return; }
      const target = a.getAttribute('href');
      if (target.startsWith('#')) { e.preventDefault(); scrollToTarget(target); }
    });
  });

  /* ---------- CUSTOM CURSOR ---------- */
  const cursor = $('#cursor');
  const dot = $('#cursorDot');
  const cLabel = cursor ? cursor.querySelector('.cursor-label') : null;
  if (cursor && dot && !coarse && !reduce) {
    document.documentElement.classList.add('has-cursor');
    let mx = vw() / 2, my = vh() / 2, cx = mx, cy = my;
    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    }, { passive: true });
    (function cloop() {
      cx = lerp(cx, mx, 0.18); cy = lerp(cy, my, 0.18);
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(cloop);
    })();
    const hov = 'a, button, .magnetic, [data-cursor], input, .j-entry';
    $$(hov).forEach((el) => {
      el.addEventListener('pointerenter', () => {
        cursor.classList.add('is-hover');
        const lbl = el.getAttribute('data-cursor');
        if (lbl && cLabel) { cursor.classList.add('has-label'); cLabel.textContent = lbl; }
      });
      el.addEventListener('pointerleave', () => {
        cursor.classList.remove('is-hover', 'has-label');
        if (cLabel) cLabel.textContent = '';
      });
    });
    window.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    window.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
    document.addEventListener('pointerleave', () => { cursor.style.opacity = '0'; dot.style.opacity = '0'; });
    document.addEventListener('pointerenter', () => { cursor.style.opacity = ''; dot.style.opacity = ''; });
  }

  /* ---------- MAGNETIC buttons ---------- */
  if (!coarse && !reduce) {
    $$('.magnetic').forEach((el) => {
      const strength = parseFloat(el.dataset.mag || '0.35');
      let raf = null, tx = 0, ty = 0, x = 0, y = 0;
      const loop = () => {
        x = lerp(x, tx, 0.2); y = lerp(y, ty, 0.2);
        el.style.transform = `translate(${x}px, ${y}px)`;
        if (Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05) raf = requestAnimationFrame(loop);
        else { el.style.transform = `translate(${tx}px, ${ty}px)`; raf = null; }
      };
      const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) * strength;
        ty = (e.clientY - (r.top + r.height / 2)) * strength;
        kick();
      });
      el.addEventListener('pointerleave', () => { tx = 0; ty = 0; kick(); });
    });
  }

  /* ---------- HERO line reveals ---------- */
  const heroReveals = $$('.lines-reveal');
  const fire = () => heroReveals.forEach((el, i) => { el.style.transitionDelay = (0.35 + i * 0.12) + 's'; el.classList.add('in'); });
  if (reduce) heroReveals.forEach((el) => el.classList.add('in'));
  else { requestAnimationFrame(() => requestAnimationFrame(fire)); setTimeout(fire, 800); }

  /* ---------- VELOCITY MARQUEE ---------- */
  const marquee = $('#heroMarquee');
  const mTrack = marquee ? marquee.querySelector('.track') : null;
  let mPos = 0, mHalf = 0;
  if (mTrack && !reduce) {
    marquee.classList.add('js-driven');
    const measure = () => { mHalf = mTrack.scrollWidth / 2; };
    measure(); window.addEventListener('resize', measure);
    setTimeout(measure, 600);
  }

  /* ---------- HORIZONTAL PINNED WORK ---------- */
  const hwrap = $('#work.hwrap');
  const htrack = $('#htrack');
  const hCur = $('#hCur'), hTot = $('#hTot');
  let hEnabled = false, hTravel = 0, hTop = 0, panels = [], relayoutH = null;
  if (htrack) {
    panels = $$('.hpanel, .wcard', htrack);
    if (hTot) hTot.textContent = String(Math.max(1, panels.length - 1)).padStart(2, '0');
    function layoutH() {
      hEnabled = vw() > 800 && !reduce;
      if (!hEnabled) {
        hwrap.style.height = '';
        htrack.style.transform = '';
        hwrap.classList.add('h-stacked');
        return;
      }
      hwrap.classList.remove('h-stacked');
      const tw = htrack.scrollWidth;
      hTravel = Math.max(0, tw - vw());
      hwrap.style.height = (vh() + hTravel) + 'px';
      hTop = hwrap.offsetTop;
      // Lenis caches the scroll limit — re-measure after we change page height
      if (lenis && lenis.resize) lenis.resize();
    }
    layoutH();
    relayoutH = layoutH;
    window.addEventListener('resize', () => { layoutH(); });
    setTimeout(() => { layoutH(); if (lenis && lenis.resize) lenis.resize(); }, 400);
    window.addEventListener('load', () => { layoutH(); if (lenis && lenis.resize) lenis.resize(); });
  }

  /* ---------- SCROLL PROGRESS ---------- */
  const prog = $('#scrollProgress');

  // Keep Lenis' cached height in sync with late layout shifts (fonts, reveals)
  if (lenis && lenis.resize) {
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (relayoutH) relayoutH(); setTimeout(() => lenis.resize(), 50); });
    [300, 800, 1500].forEach((t) => setTimeout(() => { if (relayoutH) relayoutH(); lenis.resize(); }, t));
  }

  /* ---------- unified rAF render ---------- */
  let last = scrollY(), vel = 0, lastT = performance.now();
  function render(now) {
    requestAnimationFrame(render);
    const y = scrollY();
    const dt = Math.max(1, now - lastT); lastT = now;
    vel = lerp(vel, (y - last) / dt, 0.25);
    last = y;

    // progress bar
    if (prog) {
      const max = (document.documentElement.scrollHeight - vh()) || 1;
      prog.style.transform = `scaleX(${clamp(y / max, 0, 1)})`;
    }

    // marquee: base drift + scroll velocity, skew on speed
    if (mTrack && mHalf) {
      mPos -= (0.6 + Math.abs(vel) * 6);
      if (mPos <= -mHalf) mPos += mHalf;
      mTrack.style.transform = `translateX(${mPos}px)`;
      const sk = clamp(vel * 1.4, -8, 8);
      marquee.style.transform = `translateY(-50%) skewX(${sk}deg)`;
    }

    // horizontal pin
    if (hEnabled && hTravel > 0) {
      const p = clamp((y - hTop) / hTravel, 0, 1);
      htrack.style.transform = `translate3d(${-p * hTravel}px,0,0)`;
      if (hCur) {
        const idx = clamp(Math.round(p * (panels.length - 1)), 0, panels.length - 1);
        hCur.textContent = String(idx).padStart(2, '0');
      }
    }
  }
  requestAnimationFrame(render);

  // expose for debugging / other scripts
  window.NCFX = { lenis, scrollToTarget };
})();
