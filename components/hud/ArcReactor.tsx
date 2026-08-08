'use client';

import { useId, useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { useHud } from '@/lib/hud';

/* ═══════════════════════════════════════════════════════════════
   THE ARC REACTOR — the signature element.

   ORIGINAL ARTWORK. Every line here is generated geometry: a notched
   outer bezel, ten wound copper coils, an inner glow ring and a
   triangular core under heavy bloom. No film stills, no traced assets,
   no third-party IP — the construction is drawn from first principles
   so the whole thing is code we own.

   It does four jobs at once, which is why it earns its place:
     1. the outer ring IS the scroll progress bar
     2. glow and coil speed scale with scroll depth (the page spins up)
     3. the core shifts colour per section — red in The Cave
     4. it destabilises in The Cave, then re-stabilises after
   ═══════════════════════════════════════════════════════════════ */

const CX = 50;
const CY = 50;
const R_BEZEL = 49;
const C_BEZEL = 2 * Math.PI * R_BEZEL;

const COIL_COUNT = 10;
const COIL_INNER = 24;
const COIL_OUTER = 38;
const COIL_GAP_DEG = 5;

function polar(r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)] as const;
}

const fmt = (pts: ReadonlyArray<readonly [number, number]>) =>
  pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

/** Ten trapezoid coils, each with three winding lines across it. */
const COILS = Array.from({ length: COIL_COUNT }, (_, i) => {
  const step = 360 / COIL_COUNT;
  const a0 = i * step + COIL_GAP_DEG / 2;
  const a1 = (i + 1) * step - COIL_GAP_DEG / 2;

  const body = fmt([
    polar(COIL_INNER, a0),
    polar(COIL_OUTER, a0),
    polar(COIL_OUTER, a1),
    polar(COIL_INNER, a1),
  ]);

  // copper windings wrapped across the coil face
  const windings = [0.16, 0.3, 0.44, 0.58, 0.72, 0.86].map((t) => {
    const r = COIL_INNER + (COIL_OUTER - COIL_INNER) * t;
    const [x1, y1] = polar(r, a0 + 0.6);
    const [x2, y2] = polar(r, a1 - 0.6);
    return { x1, y1, x2, y2 };
  });

  return { body, windings };
});

/** Housing notches — 24 fine ticks around the rim. */
const NOTCHES = Array.from({ length: 24 }, (_, i) => {
  const a = i * 15;
  const [x1, y1] = polar(40.5, a);
  const [x2, y2] = polar(i % 2 === 0 ? 43.5 : 42.4, a);
  return { x1, y1, x2, y2, major: i % 2 === 0 };
});

/** Mounting screws set into the housing. */
const SCREWS = Array.from({ length: 8 }, (_, i) => polar(44.5, i * 45 + 22.5));

/** The triangular core, slightly inset from the housing. */
const CORE_TRI = fmt([polar(13.5, 0), polar(13.5, 120), polar(13.5, 240)]);
const CORE_TRI_INNER = fmt([polar(8.5, 0), polar(8.5, 120), polar(8.5, 240)]);

interface ArcReactorProps {
  /** `fixed` = the persistent HUD instance. `inline` = a decorative core. */
  variant?: 'fixed' | 'inline';
  size?: number;
  className?: string;
}

