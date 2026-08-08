'use client';

import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { useHud } from '@/lib/hud';

/* ── Geometry ────────────────────────────────────────────────────
   viewBox 0 0 100 100, centred on (50,50). Everything below is pure
   SVG + CSS: no images, no libraries, no third-party assets.       */

const CX = 50;
const CY = 50;
const R_BEZEL = 46;
const C_BEZEL = 2 * Math.PI * R_BEZEL;

const COIL_COUNT = 10;
const COIL_INNER = 25;
const COIL_OUTER = 37;
const COIL_GAP_DEG = 6;

function polar(r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)] as const;
}

/** Ten trapezoid coils, generated once at module scope so server and
    client render byte-identical markup. */
const COILS: string[] = Array.from({ length: COIL_COUNT }, (_, i) => {
  const step = 360 / COIL_COUNT;
  const a0 = i * step + COIL_GAP_DEG / 2;
  const a1 = (i + 1) * step - COIL_GAP_DEG / 2;
  const pts = [
    polar(COIL_INNER, a0),
    polar(COIL_OUTER, a0),
    polar(COIL_OUTER, a1),
    polar(COIL_INNER, a1),
  ];
  return pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
});

/** Inner triangular core. */
const CORE_TRI = [polar(12, 0), polar(12, 120), polar(12, 240)]
  .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
  .join(' ');

interface ArcReactorProps {
  /** `fixed` = the persistent HUD instance. `inline` = the large COMMS core. */
  variant?: 'fixed' | 'inline';
  size?: number;
}

export default function ArcReactor({ variant = 'fixed', size }: ArcReactorProps) {
  const { scrollYProgress, unstable } = useHud();
  const reduced = useReducedMotion();

  const rotation = useMotionValue(0);
  const jitterX = useMotionValue(0);
  const jitterY = useMotionValue(0);
  const flicker = useMotionValue(1);
  const pulse = useMotionValue(1);

  const stutterUntil = useRef(0);

  /* Job 1 — the outer ring IS the scroll progress bar. */
  const dashoffset = useTransform(scrollYProgress, [0, 1], [C_BEZEL, 0]);

  /* Job 2 — the page spins up: glow and coil speed scale with depth. */
  const glow = useTransform(scrollYProgress, [0, 1], [2, 9]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 0.95]);
  const coilOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.9]);

  useAnimationFrame((time, delta) => {
    // Reduced motion: the reactor stops spinning but KEEPS its fill state.
    if (reduced) return;

    const depth = scrollYProgress.get();
    const degPerSec = 6 + depth * 26;
    rotation.set((rotation.get() + (degPerSec * delta) / 1000) % 360);

    /* Job 4 — instability. Only in The Cave. An irregular ~2% duty-cycle
       stutter plus 1px positional jitter: the power core becomes unstable
       at exactly the moment the copy admits he hasn't figured it out.
       Nobody consciously notices this. Everybody feels it. */
    if (!unstable) {
      if (flicker.get() !== 1) flicker.set(1);
      if (jitterX.get() !== 0) {
        jitterX.set(0);
        jitterY.set(0);
      }
      return;
    }

    if (time > stutterUntil.current) {
      if (Math.random() < 0.014) {
        stutterUntil.current = time + 30 + Math.random() * 70;
      } else {
        flicker.set(1);
        jitterX.set(0);
        jitterY.set(0);
      }
    }

    if (time <= stutterUntil.current) {
      flicker.set(0.3 + Math.random() * 0.35);
      jitterX.set((Math.random() - 0.5) * 2);
      jitterY.set((Math.random() - 0.5) * 2);
    }
  });

  /* Job 3 — section identity. Cyan everywhere; hot-rod in The Cave. */
  const coreColor = unstable ? 'var(--hotrod)' : 'var(--arc)';
  const ringColor = coreColor;

  // Two reactors exist at once (the fixed HUD one and the large COMMS
  // core), so the gradient id has to be unique per instance.
  const bloomId = `reactor-bloom-${variant}`;

  const dropShadow = useTransform([glow, glowOpacity], ([b, o]: number[]) => {
    const tint = unstable ? 'var(--hotrod)' : 'var(--arc)';
    return `drop-shadow(0 0 ${b.toFixed(1)}px color-mix(in srgb, ${tint} ${Math.round(
      o * 100,
    )}%, transparent))`;
  });

  async function handleClick() {
    // Power-down, then power-up.
    const seq = reduced ? [1] : [0.84, 1.08, 1];
    for (const v of seq) {
      pulse.set(v);
      await new Promise((r) => setTimeout(r, reduced ? 0 : 130));
    }
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }

  const svg = (
    <motion.svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{
        x: jitterX,
        y: jitterY,
        opacity: flicker,
        scale: pulse,
        filter: dropShadow,
      }}
    >
      {/* soft radial bloom */}
      <defs>
        <radialGradient id={bloomId}>
          <stop offset="0%" stopColor={coreColor} stopOpacity="0.5" />
          <stop offset="55%" stopColor={coreColor} stopOpacity="0.12" />
          <stop offset="100%" stopColor={coreColor} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={CX} cy={CY} r={48} fill={`url(#${bloomId})`} />

      {/* outer bezel */}
      <circle
        cx={CX}
        cy={CY}
        r={R_BEZEL}
        fill="none"
        stroke="var(--arc-dim)"
        strokeWidth={2}
        opacity={0.55}
      />

      {/* Job 1: scroll-linked fill arc */}
      <motion.circle
        cx={CX}
        cy={CY}
        r={R_BEZEL}
        fill="none"
        stroke={ringColor}
        strokeWidth={2.5}
        strokeLinecap="butt"
        strokeDasharray={C_BEZEL}
        style={{ strokeDashoffset: dashoffset }}
        transform={`rotate(-90 ${CX} ${CY})`}
      />

      {/* segmented coil ring */}
      <motion.g style={{ rotate: rotation, originX: '50px', originY: '50px', opacity: coilOpacity }}>
        {COILS.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill={i % 2 === 0 ? coreColor : 'var(--arc-dim)'}
            opacity={i % 2 === 0 ? 0.85 : 0.5}
          />
        ))}
      </motion.g>

      {/* core housing + triangular core */}
      <circle cx={CX} cy={CY} r={21} fill="var(--hangar)" stroke="var(--arc-dim)" strokeWidth={1} />
      <polygon points={CORE_TRI} fill={coreColor} opacity={0.95} />
      <circle cx={CX} cy={CY} r={5} fill="var(--readout)" opacity={0.9} />
    </motion.svg>
  );

  if (variant === 'inline') {
    return (
      <div
        aria-hidden="true"
        style={{ width: size ?? 180, height: size ?? 180 }}
        className="shrink-0"
      >
        {svg}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll to top"
      /* Sits above the bottom-right depth readout so the two never collide. */
      className="fixed z-50 cursor-pointer border-0 bg-transparent p-0
                 bottom-7 left-1/2 -translate-x-1/2 h-[52px] w-[52px]
                 md:left-auto md:translate-x-0 md:right-9 md:bottom-20 md:h-[72px] md:w-[72px]"
    >
      {svg}
    </button>
  );
}
