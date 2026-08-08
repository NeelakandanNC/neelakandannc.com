'use client';

import { motion } from 'framer-motion';
import type { Mark, Status } from '@/content/marks';
import Reticle from '@/components/hud/Reticle';

/**
 * Status vocabulary.
 *
 * NOTE — deviation from spec §6.02, deliberate: the spec lists FIELD TEST
 * as gold, but §2.1 and the acceptance checklist both cap gold at five
 * uses reserved for verified achievements, and the five Flight Log
 * markers already spend that budget. FIELD TEST therefore reads as a
 * hollow cyan ring — distinct from DEPLOYED's filled dot without
 * breaking the gold rule. Flip it here if you'd rather spend the gold.
 */
const STATUS: Record<Status, { label: string; color: string; hollow?: boolean; pulse?: boolean }> = {
  DEPLOYED: { label: 'DEPLOYED', color: 'var(--arc)' },
  ACTIVE: { label: 'ACTIVE', color: 'var(--arc)', pulse: true },
  ARCHIVED: { label: 'ARCHIVED', color: 'var(--arc-dim)' },
  FIELD_TEST: { label: 'FIELD TEST', color: 'var(--arc)', hollow: true },
  UNSTABLE: { label: 'UNSTABLE', color: 'var(--hotrod-hi)' },
};

export function StatusDot({ status }: { status: Status }) {
  const s = STATUS[status];
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`inline-block h-1.5 w-1.5 rounded-full ${s.pulse ? 'status-pulse' : ''}`}
        style={{
          background: s.hollow ? 'transparent' : s.color,
          boxShadow: s.hollow ? `inset 0 0 0 1.5px ${s.color}` : undefined,
        }}
      />
      <span className="mono" style={{ color: s.color === 'var(--arc-dim)' ? 'var(--telemetry)' : s.color }}>
        {s.label}
      </span>
    </span>
  );
}

interface MarkCardProps {
  mark: Mark;
  index: number;
  onSelect: (mark: Mark) => void;
}

export default function MarkCard({ mark, index, onSelect }: MarkCardProps) {
  return (
    <Reticle
      index={index}
      className={mark.weight === 2 ? 'md:col-span-2' : 'md:col-span-1'}
    >
      <motion.button
        type="button"
        layoutId={`mark-card-${mark.n}`}
        onClick={() => onSelect(mark)}
        aria-label={`${mark.name} — Mark ${mark.numeral}. Open details.`}
        className="mark-card group h-full w-full text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <motion.span
            layoutId={`mark-numeral-${mark.n}`}
            className="display"
            style={{
              fontSize: mark.weight === 2 ? 'clamp(1.6rem,3vw,2.4rem)' : '1.35rem',
              color: 'var(--readout)',
            }}
          >
            MARK {mark.numeral}
          </motion.span>
          <StatusDot status={mark.status} />
        </div>

        <hr className="my-4 border-0 border-t" style={{ borderColor: 'var(--arc-dim)', opacity: 0.5 }} />

        <h3 className="mb-2 text-[1.05rem] font-semibold uppercase tracking-wide" style={{ color: 'var(--readout)' }}>
          {mark.name}
        </h3>
        <p className="mb-5 text-[0.95rem]" style={{ color: 'var(--telemetry)' }}>
          {mark.tagline}
        </p>

        {/* tech stack — brightens on hover. Uses --telemetry rather than
            --arc-dim so it clears 4.5:1 at 10px even when not hovered. */}
        <p className="mono mark-card__stack mt-auto text-[10px]">{mark.stack.join(' · ')}</p>
      </motion.button>
    </Reticle>
  );
}
