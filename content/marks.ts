/**
 * THE HALL OF ARMOR — single source of truth.
 * Ordered chronologically; Mark number = build order.
 *
 * ─────────────────────────────────────────────────────────────────
 * NEEL — VERIFY EVERY LINE BEFORE THIS SHIPS.
 * Outcome figures, ordering and numerals come from the build spec's
 * reconstruction. `problem` / `built` / `stack` were written from those
 * descriptions. Nothing here was invented beyond what the spec stated,
 * but only you can confirm it is accurate.
 *
 * Open items:
 *   · MARK X (Ydhya) — no description existed in the spec or the old
 *     repo. Written as a placeholder. Fill it in, or cut it and renumber
 *     (note: cutting shifts Agentronics to XIII and breaks "MARK XIV").
 *   · `links` are omitted where the real URL is unknown. Do not guess
 *     repo slugs — add them here and they appear in the detail panel.
 * ─────────────────────────────────────────────────────────────────
 */

export type Status = 'DEPLOYED' | 'ACTIVE' | 'ARCHIVED' | 'FIELD_TEST' | 'UNSTABLE';
export type Category = 'AGENTS' | 'MARKETS' | 'RESEARCH' | 'INFRA' | 'EARLY';

export interface Mark {
  numeral: string;
  n: number;
  name: string;
  tagline: string;
  problem: string;
  built: string;
  stack: string[];
  outcome: string;
  status: Status;
  category: Category;
  weight: 1 | 2;
  links?: { repo?: string; live?: string; paper?: string };
}

export const CATEGORIES = ['ALL', 'AGENTS', 'MARKETS', 'RESEARCH', 'INFRA', 'EARLY'] as const;
export type Filter = (typeof CATEGORIES)[number];

