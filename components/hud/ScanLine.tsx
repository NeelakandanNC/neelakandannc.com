'use client';

import { useReducedMotion } from 'framer-motion';

/**
 * Ambient sweep. Very low opacity — this is atmosphere, not an event.
 * It is the only thing on the page permitted to animate continuously,
 * which is why nothing else here loops.
 */
export default function ScanLine() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-30 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, color-mix(in srgb, var(--arc) 45%, transparent), transparent)',
          animation: 'scan 9s linear infinite',
        }}
      />
      <style>{`
        @keyframes scan {
          0%   { transform: translateY(0vh);   opacity: 0; }
          8%   { opacity: 0.55; }
          92%  { opacity: 0.55; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </>
  );
}
