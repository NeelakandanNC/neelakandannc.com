# MARK XIV — Build Spec

**Personal site for Neelakandan N C (Neel).**
Handoff document for Claude Code. Read the whole thing before writing a line.

---

## 0. Mission brief

| | |
|---|---|
| **Domain** | neelakandannc.com (replaces the current site) |
| **Primary audience** | Campus + off-campus recruiters (AI/ML, quant, data), in that order of volume |
| **Secondary audience** | Founders, VCs, and the build-in-public crowd on X |
| **The page's single job** | Make a stranger believe this person ships, in under 30 seconds — then make them *like* him in the next 60 |
| **Success condition** | A recruiter forwards the link to a colleague with no commentary. It speaks for itself. |
| **Build window** | One weekend. This is a launch, not a life's work. |

### The problem this site solves

Neel is running four tracks at once: a startup (Agentronics), campus placements, building in public, and content. Read one way that's unfocused. A conventional portfolio makes it look worse — it flattens fourteen wildly different projects into a grid of grey cards and invites the question *"so what are you actually?"*

This site refuses to answer that question apologetically. It reframes the sprawl as the point.

---

## 1. The concept: **HALL OF ARMOR**

Tony Stark built forty-two suits. Most were failures. Mark II froze at altitude. Mark 42 fell apart if you looked at it wrong. He built them **in parallel**, obsessively, because he didn't know which one was right yet — and the Hall of Armor is the most impressive room in the whole story *precisely because* it displays the failures alongside the wins.

That's the site.

> **Every project is a Mark. The confusion is the workshop. Fourteen suits in three years is not a lack of focus — it's a search, run in public, run fast.**

Varun Mayya frames his career as a game playthrough — skills, grinds, levels. Same instinct, different metaphor. Yours is an engineering workshop, which fits better: you're not levelling a character, you're iterating hardware.

**The thesis line, and the only line that has to land:**

> ### Mark XIV. Still in the cave.

Everything else on the page is evidence for that sentence.

### Visual register

A **HUD** — a heads-up display. Not a movie poster. The user is *inside* the helmet looking out at a workshop: telemetry in the corners, wireframe schematics, targeting reticles that lock onto content as it enters the viewport, cyan trace lines, a power core that spins up.

### ⚠️ Hard constraint: zero Marvel assets

No Iron Man images, no movie stills, no Marvel/Stark logos, no character names in copy, no JARVIS voice lines, no film audio. Not one.

This is a legal requirement **and** the better design decision. Borrowed movie stills on a portfolio read as fan art. A HUD system built entirely from your own SVG, canvas, and CSS reads as *engineering*. Every glowing line on this page should be code you own.

The words "Iron Man," "Stark," "JARVIS," and "Avengers" appear **nowhere in the shipped copy**. The aesthetic does all the work. If a visitor gets the reference, good. If they don't, it still reads as a beautifully-built cockpit.

---

## 2. Design system

### 2.1 Palette

Blue-shifted black, not neutral black. The whole page should feel like a lit instrument in a dark hangar.

```css
--hangar:      #050810;  /* base background — near-black, blue-shifted */
--plate:       #0B1220;  /* raised surfaces, cards, panels */
--plate-hi:    #131E30;  /* hover / active plate */
--arc:         #5FE3F5;  /* ARC CYAN — primary HUD lines, active state, the core */
--arc-dim:     #2A6B78;  /* inactive HUD lines, hairlines, grid */
--hotrod:      #B71C2B;  /* deep hot-rod red — alerts, "live", destructive, the Cave */
--gold:        #F5C542;  /* gold trim — used ONLY on achievements. Restraint. */
--telemetry:   #8A97A8;  /* body text, labels, secondary */
--readout:     #E8F4F8;  /* primary text — cool white, never pure #FFF */
```

**Usage discipline:**
- `--gold` appears at most **five times** on the entire page. It marks verified achievements only (NSCIF finalist, SRCC 3rd place, merged PR, submitted paper, YC application). Gold is scarce so gold means something.
- `--hotrod` is for *live* and *unresolved* states only — the Agentronics status, the Cave section, the September countdown.
- Everything else is cyan on black. If you're reaching for a fifth colour, you've made a mistake.

