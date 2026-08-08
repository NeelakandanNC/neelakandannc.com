'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useScroll, type MotionValue } from 'framer-motion';

export interface SectionInfo {
  id: string;
  index: string;
  label: string;
}

/** Section order — drives the bottom-left telemetry readout. */
export const SECTIONS: SectionInfo[] = [
  { id: 'hero', index: '01', label: 'HERO' },
  { id: 'armor', index: '02', label: 'HALL OF ARMOR' },
  { id: 'diagnostics', index: '03', label: 'SYSTEMS DIAGNOSTIC' },
  { id: 'cave', index: '04', label: 'CAVE' },
  { id: 'current', index: '05', label: 'CURRENT BUILD' },
  { id: 'comms', index: '06', label: 'COMMS' },
];

interface HudContextValue {
  scrollYProgress: MotionValue<number>;
  active: SectionInfo;
  setActiveById: (id: string) => void;
  /** True only inside The Cave — the reactor destabilises here. */
  unstable: boolean;
}

const HudContext = createContext<HudContextValue | null>(null);

export function HudProvider({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState<SectionInfo>(SECTIONS[0]);

  const setActiveById = useCallback((id: string) => {
    const next = SECTIONS.find((s) => s.id === id);
    if (next) setActive((prev) => (prev.id === next.id ? prev : next));
  }, []);

  const value = useMemo<HudContextValue>(
    () => ({
      scrollYProgress,
      active,
      setActiveById,
      unstable: active.id === 'cave',
    }),
    [scrollYProgress, active, setActiveById],
  );

  return <HudContext.Provider value={value}>{children}</HudContext.Provider>;
}

export function useHud(): HudContextValue {
  const ctx = useContext(HudContext);
  if (!ctx) throw new Error('useHud must be used inside <HudProvider>');
  return ctx;
}

/**
 * Marks the section that owns the middle band of the viewport as active.
 * The band is deliberately narrow so the readout flips at a predictable
 * point rather than fighting between two neighbours.
 */
export function useSectionSpy(id: string) {
  const ref = useRef<HTMLElement | null>(null);
  const { setActiveById } = useHud();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveById(id);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id, setActiveById]);

  return ref;
}
