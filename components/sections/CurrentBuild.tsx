'use client';

import Section from '@/components/Section';
import { StatusDot } from './MarkCard';
import Reticle from '@/components/hud/Reticle';

/**
 * Makes the site feel current rather than archival — the difference
 * between a portfolio and a workshop with the lights on.
 *
 * OPEN DECISION (spec §13.1): the Agentronics panel reads ACTIVE, as the
 * spec's own §6.05 and marks table both specify. The spec author argues
 * MAINTENANCE is more honest given a 30–60 min/day cadence. Flipping it
 * is a one-line change here plus `status` on Mark XIV in content/marks.ts.
 */
export default function CurrentBuild() {
  return (
    <Section id="current" eyebrow="05 / CURRENT BUILD" labelledBy="current-title" className="py-28">
      <h2 id="current-title" className="display mb-12 max-w-[62ch] leading-[1.02]" style={{ fontSize: 'var(--t-h2)' }}>
        What’s powered on right now.
      </h2>

      <div className="grid gap-5 lg:grid-cols-2">
        <Reticle index={0}>
          <div
            className="h-full p-7"
            style={{
              background: 'var(--plate)',
              border: '1px solid color-mix(in srgb, var(--hotrod) 60%, transparent)',
            }}
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="mono" style={{ color: 'var(--hotrod-hi)' }}>
                MARK XIV · AGENTRONICS
              </p>
              <StatusDot status="ACTIVE" />
            </div>

            <p className="mb-6 max-w-[52ch]" style={{ color: 'var(--telemetry)' }}>
              WebMCP infrastructure — auth, observability, memory, and context management for AI
              agents interacting with websites.
            </p>

            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="mono mb-1" style={{ color: 'var(--arc-text)' }}>
                  BUILD PHASE
                </dt>
                <dd style={{ color: 'var(--readout)' }}>Infrastructure</dd>
              </div>
              <div>
                <dt className="mono mb-1" style={{ color: 'var(--arc-text)' }}>
                  CADENCE
                </dt>
                <dd style={{ color: 'var(--readout)' }}>Daily, alongside placements</dd>
              </div>
            </dl>
          </div>
        </Reticle>

        <Reticle index={1}>
          <div
            className="h-full p-7"
            style={{ background: 'var(--plate)', border: '1px solid var(--arc-dim)' }}
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="mono" style={{ color: 'var(--arc)' }}>
                MARK XV · IN FABRICATION
              </p>
              <StatusDot status="UNSTABLE" />
            </div>

            <p className="mb-6 max-w-[52ch]" style={{ color: 'var(--telemetry)' }}>
              Currently deep in AI agents, LLM systems, and interview prep. Open to full-time and
              internship roles in AI/ML engineering.
            </p>

            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="mono mb-1" style={{ color: 'var(--arc-text)' }}>
                  GRADUATING
                </dt>
                <dd style={{ color: 'var(--readout)' }}>May 2027</dd>
              </div>
              <div>
                <dt className="mono mb-1" style={{ color: 'var(--arc-text)' }}>
                  SEEKING
                </dt>
                <dd style={{ color: 'var(--readout)' }}>AI/ML engineering</dd>
              </div>
            </dl>
          </div>
        </Reticle>
      </div>
    </Section>
  );
}