### 2.2 Typography

Three faces. A HUD legitimately has multiple registers — display, prose, telemetry — but three is the ceiling.

| Role | Face | Usage |
|---|---|---|
| **Display** | `Michroma` (Google Fonts) | H1 + Mark numerals ONLY. Extremely wide, geometric, reads as a cockpit instrument. Use it four or five times on the whole page — it loses all power if you set paragraphs in it. |
| **Body** | `IBM Plex Sans` (400/500/600) | All prose. Engineering heritage, pairs cleanly under a technical display, and is not Inter. |
| **Telemetry** | `IBM Plex Mono` (400/500) | Every label, eyebrow, stat, timestamp, coordinate, status readout, and nav item. Always `uppercase`, `letter-spacing: 0.14em`, `font-size: 11–13px`. |

```css
/* type scale — 1.333 (perfect fourth), tightened at the top */
--t-hero:  clamp(2.6rem, 7.5vw, 6.4rem);   /* Michroma, line-height 0.95, tracking -0.02em */
--t-mark:  clamp(2rem, 5vw, 4rem);          /* Michroma — Mark numerals */
--t-h2:    clamp(1.6rem, 3.2vw, 2.6rem);    /* Plex Sans 600 */
--t-h3:    1.25rem;
--t-body:  1.0625rem;                        /* line-height 1.65 */
--t-label: 0.75rem;                          /* Plex Mono, uppercase, 0.14em */
```

Body prose gets `max-width: 62ch`. Non-negotiable — the Cave section is the emotional payload and it has to be readable.

### 2.3 Grid & layout

An **8px base unit** with a visible HUD frame: a 1px `--arc-dim` inset border 24px from the viewport edge on desktop, with corner brackets (⌐ ¬ ∟ ⌐) at each corner. It's fixed — it stays put while content scrolls under it. This is what sells "you are inside a helmet."

Corner telemetry, fixed to the frame:
- **Top-left:** `NEELAKANDAN N C · MARK XIV`
- **Top-right:** live IST clock, `HH:MM:SS IST`
- **Bottom-left:** current section name, updates on scroll
- **Bottom-right:** scroll depth `042%`

All in Plex Mono, `--arc-dim`, 11px. On mobile: drop to top-left + bottom-right only, or the frame eats the screen.

### 2.4 Motion doctrine

```
Standard easing:   cubic-bezier(0.22, 1, 0.36, 1)
Micro (hover):     120ms
Component reveal:  420ms
Section transition: 700ms
```

**Rules:**
1. Motion must *inform*. A reticle locking onto a card as it enters the viewport tells you where you are. A card that fades up because fading up is what cards do is noise — cut it.
2. Never animate more than **two** things at once in the viewport. Restraint is what separates this from a template.
3. `prefers-reduced-motion: reduce` → all Remotion video replaced by its static poster frame, all scroll-linked motion becomes instant opacity, the arc reactor stops spinning but keeps its fill state. The page must remain fully comprehensible with zero motion.

---

## 3. THE SIGNATURE ELEMENT — the Arc Reactor

**Spend all the boldness here.** One memorable object; everything around it stays quiet.

A fixed arc reactor, bottom-right (bottom-centre on mobile), 72px desktop / 52px mobile. Pure SVG + CSS, no images, no libraries.

**Construction:** concentric rings — outer bezel ring, a segmented mid-ring of 10 trapezoid coils, an inner triangular core, and a soft radial glow via `filter: drop-shadow`.

It does four jobs at once, which is why it earns its place:

1. **Scroll progress.** The outer ring is a `stroke-dasharray` arc that fills 0→100% with page scroll. It *is* the progress bar.
2. **Power level.** Glow intensity and coil ring rotation speed scale with scroll depth. The page "spins up" as you go deeper.
3. **Section identity.** The core colour shifts per section — cyan for everything, **`--hotrod` for The Cave**.
4. **Instability.** In The Cave section only, the reactor **flickers and destabilises** — a subtle irregular opacity stutter, ~2% duty cycle, plus a 1px positional jitter. This is the shrapnel. It is the single most important detail on the site: the power core becomes unstable at exactly the moment the copy admits he doesn't have it figured out. Then it re-stabilises when you scroll into "Current Build."