export const marks: Mark[] = [
  {
    numeral: 'I',
    n: 1,
    name: 'Flaura',
    tagline: 'Farm-to-customer flower delivery.',
    problem:
      'Flowers reach the customer through three intermediaries and a day of shelf time. By the time they arrive they are already dying.',
    built:
      'A delivery service that cut the chain to one hop, with fixed morning and evening slots so stock was picked against real orders instead of a forecast. Ran beta tests and built the deck.',
    stack: ['Ops', 'Landing page', 'Manual fulfilment'],
    outcome:
      'The first thing I ever shipped. Stopped it for lack of capital and because I could not find the innovation gap I needed. Lesson: timing and capital matter as much as the idea.',
    status: 'ARCHIVED',
    category: 'EARLY',
    weight: 1,
  },
  {
    numeral: 'II',
    n: 2,
    name: 'Medi Pro Solutions',
    tagline: 'NABH certification consultancy for hospitals.',
    problem:
      'Small hospitals want NABH accreditation but cannot read the standard, let alone build the documentation trail it demands.',
    built:
      'An agency: the outreach, the service model and the operational playbook that walks a hospital from first audit gap to submitted file.',
    stack: ['B2B ops', 'Compliance docs', 'Outreach'],
    outcome:
      'Learned what compliance actually costs — and that B2B services run on domain depth and trust built over months, not on a website.',
    status: 'ARCHIVED',
    category: 'EARLY',
    weight: 1,
    links: { live: 'https://1mediprosolutions.wixsite.com/medi-pro-solutions' },
  },
  {
    numeral: 'III',
    n: 3,
    name: 'Gemma 2B / QLoRA',
    tagline: 'Fine-tuning a 2B model on one consumer-grade GPU.',
    problem:
      'Fine-tuning anything useful is assumed to need a cluster. I had a single P100 and wanted to know where the real ceiling was.',
    built:
      '4-bit quantised LoRA adapters over Gemma 2B — the full loop from dataset prep through training to evaluation, inside the memory budget of one card.',
    stack: ['Gemma 2B', 'QLoRA', 'PEFT', 'bitsandbytes', 'P100'],
    outcome:
      'It trained. Most of the work turned out to be library-version archaeology rather than machine learning, which was itself the lesson.',
    status: 'ARCHIVED',
    category: 'RESEARCH',
    weight: 1,
  },
  {
    numeral: 'IV',
    n: 4,
    name: 'UIDAI Aadhaar Lifecycle',
    tagline: 'Lifecycle analysis across a national identity dataset.',
    problem:
      'Enrolment and update behaviour across India’s identity system is a demographic signal nobody reads as one.',
    built:
      'A lifecycle analysis over the national dataset — cohort behaviour from enrolment through update, at national scale.',
    stack: ['Python', 'pandas', 'Statistical modelling'],
    outcome: 'Deployed analysis over India’s national identity dataset.',
    status: 'DEPLOYED',
    category: 'RESEARCH',
    weight: 1,
  },
  {
    numeral: 'V',
    n: 5,
    name: 'TriageAI',
    tagline: 'Multi-agent clinical decision support.',
    problem:
      'Triage decisions get made in seconds by people who are tired, and the cost of ranking a patient one level too low is not recoverable.',
    built:
      'A multi-agent decision-support system on Google ADK, with an XGBoost risk model trained on 20,000 real clinical records. Specialist agents debate a case; the system surfaces the disagreement rather than hiding it behind one score.',
    stack: ['Google ADK', 'XGBoost', 'Multi-agent', 'Python'],
    outcome:
      'NSCIF 2026 finalist — top of 1,000+ teams. Trained on 20,000 real clinical records.',
    status: 'DEPLOYED',
    category: 'AGENTS',
    weight: 2,
  },
  {
    numeral: 'VI',
    n: 6,
    name: 'AutoResearchClaw',
    tagline: 'A pipeline that wrote and submitted its own paper.',
    problem:
      'Research has a long tail of mechanical work — literature sweep, experiment matrix, table generation, prose assembly. None of it is the idea.',
    built:
      'A 23-stage autonomous pipeline running the full arc from question to submitted manuscript. Each stage is checkpointed and inspectable, so the output can be audited rather than trusted.',
    stack: ['Multi-agent', 'LLM orchestration', 'Python', 'LaTeX'],
    outcome:
      '23-stage autonomous research pipeline that wrote and submitted a paper. Produced ECHO — an empirical study of architectural bias in wage-deflation forecasting.',
    status: 'DEPLOYED',
    category: 'RESEARCH',
    weight: 2,
  },
  {
    numeral: 'VII',
    n: 7,
    name: 'ZeraPortfolio',
    tagline: 'Multi-agent Indian equity portfolio advisor.',
    problem:
      'Retail portfolio advice is generic because it never sees your actual holdings. The advice that would help requires the position data nobody hands over.',
    built:
      'Per-stock agents reading live Zerodha holdings through MCP, cross-referenced against geopolitical and macro signals. Compiles a PDF report and delivers it to WhatsApp at 15:30 IST, after close, every trading day.',
    stack: ['Google ADK', 'Gemini 2.5', 'Zerodha MCP', 'WhatsApp API'],
    outcome:
      'Live against real holdings. Per-stock agents, geopolitical signals, and a PDF report delivered daily at 15:30 IST.',
    status: 'DEPLOYED',
    category: 'MARKETS',
    weight: 2,
  },
  {
    numeral: 'VIII',
    n: 8,
    name: 'Compliance RAG',
    tagline: 'Retrieval over regulatory documents.',
    problem:
      'Regulatory text is long, cross-referential, and punishing to search. The answer is in there; finding it is the job.',
    built:
      'A retrieval system over regulatory corpora — chunking that respects clause structure, and answers that cite the clause they came from.',
    stack: ['RAG', 'Vector search', 'Python', 'LLM'],
    outcome: 'Deployed retrieval system over regulatory documents.',
    status: 'DEPLOYED',
    category: 'AGENTS',
    weight: 1,
  },
  {
    numeral: 'IX',
    n: 9,
    name: 'Multimodal Chatbot',
    tagline: 'Vision plus text in one conversation.',
    problem:
      'Most assistants go blind the moment the question involves an image, which is exactly when people most want to ask one.',
    built:
      'A conversational system that takes vision and text in the same thread and keeps context across both.',
    stack: ['Vision-language model', 'Python', 'LLM'],
    outcome: 'Deployed vision + text conversational system.',
    status: 'DEPLOYED',
    category: 'AGENTS',
    weight: 1,
  },
  {
    numeral: 'X',
    n: 10,
    // TODO(neel): no description for this exists in the spec or the old repo.
    // Replace every field below, or cut this Mark and renumber XI–XIV.
    name: 'Ydhya',
    tagline: 'Infrastructure build. Archived.',
    problem: 'Details pending — this entry needs Neel’s own account of it.',
    built: 'Details pending.',
    stack: ['Infrastructure'],
    outcome: 'Archived. Awaiting a proper write-up.',
    status: 'ARCHIVED',
    category: 'INFRA',
    weight: 1,
  },
  {
    numeral: 'XI',
    n: 11,
    name: 'pg_ai_query',
    tagline: 'Natural-language querying for PostgreSQL.',
    problem:
      'Text-to-SQL inside the database is either a trust problem or a latency problem, and usually both.',
    built:
      'A sidecar architecture that keeps the model out of the database process, with Context7 MCP integration for schema context and an accuracy benchmark harness so the claims are measurable.',
    stack: ['PostgreSQL', 'Context7 MCP', 'Python', 'Sidecar'],
    outcome:
      'In field test, with an accuracy benchmark suite. Basis of a GSoC 2026 proposal.',
    status: 'FIELD_TEST',
    category: 'INFRA',
    weight: 1,
  },
  {
    numeral: 'XII',
    n: 12,
    name: 'MSME Financial Health',
    tagline: 'Predicting small-business financial distress.',
    problem:
      'MSME lending decisions get made on thin, messy financials where the signal is in the ratios rather than the raw fields.',
    built:
      'A CatBoost/LightGBM blend over 24 engineered features, validated with 10-fold stratified cross-validation to keep the score honest across class imbalance.',
    stack: ['CatBoost', 'LightGBM', 'Feature engineering', 'Python'],
    outcome:
      '0.8940 Micro-F1. 24 engineered features, 10-fold stratified CV.',
    status: 'DEPLOYED',
    category: 'MARKETS',
    weight: 1,
  },
  {
    numeral: 'XIII',
    n: 13,
    name: 'Planetary Alignment Search',
    tagline: 'Searching a million years of orbital mechanics.',
    problem:
      'Finding the tightest planetary alignment over geological time is a brute-force problem that brute force cannot afford.',
    built:
      'A two-stage hierarchical search over JPL Keplerian elements — a coarse sweep to find candidate windows, then refinement inside each, which cuts the search space by orders of magnitude.',
    stack: ['JPL Keplerian elements', 'NumPy', 'Hierarchical search'],
    outcome:
      'Best 1M-year alignment: 8.581° on 20 September 263,486 CE.',
    status: 'DEPLOYED',
    category: 'RESEARCH',
    weight: 1,
  },
  {
    numeral: 'XIV',
    n: 14,
    name: 'Agentronics',
    tagline: 'WebMCP infrastructure for AI agents.',
    problem:
      'Agents can now act on websites, and none of the infrastructure that makes that safe exists yet — who the agent is, what it did, what it remembers, and what it is allowed to see.',
    built:
      'WebMCP infrastructure: auth, observability, memory, and context management for AI agents interacting with websites. The current suit.',
    stack: ['WebMCP', 'TypeScript', 'Agent infra', 'Observability'],
    outcome:
      'Active build. The one I am betting on, and the reason there is a deadline on the wall.',
    status: 'ACTIVE',
    category: 'INFRA',
    weight: 2,
  },
];

/** Gold markers. Five maximum, sitewide — see spec §2.1. */
export const achievements: string[] = [
  'NSCIF 2026 finalist — TriageAI, from 1,000+ teams',
  'SRCC Derivatives Challenge 2025 — 3rd place, 4% single-day return on ₹5L',
  'PR #97 merged into andrewyng/context-hub',
  'ECHO paper submitted for publication',
  'Y Combinator Fall 2026 — applied',
];
