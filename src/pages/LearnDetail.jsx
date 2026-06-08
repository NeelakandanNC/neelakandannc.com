import { useParams, Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import RevealText from '../components/RevealText.jsx';
import { getDomain, domains } from '../lib/domains.js';
import './pages.css';

export default function LearnDetail() {
  const { slug } = useParams();
  const domain = getDomain(slug);

  if (!domain) {
    return (
      <div className="page container">
        <Link to="/about" className="back-link">← Back to About</Link>
        <h1 className="display display--lg">Domain not <span className="serif italic">found.</span></h1>
      </div>
    );
  }

  const idx = domains.findIndex((d) => d.slug === slug);

  return (
    <div className="page container learn">
      <Link to="/about" className="back-link">← About · Domains</Link>

      <header className="learn__head">
        <span className="learn__icon">{domain.icon}</span>
        <div>
          <span className="eyebrow">
            Domain {String(idx + 1).padStart(2, '0')} — what I'm learning
          </span>
          <RevealText as="h1" className="display display--lg learn__title" text={domain.title} />
          <Reveal delay={0.1}>
            <p className="lede">{domain.desc}</p>
          </Reveal>
        </div>
      </header>

      <section className="learn__section">
        <h2 className="learn__section-title">Notes</h2>
        <Reveal>
          <p className="learn__notes">{domain.notes}</p>
        </Reveal>
        <p className="learn__more text-dim">
          More notes coming as I go deeper — this is a living page.
        </p>
      </section>

      <section className="learn__section">
        <h2 className="learn__section-title">Resources</h2>
        <div className="resource-links">
          {domain.resources.map((r, i) => (
            <Reveal key={r.url} delay={(i % 4) * 0.05}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                <span className="resource-link__name">{r.name}</span>
                <span className="resource-link__arrow">↗</span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="article__foot">
        <Link to="/about" className="back-link">← All domains</Link>
      </div>
    </div>
  );
}
