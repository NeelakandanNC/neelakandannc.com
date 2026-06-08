import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from './lib/useLenis.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CursorFX from './components/CursorFX.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import Home from './pages/Home.jsx';
import Purpose from './pages/Purpose.jsx';
import Journal from './pages/Journal.jsx';
import JournalEntry from './pages/JournalEntry.jsx';
import About from './pages/About.jsx';
import LearnDetail from './pages/LearnDetail.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

function Page({ children }) {
  return (
    <motion.main variants={pageVariants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.main>
  );
}

export default function App() {
  useLenis();
  const location = useLocation();

  // Scroll to top on route change (works with or without Lenis)
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <ScrollProgress />
      <CursorFX />
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/purpose" element={<Page><Purpose /></Page>} />
          <Route path="/journal" element={<Page><Journal /></Page>} />
          <Route path="/journal/:slug" element={<Page><JournalEntry /></Page>} />
          <Route path="/about" element={<Page><About /></Page>} />
          <Route path="/learn/:slug" element={<Page><LearnDetail /></Page>} />
          <Route path="/contact" element={<Page><Contact /></Page>} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}
