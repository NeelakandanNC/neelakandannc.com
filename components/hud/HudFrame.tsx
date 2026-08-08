'use client';

import { motion } from 'framer-motion';
import { useHud } from '@/lib/hud';

/**
 * The fixed inset border with corner brackets. This is the single element
 * that sells "you are inside a helmet" — it stays put while content
 * scrolls under it. Dims to 30% inside The Cave, where the visual
 * language deliberately drops away.
 */
export default function HudFrame() {
  const { unstable } = useHud();

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
      animate={{ opacity: unstable ? 0.3 : 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* inset hairline, 24px from the viewport edge (12px on mobile) */}
      <div
        className="absolute inset-3 md:inset-6"
        style={{ border: '1px solid color-mix(in srgb, var(--arc-dim) 45%, transparent)' }}
      />

      {/* corner brackets */}
      {(
        [
          ['top-3 left-3 md:top-6 md:left-6', 'border-t-2 border-l-2'],
          ['top-3 right-3 md:top-6 md:right-6', 'border-t-2 border-r-2'],
          ['bottom-3 left-3 md:bottom-6 md:left-6', 'border-b-2 border-l-2'],
          ['bottom-3 right-3 md:bottom-6 md:right-6', 'border-b-2 border-r-2'],
        ] as const
      ).map(([pos, edges]) => (
        <div
          key={pos}
          className={`absolute h-4 w-4 md:h-5 md:w-5 ${pos} ${edges}`}
          style={{ borderColor: 'var(--arc-dim)' }}
        />
      ))}
    </motion.div>
  );
}