Nobody will consciously notice #4. Everybody will feel it.

Click behaviour → scrolls to top with a "power-down / power-up" pulse.

---

## 4. Tech stack

```
Framework      Next.js 15 (App Router) + TypeScript
Styling        Tailwind CSS v4 + CSS custom properties for the token layer
Animation      Framer Motion 11  (in-page component + scroll-linked motion)
Video          Remotion 4        (pre-rendered cinematic sequences, build-time)
Hosting        Vercel
Fonts          next/font/google — self-hosted, subset latin
Analytics      Vercel Analytics + Speed Insights
```

### 4.1 On "Framer" — read this carefully

You asked for Framer.ai. Two different products share that name and only one is buildable here:

- **Framer.ai** is a hosted no-code site builder. It cannot host a Remotion render pipeline, a custom canvas HUD, or a Next.js app — and Claude Code cannot write code into it. It's a dead end for this build.
- **Framer Motion** is the React animation library from the same company. It's exactly right for this: `useScroll`, `useTransform`, `AnimatePresence`, `layoutId` shared-element transitions between Mark cards and their detail views.

**This spec uses Framer Motion.** If you want Framer.ai in the loop, use it as a *visual sketchpad* — design a component look there, screenshot it, port it by hand. Don't try to host on it.

### 4.2 Repo structure

```
/
├── app/
│   ├── layout.tsx              # fonts, metadata, HUD frame, arc reactor
│   ├── page.tsx                # section composition
│   └── globals.css             # token layer + Tailwind
├── components/
│   ├── hud/
│   │   ├── ArcReactor.tsx      # ★ SIGNATURE — SVG, scroll-linked, instability state
│   │   ├── HudFrame.tsx        # fixed inset border + corner brackets
│   │   ├── Telemetry.tsx       # corner readouts (clock, section, depth)
│   │   ├── Reticle.tsx         # viewport-entry lock-on brackets
│   │   └── ScanLine.tsx        # ambient sweep, very low opacity
│   ├── sections/
│   │   ├── BootSequence.tsx    # Remotion video player + skip
│   │   ├── Hero.tsx
│   │   ├── HallOfArmor.tsx
│   │   ├── MarkCard.tsx
│   │   ├── MarkDetail.tsx      # layoutId modal
│   │   ├── Diagnostics.tsx
│   │   ├── TheCave.tsx
│   │   ├── CurrentBuild.tsx
│   │   ├── FlightLog.tsx
│   │   └── Comms.tsx
│   └── ui/
├── remotion/
│   ├── Root.tsx
│   ├── BootSequence/
│   ├── SuitSchematic/
│   └── OgCard/
├── content/
│   ├── marks.ts                # ← the Marks data. Single source of truth.
│   ├── systems.ts              # skills
│   └── links.ts                # ← contact links (see §9)
└── public/
    ├── video/                  # Remotion output
    └── favicon/                # ← provided, drop in as-is
```

---

## 5. Remotion compositions

Remotion renders React → video **at build time**. Output goes to `public/video/`. Add to `package.json`:

```json
"scripts": {
  "remotion:render": "remotion render remotion/Root.tsx BootSequence public/video/boot.mp4 && remotion render remotion/Root.tsx SuitSchematic public/video/schematic.webm --codec=vp9 --image-format=png",
  "prebuild": "npm run remotion:render"
}
```

### 5.1 `BootSequence` — 6s, 1920×1080, 30fps

The cold start. Plays **once per session** (`sessionStorage` flag), skippable at any time via click / Esc / scroll, and skipped entirely on `prefers-reduced-motion` and on repeat visits.

