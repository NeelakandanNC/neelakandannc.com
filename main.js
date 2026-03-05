import './style.css';
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// Global Three.js variables
let scene, camera, renderer, particles, mesh;
let currentPageRoute = '';
let isLightMode = localStorage.getItem('theme') === 'light';// ============================================================
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
  // Close mobile menu
  mainNav.classList.remove('open');
  mobileBtn.classList.remove('open');

  // Handle polymath sub-routes like /polymath/programming
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

  // Scroll to top
  window.scrollTo(0, 0);

  // Initialize scroll animations
  requestAnimationFrame(() => initScrollAnimations());

  // Transition WebGL scene
  if (typeof transitionScene === 'function') {
    transitionScene(route);
  }
}

window.addEventListener('hashchange', navigate);
window.addEventListener('load', () => {
  initThreeJS();
  navigate();
});

document.addEventListener('mousemove', (e) => {
  const home = document.querySelector('.home');
  if (home) {
    const rect = home.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = home.offsetWidth / 2;
    const centerY = home.offsetHeight / 2;
    const tiltX = (y - centerY) / 40;
    const tiltY = (centerX - x) / 40;

    home.style.setProperty('--x', `${x}px`);
    home.style.setProperty('--y', `${y}px`);
    home.style.setProperty('--tilt-x', `${tiltX}deg`);
    home.style.setProperty('--tilt-y', `${tiltY}deg`);
  }
});

// Mobile menu toggle
mobileBtn.addEventListener('click', () => {
  mobileBtn.classList.toggle('open');
  mainNav.classList.toggle('open');
});

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
    if (scene) scene.fog.color.setHex(0xffffff);
  } else {
    document.body.classList.remove('light-theme');
    iconSun.style.display = 'block';
    iconMoon.style.display = 'none';
    if (scene) scene.fog.color.setHex(0x000000);
  }
}

// Initial Setup
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
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ============================================================
// TYPING ANIMATION
// ============================================================
function initTypingAnimation() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const texts = ['Builder', 'Engineer', 'Polymath', 'Creator'];
  let textIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function type() {
    const current = texts[textIdx];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 100);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        textIdx = (textIdx + 1) % texts.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 60);
    }
  }
  setTimeout(type, 800);
}

// ============================================================
// PAGE RENDERERS
// ============================================================

