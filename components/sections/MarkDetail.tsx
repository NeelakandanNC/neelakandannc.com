'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Mark } from '@/content/marks';
import { StatusDot } from './MarkCard';

interface MarkDetailProps {
  mark: Mark;
  onClose: () => void;
}

const FIELDS: Array<{ key: 'problem' | 'built' | 'outcome'; label: string }> = [
  { key: 'problem', label: 'THE PROBLEM' },
  { key: 'built', label: 'WHAT WAS BUILT' },
  { key: 'outcome', label: 'OUTCOME' },
];

export default function MarkDetail({ mark, onClose }: MarkDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /* Esc to close, focus moved into the panel, focus trapped while open,
     and page scroll locked behind it. */
  useEffect(() => {
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
      <motion.div
        className="absolute inset-0"
        style={{ background: 'color-mix(in srgb, var(--hangar) 88%, transparent)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        ref={panelRef}
        layoutId={`mark-card-${mark.n}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`mark-detail-${mark.n}`}
        className="relative max-h-[86svh] w-full max-w-3xl overflow-y-auto p-7 sm:p-10"
        style={{
          background: 'var(--plate)',
          border: '1px solid var(--arc)',
          boxShadow: '0 0 60px color-mix(in srgb, var(--arc) 12%, transparent)',
        }}
      >
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            {/* The shared element. It must travel continuously. */}
            <motion.h2
              id={`mark-detail-${mark.n}`}
              layoutId={`mark-numeral-${mark.n}`}
              className="display"
              style={{ fontSize: 'var(--t-mark)', color: 'var(--readout)' }}
            >
              MARK {mark.numeral}
            </motion.h2>
            <p className="mt-3 text-xl font-semibold" style={{ color: 'var(--readout)' }}>
              {mark.name}
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="mono shrink-0 border px-3 py-2"
            style={{ borderColor: 'var(--arc-dim)', color: 'var(--telemetry)' }}
          >
            [ ESC ]
          </button>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          <StatusDot status={mark.status} />
          <span className="mono" style={{ color: 'var(--arc-dim)' }}>
            {mark.category}
          </span>
        </div>

        {FIELDS.map(({ key, label }) => (
          <div key={key} className="mb-7">
            <p className="mono mb-2" style={{ color: 'var(--arc-dim)' }}>
              {label}
            </p>
            <p className="max-w-[62ch]" style={{ color: 'var(--telemetry)' }}>
              {mark[key]}
            </p>
          </div>
        ))}

        <div className="mb-7">
          <p className="mono mb-2" style={{ color: 'var(--arc-dim)' }}>
            STACK
          </p>
          <ul className="flex flex-wrap gap-2">
            {mark.stack.map((s) => (
              <li
                key={s}
                className="mono px-2.5 py-1"
                style={{ border: '1px solid var(--arc-dim)', color: 'var(--telemetry)' }}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        {mark.links && Object.keys(mark.links).length > 0 ? (
          <div className="flex flex-wrap gap-5">
            {Object.entries(mark.links).map(([kind, href]) =>
              href ? (
                <a
                  key={kind}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono draw-underline"
                  style={{ color: 'var(--arc)' }}
                >
                  {kind.toUpperCase()} ↗
                </a>
              ) : null,
            )}
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
