# TISSOT PRX — Concept Scrollytelling Site

A concept e-commerce/marketing site for the Tissot PRX watch, built around a
canvas-driven scroll sequence that "explodes" the watch into its components
as you scroll. This is a mock/demo project, not an official Tissot product.

## Tech stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for scroll-linked and viewport-triggered animation

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## What's here

- **Scroll-sequence hero** (`components/Experience.tsx`) — a 240-frame canvas
  animation that assembles/disassembles the watch as the page scrolls, with
  overlaid story beats (`StoryBeats.tsx`) and a mobile/desktop chapter scrubber
  (`ExplodedTimeline.tsx`).
- **Technical Exploration** — a real disassembly video plus a static
  component breakdown (crystal, dial, movement, bracelet).
- **Configurator** (`Configurator.tsx`) — pick a dial, strap, and case size
  against a real product catalog (`lib/catalog.ts`), with pricing and a cart.
- **Collection & PDP** (`app/(site)/collection`, `app/(site)/watch`) — browse
  the full catalog and view individual references, including a zoom lightbox.
- **Editorial/lifestyle sections** — full-bleed campaign photography,
  a scattered photo gallery with hover pricing, and a press/news carousel.
- **Cart & search** — client-side cart state (`lib/cart-context.tsx`) and a
  full-site search overlay.

## Project structure

```
app/(site)/          Routes: home, /collection, /collection/[id], /watch/[slug]
app/apogee/           Standalone reference/demo page
components/           All UI components (one section/feature per file)
lib/                  Catalog data, cart context, scroll context, frame data
public/watches/       Product catalog photography
public/lifestyle/     Campaign/lifestyle photography
public/news/          Press coverage photography
public/frames/        240-frame scroll-sequence source images
public/video/         Disassembly video used in Technical Exploration
```

## Notes

Product photography and press coverage referenced in the News section are
used for concept/demonstration purposes.
