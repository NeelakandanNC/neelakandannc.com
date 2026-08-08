/**
 * FLIGHT LOG — building in public.
 *
 * Hand-curated. A short list of real entries beats an empty auto-feed.
 * `verified: true` renders the gold ◆ marker — FIVE MAXIMUM SITEWIDE.
 * There are exactly five below. Adding a sixth breaks the design rule
 * in spec §2.1; promote one and demote another instead.
 *
 * Timestamps are deliberately year-level where the exact date is not
 * on record. Do not invent precision.
 */

export interface LogEntry {
  stamp: string;
  title: string;
  body: string;
  verified?: boolean;
  href?: string;
}

export const flightLog: LogEntry[] = [
  {
    stamp: '2023',
    title: 'NIT AGARTALA — ECE',
    body: 'Started formal engineering. Core electronics, and a growing suspicion that the interesting problems were one layer up.',
  },
  {
    stamp: '2023—24',
    title: 'FIRST VENTURES, MOSTLY FAILED',
    body: 'Flaura, Medi Pro Solutions, and a run of others. Learned pricing, distribution, and how long B2B trust actually takes. Marks I and II.',
  },
  {
    stamp: '2024',
    title: 'REPOFORTHAT.DEV — SHIPPED, THEN CLOSED',
    body: 'A platform for finding the right repo for a problem. Shipped the curation engine, then sunset it to refocus. Knowing when to close is its own skill.',
    href: 'https://repoforthat.dev',
  },
  {
    stamp: '2024—25',
    title: 'SWITCHED TO AI/ML FOR REAL',
    body: 'Fine-tuned Gemma 2B on a single P100, then the Aadhaar lifecycle analysis. The point where the ECE degree and the actual work stopped overlapping.',
  },
  {
    stamp: '2025',
    title: 'SRCC DERIVATIVES CHALLENGE — 3RD PLACE',
    body: '4% single-day return on ₹5L. Options, under a clock, against people who do this seriously.',
    verified: true,
  },
  {
    stamp: '2025',
    title: 'PR #97 MERGED — andrewyng/context-hub',
    body: 'A small patch in somebody else’s repo. Still the first time code of mine shipped inside a project I did not control.',
    verified: true,
    href: 'https://github.com/andrewyng/context-hub',
  },
  {
    stamp: '2025—26',
    title: 'THE AGENT RUN',
    body: 'ZeraPortfolio, Compliance RAG, the multimodal system, pg_ai_query. Four builds in a row on agent infrastructure — the first time the search started converging.',
  },
  {
    stamp: '2026',
    title: 'NSCIF FINALIST — TRIAGEAI',
    body: 'Multi-agent clinical decision support, trained on 20,000 real records. Finalist from a field of 1,000+ teams.',
    verified: true,
  },
  {
    stamp: '2026',
    title: 'ECHO — SUBMITTED FOR PUBLICATION',
    body: 'A 23-stage autonomous pipeline wrote it. An empirical study of architectural bias in wage-deflation forecasting.',
    verified: true,
  },
  {
    stamp: '2026',
    title: 'Y COMBINATOR — FALL 2026, APPLIED',
    body: 'Agentronics. Applied. That is the whole entry; the rest of it has not happened yet.',
    verified: true,
  },
  {
    stamp: 'NOW',
    title: 'MARK XIV — AGENTRONICS',
    body: 'WebMCP infrastructure. Running it alongside placements, in public, at speed.',
  },
  {
    stamp: 'MAY 2027',
    title: 'GRADUATION',
    body: 'Open to AI/ML engineering and quantitative research roles before then.',
  },
];
