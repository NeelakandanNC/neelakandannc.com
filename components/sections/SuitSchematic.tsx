'use client';

import { useReducedMotion } from 'framer-motion';

/**
 * Exploded-view wireframe schematic — the ambient layer behind Diagnostics.
 *
 * DEVIATION from spec §5.2, deliberate: specified as a 12s VP9-with-alpha
 * Remotion loop. Built as inline SVG instead because
 *   · alpha works in Safari with no APNG fallback to maintain,
 *   · it costs ~3KB of markup instead of a multi-MB video decode,
 *   · reduced-motion is a one-line branch rather than a poster swap,
 *   · and it needs no build-time render step.
 * Same visual outcome, strictly cheaper. The geometry is abstract and
 * deliberately NOT a humanoid figure.
 *
 * All coordinates are computed deterministically at module scope, so the
 * server and client render identical markup.
 */

const CX = 600;
const CY = 600;

function ring(r: number, sides: number, rotate = 0) {
  return Array.from({ length: sides }, (_, i) => {
    const a = ((i / sides) * 360 + rotate - 90) * (Math.PI / 180);
    return `${(CX + r * Math.cos(a)).toFixed(1)},${(CY + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

/** Radial spokes at fixed angles. */
const SPOKES = Array.from({ length: 12 }, (_, i) => {
  const a = ((i / 12) * 360 - 90) * (Math.PI / 180);
  return {
    x1: CX + 130 * Math.cos(a),
    y1: CY + 130 * Math.sin(a),
    x2: CX + 470 * Math.cos(a),
    y2: CY + 470 * Math.sin(a),
  };
});

/** Callout leader lines — fade in and out on a stagger. */
const CALLOUTS = [
  { x: 300, y: 250, tx: 150, ty: 180, label: 'ASSY-01' },
  { x: 880, y: 360, tx: 1030, ty: 300, label: 'ASSY-04' },
  { x: 820, y: 880, tx: 980, ty: 960, label: 'ASSY-09' },
  { x: 320, y: 830, tx: 160, ty: 900, label: 'ASSY-11' },
];

export default function SuitSchematic() {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
      style={{ opacity: 0.22, mixBlendMode: 'screen' }}
    >
      <svg
        viewBox="0 0 1200 1200"
        className="h-[min(120vh,1200px)] w-[min(120vh,1200px)] max-w-none"
        fill="none"
        stroke="var(--arc)"
        strokeWidth={1}
      >
        <g className={reduced ? undefined : 'schematic-spin'} style={{ transformOrigin: '600px 600px' }}>
          <polygon points={ring(470, 3)} opacity={0.35} />
          <polygon points={ring(400, 6, 15)} opacity={0.5} />
          <polygon points={ring(300, 12)} opacity={0.4} />
          <circle cx={CX} cy={CY} r={210} opacity={0.55} />
          <polygon points={ring(150, 6)} opacity={0.7} />
          <circle cx={CX} cy={CY} r={70} opacity={0.8} />

          {SPOKES.map((s, i) => (
            <line
              key={i}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              opacity={i % 3 === 0 ? 0.45 : 0.18}
            />
          ))}

          {/* exploded plates, offset off-axis */}
          <polygon points={ring(90, 4, 45)} transform="translate(330 -260)" opacity={0.5} />
          <polygon points={ring(70, 4, 45)} transform="translate(-350 250)" opacity={0.45} />
          <polygon points={ring(55, 3)} transform="translate(260 330)" opacity={0.4} />
        </g>

        {CALLOUTS.map((c, i) => (
          <g
            key={c.label}
            className={reduced ? undefined : 'schematic-callout'}
            style={{ animationDelay: `${i * 1.4}s` }}
            opacity={reduced ? 0.5 : undefined}
          >
            <line x1={c.x} y1={c.y} x2={c.tx} y2={c.ty} opacity={0.7} />
            <circle cx={c.x} cy={c.y} r={3} fill="var(--arc)" stroke="none" />
            <text
              x={c.tx}
              y={c.ty - 10}
              fill="var(--arc)"
              stroke="none"
              fontSize={20}
              letterSpacing={3}
              fontFamily="var(--font-mono)"
            >
              {c.label}
            </text>
          </g>
        ))}
      </svg>

      <style>{`
        .schematic-spin { animation: schematic-spin 96s linear infinite; }
        @keyframes schematic-spin { to { transform: rotate(360deg); } }
        .schematic-callout { animation: schematic-callout 5.6s var(--ease) infinite; opacity: 0; }
        @keyframes schematic-callout {
          0%, 100% { opacity: 0; }
          15%, 55%  { opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}
