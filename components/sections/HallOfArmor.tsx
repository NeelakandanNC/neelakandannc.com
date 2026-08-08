'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import Section from '@/components/Section';
import { CATEGORIES, marks, type Filter, type Mark } from '@/content/marks';
import MarkCard from './MarkCard';
import MarkDetail from './MarkDetail';

export default function HallOfArmor() {
  const [filter, setFilter] = useState<Filter>('ALL');
  const [selected, setSelected] = useState<Mark | null>(null);

  const visible = useMemo(
    () => (filter === 'ALL' ? marks : marks.filter((m) => m.category === filter)),
    [filter],
  );

  return (
    <Section id="armor" eyebrow="02 / HALL OF ARMOR" labelledBy="armor-title" className="py-28">
      <div className="mb-4 max-w-[62ch]">
        <h2 id="armor-title" className="display mb-4 leading-[1.02]" style={{ fontSize: 'var(--t-h2)' }}>
          Fourteen suits in three years.
        </h2>
        <p style={{ color: 'var(--telemetry)' }}>
          Every project is a Mark. The failures are on the wall next to the wins, because
          leaving them off would make the wins mean less.
        </p>
      </div>

      {/* filter rail */}
      <div role="group" aria-label="Filter Marks by category" className="mb-12 flex flex-wrap gap-x-6 gap-y-3">
        {CATEGORIES.map((c) => {
          const on = filter === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={on}
              className="mono transition-colors duration-150"
              style={{
                color: on ? 'var(--arc)' : 'var(--telemetry)',
                borderBottom: `1px solid ${on ? 'var(--arc)' : 'transparent'}`,
                paddingBottom: 2,
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <LayoutGroup>
        {/* Asymmetric rail, not a uniform grid: the visual weight IS the
            ranking. `dense` lets span-1 cards backfill the gaps. */}
        <div
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          style={{ gridAutoFlow: 'dense' }}
        >
          {visible.map((mark, i) => (
            <MarkCard key={mark.n} mark={mark} index={i} onSelect={setSelected} />
          ))}
        </div>

        <AnimatePresence>
          {selected ? <MarkDetail mark={selected} onClose={() => setSelected(null)} /> : null}
        </AnimatePresence>
      </LayoutGroup>
    </Section>
  );
}