| Frames | Beat |
|---|---|
| 0–20 | Black. A single cyan pixel at centre. |
| 20–50 | Pixel expands into a horizontal scan line, sweeps top→bottom |
| 50–90 | HUD grid draws itself in — perspective lines, corner brackets snapping into place with a sharp 3-frame settle |
| 90–130 | Telemetry columns type in, Plex Mono: `POWER ██████████ 100%` · `LOC 11.29°N 92.75°E` · `SYS NOMINAL` · `MARK XIV` |
| 130–160 | Arc reactor ignites at centre — a hard white flash frame, then bloom out to cyan |
| 160–180 | Everything except the reactor dissolves; reactor scales down and translates to its resting bottom-right position |

Final frame **must** match the Hero's initial state exactly so the video→DOM handoff is invisible. Export a still of frame 179 as the `poster`.

### 5.2 `SuitSchematic` — 12s loop, VP9 **with alpha**, 1200×1200

A slowly rotating wireframe exploded-view schematic — an abstract technical assembly, deliberately *not* a humanoid figure. Cyan hairlines on transparency, with callout leader lines that fade in and out. Sits behind the Diagnostics section at `opacity: 0.22`, `mix-blend-mode: screen`.

VP9 alpha is essential — `--codec=vp9 --image-format=png`. Provide an APNG fallback for Safari.

### 5.3 `OgCard` — 1200×630 still

Rendered via `renderStill`. Arc reactor left, name in Michroma right, `MARK XIV · STILL IN THE CAVE` in Plex Mono below. Output → `public/og.png`.

---

## 6. Sections — order, spec, and final copy

Use this copy verbatim unless Neel changes it. Copy is where sites like this die.

---

### `00 · BOOT` — Remotion overlay
Full-viewport black overlay, `z-index: 100`. Skip button, bottom-right, Plex Mono 11px: `[ SKIP ]`.

---

### `01 · HERO` — the thesis

Full viewport. Content sits left-of-centre; the right two-fifths stay empty so the arc reactor and telemetry have room to breathe. Resist the urge to fill it.

```
                                                          ┌─ NEELAKANDAN N C · MARK XIV ────── 18:42:07 IST ─┐
                                                          │                                                 │
                                                          │   MARK XIV                                      │
                                                          │   ─────────────────                             │
                                                          │                                                 │
                                                          │   S T I L L   I N                               │
                                                          │   T H E   C A V E                               │
                                                          │                                     ◉           │
                                                          │   Final-year ECE at NIT Agartala                │
                                                          │   who stopped doing ECE.                        │
                                                          │                                                 │
                                                          │   [ HALL OF ARMOR ]  [ COMMS ]                  │
                                                          │                                                 │
                                                          └─ 01 / HERO ──────────────────────────── 004% ───┘
```

**Copy:**

> **Eyebrow** (Plex Mono, `--arc-dim`): `MARK XIV · BUILD IN PROGRESS`
>
> **H1** (Michroma, `--readout`, staggered per-character reveal, 24ms apart):
> ## STILL IN THE CAVE
>
> **Sub** (Plex Sans, `--telemetry`, max-width 46ch):
> Final-year ECE at NIT Agartala who stopped doing ECE. I build AI agents, trading systems, and research pipelines. Fourteen builds in three years. Most of them taught me something. Some of them worked.
>
> **CTAs:** `[ HALL OF ARMOR ↓ ]` (primary, cyan hairline border, fills on hover) · `[ COMMS ]` (ghost)

**Interaction:** cursor moves → the HUD grid parallaxes ±6px against it. Six pixels. Not sixty.

---

### `02 · HALL OF ARMOR` — the proof

The centrepiece. Fourteen Marks. Proof comes **before** vulnerability — earn the right to the Cave section first.

**Layout:** an asymmetric masonry rail, not a uniform grid. Uniform grids flatten everything to the same importance, which is exactly the failure mode this site exists to avoid. Marks V, VI, VII, XIV render at `span-2` (the ones that matter); the rest at `span-1`. The visual weight *is* the ranking.

