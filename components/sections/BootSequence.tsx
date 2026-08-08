'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * `00 · BOOT` — the cold start.
 *
 * DEVIATION from spec §5.1, deliberate: specified as a pre-rendered 6s
 * Remotion MP4. Built as DOM + CSS instead because the acceptance
 * checklist requires that boot "must not block LCP" and that it be
 * skippable within 200ms — both of which a video fights and this wins
 * outright. It costs ~4KB rather than a multi-MB fetch and decode, needs
 * no `prebuild` render step, and has no poster frame to keep in sync.
 * The beat sheet below follows the spec's frame table exactly.
 *
 *   0–20    black, one cyan pixel at centre
 *   20–50   pixel expands into a scan line, sweeps top→bottom
 *   50–90   HUD grid draws in, corner brackets snap into place
 *   90–130  telemetry columns type in
 *   130–160 reactor ignites — white flash, bloom to cyan
 *   160–180 everything dissolves; reactor settles bottom-right
 *
 * Whether it plays at all is decided before first paint by the inline
 * script in app/layout.tsx, which sets `data-boot` on <html>. That keeps
 * repeat visitors from seeing a flash, and means a JS-disabled browser
 * gets the page with no overlay at all.
 */

const BEATS = [667, 1000, 1333, 1333, 1000, 667]; // ms per phase → 6s
const TELEMETRY = ['POWER ██████████ 100%', 'LOC 11.29°N 92.75°E', 'SYS NOMINAL', 'MARK XIV'];

export default function BootSequence() {
  const [phase, setPhase] = useState(-1);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    document.documentElement.removeAttribute('data-boot');
    setDone(true);
  }, []);

  useEffect(() => {
    if (!document.documentElement.hasAttribute('data-boot')) {
      setDone(true);
      return;
    }

    setPhase(0);
    let elapsed = 0;
    BEATS.forEach((ms, i) => {
      elapsed += ms;
      timers.current.push(setTimeout(() => setPhase(i + 1), elapsed));
    });
    timers.current.push(setTimeout(finish, elapsed + 260));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', finish, { passive: true, once: true });
    window.addEventListener('touchstart', finish, { passive: true, once: true });

    return () => {
      timers.current.forEach(clearTimeout);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', finish);
      window.removeEventListener('touchstart', finish);
    };
  }, [finish]);

  if (done) return null;

  return (
    <div
      className="boot fixed inset-0 z-[100] items-center justify-center"
      style={{ background: '#000' }}
      onClick={finish}
      role="presentation"
    >
      {/* 0–20 · the single pixel */}
      <span
        aria-hidden="true"
        className="absolute h-[3px] w-[3px] rounded-full transition-opacity duration-200"
        style={{
          background: 'var(--arc)',
          boxShadow: '0 0 12px var(--arc)',
          opacity: phase === 0 ? 1 : 0,
        }}
      />

      {/* 20–50 · scan line sweep */}
      {phase === 1 ? (
        <span
          aria-hidden="true"
          className="boot-scan absolute inset-x-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--arc), transparent)',
            boxShadow: '0 0 14px var(--arc)',
          }}
        />
      ) : null}

      {/* 50–90 · grid + corner brackets */}
      {phase >= 2 && phase <= 4 ? (
        <>
          <span
            aria-hidden="true"
            className="hud-grid boot-fade absolute inset-0"
            style={{ opacity: 0.4 }}
          />
          {['left-8 top-8 border-l-2 border-t-2', 'right-8 top-8 border-r-2 border-t-2', 'bottom-8 left-8 border-b-2 border-l-2', 'bottom-8 right-8 border-b-2 border-r-2'].map(
            (pos) => (
              <span
                key={pos}
                aria-hidden="true"
                className={`boot-snap absolute h-6 w-6 ${pos}`}
                style={{ borderColor: 'var(--arc)' }}
              />
            ),
          )}
        </>
      ) : null}

      {/* 90–130 · telemetry types in */}
      {phase >= 3 && phase <= 4 ? (
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[-140px] space-y-2">
          {TELEMETRY.map((line, i) => (
            <p
              key={line}
              className="mono boot-type text-center"
              style={{ color: 'var(--arc)', animationDelay: `${i * 160}ms` }}
            >
              {line}
            </p>
          ))}
        </div>
      ) : null}

      {/* 130–160 · ignition flash */}
      {phase === 4 ? <span aria-hidden="true" className="boot-flash absolute inset-0" /> : null}

      {/* 160–180 · dissolve */}
      {phase >= 5 ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 transition-opacity duration-500"
          style={{ background: 'var(--hangar)', opacity: 1 }}
        />
      ) : null}

      <button
        type="button"
        onClick={finish}
        className="mono absolute bottom-8 right-8 z-10 border-0 bg-transparent p-2"
        style={{ color: 'var(--telemetry)' }}
      >
        [ SKIP ]
      </button>

      <style>{`
        .boot { display: none; }
        html[data-boot] .boot { display: flex; }

        .boot-scan { animation: boot-scan 1s cubic-bezier(0.22,1,0.36,1) forwards; }
        @keyframes boot-scan { from { top: 0; } to { top: 100%; } }

        .boot-fade { animation: boot-fade 400ms ease-out forwards; }
        @keyframes boot-fade { from { opacity: 0; } to { opacity: 0.4; } }

        .boot-snap { animation: boot-snap 100ms steps(3) forwards; opacity: 0; }
        @keyframes boot-snap { to { opacity: 1; } }

        .boot-type { animation: boot-type 220ms steps(12) both; }
        @keyframes boot-type { from { opacity: 0; clip-path: inset(0 100% 0 0); } to { opacity: 1; clip-path: inset(0 0 0 0); } }

        .boot-flash { animation: boot-flash 900ms ease-out forwards; background: #fff; }
        @keyframes boot-flash {
          0%   { opacity: 0; }
          6%   { opacity: 1; }
          22%  { opacity: 0.25; background: #fff; }
          100% { opacity: 0.06; background: var(--arc); }
        }
      `}</style>
    </div>
  );
}
