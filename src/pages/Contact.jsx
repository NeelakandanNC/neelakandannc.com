import Reveal from '../components/Reveal.jsx';
import RevealText from '../components/RevealText.jsx';
import Faq from '../components/Faq.jsx';
import './pages.css';

const channels = [
  { name: 'X · Twitter', handle: '@NeelakandanNC', url: 'https://x.com/NeelakandanNC', note: 'Thoughts in public. Fastest replies here.' },
  { name: 'LinkedIn', handle: 'neelakandan-nc', url: 'https://www.linkedin.com/in/neelakandan-nc', note: 'For collaboration, capital, and formal outreach.' },
  { name: 'Email', handle: 'neelakandannithin@gmail.com', url: 'mailto:neelakandannithin@gmail.com', note: 'Long-form inquiries, proposals, and decks.' },
  { name: 'YouTube', handle: '@NeelakandanNC', url: 'https://www.youtube.com/@NeelakandanNC', note: 'Building in public, one episode at a time.' },
];

export default function Contact() {
  return (
    <div className="page container">
      <header className="page-head">
        <span className="eyebrow">Contact · 4 channels</span>
        <RevealText as="h1" className="display display--xl" text="Get in touch." />
        <Reveal delay={0.2}>
          <p className="lede page-head__lede">
            Four channels. No noise. Pick whichever fits the conversation.
          </p>
        </Reveal>
      </header>

      {/* Channels — the only way to reach out */}
      <section className="section">
        <div className="section-head">
          <span className="sec-index">№ 01 — Channels</span>
          <span className="eyebrow">{channels.length} ways to connect</span>
        </div>
        <div className="contact-grid">
          {channels.map((c, i) => (
            <Reveal key={c.name} delay={(i % 2) * 0.07}>
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="contact-card">
                <div className="contact-card__top">
                  <span className="contact-card__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="contact-card__arrow">↗</span>
                </div>
                <h2 className="contact-card__name">{c.name}</h2>
                <p className="contact-card__note text-dim">{c.note}</p>
                <span className="contact-card__handle">{c.handle}</span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="section-head">
          <span className="eyebrow">FAQ</span>
          <span className="eyebrow">Good to know</span>
        </div>
        <h2 className="display display--md section-title">
          Frequently <span className="serif italic">asked.</span>
        </h2>
        <Faq />
      </section>
    </div>
  );
}