**MarkCard anatomy:**
```
┌────────────────────────────────────┐
│ MARK VII              ⬤ DEPLOYED   │   ← Michroma numeral + Plex Mono status
│ ──────────────────────────────────  │
│ ZERAPORTFOLIO                       │   ← Plex Sans 600
│ Multi-agent Indian equity           │
│ portfolio advisor.                  │
│                                     │
│ ADK · GEMINI 2.5 · ZERODHA MCP      │   ← Plex Mono 10px, --arc-dim
│                                     │
│ ⌐                              ¬    │   ← reticle brackets, appear on hover
└────────────────────────────────────┘
```

**Status vocabulary** (Plex Mono, with a 6px dot):
`DEPLOYED` cyan · `ACTIVE` cyan pulsing · `ARCHIVED` `--arc-dim` · `FIELD TEST` gold · `UNSTABLE` `--hotrod`

**Behaviour:**
- On viewport entry, a reticle bracket **locks on** — four corner brackets converge from 20px out to the card edge over 280ms, staggered 60ms per card. This is the one place a scroll animation genuinely informs.
- Hover: card lifts to `--plate-hi`, hairline border brightens `--arc-dim` → `--arc`, tech-stack line reveals.
- Click: Framer Motion `layoutId` expands the card into a full detail panel. The Mark numeral is the shared element — it must travel continuously. That transition is worth getting right; it's the second-most-memorable moment after the reactor.

**Detail panel contains:** the problem, what was built, the stack, the outcome (with a number wherever one exists), and links (repo / live / paper).

**Filter rail** above the grid, Plex Mono: `ALL · AGENTS · MARKETS · RESEARCH · INFRA · EARLY`

---

### `03 · SYSTEMS DIAGNOSTIC` — skills, honestly

Skills as suit subsystems with power levels. The `SuitSchematic` Remotion loop sits behind at 22% opacity.

**Do not fake this.** A row of 95%-filled bars is the single least credible thing on a portfolio. Real levels, including the low ones — a subsystem reading 40% with a `DEVELOPING` tag is *more* convincing than a wall of green, because it means the other numbers are true.

```
POWER SYSTEMS        AI AGENTS & LLM ORCHESTRATION
├── Google ADK / multi-agent      ████████████░░░  PRIMARY
├── RAG + retrieval               ██████████░░░░░  OPERATIONAL
├── LLM fine-tuning (QLoRA)       ████████░░░░░░░  OPERATIONAL
└── MCP / agent infra             ███████████░░░░  PRIMARY

TARGETING            MARKETS & QUANT
├── Derivatives / options         █████████░░░░░░  OPERATIONAL
├── Gradient boosting ensembles   ███████████░░░░  PRIMARY
└── Financial engineering         ████████░░░░░░░  OPERATIONAL

AIRFRAME             ENGINEERING
├── Python                        ████████████░░░  PRIMARY
├── React / Next / Tailwind       █████████░░░░░░  OPERATIONAL
├── FastAPI / Postgres            █████████░░░░░░  OPERATIONAL
└── DSA                           ███████░░░░░░░░  DEVELOPING
```

Bars fill on scroll-into-view, staggered 40ms, 600ms duration. Once. Never loop.

---

### `04 · THE CAVE` — the soul of the site

This is why the site exists. Everything before it is setup.

**Treatment:** the visual language *drops away*. No cards, no grid, no reticles. Background darkens to `#020408`. The HUD frame dims to 30% opacity. The arc reactor destabilises (§3.4). Set in Plex Sans at `--t-body`, generous leading, `max-width: 62ch`, centred, with a lot of vertical space above and below.

The whole page has been shouting in a technical voice. Here it stops and talks.

**Copy:**

> `EYEBROW: 04 / CAVE · POWER UNSTABLE`
>
> **The first suit gets built in a cave. With a box of scraps.**
>
> Everybody remembers the flying. Nobody remembers that the first one couldn't land.
>
> So here's the honest version.
>
> I'm running four things at once right now. A startup with a deadline I set myself. Campus placements. Building in public. Content. I don't know which one works. I'm not going to pretend I do.
>
> What I do know is this: in three years I've shipped fourteen builds — flower delivery, hospital compliance, clinical triage, equity research, autonomous research pipelines, Postgres tooling, agent infrastructure. Some placed in national competitions. Some got merged into other people's repos. Some died quietly and deserved to.
>
> People will tell you that's unfocused. I've decided it isn't. It's a search — and I'm running it in public, and I'm running it fast, because the only way I find out which one is the real suit is to build all of them.
>
> I'm confused. I know I'm confused. I'm doing it anyway.
>
> That's who I am.
>
> **Mark XV is next.**

