'use client';

import type { ReactNode } from 'react';
import { useSectionSpy } from '@/lib/hud';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Section eyebrow, e.g. "02 / HALL OF ARMOR". */
  eyebrow?: string;
  labelledBy?: string;
}

/** Standard horizontal gutters — clears the fixed HUD frame at every size. */
export const GUTTER = 'px-8 sm:px-12 md:px-16 lg:px-24';

export default function Section({
  id,
  children,
  className = '',
  eyebrow,
  labelledBy,
}: SectionProps) {
  const ref = useSectionSpy(id);

  return (
    <section
      id={id}
      ref={ref}
      aria-labelledby={labelledBy}
      className={`relative ${GUTTER} ${className}`}
    >
      {eyebrow ? (
        <p className="mono mb-10" style={{ color: 'var(--arc-dim)' }}>
          {eyebrow}
        </p>
      ) : null}
      {children}
    </section>
  );
}