export default function ArcReactor({ variant = 'fixed', size, className = '' }: ArcReactorProps) {
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

  /* Job 2 — the page spins up with depth. */
  const glow = useTransform(scrollYProgress, [0, 1], [3, 12]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  const coilOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 1]);

  useAnimationFrame((time, delta) => {
    // Reduced motion: stops spinning, KEEPS its fill state.
    if (reduced) return;

    const depth = scrollYProgress.get();
    rotation.set((rotation.get() + ((6 + depth * 26) * delta) / 1000) % 360);

    /* Job 4 — instability. Only in The Cave: an irregular ~2% duty-cycle
       stutter plus 1px jitter. The core becomes unstable at exactly the
       moment the copy admits he hasn't figured it out. */
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

  /* Job 3 — section identity. Blue everywhere; hot-rod red in The Cave. */
  const core = unstable ? 'var(--hotrod)' : 'var(--arc)';
  // Several reactors can be on screen at once (fixed HUD, hero motif,
  // COMMS core), so gradient ids must be unique per instance.
  const uid = `reactor${useId().replace(/:/g, '')}`;

  const dropShadow = useTransform([glow, glowOpacity], ([b, o]: number[]) => {
    const tint = unstable ? 'var(--hotrod)' : 'var(--arc)';
    return `drop-shadow(0 0 ${b.toFixed(1)}px color-mix(in srgb, ${tint} ${Math.round(
      o * 100,
    )}%, transparent))`;
  });

  async function handleClick() {
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
      style={{ x: jitterX, y: jitterY, opacity: flicker, scale: pulse, filter: dropShadow }}
    >
      <defs>
        <radialGradient id={`${uid}-bloom`}>
          <stop offset="0%" stopColor={core} stopOpacity="0.5" />
          <stop offset="55%" stopColor={core} stopOpacity="0.13" />
          <stop offset="100%" stopColor={core} stopOpacity="0" />
        </radialGradient>
        {/* brushed-metal housing */}
        <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#e8eef6" />
          <stop offset="35%" stopColor="#8d9bad" />
          <stop offset="60%" stopColor="#cfd9e6" />
          <stop offset="100%" stopColor="#6d7b8d" />
        </linearGradient>
        {/* coil mounting plate */}
        <linearGradient id={`${uid}-plate`} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#aab7c8" />
          <stop offset="100%" stopColor="#5f6c7d" />
        </linearGradient>
        {/* copper winding */}
        <linearGradient id={`${uid}-copper`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f9dc8a" />
          <stop offset="50%" stopColor="#e0a92e" />
          <stop offset="100%" stopColor="#a9761b" />
        </linearGradient>
        <radialGradient id={`${uid}-core`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="38%" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="70%" stopColor={core} stopOpacity="0.95" />
          <stop offset="100%" stopColor={core} stopOpacity="0.7" />
        </radialGradient>
      </defs>

      {/* outer bloom */}
      <circle cx={CX} cy={CY} r={49} fill={`url(#${uid}-bloom)`} />

      {/* Job 1: scroll-linked fill arc, outermost */}
      <circle cx={CX} cy={CY} r={R_BEZEL} fill="none" stroke="var(--arc-dim)" strokeWidth={1.4} opacity={0.55} />
      <motion.circle
        cx={CX}
        cy={CY}
        r={R_BEZEL}
        fill="none"
        stroke={core}
        strokeWidth={1.8}
        strokeDasharray={C_BEZEL}
        style={{ strokeDashoffset: dashoffset }}
        transform={`rotate(-90 ${CX} ${CY})`}
      />

      {/* metal housing ring */}
      <circle cx={CX} cy={CY} r={44} fill="none" stroke={`url(#${uid}-metal)`} strokeWidth={6} />
      <circle cx={CX} cy={CY} r={41} fill="none" stroke="#0a1220" strokeWidth={1} opacity={0.55} />
      <circle cx={CX} cy={CY} r={47} fill="none" stroke="#0a1220" strokeWidth={0.8} opacity={0.4} />

      {/* housing notches + mounting screws */}
      <g stroke="#3f4c5c">
        {NOTCHES.map((n, i) => (
          <line
            key={i}
            x1={n.x1}
            y1={n.y1}
            x2={n.x2}
            y2={n.y2}
            strokeWidth={n.major ? 0.9 : 0.45}
            opacity={n.major ? 0.8 : 0.5}
          />
        ))}
      </g>
      {SCREWS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.05} fill="#dbe4ef" stroke="#5c6a7c" strokeWidth={0.35} />
      ))}

      {/* copper coil assembly */}
      <motion.g style={{ rotate: rotation, originX: '50px', originY: '50px', opacity: coilOpacity }}>
        {COILS.map((c, i) => (
          <g key={i}>
            <polygon points={c.body} fill={`url(#${uid}-plate)`} stroke="#41505f" strokeWidth={0.5} />
            {c.windings.map((w, j) => (
              <line
                key={j}
                x1={w.x1}
                y1={w.y1}
                x2={w.x2}
                y2={w.y2}
                stroke={`url(#${uid}-copper)`}
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            ))}
          </g>
        ))}
      </motion.g>

      {/* inner housing + glowing well */}
      <circle cx={CX} cy={CY} r={23} fill="none" stroke={`url(#${uid}-metal)`} strokeWidth={3} />
      <circle cx={CX} cy={CY} r={20.5} fill="#04070e" />
      <circle cx={CX} cy={CY} r={19.5} fill="none" stroke={core} strokeWidth={1.6} opacity={0.95} />
      <circle cx={CX} cy={CY} r={16} fill={core} opacity={0.16} />

      {/* triangular core */}
      <polygon points={CORE_TRI} fill="none" stroke={core} strokeWidth={1.5} opacity={0.95} />
      <polygon points={CORE_TRI_INNER} fill={`url(#${uid}-core)`} />
      <circle cx={CX} cy={CY} r={3.2} fill="#ffffff" />
    </motion.svg>
  );

  if (variant === 'inline') {
    return (
      <div
        aria-hidden="true"
        style={{ width: size ?? 180, height: size ?? 180 }}
        className={`shrink-0 ${className}`}
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
                 md:left-auto md:translate-x-0 md:right-9 md:bottom-20 md:h-[76px] md:w-[76px]"
    >
      {svg}
    </button>
  );
}
