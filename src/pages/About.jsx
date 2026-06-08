import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import RevealText from '../components/RevealText.jsx';
import Parallax from '../components/Parallax.jsx';
import { domains } from '../lib/domains.js';
import './pages.css';

const timeline = [
  { year: '2005', title: 'The Beginning', desc: 'Early curiosity awakens — exploring the world and forming the foundational perspective that fuels everything else.' },
  { year: '2017', title: 'Into the Tech World', desc: "First real exposure to technology through a Celkon smart 4G phone. Discovered Sundar Pichai's work — and a deep interest in software and leadership." },
  { year: '2023', title: 'Entering NITA', desc: 'Began formal engineering at the National Institute of Technology, Agartala. Core STEM, surrounded by ambitious peers.' },
  { year: 'Ch. II', title: 'Early Ventures', desc: 'ModernClother (e-commerce) and MediPro Solutions (NABH agency). Hard lessons in pricing, sales, and B2B operations.' },
  { year: 'Now', title: 'Deep Builds', desc: 'Building Agentronics and exploring AI agents — applying everything learned into high-leverage software.' },
];

const taste = [
  {
    name: 'Goodreads',
    glyph: 'B.',
    label: 'The Library',
    note: 'Startups, systems thinking, psychology, philosophy — a running catalog of the ideas I return to.',
    url: 'https://www.goodreads.com/user/show/196817664-neelakandan-nc',
  },
  {
    name: 'IMDb',
    glyph: 'F.',
    label: 'The Reel',
    note: 'Tech dramas, finance thrillers, and biographies that inspire — cinema for anyone building something hard.',
    url: 'https://www.imdb.com/user/ur211808830/?ref_=hm_nv_profile',
  },
];

export default function About() {
  return (
    <div className="page container">
      <header className="page-head">
        <span className="eyebrow">About · A life, so far</span>
        <RevealText as="h1" className="display display--xl" text="The polymath path." />
        <Reveal delay={0.2}>
          <p className="lede page-head__lede">
            From core electronics to AI agents and markets — a self-taught route across five
            domains, and the milestones that shaped it.
          </p>
        </Reveal>
      </header>

      {/* Journey — process-style numbered timeline */}
      <section className="about-block">
        <Parallax speed={20} className="about-block__label">
          <span className="eyebrow">Journey · {timeline.length} chapters</span>
        </Parallax>
        <div className="process">
          {timeline.map((t, i) => (
            <Reveal key={t.title} className="step" delay={(i % 3) * 0.06}>
              <div className="step__rail">
                <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="step__line" />
              </div>
              <div className="step__body">
                <span className="step__year serif">{t.year}</span>
                <h3 className="step__title">{t.title}</h3>
                <p className="text-dim">{t.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Domains — each links to a living "what I learned + resources" page */}
      <section className="about-block">
        <Parallax speed={20} className="about-block__label">
          <span className="eyebrow">Domains · {domains.length} disciplines</span>
        </Parallax>
        <div className="domain-grid">
          {domains.map((d, i) => (
            <Reveal key={d.slug} delay={(i % 3) * 0.06}>
              <Link to={`/learn/${d.slug}`} className="domain">
                <span className="domain__icon">{d.icon}</span>
                <h3 className="domain__t">{d.title}</h3>
                <p className="domain__d text-dim">{d.desc}</p>
                <span className="domain__cta">Notes &amp; resources →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Creative taste — Goodreads + IMDb */}
      <section className="about-block">
        <Parallax speed={20} className="about-block__label">
          <span className="eyebrow">Taste · how I build it</span>
        </Parallax>
        <div className="taste-grid">
          {taste.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <a href={t.url} target="_blank" rel="noopener noreferrer" className="taste-card">
                <div className="taste-card__top">
                  <span className="taste-card__glyph serif">{t.glyph}</span>
                  <span className="taste-card__arrow">↗</span>
                </div>
                <span className="eyebrow">{t.label}</span>
                <h3 className="taste-card__name">{t.name}</h3>
                <p className="taste-card__note text-dim">{t.note}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
