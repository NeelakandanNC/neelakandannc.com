'use client';

import Section from '@/components/Section';
import ArcReactor from '@/components/hud/ArcReactor';
import { channels } from '@/content/links';

/**
 * Full-bleed and minimal. The reactor scales up and centres; the links
 * radiate around it as a hub-and-spoke — the core, and its coils.
 */
export default function Comms() {
  return (
    <Section id="comms" labelledBy="comms-title" className="py-32 md:py-44">
      <div className="flex flex-col items-center text-center">
        <p className="mono mb-8" style={{ color: 'var(--arc-text)' }}>
          COMMS <span style={{ color: 'var(--gold)' }}>·</span> CHANNEL OPEN
        </p>
        <h2
          id="comms-title"
          className="display mb-7"
          style={{ fontSize: 'var(--t-mark)', lineHeight: 1.05, color: 'var(--readout)' }}
        >
          LET’S BUILD
          <br />
          SOMETHING
        </h2>

        <p className="mb-16 max-w-[46ch]" style={{ color: 'var(--telemetry)' }}>
          Open to AI/ML engineering roles. Also just open to talking.
        </p>

        <div className="mb-16 hidden md:block">
          <ArcReactor variant="inline" size={180} />
        </div>

        <ul className="grid w-full max-w-4xl gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((c) => (
            <li key={c.label} className="text-left">
              <p className="mono mb-2" style={{ color: 'var(--telemetry)' }}>
                {c.label}
              </p>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="draw-underline break-words text-[1.02rem]"
                style={{ color: 'var(--readout)' }}
              >
                {c.handle} ↗
              </a>
              <p className="mt-2 text-[0.9rem]" style={{ color: 'var(--telemetry)' }}>
                {c.note}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <footer className="mono mt-28 border-t pt-8 text-center" style={{ borderColor: 'var(--arc-dim)', color: 'var(--telemetry)' }}>
        MARK XIV · BUILT WITH NEXT.JS, FRAMER MOTION, AND AN UNREASONABLE AMOUNT OF COFFEE · ©{' '}
        {new Date().getFullYear()}
      </footer>
    </Section>
  );
}
