import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Motif from './Motif.jsx';
import './SelectedWork.css';

const ventures = [
  {
    idx: '01',
    name: 'Agentronics',
    status: 'active',
    statusLabel: 'Active',
    tag: 'AI · Agents · Hardware',
    desc:
      'An agent platform for the physical world — autonomous software that perceives, decides, and operates real hardware. Founder & principal engineer.',
    motif: 'orbit',
    glyph: 'A',
    to: '/purpose',
    cta: 'Build log',
  },
  {
    idx: '02',
    name: 'repoforthat.dev',
    status: 'closed',
    statusLabel: 'Closed',
    tag: 'Dev tooling',
    desc:
      'A platform to discover the right repo for any problem — a curation engine and developer tooling. Shipped, then sunset to refocus.',
    motif: 'network',
    href: 'https://repoforthat.dev',
    cta: 'Visit site',
  },
  {
    idx: '03',
    name: 'MediPro Solutions',
    status: 'neutral',
    statusLabel: 'NABH Agency',
    tag: 'B2B services',
    desc:
      'An agency helping hospitals obtain NABH certification — operations, outreach, and the service model built from scratch.',
    motif: 'waves',
    href: 'https://1mediprosolutions.wixsite.com/medi-pro-solutions',
    cta: 'Visit site',
  },
];

export default function SelectedWork() {
  const wrapRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const [cur, setCur] = useState('00');

  // total panels = intro + ventures + cta
  const total = ventures.length + 1; // index goes 00..total

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let enabled = false;
    let travel = 0;
    let top = 0;
    let raf;

    const scrollY = () =>
      window.__lenis ? window.__lenis.scroll : window.scrollY || 0;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const layout = () => {
      enabled = window.innerWidth > 800 && !reduce;
      if (!enabled) {
        wrap.style.height = '';
        track.style.transform = '';
        wrap.classList.add('is-stacked');
        return;
      }
      wrap.classList.remove('is-stacked');
      const tw = track.scrollWidth;
      travel = Math.max(0, tw - window.innerWidth);
      wrap.style.height = window.innerHeight + travel + 'px';
      top = wrap.offsetTop;
      if (window.__lenis && window.__lenis.resize) window.__lenis.resize();
    };

    const render = () => {
      raf = requestAnimationFrame(render);
      if (!enabled || travel <= 0) return;
      const p = clamp((scrollY() - top) / travel, 0, 1);
      track.style.transform = `translate3d(${-p * travel}px,0,0)`;
      const idx = clamp(Math.round(p * (total - 1)), 0, total - 1);
      setCur(String(idx).padStart(2, '0'));
    };

    layout();
    raf = requestAnimationFrame(render);
    window.addEventListener('resize', layout);
    const timers = [300, 800, 1500].map((t) => setTimeout(layout, t));
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(layout);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', layout);
      timers.forEach(clearTimeout);
      wrap.style.height = '';
    };
  }, [total]);

  return (
    <section className="hwrap" ref={wrapRef} id="work">
      <div className="hpin" ref={pinRef}>
        <div className="htrack" ref={trackRef}>
          {/* intro panel */}
          <div className="hpanel hpanel--intro">
            <span className="sec-index">№ 02 — Selected work</span>
            <h2 className="hpanel__title">
              Things I&apos;ve
              <br />
              <span className="italic-blue serif">built &amp; shipped</span>
            </h2>
            <p className="hpanel__sub text-dim">
              A few of the ventures and tools I&apos;ve designed and engineered.
              Scroll sideways →
            </p>
            <div className="hpanel__count mono">
              <span className="hpanel__cur">{cur}</span>
              <span className="hpanel__slash">/</span>
              <span>{String(total - 1).padStart(2, '0')}</span>
            </div>
          </div>

          {/* venture cards */}
          {ventures.map((v) => {
            const Inner = (
              <>
                <div className="wcard__body">
                  <div className="wcard__top">
                    <span className="wcard__idx mono">{v.idx}</span>
                    <span className={`status status--${v.status}`}>
                      <span className="status__dot" />
                      {v.statusLabel}
                    </span>
                    <span className="chip mono">{v.tag}</span>
                  </div>
                  <h3 className="wcard__name">{v.name}</h3>
                  <p className="wcard__desc text-dim">{v.desc}</p>
                  <span className="wcard__link">
                    {v.cta} <span className="arrow">→</span>
                  </span>
                </div>
                <div className="wcard__visual">
                  <Motif variant={v.motif} glyph={v.glyph} />
                </div>
              </>
            );
            return v.to ? (
              <Link className="wcard" key={v.name} to={v.to} data-cursor="Open">
                {Inner}
              </Link>
            ) : (
              <a
                className="wcard"
                key={v.name}
                href={v.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Open"
              >
                {Inner}
              </a>
            );
          })}

          {/* CTA card */}
          <article className="wcard wcard--cta">
            <div className="wcard__body">
              <div className="wcard__top">
                <span className="wcard__idx mono">04</span>
                <span className="status status--neutral">
                  <span className="status__dot" />
                  In the lab
                </span>
              </div>
              <h3 className="wcard__name">
                Something
                <br />
                new.
              </h3>
              <p className="wcard__desc text-dim">
                There&apos;s always a next thing taking shape. Want to build it
                together — or just see what&apos;s cooking?
              </p>
              <Link to="/contact" className="btn btn--solid magnetic" data-cursor="Say hi">
                Get in touch <span className="arrow">→</span>
              </Link>
            </div>
            <div className="wcard__visual">
              <Motif variant="pulse" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
