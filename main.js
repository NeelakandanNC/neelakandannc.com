import './style.css';

let isLightMode = localStorage.getItem('theme') === 'light';

// ============================================================
// ROUTER
// ============================================================
const app = document.getElementById('app');
const navLinks = document.querySelectorAll('.nav-link');
const mobileBtn = document.getElementById('mobile-menu-btn');
const mainNav = document.getElementById('main-nav');

function getRoute() {
  const hash = window.location.hash || '#/';
  return hash.replace('#', '') || '/';
}

function setActiveNav(route) {
  const page = route === '/' ? 'home' : route.replace('/', '').split('/')[0];
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
}

function navigate() {
  const route = getRoute();
  setActiveNav(route);
  mainNav.classList.remove('open');
  mobileBtn.classList.remove('open');

  if (route.startsWith('/polymath/')) {
    const skillSlug = route.replace('/polymath/', '');
    app.innerHTML = renderPolymathDetail(skillSlug);
  } else {
    switch (route) {
      case '/contact': app.innerHTML = renderContact(); break;
      case '/projects': app.innerHTML = renderProjects(); break;
      case '/builder': app.innerHTML = renderBuilder(); break;
      case '/polymath': app.innerHTML = renderPolymath(); break;
      case '/taste': app.innerHTML = renderTaste(); break;
      case '/life': app.innerHTML = renderLife(); break;
      default: app.innerHTML = renderHome(); break;
    }
  }

  window.scrollTo(0, 0);

  requestAnimationFrame(() => {
    initScrollAnimations();
    initPageEnter();
  });
}

window.addEventListener('hashchange', navigate);
window.addEventListener('load', () => {
  initMastheadClock();
  navigate();
});

mobileBtn.addEventListener('click', () => {
  mobileBtn.classList.toggle('open');
  mainNav.classList.toggle('open');
});

