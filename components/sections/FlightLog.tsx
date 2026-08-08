'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Section from '@/components/Section';
import { flightLog } from '@/content/log';

/**
 * Vertical timeline with a cyan hairline spine.
 * The gold ◆ marks verified achievements — exactly five, sitewide.
 */
export default function FlightLog() {
  const reduced = useReducedMotion();

  return (
    <Section id="log" eyebrow="06 / FLIGHT LOG" labelledBy="log-title" className="py-28">
      <div className="mb-14 max-w-[62ch]">
        <h2 id="log-title" className="mb-4 font-semibold" style={{ fontSize: 'var(--t-h2)' }}>
          Building in public, logged.
        </h2>
        <p style={{ color: 'var(--telemetry)' }}>
          Dates are year-level where the exact day isn’t on record. Nothing here is rounded up.
        </p>
      </div>

      <ol className="relative max-w-[68ch]">
        {/* the spine */}
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-[7px] top-2 w-px"
          style={{ background: 'color-mix(in srgb, var(--arc-dim) 70%, transparent)' }}
        />

        {flightLog.map((entry, i) => (
          <motion.li
            key={entry.title}
            className="relative mb-10 pl-10"
            initial={reduced ? false : { opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{
              duration: reduced ? 0 : 0.42,
              delay: reduced ? 0 : Math.min(i * 0.04, 0.3),
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* node — gold ◆ for verified, cyan tick otherwise */}
            {entry.verified ? (
              <span
                aria-label="Verified achievement"
                className="absolute left-0 top-1 text-[15px] leading-none"
                style={{ color: 'var(--gold)' }}
              >
                ◆
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="absolute left-[3px] top-[7px] h-2 w-2 rounded-full"
                style={{ background: 'var(--arc-dim)' }}
              />
            )}

            {/* --telemetry, not gold: the ◆ is the only gold element on the
                page, so the budget stays at exactly five. It's also the only
                one of the two that clears 4.5:1 at this size. */}
            <p className="mono mb-1.5" style={{ color: 'var(--telemetry)' }}>
              {entry.stamp}
            </p>

            <h3 className="mono mb-2 !text-[13px] !tracking-[0.1em]" style={{ color: 'var(--readout)' }}>
              {entry.href ? (
                <a
                  href={entry.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="draw-underline"
                >
                  {entry.title} ↗
                </a>
              ) : (
                entry.title
              )}
            </h3>

            <p className="text-[0.97rem]" style={{ color: 'var(--telemetry)' }}>
              {entry.body}
            </p>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
