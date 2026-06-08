/**
 * Knowledge domains. Each one has a detail page at /learn/:slug where
 * notes and resources live — add to `notes` / `resources` over time as
 * you learn more.
 */
export const domains = [
  {
    slug: 'science',
    icon: '⚡',
    title: 'Science',
    desc: 'Core electronics, circuit design, and the engineering foundation behind everything.',
    tags: ['University', 'NPTEL', 'YouTube'],
    notes:
      'Where it all started. Core electronics — circuit design, embedded systems, signal processing. This foundation gives a hardware-aware perspective to software engineering that most developers lack.',
    resources: [
      { name: 'NPTEL', url: 'https://nptel.ac.in/' },
      { name: 'All About Circuits', url: 'https://www.allaboutcircuits.com/' },
    ],
  },
  {
    slug: 'technology',
    icon: '{ }',
    title: 'Technology',
    desc: 'Full-stack development, web technologies, cloud, and scalable architecture.',
    tags: ['FreeCodeCamp', 'MDN', 'LeetCode', 'Docker'],
    notes:
      'Started with Python, moved to JavaScript/TypeScript for full-stack. Currently deep in Node.js, React/Next.js, and building CLI tools. The best way to learn is to build real projects. Understanding infrastructure is non-negotiable for shipping — from Docker containers to cloud deployments, from PostgreSQL to pgvector. Currently focused on edge computing and serverless patterns.',
    resources: [
      { name: 'FreeCodeCamp', url: 'https://www.freecodecamp.org/' },
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
      { name: 'LeetCode', url: 'https://leetcode.com/' },
      { name: 'The Odin Project', url: 'https://www.theodinproject.com/' },
      { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
      { name: 'Docker Docs', url: 'https://docs.docker.com/' },
    ],
  },
  {
    slug: 'engineering',
    icon: '◈',
    title: 'Engineering',
    desc: 'AI agents, LLM-integrated workflows, machine learning, and product design.',
    tags: ['Andrew Ng', 'Fast.ai', 'Kaggle', 'Figma'],
    notes:
      'Transitioning from core electronics into ML/AI. Focused on practical AI — building agents, LLM pipelines, and production-grade ML systems. Currently exploring multi-agent orchestration and RAG pipelines. Design is not just how it looks — it is how it works. Utility-first design: every element must earn its place.',
    resources: [
      { name: 'Andrew Ng (Coursera)', url: 'https://www.coursera.org/instructor/andrewng' },
      { name: 'Fast.ai', url: 'https://www.fast.ai/' },
      { name: 'Kaggle', url: 'https://www.kaggle.com/' },
      { name: 'Hugging Face', url: 'https://huggingface.co/' },
      { name: 'Figma', url: 'https://www.figma.com/' },
      { name: 'Refactoring UI', url: 'https://www.refactoringui.com/' },
    ],
  },
  {
    slug: 'mathematics',
    icon: '∑',
    title: 'Mathematics',
    desc: 'Algorithmic thinking, statistical modeling, and the quantitative backbone of AI and markets.',
    tags: ['Papers With Code', 'Kaggle', 'QuantConnect'],
    notes:
      'The quantitative backbone behind everything — neural networks, data science, and algorithmic strategies all reduce to mathematics. Studying market microstructure, options pricing models, and the linear algebra and statistics under modern ML. The goal: turn rigorous models into systems that compound.',
    resources: [
      { name: 'Papers With Code', url: 'https://paperswithcode.com/' },
      { name: 'Kaggle', url: 'https://www.kaggle.com/' },
      { name: 'QuantConnect', url: 'https://www.quantconnect.com/' },
    ],
  },
  {
    slug: 'finance',
    icon: '◉',
    title: 'Finance',
    desc: 'Market analysis, entrepreneurship, and the intersection of capital and code.',
    tags: ['Zerodha Varsity', 'Investopedia', 'YC Library'],
    notes:
      'Finance through the lens of engineering. Studying market microstructure, options pricing, and algorithmic strategies — bridging the gap between capital and code. Learned business by doing: from ModernClother to MediPro. Failure is the best teacher. Key insight: distribution > product in early stages.',
    resources: [
      { name: 'Zerodha Varsity', url: 'https://zerodha.com/varsity/' },
      { name: 'Investopedia', url: 'https://www.investopedia.com/' },
      { name: 'Y Combinator Library', url: 'https://www.ycombinator.com/library' },
      { name: 'Indie Hackers', url: 'https://www.indiehackers.com/' },
      { name: 'Paul Graham Essays', url: 'http://paulgraham.com/articles.html' },
    ],
  },
];

export function getDomain(slug) {
  return domains.find((d) => d.slug === slug);
}
