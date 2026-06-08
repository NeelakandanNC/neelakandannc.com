# Neelakandan NC — Website Design Brief

A handoff document for designing the UI. Covers purpose, brand, structure,
every page's sections + real content, shared components, and interactions.

---

## 1. What the site is

**Neelakandan NC** — a **personal-brand + digital journal** for a founder
building working at the intersection of **AI and markets / frontier
technology**. It is part portfolio (what he's built), part living journal (the
journey, unredacted), part knowledge base (what he's learning).

- **Audience:** potential collaborators, investors/capital, fellow builders, and
  people who follow his build-in-public story.
- **Voice:** confident, founder, editorial. Plainspoken but premium. "Build in
  public," "every failure is data," "bridge capital and code."
- **Vibe:** modern, motion-forward, lots of whitespace, editorial typography. Not
  a flashy agency site — a sharp personal brand.

---

## 2. Brand & design system

### Color
- **Primary brand blue:** `#3a86ff` (accents, links, CTAs, highlights, the "N" mark).
- **Two themes, with a toggle. Dark is the default.**

| Token | Dark (default) | Light (warm cream) |
|---|---|---|
| Background | `#07080c` | `#fbf8f4` |
| Elevated surface | `#0d1018` | `#ffffff` |
| Text (primary) | `#f2f5fb` | `#1e1a1c` |
| Text (dim) | `#9aa3b6` | `#5d5760` |
| Text (faint) | `#626b7e` | `#8c8690` |
| Hairline / border | white @ 8% | ink @ 8% |
| Accent | `#3a86ff` | `#2f6fe0` (deepened for contrast) |

### Type
- **Display / headlines:** *Instrument Serif* (incl. italics for emphasis words).
- **Body / UI:** *Inter* (300–700).
- **Labels / eyebrows / numbers / metadata:** *JetBrains Mono* (uppercase,
  letter-spaced).
- Headlines are **fluid** (scale with viewport), tight letter-spacing, big.

### Layout
- Max content width **1240px**, centered, with a fluid side gutter.
- Card radius ~**14px**. Generous vertical rhythm between sections.
- Section pattern: a **mono eyebrow label** (often a "№ 01" index) + a section
  title, divided by a hairline rule.

### Logo / mark
- A **rounded square badge** (dark `#0b1020`) with a **blue "N"** (`#3a86ff`).
  Same mark used as favicon, header, and footer. Wordmark: "Neelakandan NC".

---

## 3. Global chrome (every page)

### Header (fixed, top)
- Left: **logo badge + "Neelakandan NC"** wordmark.
- Center: nav — **Home · Purpose · Journal · About**.
- Right: **social icons** (X, LinkedIn, YouTube) · a divider · **theme toggle**
  (sun/moon) · **"Get in touch"** pill CTA.
- On scroll: header gains a translucent blurred background + hairline.
- Mobile: nav collapses into a slide-in menu (hamburger); socials move inside it.

### Footer
- Big **"Start a conversation ↗"** CTA line (serif, oversized).
- Three columns: brand blurb · **Sitemap** (Home/Purpose/Journal/About) ·
  **Elsewhere** (X, LinkedIn, YouTube, Email).
- Baseline: "© [year] Neelakandan NC" · "Built with purpose · India".

---

## 4. Site map

```
/                 Home
/purpose          Purpose (builder log / ventures)
/journal          Journal (list of entries)
/journal/:slug    Journal entry (article)
/about            About (journey + domains + taste)
/learn/:slug      Domain detail (notes + resources)   ← linked from About
/contact          Contact (form + channels + FAQ)
*                 404
```

---

## 5. Pages & content

### 5.1 Home (`/`)

**A — Hero (editorial split, full viewport height)**
- Left column:
  - Tag chips: `Founder` · `Engineer` · `Building in public`
  - Headline (huge serif): **"Neelakandan"** then **"NC."** (italic, blue)
  - Bio: *"Founder at the intersection of AI and markets. I build the systems
    that create leverage — and journal the journey here."*
  - Two buttons: **View my work** (solid blue) · **Get in touch →** (ghost)
- Right column: a **full-body cut-out portrait** at lower opacity (~0.6), blended
  into the page.
- Background: large **moving marquee text** (roles/phrases) + a soft brand-blue
  glow that tracks the cursor.

**B — Stats strip** (4 across, animated count-up)
- **9** Ventures shipped · **5** Domains mastered · **3+** Years building ·
  **∞** Curiosity level

**C — Thesis / Philosophy** (`№ 01 — Thesis`)
- Big statement: *"The next decade belongs to those who can bridge the gap
  between capital and code."*
- 3 pillars:
  - **01 Advanced Tech** — AI agents & LLM workflows that ship, multi-agent
    orchestration to production ML.
  - **02 Markets** — reading markets through data, algorithms, venture-scale
    thinking; quant × code.
  - **03 In Public** — documenting every venture, lesson, failure, to raise the
    bar on technical craft.

**D — Selected work** (`№ 02 — Selected`)
- One featured card: **Agentronics** (status: Active) — "Building at the
  intersection of autonomous AI agents and electronics…" → links to Purpose.

**E — Latest journal** (`№ 03 — Journal`)
- Title: "Building, out loud." + 3 most recent journal entries as rows
  (date · title · excerpt · arrow) → link to full Journal.

---

### 5.2 Purpose (`/purpose`) — the builder log
- Header: eyebrow "Purpose — Builder Log · 9 ventures · 1 active", title
  **"Built on purpose."**, intro: *"Every venture is a lesson. Every failure is
  data."*
- A vertical **list of 9 ventures**, each row: index № · **status chip** ·
  **name** (some link out) · description · a one-line **lesson** (italic, quoted).

| # | Venture | Status | One-line |
|---|---|---|---|
| 01 | Agentronics | **Active** | AI agents × electronics; agents that touch atoms. |
| 02 | repoforthat.dev | Closed | Discover the right repo for any problem. |
| 03 | Ween | Stopped | MVP ready, launch planned, paused. |
| 04 | Arthhive | Stopped · 9 mo | Paused after nine months. |
| 05 | LumoScript | Early | New venture, earliest stage. |
| 06 | Flaura | Paused | Beta + deck; stopped on funds/innovation gap. |
| 07 | MediPro Solutions | NABH Agency | Helping hospitals get NABH certified. |
| 08 | ModernClother | Lesson | First e-commerce; learned distribution > product. |
| 09 | SciTech Knowledge | Foundation | Self-taught science/tech via YouTube. |

- **Status chips** are color-coded: Active (green), Closed (red), Paused/Stopped
  (amber), Foundation/Lesson (neutral).

---

### 5.3 Journal (`/journal`)
- Header: eyebrow "Digital Journal · N entries", title **"The journey, logged."**,
  intro about building-in-public notes.
- A stack of **entry cards**: meta row (date · #tags) · **title** (serif) ·
  excerpt · "Read entry →". Hover lifts the card.
- Entries are written as Markdown files; currently 3 (e.g. "Why I'm building in
  public", "Agents that touch atoms", "The lesson ModernClother beat into me").

### 5.4 Journal entry (`/journal/:slug`)
- Narrow reading column (~760px). **Reading-progress bar** pinned at top.
- Back link · meta (date · tags) · big serif title · optional excerpt lede.
- **Prose** (Markdown): headings, blockquotes (serif italic), lists, links, code,
  rules. Footer back-link.

---

### 5.5 About (`/about`)
- Header: eyebrow "About · A life, so far", title **"The polymath path."**,
  intro about the self-taught route across five domains.

**A — Journey** (numbered, process-style timeline; left sticky label "Journey")
1. **2005 — The Beginning** — early curiosity awakens.
2. **2017 — Into the Tech World** — first phone; discovered Sundar Pichai's work.
3. **2023 — Entering NITA** — formal engineering at NIT Agartala.
4. **Ch. II — Early Ventures** — ModernClother + MediPro; hard lessons.
5. **Now — Deep Builds** — Agentronics + AI agents.

**B — Domains** (grid of 5 cards; each links to its `/learn/:slug` page)
- ⚡ **Science** · { } **Technology** · ◈ **Engineering** · ∑ **Mathematics** ·
  ◉ **Finance**. Card = icon · title · one-liner · "Notes & resources →" on hover.

**C — Creative taste** (2 cards, external links)
- **Goodreads** — "The Library" — books that shaped his thinking.
- **IMDb** — "The Reel" — films that inspire builders.

### 5.6 Domain detail (`/learn/:slug`) — a *living* page
- Back link · big domain **icon badge** · "Domain 0X — what I'm learning" · title ·
  one-liner.
- **Notes** section (paragraph, expandable over time — "this is a living page").
- **Resources** grid of external links (e.g. NPTEL, FreeCodeCamp, Andrew Ng,
  Kaggle, Zerodha Varsity…). Designed to grow as he learns.

---

### 5.7 Contact (`/contact`)
- Header: eyebrow "Contact · 4 channels", title **"Get in touch."**
- **A — Contact form** (left intro "Let's build something exceptional." + right
  form): Name · Email · Project details · **Send message** (composes an email).
- **B — Channels** (4 cards): **X** (@NeelakandanNC) · **LinkedIn** · **Email**
  (neelakandannithin@gmail.com) · **YouTube** (@NeelakandanNC). Each: number ·
  name · note · handle.
- **C — FAQ** accordion: "What are you building?", "Why journal in public?",
  "What's your background?", "Open to collaboration/capital?", "How many ventures?"

### 5.8 404 — "Lost the thread." + back-to-home link.

---

## 6. Shared components / patterns to design

- **Section header** — mono eyebrow / "№ 0X" index + title + hairline divider.
- **Tag chip** — small mono pill (outline).
- **Status chip** — color-coded state label.
- **Card** — bordered, rounded, subtle hover lift + blue border on hover
  (used for ventures, journal, domains, contact, taste, resources).
- **Buttons** — solid (blue fill) and ghost (outline).
- **Stat** — oversized number (count-up) + mono label.
- **Marquee / ticker** — repeating moving text row.
- **Accordion** — FAQ expand/collapse.
- **Reading progress bar** — for articles.
- **Theme toggle** — sun/moon.

---

## 7. Motion & interactions (already specced in build)

- **Smooth scrolling** site-wide (eased, momentum).
- **Page transitions** — content fades/lifts on route change.
- **Scroll reveals** — sections fade + rise into view; headlines reveal
  word-by-word.
- **Hero** — cursor-tracking glow, subtle 3D tilt of the portrait toward the
  cursor, slow idle float, parallax + fade on scroll.
- **Hover** — cards lift, nav links get a blue underline + slight magnetic pull,
  arrows slide in.
- All motion respects **reduced-motion** preferences.

---

## 8. What we need from the designer

1. High-fidelity UI for each page above, in **both themes** (dark default + light).
2. Component library covering section 6 (states: default/hover/active/focus).
3. Responsive layouts (desktop / tablet / mobile), including the hero's mobile
   treatment (portrait as a faint backdrop behind the copy).
4. Keep the brand blue `#3a86ff`, the Instrument Serif / Inter / JetBrains Mono
   type system, and the editorial, motion-forward feel.
5. Deliverables: Figma file with styles/variables (color + type tokens mapped to
   the table in §2), components, and page frames.
```
