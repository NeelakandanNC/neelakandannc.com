import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Counts up to `value` once when scrolled into view.
 * If `value` is not a finite number (e.g. "∞"), it just renders static.
 */
export default function Counter({ value, prefix = '', suffix = '', duration = 1.4 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [n, setN] = useState(0);
  const numeric = typeof value === 'number' && Number.isFinite(value);

  useEffect(() => {
    if (!inView || !numeric) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setN(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, numeric, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {numeric ? n : value}
      {suffix}
    </span>
  );
}
