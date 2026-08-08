'use client';

import { useEffect, useState } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import { useHud } from '@/lib/hud';

/**
 * Corner readouts, fixed to the HUD frame.
 *   top-left     NEELAKANDAN N C · MARK XIV
 *   top-right    live IST clock
 *   bottom-left  current section, updates on scroll
 *   bottom-right scroll depth
 *
 * On mobile only top-left and bottom-right survive — the rest would eat
 * the screen. Text is --telemetry, not --arc-dim: see the contrast audit
 * in globals.css.
 */

const cornerBase =
  'mono pointer-events-none fixed z-40 select-none whitespace-nowrap text-[10px] md:text-[11px]';

function ISTClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Renders null on the server so the clock can never cause a hydration
  // mismatch; it appears on the first client tick.
  if (!time) return null;
  return <>{time} IST</>;
}

export default function Telemetry() {
  const { scrollYProgress, active } = useHud();
  const [depth, setDepth] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setDepth(Math.round(v * 100));
  });

  return (
    <>
      <div className={`${cornerBase} left-5 top-5 md:left-9 md:top-9`} style={{ color: 'var(--telemetry)' }}>
        NEELAKANDAN N C <span style={{ color: 'var(--arc-dim)' }}>·</span> MARK XIV
      </div>

      <div
        className={`${cornerBase} right-5 top-5 hidden md:right-9 md:top-9 md:block`}
        style={{ color: 'var(--telemetry)' }}
      >
        <ISTClock />
      </div>

      <div
        className={`${cornerBase} bottom-5 left-5 hidden md:bottom-9 md:left-9 md:block`}
        style={{ color: 'var(--telemetry)' }}
      >
        {active.index} / {active.label}
      </div>

      <div
        className={`${cornerBase} bottom-5 right-5 md:bottom-9 md:right-9`}
        style={{ color: 'var(--telemetry)' }}
      >
        {String(depth).padStart(3, '0')}%
      </div>
    </>
  );
}
