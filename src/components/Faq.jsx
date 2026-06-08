import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './Faq.css';

const faqs = [
  {
    q: 'What are you building right now?',
    a: 'Agentronics — autonomous AI agents that reason about hardware, sensors, and the physical world. Agents that touch atoms, not just bits.',
  },
  {
    q: 'Why journal your journey in public?',
    a: 'Building in private optimizes for looking competent; building in public optimizes for becoming competent. The dead-ends are where the real information lives, so I share them.',
  },
  {
    q: "What's your background?",
    a: 'Core electronics, then a self-taught path across technology, engineering (AI/ML), mathematics, and finance. Currently studying at NIT Agartala.',
  },
  {
    q: 'Are you open to collaboration or capital?',
    a: 'Yes — for the right thing. The fastest way to reach me is X or email. Long-form proposals and decks are welcome via email.',
  },
  {
    q: 'How many ventures have you started?',
    a: 'Nine so far — one active, the rest paused, closed, or lessons in disguise. Every one taught me something a polished case study would have hidden.',
  },
];

function Item({ item, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? 'is-open' : ''}`}>
      <button className="faq-item__q" onClick={onToggle} aria-expanded={isOpen}>
        <span>{item.q}</span>
        <span className="faq-item__icon" aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="faq-item__a-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="faq-item__a text-dim">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {faqs.map((item, i) => (
        <Item
          key={item.q}
          item={item}
          isOpen={open === i}
          onToggle={() => setOpen(open === i ? -1 : i)}
        />
      ))}
    </div>
  );
}