The last three lines get their own paragraph breaks and extra space. Let them land.

---

### `05 · CURRENT BUILD` — live status

Two panels, side by side (stacked on mobile). This section makes the whole site feel *current* rather than archival — it's the difference between a portfolio and a workshop with the lights on.

**Left — `MARK XIV · AGENTRONICS`** — status `ACTIVE`, `--hotrod` accent:
> WebMCP infrastructure — auth, observability, memory, and context management for AI agents interacting with websites.
> Live telemetry: days-to-gate counter, current build phase.

**Right — `MARK XV · IN FABRICATION`** — status `UNSTABLE`:
> Currently deep in AI agents, LLM systems, and interview prep. Open to full-time and internship roles in AI/ML engineering and quantitative research. Graduating May 2027.

⚠️ **Neel — decide before build:** does the Agentronics panel say `ACTIVE` or `MAINTENANCE`? See the note at the end of this doc.

---

### `06 · FLIGHT LOG` — building in public

A vertical timeline, Plex Mono timestamps, cyan hairline spine. Writing, milestones, ship dates. Pulls from X/Substack if a feed exists; otherwise a static array in `content/log.ts` — a hand-curated list of 8–12 real entries beats an empty auto-feed every time.

Gold marker (`◆`) on verified achievements only. Five maximum, sitewide.

---

### `07 · COMMS` — contact

Full-bleed, minimal. Arc reactor scales up to 180px and centres. Around it, links radiate as a hub-and-spoke — the reactor is the core, the links are the coils.

> `COMMS · CHANNEL OPEN`
> ## LET'S BUILD SOMETHING
> Open to AI/ML engineering and quant research roles. Also just open to talking.

Footer: `MARK XIV · BUILT WITH NEXT.JS, REMOTION, AND AN UNREASONABLE AMOUNT OF COFFEE · © 2026`

---

## 7. Content model

`content/marks.ts` — single source of truth. Ordered chronologically; Mark number = build order.

```ts
export type Status = 'DEPLOYED' | 'ACTIVE' | 'ARCHIVED' | 'FIELD_TEST' | 'UNSTABLE';
export type Category = 'AGENTS' | 'MARKETS' | 'RESEARCH' | 'INFRA' | 'EARLY';

export interface Mark {
  numeral: string;        // 'XIV'
  n: number;
  name: string;
  tagline: string;        // one line, max 12 words
  problem: string;
  built: string;
  stack: string[];
  outcome: string;        // ALWAYS lead with a number if one exists
  status: Status;
  category: Category;
  weight: 1 | 2;          // 2 = span-2 in the masonry
  links?: { repo?: string; live?: string; paper?: string };
}
```

### The fourteen Marks

> **Neel: verify every line of this before it ships.** I've assembled it from what I know about you — the ordering, the numerals, and a few outcome figures are my reconstruction and may be off. This is the one part of the doc that needs your eyes, not Claude Code's.

