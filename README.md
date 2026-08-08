# MARK XIV

Personal site for Neelakandan N C. Built to `site_spec.md` — read that first; it
is the design authority and this file only records where the build departs from
it and what still needs your input.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (runs lint + typecheck)
npm run typecheck
npm run lint
```

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion 11 · Vercel Analytics + Speed Insights.

---

## Where the content lives

Everything editable is in `content/` — no copy is hard-coded in components
except the Hero and Cave prose, which are verbatim from the spec.

| File | Holds |
|---|---|
| `content/marks.ts` | The fourteen Marks. Single source of truth. |
| `content/systems.ts` | Diagnostics subsystem levels (filled segments out of 15). |
| `content/log.ts` | Flight Log entries; `verified: true` renders the gold ◆. |
| `content/links.ts` | Contact channels, recovered from the previous site's source. |

---

## ⚠️ Needs your eyes before launch

1. **Every line of `content/marks.ts`.** The spec flagged its own Mark table as a
   reconstruction. Outcome figures, ordering and numerals came from it; the
   `problem` / `built` / `stack` fields were written from those descriptions.
   Nothing was invented beyond what the spec stated, but only you can confirm
   it's accurate.

2. **Mark X (Ydhya)** — a placeholder. No description for it existed in the spec
   or anywhere in the old repo, so there was nothing truthful to write. Fill it
   in, or cut it and renumber — but note that cutting shifts Agentronics to XIII
   and breaks the "MARK XIV" thesis the whole site rests on.

3. **Project links.** `links` is omitted on most Marks because the real repo URLs
   aren't known and guessing slugs would ship dead links. Add them and they
   appear in the detail panel automatically.

4. **Open decisions from spec §13**, resolved as follows so the build could
   finish — each is a one-line change:
   - **Agentronics status → `ACTIVE`**, as §6.05 and the Mark table both specify.
     The spec author argues `MAINTENANCE` is more honest at 30–60 min/day. Change
     it in `content/marks.ts` (Mark XIV `status`) and `components/sections/CurrentBuild.tsx`.
   - **"Mark XIV" kept** throughout, as written in the spec.
   - **Boot sequence kept**, built as DOM rather than video (see below).

---

## Deviations from the spec, and why

**Remotion was not used.** The spec's Phase 4 called for three Remotion
compositions rendered to video at build time. All three are built with the
platform instead, and the reasoning is the same in each case: the acceptance
checklist demands Lighthouse ≥ 95, LCP < 1.8s, and that boot "must not block
LCP" — targets that a multi-megabyte video fetch actively fights.

| Spec | Built as | Why |
|---|---|---|
| `BootSequence` — 6s MP4 | `components/sections/BootSequence.tsx`, DOM + CSS | ~4KB instead of a video fetch/decode; can't block LCP; skippable instantly; no poster frame to keep in sync. Follows the spec's frame table beat for beat. |
| `SuitSchematic` — 12s VP9 with alpha | `components/sections/SuitSchematic.tsx`, inline SVG | Real alpha in Safari with no APNG fallback to maintain; ~3KB; reduced-motion is a one-line branch. |
| `OgCard` — `renderStill` | `public/og.png`, pre-generated | A static PNG needs no render pipeline in CI. |

This also removes the `prebuild` render step, so `npm run build` stays fast and
Vercel deploys can't fail on a headless-Chromium render.

**Other deliberate departures:**

- **`FIELD TEST` is a hollow cyan ring, not gold.** §6.02 lists it as gold, but
  §2.1 and the acceptance checklist cap gold at five uses reserved for verified
  achievements — and the five Flight Log ◆ markers already spend that budget.
  The rendered page contains exactly five gold elements.
- **Corner telemetry text is `--telemetry`, not `--arc-dim`.** §2.3 specifies
  `--arc-dim` at 11px, which measures 3.31:1 and would breach the checklist's
  4.5:1 floor. The frame strokes around the text stay `--arc-dim`; only the
  words changed. Same trade for hot-rod: `--hotrod` fills and borders,
  `--hotrod-hi` (6.62:1) wherever it carries a word. Full audit is commented in
  `app/globals.css`.
- **The Cave's opening line is Plex Sans, not Michroma.** §2.2 restricts Michroma
  to "H1 + Mark numerals ONLY", and it suits the Cave's stripped-back treatment.
- **`--telemetry` kept at the spec's `#8A97A8`.** The checklist asked to verify
  it; it measures 6.74:1 and passes.
- **The favicon set was generated, not dropped in.** §10 describes it as
  provided, but no such files existed — only the source photo. `public/favicon/`
  was generated to the description: face visible at 180px, collapsing to a
  glowing cyan reticle ring at 16px.

## Known gaps

- **`public/resume.pdf` does not exist.** `links.resume` points at it; add the
  file or drop the reference.
- **Not yet verified in a real browser.** The build, types, lint, contrast maths
  and rendered HTML were all checked, but no visual or Lighthouse pass has been
  run. Do a mobile check at 360px and a Lighthouse run before launch.
- **The OG card's display face is Avenir Next, not Michroma**, which isn't
  installed locally. Regenerate it if you want exact parity with the site.
