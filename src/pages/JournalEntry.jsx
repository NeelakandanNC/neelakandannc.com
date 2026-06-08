import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Reveal from '../components/Reveal.jsx';
import { getEntry, formatDate } from '../lib/journal.js';
import './pages.css';

export default function JournalEntry() {
  const { slug } = useParams();
  const entry = getEntry(slug);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  if (!entry) {
    return (
      <div className="page container">
        <Link to="/journal" className="back-link">← Back to Journal</Link>
        <h1 className="display display--lg">Entry not found.</h1>
      </div>
    );
  }

  return (
    <article className="page container article">
      <motion.div className="read-progress" style={{ scaleX: progress }} />

      <Link to="/journal" className="back-link">← Journal</Link>

      <header className="article__head">
        <Reveal className="article__meta">
          <span className="entry__date">{formatDate(entry.date)}</span>
          <div className="entry__tags">
            {entry.tags.map((t) => (
              <span className="entry__tag" key={t}>#{t}</span>
            ))}
          </div>
        </Reveal>
        <Reveal as="h1" className="display display--lg article__title" delay={0.05}>
          {entry.title}
        </Reveal>
        {entry.excerpt && (
          <Reveal delay={0.1}>
            <p className="lede article__excerpt">{entry.excerpt}</p>
          </Reveal>
        )}
      </header>

      <Reveal className="prose" delay={0.12}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.body}</ReactMarkdown>
      </Reveal>

      <div className="article__foot">
        <Link to="/journal" className="back-link">← All entries</Link>
      </div>
    </article>
  );
}
