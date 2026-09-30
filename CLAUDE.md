# CLAUDE.md — TISSOT PRX concept site

Unofficial concept scrollytelling/e-commerce demo for the Tissot PRX: a 240-frame
canvas sequence that "explodes" the watch on scroll, plus configurator, collection,
PDP, cart and search. Nothing is for sale; cart and checkout are simulated.

## Brand / IP rules
- Unofficial concept. Never imply affiliation with or endorsement by Tissot SA or the
  Swatch Group; no "official" wording, no invented slogans presented as Tissot's.
- No invented quotes, reviews, testimonials or press attributions. Press items must
  reflect real coverage or be clearly generic.
- No real people (names, faces, ambassadors) without a concrete reason.
- Product and press imagery belongs to its owners and is used only for this
  non-commercial portfolio demo. Keep the README "Notes" disclaimer intact.

## Stack
Next.js 15.5 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 3.4 ·
Framer Motion 11 · Vitest 4 · ESLint 8 (next lint). Node per `.nvmrc` (22).

## Commands
```bash
npm run dev -- -p 3002   # local dev runs on :3002 (script default is 3000)
npm run build
npm start -- -p 3002     # serve production build (script pins -p 3000; override)
npm run typecheck        # tsc --noEmit
npm run lint             # next lint
npm test                 # vitest run (tests/, node env)
```

## Quality gate before every commit
`npm run typecheck && npm run lint && npm test && npm run build` — all must pass
(CI in `.github/workflows/ci.yml` runs the same four). Stage specific files only.

## Machine
8 GB RAM. Never run two `next build`s (or build + dev) at once, including across
the sibling EUROPA repo. Prefer tsc/lint/test for quick checks.

## Design system
- Colours are CSS tokens in `app/globals.css`: text `--ink-900/600/400` (AA text),
  `--ink-300` (non-text only), light surfaces `--bg-0/--bg-1`, dark sections
  `--bg-dark/--bg-dark-2` (RGB channels → Tailwind `bg-dark`, `bg-dark-2/90`).
- One accent: navy (`--navy`, `--navy-light`, `.btn-primary`). No new hues.
- Shadows only via tokens in `tailwind.config.ts`: `shadow-media`, `shadow-float`,
  `shadow-lift`. Don't hand-roll box-shadows.
- Motion easing house curve: `[0.16, 1, 0.3, 1]`. Keep motion restrained.

## Accessibility
- Text contrast ≥ 4.5:1 on its actual surface; check new token/surface pairs.
- Overlays (cart, search, menus, lightbox) use `useDialogA11y` from
  `lib/use-dialog-a11y.ts` (Escape, focus trap, focus return, scroll lock).
- `MotionProvider` wraps the app in `MotionConfig reducedMotion="user"`; custom
  loops/pointer effects must also check `useReducedMotion()`.
- Exactly one `<h1>` per page; decorative text (GhostHeading) stays `aria-hidden`.

## Performance
- Scroll-sequence frames stream in with a bounded in-flight request pool
  (`components/Experience.tsx`, `lib/frames.ts`); don't preload all 240 up front.
- Video uses `preload="metadata"` and starts on play — never `preload="auto"`.
- Prefer WebP for large photos; set `loading`/`fetchPriority` deliberately.

## Security
- CSP and security headers live in `next.config.mjs`, `'self'`-only. Adding any
  external origin (fonts, CDN, analytics, embeds) requires updating the CSP there.
- `images.unoptimized: true` (next/image optimizer disabled) — keep it.
- Treat localStorage and URL params as untrusted: parse, validate, fall back
  (see `lib/cart-context.tsx`, `lib/recent-searches.ts`).
- JSON-LD only through `components/JsonLd.tsx`, which escapes `<`.

## Mirrored components
`components/MagneticButton.tsx`, `components/GhostHeading.tsx` and
`components/MotionProvider.tsx` are byte-identical copies of the same files in
`~/projects/EUROPA`. Edit both repos together (`cmp` them) — no shared package.
MagneticButton: `maxOffsetPx` (px at edge, default 7) XOR `pullRatio` (0–1).
