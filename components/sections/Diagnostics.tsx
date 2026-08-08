'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Section from '@/components/Section';
import { SEGMENTS, systems, type Grade } from '@/content/systems';
import SuitSchematic from './SuitSchematic';

const GRADE_COLOR: Record<Grade, string> = {
  PRIMARY: 'var(--arc)',
  OPERATIONAL: 'var(--telemetry)',
  DEVELOPING: 'var(--telemetry)',
};

function Bar({ filled, grade, index }: { filled: number; grade: Grade; index: number }) {
  const reduced = useReducedMotion();

  return (
    <span className="flex gap-[3px]" aria-hidden="true">
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <motion.span
          key={i}
          className="h-2.5 w-[7px]"
          style={{ background: i < filled ? GRADE_COLOR[grade] : 'var(--plate-hi)' }}
          initial={reduced ? false : { opacity: 0, scaleY: 0.3 }}
          whileInView={{ opacity: i < filled ? 1 : 0.5, scaleY: 1 }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{
            duration: reduced ? 0 : 0.6,
            delay: reduced ? 0 : index * 0.04 + i * 0.012,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </span>
  );
}

export default function Diagnostics() {
  let row = 0;

  return (
    <Section id="diagnostics" eyebrow="03 / SYSTEMS DIAGNOSTIC" labelledBy="diag-title" className="relative py-28">
      <SuitSchematic />

      <div className="mb-14 max-w-[62ch]">
        <h2 id="diag-title" className="mb-4 font-semibold" style={{ fontSize: 'var(--t-h2)' }}>
          Subsystems, honestly rated.
        </h2>
        <p style={{ color: 'var(--telemetry)' }}>
          A row of 95%-filled bars is the least credible thing on a portfolio. The low readings
          below are the reason you can trust the high ones.
        </p>
      </div>

      <div className="relative grid gap-14 lg:grid-cols-3">
        {systems.map((group) => (
          <div key={group.id}>
            <p className="mono mb-1" style={{ color: 'var(--arc)' }}>
              {group.title}
            </p>
            <p className="mono mb-6" style={{ color: 'var(--arc-dim)' }}>
              {group.subtitle}
            </p>

            <ul className="space-y-5">
              {group.items.map((item) => {
                const i = row++;
                return (
                  <li key={item.name}>
                    <div className="mb-2 flex items-baseline justify-between gap-4">
                      <span className="text-[0.95rem]" style={{ color: 'var(--readout)' }}>
                        {item.name}
                      </span>
                      <span className="mono shrink-0" style={{ color: GRADE_COLOR[item.grade] }}>
                        {item.grade}
                      </span>
                    </div>
                    <Bar filled={item.filled} grade={item.grade} index={i} />
                    <span className="sr-only">
                      {item.name}: {item.grade}, {Math.round((item.filled / SEGMENTS) * 100)} percent
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
