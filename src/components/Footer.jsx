import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import './Footer.css';

const socials = [
  { label: 'X', url: 'https://x.com/NeelakandanNC' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/neelakandan-nc' },
  { label: 'YouTube', url: 'https://www.youtube.com/@NeelakandanNC' },
  { label: 'Email', url: 'mailto:neelakandannithin@gmail.com' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <Reveal className="footer-cta">
          <span className="eyebrow">Let's build</span>
          <Link to="/contact" className="footer-cta__line">
            Start a conversation <span className="arrow">↗</span>
          </Link>
        </Reveal>

        <div className="footer-grid">
          <div className="footer-col">
            <span className="footer-mark">N</span>
            <p className="text-dim footer-blurb">
              Founder building in public — and journaling the journey, one entry at a time.
            </p>
          </div>

          <div className="footer-col">
            <span className="eyebrow">Sitemap</span>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/purpose">Purpose</Link></li>
              <li><Link to="/journal">Journal</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <span className="eyebrow">Elsewhere</span>
            <ul>
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label} <span className="arrow">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-base">
          <span>© {new Date().getFullYear()} Neelakandan NC</span>
          <span className="footer-base__mono">Built with purpose · India</span>
        </div>
      </div>
    </footer>
  );
}