| # | Name | Category | Status | Weight | Outcome line |
|---|---|---|---|---|---|
| I | **Flaura** | EARLY | ARCHIVED | 1 | Farm-to-customer flower delivery. Morning/evening slots. First thing I ever shipped. |
| II | **Medi Pro Solutions** | EARLY | ARCHIVED | 1 | NABH certification consultancy for hospitals. Learned what compliance actually costs. |
| III | **Gemma 2B / QLoRA** | RESEARCH | ARCHIVED | 1 | Fine-tuned Gemma 2B on a single P100. Most of the work was library-version archaeology. |
| IV | **UIDAI Aadhaar Lifecycle** | RESEARCH | DEPLOYED | 1 | Lifecycle analysis across India's national identity dataset. |
| V | **TriageAI** | AGENTS | DEPLOYED | **2** | **NSCIF 2026 finalist — top of 1,000+ teams.** Multi-agent clinical decision support on Google ADK + XGBoost, trained on 20,000 real clinical records. |
| VI | **AutoResearchClaw** | RESEARCH | DEPLOYED | **2** | **23-stage autonomous research pipeline that wrote and submitted a paper.** Produced ECHO — an empirical study of architectural bias in wage-deflation forecasting. |
| VII | **ZeraPortfolio** | MARKETS | DEPLOYED | **2** | Multi-agent Indian equity advisor. Live Zerodha holdings, per-stock agents, geopolitical signals, PDF report to WhatsApp at 15:30 IST daily. |
| VIII | **Compliance RAG** | AGENTS | DEPLOYED | 1 | Retrieval system over regulatory documents. |
| IX | **Multimodal Chatbot** | AGENTS | DEPLOYED | 1 | Vision + text conversational system. |
| X | **Ydhya** | INFRA | ARCHIVED | 1 | — *(Neel: fill this in)* |
| XI | **pg_ai_query** | INFRA | FIELD_TEST | 1 | Natural-language querying for PostgreSQL. Sidecar architecture, Context7 MCP integration, accuracy benchmarking. GSoC 2026 proposal. |
| XII | **MSME Financial Health** | MARKETS | DEPLOYED | 1 | **0.8940 Micro-F1.** CatBoost/LightGBM blend, 24 engineered features, 10-fold stratified CV. |
| XIII | **Planetary Alignment Search** | RESEARCH | DEPLOYED | 1 | **Best 1M-year alignment: 8.581° on 20 Sept 263,486 CE.** Two-stage hierarchical search over JPL Keplerian elements. |
| XIV | **Agentronics** | INFRA | ACTIVE | **2** | WebMCP infrastructure for AI agents — auth, observability, memory, context management. |

**Separate `ACHIEVEMENTS` array** (gold `◆`, five maximum):
1. NSCIF 2026 finalist — TriageAI, from 1,000+ teams
2. SRCC Derivatives Challenge 2025 — 3rd place, 4% single-day return on ₹5L
3. PR #97 merged into `andrewyng/context-hub`
4. ECHO paper submitted for publication — *NeelakandanNC*
5. Y Combinator Fall 2026 — applied

---

## 8. What stays OFF the site

You said no data restrictions, and I've used everything that helps. But a public URL that recruiters read is not the same surface as a private chat, so I've excluded a few things deliberately. Flagging them so it's your call, not a silent edit:

- Exact CGPA and JEE ranks — leave them for the CV. On a site like this they shrink you.
- Any interview outcome, aptitude-test result, or company-specific application status.
- Terms of any offer, internship, or exclusivity clause.
- The X/Twitter reach incident.
- Any hard revenue/user number for Agentronics unless it's genuinely strong.

The Cave section is vulnerable **by design and on your terms** — "I'm running four things and I don't know which works" is a confident admission. "My aptitude test went badly" is not the same thing and doesn't belong.

---

## 9. Contact links

`neelakandannc.com` is client-side rendered, so the links couldn't be scraped from the live site.

**Claude Code:** read them out of the existing repo — grep for `href` on `mailto:`, `github.com`, `linkedin.com`, `x.com`/`twitter.com` — and populate `content/links.ts`. If the repo isn't available, stub it and stop:

```ts
export const links = {
  email:    'TODO',
  github:   'TODO',
  linkedin: 'TODO',
  x:        'TODO',
  substack: 'TODO',   // if it exists
  resume:   '/resume.pdf',
} as const;
```

Every link: `target="_blank" rel="noopener noreferrer"`, Plex Mono label, cyan hairline underline that draws left→right on hover over 180ms.

---

## 10. Favicon & metadata

The favicon set is **provided — drop it into `public/favicon/` unmodified.** It's a HUD reticle built around Neel's photo: at 180px you see his face, at 16px it reads as a glowing cyan ring with reticle ticks, which is far more distinctive in a tab bar than a shrunken portrait.

```
favicon.ico            multi-res (16/32/48/64/128/256)
favicon-16x16.png
favicon-32x32.png
favicon-192.png
favicon-512.png
apple-touch-icon.png   180×180
maskable-512.png       Android adaptive, 20% safe padding
```