// --- HOME ---
function renderHome() {
  requestAnimationFrame(() => initTypingAnimation());
  return `
    <section class="home">
      <div class="home__content">
        <div class="anim-fade" style="--i:0">
          <p class="home__greeting">// the vision</p>
        </div>
        <h1 class="home__name anim-fade" style="--i:1">
          <span>Neelakandan NC</span><br>
          <span class="home__name-sub">Building at the intersection of STEM</span>
        </h1>
        <p class="home__bio anim-fade" style="--i:2">
          I am a builder. Currently, finding synergy between core Electronics
          and the world of Machine Learning, AI Agents, and Finance and Economics.
          I don't just study systems; I build them. Whether it's orchestrating multi-agent
          CLI tools or engineering low-latency AI dictation platforms, my goal is to
          create high-leverage technology that solves complex problems.
        </p>
        <div class="home__tags anim-fade stagger" style="--i:3">
          <span class="home__tag" style="--i:0">AI Agents</span>
          <span class="home__tag" style="--i:1">Finance and Economics</span>
          <span class="home__tag" style="--i:2">STEM</span>
          <span class="home__tag" style="--i:3">Tech</span>
        </div>
      </div>
      <div class="home__scroll-hint">Scroll to explore</div>
    </section>

    <section class="home__about">
      <div class="page-label anim-fade">Thesis</div>
      <h2 class="page-title anim-fade">My Philosophy</h2>
      <div class="about-grid">
        <div class="about-text">
          <p class="anim-fade">
            I believe the <strong>next decade belongs to those who can bridge
            the gap between capital and code.</strong> My focus is split between
            building advanced technology and understanding markets through the
            lens of data, algorithms, and venture-scale thinking.
          </p>
          <p class="anim-fade">
            <strong>Advanced Tech</strong> — Developing AI Agents and LLM-integrated
            workflows that actually work. From multi-agent orchestration to
            production-grade ML pipelines.
          </p>
          <p class="anim-fade">
            <strong>Finance</strong> — Analyzing markets through the lens of data,
            algorithms, and venture-scale thinking. Building at the intersection
            of quant and code.
          </p>
          <p class="anim-fade">
            <strong>Creativity</strong> — Documenting the process of building in
            public to inspire a new standard of technical craftsmanship.
          </p>
        </div>
        <div class="about-stats stagger">
          <div class="stat-card anim-scale" style="--i:0">
            <div class="stat-card__number">8+</div>
            <div class="stat-card__label">Ventures Built</div>
          </div>
          <div class="stat-card anim-scale" style="--i:1">
            <div class="stat-card__number">∞</div>
            <div class="stat-card__label">Curiosity Level</div>
          </div>
          <div class="stat-card anim-scale" style="--i:2">
            <div class="stat-card__number">24/7</div>
            <div class="stat-card__label">Building Mode</div>
          </div>
          <div class="stat-card anim-scale" style="--i:3">
            <div class="stat-card__number">1</div>
            <div class="stat-card__label">Mission</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// --- CONTACT ---
function renderContact() {
  const socials = [
    { name: 'X (Twitter)', handle: '@NeelakandanNC', icon: 'X', active: true, url: 'https://x.com/NeelakandanNC' },
    { name: 'LinkedIn', handle: 'neelakandan-nc', icon: 'in', active: true, url: 'https://www.linkedin.com/in/neelakandan-nc' },
    { name: 'GitHub', handle: 'NeelakandanNC', icon: 'GH', active: true, url: 'https://github.com/NeelakandanNC' },
    { name: 'Kaggle', handle: 'neelakandannc', icon: 'K', active: true, url: 'https://www.kaggle.com/neelakandannc' },
    { name: 'Hugging Face', handle: 'neelakandannc', icon: 'HF', active: true, url: 'https://huggingface.co/neelakandannc' },
    { name: 'Gmail', handle: 'neelakandannithin@gmail.com', icon: '@', active: true, url: 'mailto:neelakandannithin@gmail.com' },
    { name: 'YouTube', handle: '@NeelakandanNC', icon: '▶', active: true, url: 'https://www.youtube.com/@NeelakandanNC' },
    { name: 'Telegram', handle: '@neelakandan', icon: 'TG', active: false },
    { name: 'Reddit', handle: 'coming soon', icon: 'R', active: false },
    { name: 'WhatsApp', handle: 'coming soon', icon: 'WA', active: false },
    { name: 'Substack', handle: 'coming soon', icon: 'S', active: false },
    { name: 'Quora', handle: 'coming soon', icon: 'Q', active: false },
    { name: 'Instagram', handle: 'coming soon', icon: 'IG', active: false },
    { name: 'Threads', handle: 'coming soon', icon: 'TH', active: false },
    { name: 'Facebook', handle: 'coming soon', icon: 'FB', active: false },
  ];

  const cards = socials.map((s, i) => {
    const cls = s.active ? 'social-card--active' : 'social-card--inactive';
    const status = s.active ? 'Active' : 'Inactive';
    const wrapper = s.active ? `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-card ${cls} anim-scale" style="--i:${i}">` : `<div class="social-card ${cls} anim-scale" style="--i:${i}">`;
    const close = s.active ? '</a>' : '</div>';

    return `${wrapper}
      <div class="social-card__icon">${s.icon}</div>
      <div class="social-card__info">
        <div class="social-card__name">${s.name}</div>
        <div class="social-card__handle">${s.handle}</div>
      </div>
      <div class="social-card__status">${status}</div>
    ${close}`;
  }).join('');

  return `
    <div class="page">
      <div class="page-label anim-fade">Connect</div>
      <h1 class="page-title anim-fade">Get in Touch</h1>
      <p class="page-subtitle anim-fade">
        Reach out on any active platform. More channels coming soon.
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
      category: 'Financial Tech & Quantitative Analysis',
      title: 'Financial Health Index Prediction for MSMEs',
      goal: 'Developed a machine learning pipeline to predict the business resilience and creditworthiness of MSMEs across four African nations.',
      innovation: 'Implemented Regime-Based Modeling to handle "structural noise," where entire countries skipped specific survey questions.',
      highlights: 'Utilized a triple-model ensemble (CatBoost, LightGBM, XGBoost) and engineered domain-specific features like the "Skin in the Game" ratio and "Pure Efficiency" metrics.'
    },
    {
      category: 'Financial Tech & Quantitative Analysis',
      title: 'Gold & Silver Market Analysis Dashboard',
      goal: 'Built an interactive web-based tool for analyzing the 25+ year historical relationship between Gold and Silver markets.',
      features: 'Includes a real-time data pipeline via Yahoo Finance, synchronized Plotly dashboards, and market statistics cards measuring volatility and returns.',
      stack: 'Streamlit, Plotly, Pandas, and yfinance.'
    },
    {
      category: 'Financial Tech & Quantitative Analysis',
      title: 'Portfolio Optimizer with Moving Average Strategy',
      goal: 'Combines Modern Portfolio Theory with tactical timing strategies to find optimal asset weights and test if active timing (MA crossovers) beats buy-and-hold.',
      innovation: 'Tests thousands of moving average combinations to determine if active management adds value by avoiding drawdowns during market crashes.',
      stack: 'Python (Scipy for optimization), Pandas, Matplotlib.'
    },
    {
      category: 'Financial Tech & Quantitative Analysis',
      title: 'Linear Regression Beta Finder',
      goal: 'A Python tool that calculates the Beta (β) and R² of stocks relative to a market index (e.g., S&P 500) using monthly log returns.',
      features: 'Automated data fetching, outlier handling, and visualization of Beta values across different time horizons (1y, 3y, 5y, 10y).'
    },
    {
      category: 'Advanced Tech & Machine Learning',
      title: 'UIDAI Data Hackathon 2026: Aadhaar Lifecycle Modeling',
      goal: 'Reframed Aadhaar as a dynamic lifecycle system to identify patterns of delayed compliance and system stress.',
      finding: 'Discovered that adult demographic updates—not youth enrollments—are the primary drivers of peak-load system stress, particularly in November.',
      output: 'Developed a diagnostic Jupyter Notebook that segments states into typologies to offer targeted policy recommendations.'
    },
    {
      category: 'Advanced Tech & Machine Learning',
      title: 'StreamMax OTT Engagement Intelligence',
      goal: 'Predicted user "fatigue" (churn risk) weeks before cancellation using behavioral leading indicators.',
      metrics: 'Identified Recency and Momentum Drop (variance between 7-day and 30-day engagement) as the strongest predictors of churn.',
      results: 'Achieved a stable Mean AUC-ROC of 0.786 using a Random Forest Classifier, enabling automated risk-based interventions.'
    },
    {
      category: 'Advanced Tech & Machine Learning',
      title: 'REPO FOR THAT',
      goal: 'A curated, searchable directory for open-source repositories featuring a distinctive retro/pixel art aesthetic.',
      architecture: 'Built with Next.js 16, PostgreSQL (Neon), and Drizzle ORM.',
      ux: 'Implemented Optimistic UI Updates for bookmarking and JWT-based authentication via secure cookies.'
    },
    {
      category: 'Venture Capital & Investment Analysis',
      title: 'Accelsius Investment Memo',
      focus: 'Provided a strategic investment thesis for Accelsius, a company developing two-phase, direct-to-chip liquid cooling for AI data centers.',
      thesis: 'Highlighted how the technology addresses the structural limits of air cooling as AI workloads push power densities beyond 30–50kW per rack.',
      strategicFit: 'Analyzed the alignment with HP Tech Ventures, emphasizing the potential for co-engineered architectures for next-gen AI systems.'
    }
  ];

  const cards = projects.map((p, i) => {
    let detailsHtml = '';
    if (p.goal) detailsHtml += `<div class="project-card__detail"><strong>Goal:</strong> ${p.goal}</div>`;
    if (p.focus) detailsHtml += `<div class="project-card__detail"><strong>Focus:</strong> ${p.focus}</div>`;

    if (p.innovation) detailsHtml += `<div class="project-card__detail"><strong>Key Innovation:</strong> ${p.innovation}</div>`;
    if (p.finding) detailsHtml += `<div class="project-card__detail"><strong>Key Finding:</strong> ${p.finding}</div>`;
    if (p.thesis) detailsHtml += `<div class="project-card__detail"><strong>Thesis:</strong> ${p.thesis}</div>`;

    if (p.highlights) detailsHtml += `<div class="project-card__detail"><strong>Highlights:</strong> ${p.highlights}</div>`;
    if (p.features) detailsHtml += `<div class="project-card__detail"><strong>Features:</strong> ${p.features}</div>`;
    if (p.architecture) detailsHtml += `<div class="project-card__detail"><strong>Architecture:</strong> ${p.architecture}</div>`;

    if (p.metrics) detailsHtml += `<div class="project-card__detail"><strong>Key Metrics:</strong> ${p.metrics}</div>`;
    if (p.results) detailsHtml += `<div class="project-card__detail"><strong>Results:</strong> ${p.results}</div>`;
    if (p.output) detailsHtml += `<div class="project-card__detail"><strong>Output:</strong> ${p.output}</div>`;
    if (p.ux) detailsHtml += `<div class="project-card__detail"><strong>UX Features:</strong> ${p.ux}</div>`;
    if (p.strategicFit) detailsHtml += `<div class="project-card__detail"><strong>Strategic Fit:</strong> ${p.strategicFit}</div>`;

    if (p.stack) detailsHtml += `<div class="project-card__detail"><strong>Stack:</strong> ${p.stack}</div>`;

    return `
      <div class="project-card anim-fade" style="--i:${i}">
        <div class="project-card__category">${p.category}</div>
        <h3 class="project-card__title">${p.title}</h3>
        <div class="project-card__content">
          ${detailsHtml}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="page page--wide">
      <div class="page-label anim-fade">Building</div>
      <h1 class="page-title anim-fade">Projects</h1>
      <p class="page-subtitle anim-fade">
        Advanced technology, quantitative analysis, and venture strategy.
      </p>
      <div class="projects-grid stagger">
        ${cards}
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
      desc: 'First e-commerce venture — tried to sell apparel online. The pricing was too high and I had no understanding of sales and marketing at the time.',
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
      status: 'paused', statusLabel: 'Stopped — 9 months',
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
      desc: 'Active project — building a platform to discover the right repo for any problem. Combining developer tooling with curation.',
      status: 'active', statusLabel: 'Active',
      lesson: 'Build what you wish existed.'
    },
  ];

  const cards = ventures.map((v, i) => {
    const nameHtml = v.link ? `<a href="${v.link}" target="_blank" rel="noopener noreferrer">${v.name}</a>` : v.name;
    return `
      <div class="venture-card anim-fade" style="--i:${i}">
        <div class="venture-card__status venture-card__status--${v.status}">${v.statusLabel}</div>
        <h3 class="venture-card__name">${nameHtml}</h3>
        <p class="venture-card__desc">${v.desc}</p>
        <div class="venture-card__lesson">↳ ${v.lesson}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="page">
      <div class="builder-hero anim-fade">
        <h1 class="builder-hero__title">Born <span>Builder</span></h1>
        <p class="builder-hero__sub">
          Every venture is a lesson. Every failure is data. Here's the journey.
        </p>
      </div>
      <div class="builder-timeline stagger">
        ${cards}
      </div>
    </div>
  `;
}

// ============================================================
// POLYMATH DATA (shared between list and detail views)
// ============================================================
const polymathSkills = [
  {
    slug: 'programming',
    icon: '{ }',
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
    resources: ['YC Library', 'Indie Hackers', 'First-hand experience'],
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

// --- POLYMATH (main page — clickable skill cards) ---
function renderPolymath() {
  const cards = polymathSkills.map((s, i) => {
    const resources = s.resources.map(r => `<span class="skill-card__resource">${r}</span>`).join('');
    return `
      <a href="#/polymath/${s.slug}" class="skill-card skill-card--clickable anim-scale" style="--i:${i}">
        <div class="skill-card__icon">${s.icon}</div>
        <h3 class="skill-card__title">${s.title}</h3>
        <p class="skill-card__desc">${s.desc}</p>
        <div class="skill-card__resources">${resources}</div>
        <div class="skill-card__arrow">→</div>
      </a>
    `;
  }).join('');

  return `
    <div class="page">
      <div class="page-label anim-fade">Knowledge</div>
      <h1 class="page-title anim-fade">Polymath</h1>
      <p class="page-subtitle anim-fade">
        Every skill is a weapon. Click any domain to explore notes, resources, and the learning journey.
      </p>
      <div class="skills-grid stagger">
        ${cards}
      </div>
    </div>
  `;
}

// --- POLYMATH DETAIL (sub-page for each skill) ---
function renderPolymathDetail(slug) {
  const skill = polymathSkills.find(s => s.slug === slug);
  if (!skill) {
    return `
      <div class="page">
        <div class="page-label">404</div>
        <h1 class="page-title">Skill Not Found</h1>
        <p class="page-subtitle"><a href="#/polymath" class="back-link">← Back to Polymath</a></p>
      </div>
    `;
  }

  const links = skill.links.map((l, i) => `
    <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="resource-link anim-scale" style="--i:${i}">
      <span class="resource-link__name">${l.name}</span>
      <span class="resource-link__arrow">↗</span>
    </a>
  `).join('');

  const tags = skill.resources.map(r => `<span class="skill-card__resource">${r}</span>`).join('');

  return `
    <div class="page">
      <a href="#/polymath" class="back-link anim-fade">← Back to Polymath</a>
      <div class="polymath-detail">
        <div class="polymath-detail__header anim-fade">
          <div class="polymath-detail__icon">${skill.icon}</div>
          <h1 class="page-title">${skill.title}</h1>
          <p class="page-subtitle">${skill.desc}</p>
          <div class="skill-card__resources" style="margin-top: 0.5rem">${tags}</div>
        </div>

        <div class="polymath-detail__section anim-fade">
          <h2 class="polymath-detail__section-title">// Notes</h2>
          <p class="polymath-detail__notes">${skill.notes}</p>
        </div>

        <div class="polymath-detail__section anim-fade">
          <h2 class="polymath-detail__section-title">// Resources</h2>
          <div class="resource-links stagger">
            ${links}
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- TASTE ---
function renderTaste() {
  return `
    <div class="page">
      <div class="page-label anim-fade">Curation</div>
      <h1 class="page-title anim-fade">Taste</h1>
      <p class="page-subtitle anim-fade">
        The books and movies that shaped how I think and see the world.
      </p>
      <div class="taste-duo stagger">
        <a href="https://www.goodreads.com/user/show/196817664-neelakandan-nc" target="_blank" rel="noopener noreferrer" class="taste-big-card anim-scale" style="--i:0">
          <div class="taste-big-card__icon">📚</div>
          <div class="taste-big-card__content">
            <h2 class="taste-big-card__title">Books</h2>
            <p class="taste-big-card__desc">Explore my reading list on Goodreads — startups, systems thinking, psychology, and more.</p>
            <div class="taste-big-card__cta">
              <span>View on Goodreads</span>
              <span class="taste-big-card__arrow">↗</span>
            </div>
          </div>
        </a>
        <a href="https://www.imdb.com/user/ur211808830/?ref_=hm_nv_profile" target="_blank" rel="noopener noreferrer" class="taste-big-card anim-scale" style="--i:1">
          <div class="taste-big-card__icon">🎬</div>
          <div class="taste-big-card__content">
            <h2 class="taste-big-card__title">Movies</h2>
            <p class="taste-big-card__desc">Explore my watchlist on IMDb — tech dramas, finance thrillers, and biographies that inspire.</p>
            <div class="taste-big-card__cta">
              <span>View on IMDb</span>
              <span class="taste-big-card__arrow">↗</span>
            </div>
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
      title: 'The Beginning',
      desc: 'Early curiosity awakens. Exploring the world and forming the foundational perspective that would later fuel everything else.',
      tags: ['Curiosity', 'Origin']
    },
    {
      year: '2017',
      title: 'Introduction to Tech World',
      desc: 'First real exposure to technology through a Celkon smart 4G phone. Introduced to the incredible work of Sundar Pichai, sparking a deep interest in software engineering and leadership.',
      tags: ['Tech Exposure', 'Inspiration', 'Sundar Pichai']
    },
    {
      year: '2023',
      title: 'Entering NITA College',
      desc: 'Began formal engineering education at National Institute of Technology, Agartala (NITA). Diving into core STEM and surrounding myself with ambitious peers.',
      tags: ['NITA', 'Engineering', 'STEM']
    },
    {
      year: 'Exploration',
      title: 'Early Ventures',
      desc: 'Attempted ModernClother (e-commerce) and MediPro Solutions (NABH agency). Learned hard lessons about pricing, sales, and B2B operations.',
      tags: ['E-Commerce', 'B2B', 'Lessons']
    },
    {
      year: 'Now',
      title: 'Deep Builds',
      desc: 'Currently building repoforthat.dev and exploring AI agents. Applying everything learned from past ventures into high-leverage software products.',
      tags: ['Shipping', 'Active', 'Growth']
    },
  ];

  const items = timeline.map((t, i) => {
    const tags = t.tags.map(tag => `<span class="timeline-item__tag">${tag}</span>`).join('');
    return `
      <div class="timeline-item anim-fade" style="--i:${i}">
        <div class="timeline-item__year">${t.year}</div>
        <h3 class="timeline-item__title">${t.title}</h3>
        <p class="timeline-item__desc">${t.desc}</p>
        <div class="timeline-item__tags">${tags}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="page">
      <div class="page-label anim-fade">Journey</div>
      <h1 class="page-title anim-fade">Life Timeline</h1>
      <p class="page-subtitle anim-fade">
        The milestones, lessons, and turning points that shaped who I am.
      </p>
      <div class="timeline stagger">
        ${items}
      </div>
    </div>
  `;
}

// ============================================================
// THREE.JS PAGE-SPECIFIC WEBGL
// ============================================================
function initThreeJS() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.001);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Base Particle System (always present)
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 700;
  const posArray = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x0F52BA,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  mesh = new THREE.Group();
  scene.add(mesh);

  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  function animate() {
    requestAnimationFrame(animate);

    // Rotate particles slowly
    particles.rotation.y += 0.0005;
    particles.rotation.x += 0.0002;

    // Interactive camera wobble
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Animate the central mesh based on route
    if (mesh) {
      if (currentPageRoute === '/' || currentPageRoute === '') {
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.005;
      } else if (currentPageRoute === '/builder') {
        mesh.rotation.x += 0.01;
        mesh.rotation.y -= 0.005;
      } else if (currentPageRoute === '/projects') {
        mesh.children.forEach((child, i) => {
          child.rotation.x += 0.01;
          child.rotation.y += 0.01;
          child.position.y += Math.sin(Date.now() * 0.001 + i) * 0.02;
        });
      } else if (currentPageRoute === '/life') {
        particles.rotation.y += 0.002;
      } else {
        mesh.rotation.y += 0.002;
        mesh.rotation.x += 0.002;
      }
    }

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

window.transitionScene = function (route) {
  if (!scene) return;
  currentPageRoute = route;

  scene.remove(mesh);
  mesh = new THREE.Group();

  const material = new THREE.LineBasicMaterial({
    color: 0x0F52BA,
    transparent: true,
    opacity: 0.6
  });

  if (route === '/' || route === '') {
    // Home: Connections / Neural Net (Points connected by lines)
    const geo = new THREE.BufferGeometry();
    const pts = [];
    for (let i = 0; i < 60; i++) {
      pts.push(new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      ));
    }
    geo.setFromPoints(pts);
    const m = new THREE.LineSegments(geo, material);
    mesh.add(m);
  } else if (route === '/builder') {
    // Builder: Interlocking Gears (using rings/cylinders)
    const m1 = new THREE.Mesh(new THREE.TorusGeometry(4, 0.5, 8, 24), new THREE.MeshBasicMaterial({ color: 0x0F52BA, wireframe: true }));
    const m2 = new THREE.Mesh(new THREE.TorusGeometry(3, 0.5, 8, 24), new THREE.MeshBasicMaterial({ color: 0x0F52BA, wireframe: true }));
    m1.position.x = -3;
    m2.position.x = 3;
    m2.position.y = 2;
    // Animate logic relies on looping through mesh.children
    mesh.add(m1);
    mesh.add(m2);
  } else if (route === '/projects') {
    // Projects: 3D Matrix / Grid of Boxes
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMat = new THREE.MeshBasicMaterial({ color: 0x0F52BA, wireframe: true, opacity: 0.4, transparent: true });
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const b = new THREE.Mesh(boxGeo, boxMat);
          b.position.set(x * 4, y * 4, z * 4);
          mesh.add(b);
        }
      }
    }
  } else if (route === '/polymath' || route.startsWith('/polymath/')) {
    // Polymath: Atom Model (Nucleus + Rings)
    const nucleus = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 1), new THREE.MeshBasicMaterial({ color: 0x0F52BA, wireframe: true }));
    mesh.add(nucleus);
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(7, 0.1, 8, 64), material);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      mesh.add(ring);
    }
  } else if (route === '/taste') {
    // Taste: Cascading Pages (Curved planes)
    for (let i = 0; i < 5; i++) {
      const geo = new THREE.PlaneGeometry(8, 12, 4, 4);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x0F52BA, wireframe: true, side: THREE.DoubleSide }));
      m.position.z = i * -2;
      m.rotation.y = -Math.PI / 8 + (i * 0.1);
      m.rotation.x = 0.2;
      mesh.add(m);
    }
  } else if (route === '/life') {
    // Life: DNA Double Helix
    const geo = new THREE.BufferGeometry();
    const pts = [];
    for (let i = 0; i < 150; i++) {
      const angle = i * 0.2;
      const y = (i - 75) * 0.2;
      pts.push(new THREE.Vector3(Math.cos(angle) * 3, y, Math.sin(angle) * 3));
      pts.push(new THREE.Vector3(Math.cos(angle + Math.PI) * 3, y, Math.sin(angle + Math.PI) * 3));
      if (i % 5 === 0) {
        // connect strands
        pts.push(new THREE.Vector3(Math.cos(angle) * 3, y, Math.sin(angle) * 3));
        pts.push(new THREE.Vector3(Math.cos(angle + Math.PI) * 3, y, Math.sin(angle + Math.PI) * 3));
      }
    }
    geo.setFromPoints(pts);
    const m = new THREE.LineSegments(geo, material);
    mesh.add(m);
  } else if (route === '/contact') {
    // Contact: Pulse Radar / Satellite Ring
    const geo = new THREE.RingGeometry(2, 12, 32);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x0F52BA, wireframe: true }));
    m.rotation.x = Math.PI / 2;
    mesh.add(m);
  }

  scene.add(mesh);
}
