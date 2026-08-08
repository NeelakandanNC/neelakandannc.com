'use client';

import { motion } from 'framer-motion';
import type { Mark, Status } from '@/content/marks';
import Reticle from '@/components/hud/Reticle';

/**
 * Status vocabulary. Gold is back on FIELD TEST as the spec originally
 * wanted — removing the Flight Log freed the gold budget it used to
 * spend, so gold now reads as armour trim rather than a rationed token.
 */
const STATUS: Record<Status, { label: string; color: string; pulse?: boolean }> = {
  DEPLOYED: { label: 'DEPLOYED', color: 'var(--arc-text)' },
  ACTIVE: { label: 'ACTIVE', color: 'var(--arc-text)', pulse: true },
  ARCHIVED: { label: 'ARCHIVED', color: 'var(--telemetry)' },
  FIELD_TEST: { label: 'FIELD TEST', color: 'var(--gold-text)' },
  UNSTABLE: { label: 'UNSTABLE', color: 'var(--hotrod-hi)' },
};

export function StatusDot({ status }: { status: Status }) {
  const s = STATUS[status];
  return (
    <span className="inline-flex shrink-0 items-center gap-2">
      <span
        aria-hidden="true"
        className={`inline-block h-1.5 w-1.5 rounded-full ${s.pulse ? 'status-pulse' : ''}`}
        style={{ background: s.color }}
      />
      <span className="mono" style={{ color: s.color }}>
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
  const heavy = mark.weight === 2;

  return (
    <Reticle index={index} className={heavy ? 'md:col-span-2' : 'md:col-span-1'}>
      <motion.button
        type="button"
        layoutId={`mark-card-${mark.n}`}
        onClick={() => onSelect(mark)}
        aria-label={`Mark ${mark.numeral}, ${mark.name}. Open details.`}
        className="mark-card group h-full w-full text-left"
        style={
          // gold trim marks the builds that carry the most weight
          heavy ? { borderTop: '2px solid var(--gold)' } : undefined
        }
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <span className="mono" style={{ color: 'var(--arc-text)' }}>
            MARK {mark.numeral}
          </span>
          <StatusDot status={mark.status} />
        </div>

        {/* The numeral and the project name travel together into the
            detail panel as one shared element. */}
        <motion.h3
          layoutId={`mark-head-${mark.n}`}
          className="display mb-3 leading-[0.95]"
          style={{
            fontSize: heavy ? 'clamp(1.9rem,3.4vw,2.9rem)' : 'clamp(1.5rem,2.2vw,1.9rem)',
            color: 'var(--readout)',
          }}
        >
          {mark.name}
        </motion.h3>

        <hr className="mb-4 border-0 border-t" style={{ borderColor: 'var(--arc-dim)' }} />

        <p className="mb-5 text-[0.95rem]" style={{ color: 'var(--telemetry)' }}>
          {mark.tagline}
        </p>

        {/* tech stack — brightens on hover. --telemetry, not --arc-dim, so
            it clears 4.5:1 at 10px even when not hovered. */}
        <p className="mono mark-card__stack mt-auto text-[10px]">{mark.stack.join(' · ')}</p>
      </motion.button>
    </Reticle>
  );
}