// ============================================================
// MASTHEAD CLOCK + DATE
// ============================================================
function initMastheadClock() {
  const dateEl = document.getElementById('ms-date');
  const clockEl = document.getElementById('ms-clock');
  if (!dateEl || !clockEl) return;

  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  function tick() {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = months[now.getMonth()];
    const y = now.getFullYear();
    const dw = days[now.getDay()];
    dateEl.textContent = `${dw} · ${d} ${m} ${y}`;
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hh}:${mm}:${ss} IST`;
  }
  tick();
  setInterval(tick, 1000);
}

// ============================================================
// THEME TOGGLE
// ============================================================
const themeToggle = document.getElementById('theme-toggle');
const iconSun = document.querySelector('.theme-icon-sun');
const iconMoon = document.querySelector('.theme-icon-moon');

function applyTheme(isLight) {
  if (isLight) {
    document.body.classList.add('light-theme');
    iconSun.style.display = 'none';
    iconMoon.style.display = 'block';
  } else {
    document.body.classList.remove('light-theme');
    iconSun.style.display = 'block';
    iconMoon.style.display = 'none';
  }
}

applyTheme(isLightMode);

themeToggle.addEventListener('click', () => {
  isLightMode = !isLightMode;
  localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
  applyTheme(isLightMode);
});

// ============================================================
// SCROLL ANIMATIONS
// ============================================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.anim-fade, .anim-slide-left, .anim-slide-right, .anim-scale');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  elements.forEach(el => observer.observe(el));
}

function initPageEnter() {
  const main = document.getElementById('app');
  if (!main) return;
  main.style.opacity = '0';
  main.style.transform = 'translateY(6px)';
  main.style.transition = 'opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1)';
  requestAnimationFrame(() => {
    main.style.opacity = '1';
    main.style.transform = 'translateY(0)';
  });
}

// ============================================================
// PAGE RENDERERS
// ============================================================

// --- HOME ---
function renderHome() {
  return `
    <section class="home">
      <div class="home-hero">
        <div class="home-hero__meta anim-fade" style="--i:0">
          <span class="kbd kbd--accent">№ 01 — Vision</span>
          <span class="kbd">Builder · Engineer · Polymath</span>
          <span class="kbd">India</span>
        </div>

        <h1 class="home-hero__display anim-fade" style="--i:1">
          <span class="line">Neelakandan</span>
        </h1>

        <div class="home-hero__caption">
          <div class="anim-fade" style="--i:2">
            <div class="home-hero__caption-mono">— Building at the intersection of STEM</div>
            <p class="home-hero__bio" style="margin-top:1.25rem;">
              I build at the intersection of <em>AI and markets</em>.
              Agents, models, and the systems that create leverage.
              I don't just study systems — I <em>build</em> them.
            </p>
          </div>
          <div class="home-hero__aside anim-fade" style="--i:3">
            <div class="home-hero__aside-item">
              <span class="home-hero__aside-label">Focus</span>
              <span class="home-hero__aside-value"><em>Frontier Tech</em></span>
            </div>
            <div class="home-hero__aside-item">
              <span class="home-hero__aside-label">Status</span>
              <span class="home-hero__aside-value"><em>Building</em></span>
            </div>
            <div class="home-hero__aside-item">
              <span class="home-hero__aside-label">Open to</span>
              <span class="home-hero__aside-value">Collab · Capital</span>
            </div>
          </div>
        </div>

        <div class="home-tags anim-fade stagger" style="--i:4">
          <span class="home-tag">Frontier Tech</span>
          <span class="home-tag">Finance & Economics</span>
          <span class="home-tag">STEM</span>
          <span class="home-tag">Tech</span>
          <span class="home-tag">Venture</span>
        </div>
      </div>

      <section class="manifesto">
        <div class="section-head">
          <span class="section-num">№ 02</span>
          <span class="section-label">Thesis</span>
          <span class="section-right">The Philosophy</span>
        </div>

        <div class="manifesto-heading anim-fade">
          <h2 class="display display--lg">My <span class="italic">Philosophy</span></h2>
          <span class="kbd">Long-form</span>
        </div>

        <div class="manifesto-grid">
          <p class="manifesto-drop anim-fade" style="--i:0">
            The next decade belongs to those who can <em>bridge the gap</em> between capital and code.
          </p>

          <div class="manifesto-body-col anim-fade" style="--i:1">
            <p><strong>Advanced Tech</strong>Developing AI agents and LLM-integrated workflows that actually work — from multi-agent orchestration to production-grade ML pipelines.</p>
            <p><strong>Finance</strong>Analyzing markets through the lens of data, algorithms, and venture-scale thinking. Building at the intersection of quant and code.</p>
            <p><strong>Creativity</strong>Documenting the process of building in public, to inspire a new standard of technical craftsmanship.</p>
          </div>

          <div class="manifesto-stats anim-fade stagger" style="--i:2">
            <div class="stat-row">
              <span class="stat-num"><span class="sym">∞</span></span>
              <span class="stat-label">Curiosity<br>Level</span>
            </div>
            <div class="stat-row">
              <span class="stat-num">24<span class="sym">/</span>7</span>
              <span class="stat-label">Building<br>Mode</span>
            </div>
          </div>
        </div>
      </section>
    </section>
  `;
}

// --- CONTACT ---
function renderContact() {
  const channels = [
    {
      name: 'X',
      label: 'Twitter · X',
      handle: '@NeelakandanNC',
      url: 'https://x.com/NeelakandanNC',
      note: 'Thoughts in public. Fastest replies here.'
    },
    {
      name: 'LinkedIn',
      label: 'Professional',
      handle: 'neelakandan-nc',
      url: 'https://www.linkedin.com/in/neelakandan-nc',
      note: 'For collaboration, capital, and formal outreach.'
    },
    {
      name: 'Gmail',
      label: 'Direct Mail',
      handle: 'neelakandannithin@gmail.com',
      url: 'mailto:neelakandannithin@gmail.com',
      note: 'Long-form inquiries, proposals, and decks.'
    },
    {
      name: 'YouTube',
      label: 'Video · Build Logs',
      handle: '@NeelakandanNC',
      url: 'https://www.youtube.com/@NeelakandanNC',
      note: 'Building in public, one episode at a time.'
    },
  ];

  const cards = channels.map((c, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `
      <a href="${c.url}" target="_blank" rel="noopener noreferrer" class="contact-card anim-fade" style="--i:${i}">
        <div class="contact-card__top">
          <span class="contact-card__num">№ ${num}</span>
          <span class="contact-card__label">${c.label}</span>
        </div>
        <h2 class="contact-card__name">${c.name}</h2>
        <p class="contact-card__note">${c.note}</p>
        <div class="contact-card__foot">
          <span class="contact-card__handle">${c.handle}</span>
          <span class="contact-card__arrow">↗</span>
        </div>
      </a>
    `;
  }).join('');

  return `
    <div class="page">
      <div class="section-head">
        <span class="section-num">№ 06</span>
        <span class="section-label">Connect</span>
        <span class="section-right">${channels.length} Channels</span>
      </div>
      <h1 class="display display--xl anim-fade" style="margin-bottom:1.5rem;">
        Get in <span class="italic">touch</span>.
      </h1>
      <p class="lede anim-fade" style="margin-bottom:3.5rem;">
        Four channels. No noise. Pick whichever fits the <em>conversation</em>.
      </p>
      <div class="contact-grid stagger">
        ${cards}
      </div>
    </div>
  `;
}

// --- PROJECTS ---
function renderProjects() {
  const projects = [
    {
      category: 'AI · Agentic Systems · Hero',
      title: 'ZeraPortfolio Advisor',
      goal: 'Post-market portfolio intelligence system. A 4-agent Gemini swarm runs after the Indian market close, fetches live Zerodha holdings, scrapes Screener.in fundamentals, pulls geopolitical signals, and produces a daily Bloomberg-style dashboard + PDF delivered to WhatsApp.',
      innovation: 'Multi-agent orchestration via Google ADK with Gemini 2.0 Flash and 2.5 Pro, APScheduler-driven post-close triggers, WeasyPrint PDF generation, and Twilio delivery.',
      stack: 'Google ADK · Gemini 2.0 Flash / 2.5 Pro · FastAPI · PostgreSQL (Neon) · React + Vite + Tailwind · Docker · APScheduler · Twilio · WeasyPrint'
    },
    {
      category: 'AI · Agentic Systems · National Finalist NSCIF 2026',
      title: 'Ydhya — Clinical Decision Support Agent',
      goal: 'AI triage agent for junior doctors in resource-constrained rural India. Analyzes vitals, symptoms, and co-morbidities in real time; flags complications with clinical rationale; recommends workups; routes to specialists on escalation.',
      architecture: 'Google ADK multi-agent orchestration layered over an XGBoost classifier trained on a real 20,000-row clinical dataset.',
      results: 'Validated with practicing doctors post-hackathon. National Finalist at NSCIF 2026.'
    },
    {
      category: 'AI · RAG · Production',
      title: 'Compliance RAG System',
      goal: 'Production-grade RAG application for compliance documents. Users upload PDFs; the system chunks, embeds, and retrieves clause-level citations with GPT-4o explanations — responses always include the verbatim source clause and page number.',
      innovation: '800-char chunks with 100-char overlap, OpenAI text-embedding-3-small, Pinecone Serverless for vector storage, zero-hallucination guarantee via enforced citation contracts.',
      stack: 'FastAPI · Streamlit · Pinecone · GPT-4o · PyMuPDF · Docker'
    },
    {
      category: 'AI · Fine-Tuning',
      title: 'Gemma 2B Medical QLoRA Fine-Tuning',
      goal: 'Fine-tuned Google Gemma 2B on the LiveClin medical dataset using 4-bit NF4 quantization and PEFT + LoRA targeting all attention and MLP projections.',
      highlights: 'Rank 8, alpha 32, paged AdamW optimizer. Trained on a single T4 GPU via Google Colab.',
      stack: 'HuggingFace Transformers · PEFT · TRL · BitsAndBytes · SFTTrainer'
    },
    {
      category: 'AI · Full-Stack',
      title: 'Multimodal Chatbot with Memory',
      goal: 'Full-stack chatbot supporting text and image input with persistent conversation memory, multi-turn history, and auto-titled threads.',
      architecture: 'LangChain orchestrates chat history; conversations stored in SQLite; OpenAI handles generation and title synthesis.',
      stack: 'FastAPI · React + TypeScript + Vite · LangChain · OpenAI SDK · SQLAlchemy · SQLite'
    },
    {
      category: 'MCP · Developer Tools',
      title: 'WebMCP Amazon Demo',
      goal: 'E-commerce demo site (4-page shopping flow) demonstrating WebMCP integration — every user action is simultaneously registered as a W3C navigator.modelContext tool, making the full flow agent-drivable.',
      features: 'Tested end-to-end with the WebMCP Chrome extension and Gemini CLI.',
      stack: 'React 19 · Vite · Tailwind · Zustand · React Router v7'
    },
    {
      category: 'MCP · Developer Tools',
      title: 'MCP Chat — File Search MCP Server',
      goal: 'CLI application for interactive chat with Claude via the Anthropic API, with document retrieval (@doc_id syntax), command-based prompts (/command prefix with Tab autocomplete), and extensible MCP tool integrations.',
      stack: 'Python · Anthropic SDK · MCP 1.8.0 · prompt-toolkit'
    },
    {
      category: 'Developer Tools',
      title: 'REPO FOR THAT',
      goal: 'A curated, searchable directory for open-source repositories with a distinctive retro/pixel art aesthetic.',
      architecture: 'Next.js 16 · PostgreSQL (Neon) · Drizzle ORM.',
      ux: 'Optimistic UI updates for bookmarking; JWT-based authentication via secure cookies.'
    },
    {
      category: 'Data · ML · Quantitative',
      title: 'StreamMax OTT Churn Prediction',
      goal: 'Predicts user fatigue before cancellation on a 10,000-user dataset using behavioral leading indicators.',
      metrics: 'Random Forest (600 estimators, max depth 12) outperformed logistic regression baseline by 6.2 AUC points.',
      results: 'Mean AUC-ROC of 0.786 via 5-fold stratified cross-validation. Outputs fatigue probability scores segmenting users into High/Medium/Low risk tranches for automated interventions.'
    },
    {
      category: 'Data · ML · Quantitative',
      title: 'MSME Financial Health Index — Zindi Competition',
      goal: 'ML pipeline predicting financial health of MSMEs across four African countries (Eswatini, Lesotho, Malawi, Zimbabwe).',
      innovation: 'Regime-based modeling per country, James-Stein shrinkage encoding, quantile transformations, adversarial validation (AUC 0.4928 — confirming train/test parity), and a multi-seed CatBoost/LightGBM/XGBoost ensemble with Repeated Stratified K-Fold.',
      stack: 'CatBoost · LightGBM · XGBoost · Pandas · scikit-learn'
    },
    {
      category: 'Data · ML · Quantitative',
      title: 'UIDAI Aadhaar Lifecycle Analysis — UIDAI Data Hackathon 2026',
      goal: 'Reframed Aadhaar as a lifecycle-driven system rather than a static enrollment database.',
      finding: 'Adult demographic updates — not youth enrollments — drive system stress; update surges are nationally synchronized; November is the peak stress month due to predictable backlog release.',
      output: 'Behavioral model of the system\'s stress dynamics; diagnostic notebook segmenting states into typologies for policy recommendations.'
    },
    {
      category: 'Data · ML · Quantitative',
      title: 'Gold & Silver Market Analysis Dashboard',
      goal: 'Interactive dashboard with 25+ years of daily futures data (~1,300 weekly points) analyzing the historical Gold/Silver relationship.',
      features: '4-panel synchronized chart grid (Gold/Silver weekly returns, ratio, price history) with linked x-axes, a timeline slider, and live market stats cards.',
      stack: 'Streamlit · Plotly · Pandas · yfinance'
    },
    {
      category: 'Data · ML · Quantitative',
      title: 'Statistical Risk-Reward Analysis Tool',
      goal: 'Python tool computing annualized returns, volatility, Sharpe-like risk-reward ratios, and visualizations for user-selected stock portfolios using Yahoo Finance data.',
      stack: 'Python · Pandas · NumPy · Matplotlib · yfinance'
    },
    {
      category: 'Data · ML · Quantitative',
      title: 'Modern Portfolio Theory Portfolio Analyzer',
      goal: 'Automated portfolio construction tool building market-cap-weighted portfolios and analyzing cumulative returns, maximum drawdowns, volatility, and beta against benchmarks.',
      stack: 'Python · Scipy · Pandas · Matplotlib'
    },
    {
      category: 'Data · ML · Quantitative',
      title: 'Portfolio Optimizer with Moving Average Strategy',
      goal: 'Combines Modern Portfolio Theory with tactical timing strategies to find optimal asset weights and test if MA crossovers beat buy-and-hold.',
      innovation: 'Tests thousands of MA combinations to determine if active management adds value by avoiding drawdowns during crashes.',
      stack: 'Python · Scipy · Pandas · Matplotlib'
    },
    {
      category: 'Data · ML · Quantitative',
      title: 'Linear Regression Beta Finder',
      goal: 'A Python tool that calculates Beta (β) and R² of stocks relative to a market index (e.g., S&P 500) using monthly log returns.',
      features: 'Automated data fetching, outlier handling, and visualization of Beta across 1y, 3y, 5y, 10y horizons.'
    },
    {
      category: 'Venture Capital · Investment',
      title: 'Accelsius — Investment Memo',
      focus: 'Strategic investment thesis for Accelsius, developing two-phase, direct-to-chip liquid cooling for AI data centers.',
      thesis: 'Addresses the structural limits of air cooling as AI workloads push densities beyond 30–50 kW per rack.',
      strategicFit: 'Alignment with HP Tech Ventures, emphasizing co-engineered architectures for next-gen AI systems.'
    }
  ];

  const rows = projects.map((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    const details = [];
    const push = (label, text) => { if (text) details.push({ label, text }); };
    push('Goal', p.goal);
    push('Focus', p.focus);
    push('Key Innovation', p.innovation);
    push('Key Finding', p.finding);
    push('Thesis', p.thesis);
    push('Highlights', p.highlights);
    push('Features', p.features);
    push('Architecture', p.architecture);
    push('Key Metrics', p.metrics);
    push('Results', p.results);
    push('Output', p.output);
    push('UX', p.ux);
    push('Strategic Fit', p.strategicFit);
    push('Stack', p.stack);

    const detailsHtml = details.map(d => `
      <div class="dossier-detail">
        <span class="dossier-detail__label">${d.label}</span>
        <span class="dossier-detail__text">${d.text}</span>
      </div>
    `).join('');

    return `
      <article class="dossier-row anim-fade" style="--i:${i}">
        <div class="dossier-num">
          <span><strong>№ ${num}</strong></span>
          <span class="dossier-category">${p.category}</span>
        </div>
        <div class="dossier-body">
          <h3 class="dossier-title">${p.title}</h3>
          <div class="dossier-details">${detailsHtml}</div>
        </div>
      </article>
    `;
  }).join('');

  return `
    <div class="page page--wide">
      <div class="section-head">
        <span class="section-num">№ 05</span>
        <span class="section-label">Building</span>
        <span class="section-right">${projects.length} Entries · 2024 — 2026</span>
      </div>
      <h1 class="display display--xl anim-fade" style="margin-bottom:1.5rem;">
        <span class="italic">Projects</span>.
      </h1>
      <p class="lede anim-fade" style="margin-bottom:3.5rem;">
        Advanced technology, quantitative analysis, and venture strategy — a running dossier of builds, experiments, and research.
      </p>
      <div class="dossier stagger">
        ${rows}
      </div>
    </div>
  `;
}

// --- BUILDER ---
function renderBuilder() {
  const ventures = [
    {
      name: 'SciTech Knowledge',
      desc: 'Learned the foundations through YouTube channels. Self-taught across science and technology, building a base of knowledge that fuels everything after.',
      status: 'learned', statusLabel: 'Foundation',
      lesson: 'Self-education is the most powerful investment you can make.'
    },
    {
      name: 'ModernClother',
      desc: 'First e-commerce venture — tried to sell apparel online. Pricing was too high and I had no understanding of sales and marketing at the time.',
      status: 'learned', statusLabel: 'Lesson Learned',
      lesson: 'Product-market fit matters more than the product itself. Pricing and distribution are everything.'
    },
    {
      name: 'MediPro Solutions',
      link: 'https://1mediprosolutions.wixsite.com/medi-pro-solutions',
      desc: 'Created an agency to help hospitals obtain NABH certification. Built the operations, outreach, and service model from scratch.',
      status: 'learned', statusLabel: 'NABH Agency',
      lesson: 'B2B services require deep domain expertise and trust-building over time.'
    },
    {
      name: 'Flaura',
      desc: 'Did beta testing and created a deck. Stopped due to lack of funds and a gap in innovation that I couldn\'t bridge at the time.',
      status: 'paused', statusLabel: 'Paused',
      lesson: 'Timing and capital are just as important as the idea.'
    },
    {
      name: 'LumoScript',
      desc: 'Just started — a new venture in the early stages. No clients yet so the work is still nascent, but the foundation is being laid.',
      status: 'paused', statusLabel: 'Stopped',
      lesson: 'Every big thing starts small. The key is to start.'
    },
    {
      name: 'Arthhive',
      desc: 'Worked on this for 9 months. Due to lack of time and competing priorities, we decided to pause the project.',
      status: 'paused', statusLabel: 'Stopped — 9 mo',
      lesson: 'Time is the scarcest resource. Choose your battles wisely.'
    },
    {
      name: 'Ween',
      desc: 'MVP is ready and the launch was planned. The product was taking shape but is currently stopped.',
      status: 'paused', statusLabel: 'Stopped',
      lesson: 'Ship it. Iterate. Don\'t wait for perfect.'
    },
    {
      name: 'repoforthat.dev',
      link: 'https://repoforthat.dev',
      desc: 'A platform to discover the right repo for any problem. Shipped the curation engine and developer tooling surface, then sunset the venture to refocus.',
      status: 'closed', statusLabel: 'Closed',
      lesson: 'Build what you wish existed — and know when to close the chapter.'
    },
    {
      name: 'Agentronics',
      desc: 'Currently active — building at the intersection of autonomous AI agents and electronics. Agentic systems that reason about hardware, sensors, and the physical world.',
      status: 'active', statusLabel: 'Active',
      lesson: 'The next frontier is agents that touch atoms, not just bits.'
    },
  ];

  const rows = ventures.map((v, i) => {
    const num = String(i + 1).padStart(2, '0');
    const nameHtml = v.link
      ? `<a href="${v.link}" target="_blank" rel="noopener noreferrer">${v.name}</a>`
      : v.name;
    return `
      <article class="venture-row anim-fade" style="--i:${i}">
        <span class="venture-idx">№ ${num}</span>
        <div class="venture-head">
          <span class="venture-status venture-status--${v.status}">${v.statusLabel}</span>
          <h3 class="venture-name">${nameHtml}</h3>
        </div>
        <div class="venture-detail">
          <p class="venture-desc">${v.desc}</p>
          <p class="venture-lesson">${v.lesson}</p>
        </div>
      </article>
    `;
  }).join('');

  return `
    <div class="page">
      <div class="section-head">
        <span class="section-num">№ 04</span>
        <span class="section-label">Builder Log</span>
        <span class="section-right">9 Ventures · 1 Active</span>
      </div>
      <h1 class="display display--xl anim-fade" style="margin-bottom:1rem;">
        Born <span class="italic">builder</span>.
      </h1>
      <p class="lede anim-fade" style="margin-bottom:3.5rem;">
        Every venture is a <em>lesson</em>. Every failure is data. What follows is a working log — the journey, unredacted.
      </p>
      <div class="venture-log stagger">
        ${rows}
      </div>
    </div>
  `;
}

// ============================================================
// POLYMATH DATA
// ============================================================
const polymathSkills = [
  {
    slug: 'programming',
    icon: '{}',
    title: 'Programming & Development',
    desc: 'Full-stack development, web technologies, and software engineering fundamentals.',
    resources: ['YouTube', 'FreeCodeCamp', 'MDN Docs', 'LeetCode'],
    notes: 'Started with Python, moved to JavaScript/TypeScript for full-stack. Currently deep in Node.js, React/Next.js, and building CLI tools. The best way to learn is to build real projects — every side project taught more than a tutorial ever could.',
    links: [
      { name: 'FreeCodeCamp', url: 'https://www.freecodecamp.org/' },
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
      { name: 'LeetCode', url: 'https://leetcode.com/' },
      { name: 'The Odin Project', url: 'https://www.theodinproject.com/' },
    ]
  },
  {
    slug: 'ml-ai',
    icon: '◈',
    title: 'Machine Learning & AI',
    desc: 'Neural networks, data science, AI agents, and LLM-integrated workflows.',
    resources: ['Andrew Ng', 'Fast.ai', 'Kaggle', 'Papers With Code'],
    notes: 'Transitioning from core electronics into ML/AI. Focused on practical AI — building agents, LLM pipelines, and production-grade ML systems. Currently exploring multi-agent orchestration and RAG pipelines.',
    links: [
      { name: 'Andrew Ng (Coursera)', url: 'https://www.coursera.org/instructor/andrewng' },
      { name: 'Fast.ai', url: 'https://www.fast.ai/' },
      { name: 'Kaggle', url: 'https://www.kaggle.com/' },
      { name: 'Papers With Code', url: 'https://paperswithcode.com/' },
      { name: 'Hugging Face', url: 'https://huggingface.co/' },
    ]
  },
  {
    slug: 'business',
    icon: '△',
    title: 'Business & Startups',
    desc: 'Entrepreneurship, sales, marketing, and building ventures from zero.',
    resources: ['YC Library', 'Indie Hackers', 'First-hand'],
    notes: 'Learned business through doing — from ModernClother to MediPro to Doubt Room. Failure is the best teacher. Key insight: distribution > product in early stages. Currently focused on building in public and lean startup methodology.',
    links: [
      { name: 'Y Combinator Library', url: 'https://www.ycombinator.com/library' },
      { name: 'Indie Hackers', url: 'https://www.indiehackers.com/' },
      { name: 'Paul Graham Essays', url: 'http://paulgraham.com/articles.html' },
    ]
  },
  {
    slug: 'design',
    icon: '⬡',
    title: 'Design & Product',
    desc: 'UI/UX thinking, product design, and user-centered development.',
    resources: ['Figma', 'Refactoring UI', 'Design Twitter'],
    notes: 'Design is not just how it looks — it\'s how it works. Focus on utility-first design: every element must earn its place. Inspired by terminal aesthetics, Bloomberg-style data density, and minimalist fintech UIs.',
    links: [
      { name: 'Figma', url: 'https://www.figma.com/' },
      { name: 'Refactoring UI', url: 'https://www.refactoringui.com/' },
      { name: 'Mobbin', url: 'https://mobbin.com/' },
    ]
  },
  {
    slug: 'systems',
    icon: '⊞',
    title: 'Systems & Infrastructure',
    desc: 'Cloud, DevOps, databases, and scalable architecture patterns.',
    resources: ['AWS Docs', 'Docker Docs', 'System Design Primer'],
    notes: 'Understanding infrastructure is non-negotiable for shipping real products. From Docker containers to cloud deployments, from PostgreSQL to pgvector — each layer of the stack matters. Currently focused on edge computing and serverless patterns.',
    links: [
      { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
      { name: 'AWS Documentation', url: 'https://docs.aws.amazon.com/' },
      { name: 'Docker Docs', url: 'https://docs.docker.com/' },
    ]
  },
  {
    slug: 'finance',
    icon: '◉',
    title: 'Quantitative Finance',
    desc: 'Market analysis, algorithmic thinking, and the intersection of capital and code.',
    resources: ['Zerodha Varsity', 'Investopedia', 'QuantConnect'],
    notes: 'Finance through the lens of engineering. Studying market microstructure, options pricing models, and algorithmic strategies. The goal: bridge the gap between capital and code. Currently building quantitative models and exploring systematic trading.',
    links: [
      { name: 'Zerodha Varsity', url: 'https://zerodha.com/varsity/' },
      { name: 'Investopedia', url: 'https://www.investopedia.com/' },
      { name: 'QuantConnect', url: 'https://www.quantconnect.com/' },
    ]
  },
  {
    slug: 'electronics',
    icon: '⚡',
    title: 'Electronics & STEM',
    desc: 'Core electronics, circuit design, and the engineering foundation behind everything.',
    resources: ['University', 'NPTEL', 'YouTube'],
    notes: 'Where it all started. Core Electronics background — circuit design, embedded systems, signal processing. This foundation gives a hardware-aware perspective to software engineering that most developers lack.',
    links: [
      { name: 'NPTEL', url: 'https://nptel.ac.in/' },
      { name: 'All About Circuits', url: 'https://www.allaboutcircuits.com/' },
    ]
  },
];

// --- POLYMATH (index) ---
function renderPolymath() {
  const rows = polymathSkills.map((s, i) => {
    const num = String(i + 1).padStart(2, '0');
    const resources = s.resources.map(r => `<span class="polymath-entry__resource">${r}</span>`).join('');
    // Title: split to allow italicizing the second word for character
    const parts = s.title.split(' & ');
    const titleHtml = parts.length === 2
      ? `${parts[0]} <em>&amp; ${parts[1]}</em>`
      : s.title;

    return `
      <a href="#/polymath/${s.slug}" class="polymath-entry anim-fade" style="--i:${i}">
        <span class="polymath-entry__num">№ ${num}</span>
        <div class="polymath-entry__content">
          <h3 class="polymath-entry__title">${titleHtml}</h3>
          <p class="polymath-entry__desc">${s.desc}</p>
          <div class="polymath-entry__resources">${resources}</div>
        </div>
        <span class="polymath-entry__arrow">→</span>
      </a>
    `;
  }).join('');

  return `
    <div class="page">
      <div class="section-head">
        <span class="section-num">№ 03</span>
        <span class="section-label">Knowledge</span>
        <span class="section-right">${polymathSkills.length} Domains</span>
      </div>
      <h1 class="display display--xl anim-fade" style="margin-bottom:1.5rem;">
        The <span class="italic">Polymath</span>.
      </h1>
      <p class="lede anim-fade" style="margin-bottom:3.5rem;">
        Every skill is a weapon. An index of <em>domains</em> — open any entry for notes, resources, and the learning journey.
      </p>
      <div class="polymath-index stagger">
        ${rows}
      </div>
    </div>
  `;
}

// --- POLYMATH DETAIL ---
function renderPolymathDetail(slug) {
  const skill = polymathSkills.find(s => s.slug === slug);
  if (!skill) {
    return `
      <div class="page">
        <a href="#/polymath" class="back-link">← Back to Polymath</a>
        <h1 class="display display--lg">Skill not <span class="italic">found</span>.</h1>
      </div>
    `;
  }

  const links = skill.links.map((l, i) => `
    <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="resource-link anim-fade" style="--i:${i}">
      <span class="resource-link__name">${l.name}</span>
      <span class="resource-link__arrow">↗</span>
    </a>
  `).join('');

  const tags = skill.resources.map(r => `<span class="polymath-detail__resource">${r}</span>`).join('');
  const idx = polymathSkills.findIndex(s => s.slug === slug);
  const num = String(idx + 1).padStart(2, '0');

  return `
    <div class="page">
      <a href="#/polymath" class="back-link anim-fade">← Back to Polymath · Index</a>
      <div class="polymath-detail">
        <header class="polymath-detail__header anim-fade">
          <div class="polymath-detail__icon">${skill.icon}</div>
          <div class="polymath-detail__head-content">
            <div class="kbd kbd--accent" style="align-self:flex-start;">№ ${num} — Domain</div>
            <h1 class="display display--lg">${skill.title.replace(' & ', ' <em>&amp; </em>')}</h1>
            <p class="lede">${skill.desc}</p>
            <div class="polymath-detail__resources">${tags}</div>
          </div>
        </header>

        <section class="polymath-detail__section anim-fade">
          <h2 class="polymath-detail__section-title">Notes</h2>
          <p class="polymath-detail__notes">${skill.notes}</p>
        </section>

        <section class="polymath-detail__section anim-fade">
          <h2 class="polymath-detail__section-title">Resources</h2>
          <div class="resource-links stagger">
            ${links}
          </div>
        </section>
      </div>
    </div>
  `;
}

// --- TASTE ---
function renderTaste() {
  return `
    <div class="page">
      <div class="section-head">
        <span class="section-num">№ 02</span>
        <span class="section-label">Curation</span>
        <span class="section-right">Books · Films</span>
      </div>
      <h1 class="display display--xl anim-fade" style="margin-bottom:1.5rem;">
        <span class="italic">Taste</span>.
      </h1>
      <p class="lede anim-fade" style="margin-bottom:3rem;">
        The <em>books</em> and <em>films</em> that shaped how I think, build, and see the world.
      </p>
      <div class="taste-diptych anim-fade">
        <a href="https://www.goodreads.com/user/show/196817664-neelakandan-nc" target="_blank" rel="noopener noreferrer" class="taste-panel">
          <div class="taste-panel__meta">
            <span><span class="taste-panel__num">№ 01</span> &nbsp; The Library</span>
            <span>↗ Goodreads</span>
          </div>
          <div>
            <div class="taste-panel__glyph">B.</div>
            <h2 class="taste-panel__title">On <span class="italic">reading</span>.</h2>
            <p class="taste-panel__desc" style="margin-top:1rem;">Startups, systems thinking, psychology, philosophy, and the occasional novel. A running catalog of the ideas I return to.</p>
          </div>
          <div class="taste-panel__cta">
            <span class="arrow-link">View on Goodreads <span class="arrow-link__arrow">↗</span></span>
          </div>
        </a>
        <a href="https://www.imdb.com/user/ur211808830/?ref_=hm_nv_profile" target="_blank" rel="noopener noreferrer" class="taste-panel">
          <div class="taste-panel__meta">
            <span><span class="taste-panel__num">№ 02</span> &nbsp; The Reel</span>
            <span>↗ IMDb</span>
          </div>
          <div>
            <div class="taste-panel__glyph">F.</div>
            <h2 class="taste-panel__title">On <span class="italic">watching</span>.</h2>
            <p class="taste-panel__desc" style="margin-top:1rem;">Tech dramas, finance thrillers, and biographies that inspire — curated cinema for anyone building something hard.</p>
          </div>
          <div class="taste-panel__cta">
            <span class="arrow-link">View on IMDb <span class="arrow-link__arrow">↗</span></span>
          </div>
        </a>
      </div>
    </div>
  `;
}

// --- LIFE ---
function renderLife() {
  const timeline = [
    {
      year: '2005',
      yearHtml: '20<em>05</em>',
      title: 'The Beginning',
      desc: 'Early curiosity awakens. Exploring the world and forming the foundational perspective that would later fuel everything else.',
      tags: ['Curiosity', 'Origin']
    },
    {
      year: '2017',
      yearHtml: '20<em>17</em>',
      title: 'Introduction to the Tech World',
      desc: 'First real exposure to technology through a Celkon smart 4G phone. Introduced to the incredible work of Sundar Pichai, sparking a deep interest in software engineering and leadership.',
      tags: ['Tech Exposure', 'Inspiration', 'Sundar Pichai']
    },
    {
      year: '2023',
      yearHtml: '20<em>23</em>',
      title: 'Entering NITA',
      desc: 'Began formal engineering education at the National Institute of Technology, Agartala. Diving into core STEM and surrounding myself with ambitious peers.',
      tags: ['NITA', 'Engineering', 'STEM']
    },
    {
      year: 'Exploration',
      yearHtml: '<em>Chapter</em><br>II',
      title: 'Early Ventures',
      desc: 'Attempted ModernClother (e-commerce) and MediPro Solutions (NABH agency). Learned hard lessons about pricing, sales, and B2B operations.',
      tags: ['E-Commerce', 'B2B', 'Lessons']
    },
    {
      year: 'Now',
      yearHtml: '<em>Now</em>',
      title: 'Deep Builds',
      desc: 'Currently building repoforthat.dev and exploring AI agents. Applying everything learned from past ventures into high-leverage software products.',
      tags: ['Shipping', 'Active', 'Growth']
    },
  ];

  const items = timeline.map((t, i) => {
    const num = String(i + 1).padStart(2, '0');
    const tags = t.tags.map(tag => `<span class="chapter__tag">${tag}</span>`).join('');
    return `
      <article class="chapter anim-fade" style="--i:${i}">
        <div class="chapter__year">
          <span class="chapter__year-num">${t.yearHtml}</span>
          <span class="chapter__year-label">Ch. ${num}</span>
        </div>
        <div class="chapter__body">
          <h3 class="chapter__title">${t.title}</h3>
          <p class="chapter__desc">${t.desc}</p>
          <div class="chapter__tags">${tags}</div>
        </div>
      </article>
    `;
  }).join('');

  return `
    <div class="page">
      <div class="section-head">
        <span class="section-num">№ 01</span>
        <span class="section-label">Journey</span>
        <span class="section-right">${timeline.length} Chapters</span>
      </div>
      <h1 class="display display--xl anim-fade" style="margin-bottom:1.5rem;">
        A <span class="italic">life</span>, so far.
      </h1>
      <p class="lede anim-fade" style="margin-bottom:3.5rem;">
        The milestones, lessons, and turning points — a personal chronicle of becoming.
      </p>
      <div class="chapters stagger">
        ${items}
      </div>
    </div>
  `;
}
