'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Section from '@/components/Section';

/**
 * THE CAVE — the soul of the site. Everything before it is setup.
 *
 * The visual language drops away here: no cards, no grid, no reticles.
 * Background darkens, the HUD frame dims to 30% (handled in HudFrame),
 * and the arc reactor destabilises (handled in ArcReactor, driven by
 * `unstable` in the HUD context). Copy is verbatim from the spec.
 */

const PARAGRAPHS = [
  'Everybody remembers the flying. Nobody remembers that the first one couldn’t land.',
  'So here’s the honest version.',
  'I’m running four things at once right now. A startup with a deadline I set myself. Campus placements. Building in public. Content. I don’t know which one works. I’m not going to pretend I do.',
  'What I do know is this: in three years I’ve shipped fourteen builds — flower delivery, hospital compliance, clinical triage, equity research, autonomous research pipelines, Postgres tooling, agent infrastructure. Some placed in national competitions. Some got merged into other people’s repos. Some died quietly and deserved to.',
  'People will tell you that’s unfocused. I’ve decided it isn’t. It’s a search — and I’m running it in public, and I’m running it fast, because the only way I find out which one is the real suit is to build all of them.',
];

/** These land one at a time, with room around them. */
const CLOSERS = [
  'I’m confused. I know I’m confused. I’m doing it anyway.',
  'That’s who I am.',
];

export default function TheCave() {
  const reduced = useReducedMotion();

  const fade = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '0px 0px -18% 0px' },
    transition: { duration: reduced ? 0 : 0.7, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <Section id="cave" className="relative py-40 md:py-56" labelledBy="cave-title">
      {/* the room goes dark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, var(--cave) 0%, var(--cave) 55%, var(--hangar) 100%)',
        }}
      />

      <div className="mx-auto prose-cave">
        <p className="mono mb-12" style={{ color: 'var(--hotrod-hi)' }}>
          04 / CAVE <span style={{ color: 'var(--telemetry)' }}>·</span> POWER UNSTABLE
        </p>

        {/* Plex Sans, not the display face: in The Cave the HUD language
            drops away and the page just talks. */}
        <motion.h2
          id="cave-title"
          className="mb-14 font-semibold"
          style={{ fontSize: 'var(--t-h2)', lineHeight: 1.25, color: 'var(--readout)' }}
          {...fade(0)}
        >
          The first suit gets built in a cave. With a box of scraps.
        </motion.h2>

        {PARAGRAPHS.map((p, i) => (
          <motion.p key={i} className="mb-8" style={{ color: 'var(--telemetry)' }} {...fade(0.05 * i)}>
            {p}
          </motion.p>
        ))}

        <div className="mt-20 space-y-14">
          {CLOSERS.map((line, i) => (
            <motion.p
              key={i}
              className="text-[1.2rem] font-medium"
              style={{ color: 'var(--readout)' }}
              {...fade(0.05 * i)}
            >
              {line}
            </motion.p>
          ))}

          <motion.p
            className="text-[1.35rem] font-semibold"
            style={{ color: 'var(--hotrod-hi)' }}
            {...fade(0.1)}
          >
            Mark XV is next.
          </motion.p>
        </div>
      </div>
    </Section>
  );
}
