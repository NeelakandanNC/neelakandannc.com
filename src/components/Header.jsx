import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Magnetic from './Magnetic.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import Social from './Social.jsx';
import './Header.css';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/purpose', label: 'Purpose' },
  { to: '/journal', label: 'Journal' },
  { to: '/about', label: 'About' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      className={`site-header ${scrolled ? 'is-scrolled' : ''}`}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      <div className="site-header__inner container">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand__mark">N</span>
          <span className="brand__name">Neelakandan&nbsp;NC</span>
        </Link>

        <nav className={`nav ${open ? 'is-open' : ''}`}>
          {links.map((l) => (
            <Magnetic key={l.to} strength={0.25}>
              <NavLink
                to={l.to}
                end={l.end}
                className="nav__link"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            </Magnetic>
          ))}
          <Magnetic strength={0.25}>
            <Link to="/contact" className="nav__cta" onClick={() => setOpen(false)}>
              Get in touch
            </Link>
          </Magnetic>
          <Social className="nav-social" />
        </nav>

        <div className="header-actions">
          <Social className="header-social" />
          <span className="header-divider" />
          <ThemeToggle />
          <button
            className={`burger ${open ? 'is-open' : ''}`}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
