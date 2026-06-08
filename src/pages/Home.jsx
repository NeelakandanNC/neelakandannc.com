import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import RevealText from '../components/RevealText.jsx';
import HeroAurora from '../components/HeroAurora.jsx';
import SelectedWork from '../components/SelectedWork.jsx';
import Counter from '../components/Counter.jsx';
import { entries, formatDate } from '../lib/journal.js';
import './pages.css';

const stats = [
  { value: 9, suffix: '', label: 'Ventures\nshipped' },
  { value: 5, suffix: '', label: 'Domains\nmastered' },
  { value: 3, suffix: '+', label: 'Years\nbuilding' },
  { value: '∞', suffix: '', label: 'Curiosity\nlevel' },
];

const pillars = [
  {
    n: '01',
    t: 'Advanced Tech',
    d: 'AI agents and LLM-integrated workflows that actually ship — from multi-agent orchestration to production ML.',
  },
  {
    n: '02',
    t: 'Markets',
    d: 'Reading markets through data, algorithms, and venture-scale thinking. Building at the intersection of quant and code.',
  },
  {
    n: '03',
    t: 'In Public',
    d: 'Documenting the build — every venture, every lesson, every failure — to raise the bar on technical craft.',
  },
];

export default function Home() {
  const latest = entries.slice(0, 3);

  return (
    <div className="home">
      {/* ---------- HERO (WebGL aurora, no image) ---------- */}
      <HeroAurora />

      {/* ---------- STATS COUNTER ---------- */}
      <section className="section container">
        <div className="stats-strip">
          {stats.map((s, i) => (
            <Reveal className="stat" key={s.label} delay={i * 0.08}>
              <span className="stat__num display">
                <Counter value={s.value} suffix={s.suffix} />
              </span>
              <span className="stat__label">
                {s.label.split('\n').map((l) => (
                  <span key={l}>{l}<br /></span>
                ))}
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- THESIS ---------- */}
      <section className="section container">
        <div className="section-head">
          <span className="sec-index">№ 01 — Thesis</span>
          <span className="eyebrow">The Philosophy</span>
        </div>

        <RevealText
          as="h2"
          className="display display--lg thesis__statement"
          text="The next decade belongs to those who can bridge the gap between capital and code."
          stagger={0.04}
        />

        <div className="pillars">
          {pillars.map((p, i) => (
            <Reveal className="pillar" key={p.n} delay={i * 0.08}>
              <span className="pillar__n">{p.n}</span>
              <h3 className="pillar__t">{p.t}</h3>
              <p className="pillar__d text-dim">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- SELECTED WORK (horizontal pin, no images) ---------- */}
      <SelectedWork />

      {/* ---------- LATEST JOURNAL ---------- */}
      <section className="section container">
        <div className="section-head">
          <span className="sec-index">№ 03 — Journal</span>
          <Link to="/journal" className="section-link">Read all ↗</Link>
        </div>

        <h2 className="display display--lg section-title">
          Building, <span className="serif italic">out loud.</span>
        </h2>

        <div className="journal-feed">
          {latest.map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.06}>
              <Link to={`/journal/${e.slug}`} className="journal-row">
                <span className="journal-row__date">{formatDate(e.date)}</span>
                <span className="journal-row__title">{e.title}</span>
                <span className="journal-row__excerpt text-dim">{e.excerpt}</span>
                <span className="journal-row__arrow">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
