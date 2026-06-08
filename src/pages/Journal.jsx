import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import RevealText from '../components/RevealText.jsx';
import { entries, formatDate } from '../lib/journal.js';
import './pages.css';

export default function Journal() {
  return (
    <div className="page container">
      <header className="page-head">
        <span className="eyebrow">Digital Journal · {entries.length} entries</span>
        <RevealText as="h1" className="display display--xl" text="The journey, logged." />
        <Reveal delay={0.2}>
          <p className="lede page-head__lede">
            Notes from building a startup in public — the wins, the dead-ends, and the thinking in
            between. Written as it happens.
          </p>
        </Reveal>
      </header>

      <div className="entry-list">
        {entries.map((e, i) => (
          <Reveal key={e.slug} delay={(i % 4) * 0.05}>
            <Link to={`/journal/${e.slug}`} className="entry">
              <div className="entry__meta">
                <span className="entry__date">{formatDate(e.date)}</span>
                <div className="entry__tags">
                  {e.tags.map((t) => (
                    <span className="entry__tag" key={t}>#{t}</span>
                  ))}
                </div>
              </div>
              <h2 className="entry__title">{e.title}</h2>
              <p className="entry__excerpt text-dim">{e.excerpt}</p>
              <span className="entry__read">Read entry →</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
