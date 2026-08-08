'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Viewport-entry lock-on brackets. Four corner brackets converge from
 * 20px out to the element edge over 280ms.
 *
 * This is the one place a scroll animation genuinely informs: it tells
 * you where you are. Everything else that merely "fades up because that's
 * what cards do" has been cut.
 */

const CORNERS = [
  { pos: 'left-0 top-0 border-l-2 border-t-2', dx: -1, dy: -1 },
  { pos: 'right-0 top-0 border-r-2 border-t-2', dx: 1, dy: -1 },
  { pos: 'left-0 bottom-0 border-b-2 border-l-2', dx: -1, dy: 1 },
  { pos: 'right-0 bottom-0 border-b-2 border-r-2', dx: 1, dy: 1 },
] as const;

interface ReticleProps {
  children: ReactNode;
  /** Stagger index — 60ms per card. */
  index?: number;
  className?: string;
}

export default function Reticle({ children, index = 0, className = '' }: ReticleProps) {
  const reduced = useReducedMotion();
  const delay = reduced ? 0 : Math.min(index * 0.06, 0.48);

  return (
    <motion.div
      className={`relative ${className}`}
      initial="idle"
      whileInView="locked"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
    >
      {children}

      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        {CORNERS.map((c, i) => (
          <motion.span
            key={i}
            className={`absolute h-3 w-3 ${c.pos}`}
            style={{ borderColor: 'var(--arc)' }}
            variants={{
              idle: { opacity: 0, x: c.dx * 20, y: c.dy * 20 },
              locked: { opacity: 0.9, x: 0, y: 0 },
            }}
            transition={{
              duration: reduced ? 0 : 0.28,
              delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </span>
    </motion.div>
  );
}