```ts
export const metadata: Metadata = {
  title: 'Neelakandan N C — Mark XIV',
  description:
    'Final-year ECE at NIT Agartala who stopped doing ECE. AI agents, trading systems, research pipelines. Fourteen builds in three years.',
  metadataBase: new URL('https://neelakandannc.com'),
  openGraph: { images: ['/og.png'], type: 'website' },
  twitter:   { card: 'summary_large_image', images: ['/og.png'] },
  icons: {
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16' },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
};
```

`theme-color: #050810`. Add `manifest.json` referencing the 192/512/maskable set.

---

## 11. Build phases

Ship in this order. Each phase is independently deployable — if the weekend runs out mid-way, whatever exists is still a complete site.

**Phase 1 — Foundation.** Next.js + Tailwind + tokens + fonts. `HudFrame`, `Telemetry`, and **`ArcReactor` with scroll-linked fill**. Hero with real copy. Ship this. It's already better than the current site.

**Phase 2 — Proof.** `content/marks.ts`, Hall of Armor grid, MarkCard, reticle lock-on, `layoutId` detail panel, filter rail.

**Phase 3 — Soul.** The Cave, with reactor instability. Diagnostics. Current Build. Comms.

**Phase 4 — Cinema.** Remotion: BootSequence, SuitSchematic, OgCard. This is last **on purpose** — it's the highest-effort, lowest-necessity work, and a site that's 90% built with no boot video beats a boot video with no site.

**Phase 5 — Polish.** Flight Log, reduced-motion pass, Lighthouse, mobile QA.

---

## 12. Acceptance checklist

**Quality floor — non-negotiable:**
- [ ] Lighthouse ≥ 95 performance, ≥ 100 accessibility
- [ ] LCP < 1.8s on 4G. Boot video **must not** block LCP — lazy-load it, poster-first
- [ ] Fully responsive to 360px. The HUD frame degrades gracefully; it does not eat the screen
- [ ] Visible keyboard focus on every interactive element, cyan 2px offset ring
- [ ] `prefers-reduced-motion` honoured everywhere — video → poster, scroll motion → instant
- [ ] All text ≥ 4.5:1 contrast. `--telemetry` on `--hangar` — **verify this, it's borderline**
- [ ] Boot sequence skippable within 200ms of the first input, and skipped entirely on repeat visits
- [ ] Zero layout shift on font load (`next/font` with `display: swap` + size-adjust)

**Design integrity — the things that make it not a template:**
- [ ] Michroma appears **five times or fewer** on the whole page
- [ ] Gold appears **five times or fewer**, only on verified achievements
- [ ] The arc reactor genuinely destabilises in The Cave, and re-stabilises after
- [ ] The Mark numeral travels continuously in the `layoutId` card→detail transition
- [ ] Never more than two things animating in the viewport at once
- [ ] The words "Iron Man," "Stark," "JARVIS," "Marvel" appear **nowhere** in the shipped copy
- [ ] Zero third-party IP assets of any kind

---

## 13. Open decisions — Neel, these are yours

1. **Agentronics status.** `ACTIVE` or `MAINTENANCE`? You've said you're dropping to 30–60 min/day for the next two months, so `ACTIVE` overstates it. `MAINTENANCE` with a real one-liner about what you're doing instead is more honest and, on a page whose entire thesis is honesty, more powerful.
2. **"Mark XIV" or "Mark XV"?** XIV = Agentronics is the current suit. XV = *you* are the suit currently in fabrication. I've written it as XIV throughout, but XV is the braver read — it makes the site itself the fifteenth build.
3. **Mark X (Ydhya)** — I don't have enough to write a line for it. Fill it in or cut it and renumber.
4. **Boot sequence** — keep or cut? It's beautiful and it's a 2–3 second tax on every first visit. My vote: build it in Phase 4, keep it under 6s, and only if Phases 1–3 are genuinely done.
5. **Voice check** — read The Cave copy out loud. If any sentence isn't something you'd actually say, cut it. That section only works if it's yours.