/**
 * SYSTEMS DIAGNOSTIC — skills as suit subsystems.
 *
 * Levels are stored as filled segments out of 15, matching the 15-segment
 * readout in the build spec. They are deliberately NOT all high: a
 * subsystem reading DEVELOPING is what makes the PRIMARY readings
 * believable. Do not inflate these.
 */

export type Grade = 'PRIMARY' | 'OPERATIONAL' | 'DEVELOPING';

export const SEGMENTS = 15;

export interface Subsystem {
  name: string;
  filled: number;
  grade: Grade;
}

export interface SystemGroup {
  id: string;
  title: string;
  subtitle: string;
  items: Subsystem[];
}

export const systems: SystemGroup[] = [
  {
    id: 'power',
    title: 'POWER SYSTEMS',
    subtitle: 'AI AGENTS & LLM ORCHESTRATION',
    items: [
      { name: 'Google ADK / multi-agent', filled: 12, grade: 'PRIMARY' },
      { name: 'RAG + retrieval', filled: 10, grade: 'OPERATIONAL' },
      { name: 'LLM fine-tuning (QLoRA)', filled: 8, grade: 'OPERATIONAL' },
      { name: 'MCP / agent infra', filled: 11, grade: 'PRIMARY' },
      // Moved here from the old markets group — it's machine learning,
      // and it's what actually powered TriageAI and the MSME model.
      { name: 'Gradient boosting ensembles', filled: 11, grade: 'PRIMARY' },
    ],
  },
  {
    /* Finance and economics, deliberately NOT quant. No stochastic
       calculus, no derivatives pricing, no financial engineering — this
       is fundamentals, personal finance and venture thinking. */
    id: 'targeting',
    title: 'TARGETING',
    subtitle: 'FINANCE & ECONOMICS',
    items: [
      { name: 'Fundamental / equity research', filled: 10, grade: 'OPERATIONAL' },
      { name: 'Personal finance', filled: 11, grade: 'PRIMARY' },
      { name: 'Venture & startup economics', filled: 9, grade: 'OPERATIONAL' },
      { name: 'Macro & market structure', filled: 7, grade: 'DEVELOPING' },
    ],
  },
  {
    id: 'airframe',
    title: 'AIRFRAME',
    subtitle: 'ENGINEERING',
    items: [
      { name: 'Python', filled: 12, grade: 'PRIMARY' },
      { name: 'React / Next / Tailwind', filled: 9, grade: 'OPERATIONAL' },
      { name: 'FastAPI / Postgres', filled: 9, grade: 'OPERATIONAL' },
      { name: 'DSA', filled: 7, grade: 'DEVELOPING' },
    ],
  },
];
