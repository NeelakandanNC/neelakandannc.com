import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom cursor — a lerped ring + dot that grows on interactive elements
 * and can show a label via [data-cursor]. Desktop / fine-pointer only;
 * disabled for touch and reduced-motion. Mount once at the app root.
 */
export default function CursorFX() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const location = useLocation();

  // Re-bind hover targets after each route change (new DOM mounts).
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (coarse || reduce || !ring || !dot) return;

    const root = document.documentElement;
    root.classList.add('has-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let raf;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    };
    const loop = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      ring.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(loop);
    };

    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');
    const onDocLeave = () => {
      ring.style.opacity = '0';
      dot.style.opacity = '0';
    };
    const onDocEnter = () => {
      ring.style.opacity = '';
      dot.style.opacity = '';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerleave', onDocLeave);
    document.addEventListener('pointerenter', onDocEnter);

    // Delegated hover handling so it survives DOM updates without rebinding.
    const SELECTOR = 'a, button, .magnetic, .j-entry, [data-cursor], input, textarea';
    const onOver = (e) => {
      const t = e.target.closest?.(SELECTOR);
      if (!t) return;
      ring.classList.add('is-hover');
      const lbl = t.getAttribute('data-cursor');
      if (lbl) {
        ring.classList.add('has-label');
        label.textContent = lbl;
      }
    };
    const onOut = (e) => {
      const t = e.target.closest?.(SELECTOR);
      if (!t) return;
      // moving to another interactive element keeps hover on
      if (e.relatedTarget && e.relatedTarget.closest?.(SELECTOR)) return;
      ring.classList.remove('is-hover', 'has-label');
      label.textContent = '';
    };
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onDocLeave);
      document.removeEventListener('pointerenter', onDocEnter);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      root.classList.remove('has-cursor');
    };
    // location.pathname intentionally in deps so listeners reset on nav
  }, [location.pathname]);

  return (
    <>
      <div className="cursor" ref={ringRef} aria-hidden="true">
        <span className="cursor__label" ref={labelRef} />
      </div>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
