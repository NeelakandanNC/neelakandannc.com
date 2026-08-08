# MARK XIV

Personal site for Neelakandan N C. `site_spec.md` holds the original design
brief; this file records where the build departs from it and what still needs
your input. Where the two disagree, this file is current.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (runs lint + typecheck)
npm run typecheck
npm run lint
```

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion 11 · Vercel Analytics + Speed Insights.

---

## Design system

**Palette — neon blue `#3a86ff` primary, with red and gold as armour trim.**
Tokens live in `app/globals.css`; nothing hard-codes a hex outside that file.

**Two themes.** Dark is the design's home; light is a full second palette rather
than an inversion. The initial theme follows the system preference, the toggle
(top-right) overrides it, and the choice persists in `localStorage`. An inline
script in `app/layout.tsx` applies it before first paint so there's no flash.

**Type.** Anton for the display register (H1, Mark names, section headings),
IBM Plex Sans for prose, IBM Plex Mono for every label and readout.

**Contrast.** Both palettes were measured, and the audit is commented in
`app/globals.css`. The rule that matters when editing: `--arc-dim` and
`--hotrod` sit near 3:1 and are for **lines and fills only** — anything carrying
a word uses `--arc-text`, `--hotrod-hi`, `--gold-text` or `--telemetry`.

**The arc reactor** (`components/hud/ArcReactor.tsx`) is original SVG —
notched bezel, ten wound coils, triangular core, generated geometry throughout.
No film stills or traced assets: using an actual asset from the film would be
copyright infringement on a public site, and the spec's own §1 made that a hard
constraint. It appears three times: the fixed HUD instance, a large faint motif
in the Hero, and the COMMS core. It also drives four behaviours at once — scroll
progress, power scaling, section colour, and the Cave instability.

---

## Where the content lives

| File | Holds |
|---|---|
| `content/marks.ts` | The fourteen Marks. Single source of truth. |
| `content/systems.ts` | Diagnostics subsystem levels (filled segments out of 15). |
| `content/links.ts` | Contact channels, recovered from the previous site's source. |

---

## ⚠️ Needs your eyes before launch

1. **Every line of `content/marks.ts`.** The spec flagged its own Mark table as a
   reconstruction. Outcome figures, ordering and numerals came from it; the
   `problem` / `built` / `stack` fields were written from those descriptions.
   Nothing was invented beyond what the spec stated, but only you can confirm
   it's accurate.

2. **Mark X (Ydhya)** — still a placeholder. No description for it existed in the
   spec or anywhere in the old repo. Fill it in, or cut it and renumber — but
   cutting shifts Agentronics to XIII and breaks the "MARK XIV" thesis.

3. **Three achievements are now invisible.** Removing the Flight Log took the
   gold ◆ markers with it. The NSCIF finalist placing and the ECHO paper survive
   inside their Marks' outcome lines, but the **SRCC Derivatives 3rd place, the
   merged PR #97, and the YC application are no longer stated anywhere on the
   site.** They're preserved as an unrendered `achievements` array in
   `content/marks.ts` — worth putting somewhere, since they're strong recruiter
   signal.

4. **"Building in public" still appears once**, in The Cave, as one of the four
   things you're juggling ("A startup… Campus placements. Building in public.
   Content."). That's verbatim spec copy and structurally part of the section's
   argument, so it stayed when the Flight Log went. Say if you want it cut too.

5. **Project links.** `links` is omitted on most Marks because the real repo URLs
   aren't known and guessing slugs would ship dead links.

6. **Agentronics reads `ACTIVE`**, as the spec specifies. `MAINTENANCE` is a
   one-line change in `content/marks.ts` and `components/sections/CurrentBuild.tsx`.

---

## Deviations from the spec

**Remotion was not used.** Phase 4 called for three compositions rendered to
video at build time. All three are built with the platform instead, because the
acceptance checklist demands LCP < 1.8s and that boot "must not block LCP" —
targets a multi-megabyte video actively fights.

| Spec | Built as | Why |
|---|---|---|
| `BootSequence` — 6s MP4 | `components/sections/BootSequence.tsx`, DOM + CSS | ~4KB instead of a video fetch/decode; can't block LCP; skippable instantly. Follows the spec's frame table beat for beat. |
| `SuitSchematic` — 12s VP9 with alpha | `components/sections/SuitSchematic.tsx`, inline SVG | Real alpha in Safari with no APNG fallback; ~3KB. |
| `OgCard` — `renderStill` | `public/og.png`, pre-generated | No render pipeline needed in CI. |

This removes the `prebuild` step, so deploys can't fail on a headless-Chromium
render.

**Other departures:**

- **The Cave's opening line is Plex Sans, not the display face** — the section's
  whole treatment is the HUD language dropping away.
- **The favicon set was generated, not dropped in.** §10 described it as
  provided, but no such files existed. It is now the arc reactor rather than the
  photo, per your request; small sizes shed the gold trim and coil detail so the
  ring and core still read at 16px.

## Known gaps

- **`public/resume.pdf` does not exist.** `links.resume` points at it; add the
  file or drop the reference.
- **Not yet verified in a real browser.** The build, types, lint, contrast maths
  and served HTML were all checked, and the page returns 200 from
  `next start` — but no visual, mobile or Lighthouse pass has been run. Check
  360px and both themes before launch.
- **The OG card's display face is Impact, not Anton**, which isn't installed
  locally. Regenerate it if you want exact parity.
