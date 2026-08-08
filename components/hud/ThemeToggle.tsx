'use client';

import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

/**
 * Theme switch. The initial value is applied before first paint by the
 * inline script in app/layout.tsx, so there's no flash; this component
 * only reads what that script decided and lets the user change it.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') {
      setTheme(attr);
    } else {
      setTheme(matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    }
  }, []);

  function toggle() {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('mxiv-theme', next);
    } catch {
      /* private mode — the choice just won't persist */
    }
  }

  // Render a stable placeholder until the client knows the theme, so the
  // markup can't mismatch during hydration.
  const label = theme === 'light' ? 'DARK' : 'LIGHT';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${label.toLowerCase()} theme`}
      className="mono fixed z-50 border px-2.5 py-1.5 transition-colors duration-150
                 right-5 top-[38px] md:right-9 md:top-[62px]"
      style={{
        borderColor: 'var(--arc-dim)',
        color: 'var(--telemetry)',
        background: 'color-mix(in srgb, var(--plate) 70%, transparent)',
      }}
    >
      {theme === null ? '· · ·' : `[ ${label} ]`}
    </button>
  );
}
