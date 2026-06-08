import { useEffect, useRef } from 'react';

/**
 * Fixed top progress bar. Reads Lenis scroll if present, else window scroll.
 * Mount once at the app root.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf;
    const tick = () => {
      const y = window.__lenis ? window.__lenis.scroll : window.scrollY || 0;
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      const p = Math.max(0, Math.min(1, y / max));
      bar.style.transform = `scaleX(${p})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <div className="scroll-progress" ref={barRef} aria-hidden="true" />;
}
