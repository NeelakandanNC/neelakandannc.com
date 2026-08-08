'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Section from '@/components/Section';

const HEADLINE = 'STILL IN THE CAVE';

export default function Hero() {
  const reduced = useReducedMotion();
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  /* Cursor parallax on the HUD grid: ±6px. Six, not sixty. */
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      setParallax({ x, y });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  return (
    <Section id="hero" className="flex min-h-[100svh] items-center py-28">
      {/* ambient grid — the only thing that parallaxes */}
      <motion.div
        aria-hidden="true"
        className="hud-grid pointer-events-none absolute inset-0 -z-10"
        animate={{ x: parallax.x, y: parallax.y }}
        transition={{ type: 'spring', stiffness: 60, damping: 20, mass: 0.6 }}
        style={{
          maskImage: 'radial-gradient(ellipse at 30% 50%, black 10%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 30% 50%, black 10%, transparent 72%)',
        }}
      />

      {/* Content sits left-of-centre. The right two-fifths stay empty so the
          reactor and telemetry have room to breathe. Resist filling it. */}
      <div className="w-full max-w-[62ch] lg:max-w-[54%]">
        <p className="mono mb-8" style={{ color: 'var(--arc-dim)' }}>
          MARK XIV <span style={{ color: 'var(--arc)' }}>·</span> BUILD IN PROGRESS
        </p>

        <h1
          id="hero-title"
          className="display mb-8"
          style={{
            fontSize: 'var(--t-hero)',
            lineHeight: 0.95,
            color: 'var(--readout)',
          }}
        >
          {/* staggered per-character reveal, 24ms apart */}
          <span className="sr-only">{HEADLINE}</span>
          <span aria-hidden="true">
            {HEADLINE.split(' ').map((word, wi, words) => (
              <span key={wi} className="inline-block whitespace-nowrap">
                {word.split('').map((ch, ci) => {
                  const globalIndex =
                    words.slice(0, wi).join(' ').length + (wi > 0 ? 1 : 0) + ci;
                  return (
                    <motion.span
                      key={ci}
                      className="inline-block"
                      initial={reduced ? false : { opacity: 0, y: '0.35em' }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduced ? 0 : 0.42,
                        delay: reduced ? 0 : 0.35 + globalIndex * 0.024,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {ch}
                    </motion.span>
                  );
                })}
                {wi < words.length - 1 ? <span>&nbsp;</span> : null}
              </span>
            ))}
          </span>
        </h1>

        <motion.p
          className="mb-12 max-w-[46ch]"
          style={{ color: 'var(--telemetry)' }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: reduced ? 0 : 0.85 }}
        >
          Final-year ECE at NIT Agartala who stopped doing ECE. I build AI agents, trading
          systems, and research pipelines. Fourteen builds in three years. Most of them taught
          me something. Some of them worked.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: reduced ? 0 : 1 }}
        >
          <a href="#armor" className="hud-cta hud-cta--primary mono">
            [ HALL OF ARMOR ↓ ]
          </a>
          <a href="#comms" className="hud-cta mono">
            [ COMMS ]
          </a>
        </motion.div>
      </div>
    </Section>
  );
}
