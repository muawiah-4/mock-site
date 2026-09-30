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

## Quality checks

CI (`.github/workflows/ci.yml`) runs these on every push and pull request to
`main`, using the Node version in `.nvmrc`:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run build       # next build
```

### Screenshot QA (optional, local)

`scripts/qa-screenshots.mjs` drives an installed Chrome via `puppeteer-core`
(no browser is downloaded) against a running dev server:

```bash
npm run dev   # in another terminal
node scripts/qa-screenshots.mjs
```

| Env var       | Default                                                         |
| ------------- | --------------------------------------------------------------- |
| `CHROME_PATH` | `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`  |
| `BASE_URL`    | `http://localhost:3000`                                         |
| `QA_OUT_DIR`  | `/tmp/prx-qa`                                                   |
| `HEADFUL`     | unset (headless); set `HEADFUL=1` to show the browser window    |

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
components/           All UI components (one section/feature per file)
lib/                  Catalog data, cart context, scroll context, frame data
public/watches/       Product catalog photography
public/lifestyle/     Campaign/lifestyle photography
public/news/          Press coverage photography
public/frames/        240-frame scroll-sequence source images
public/video/         Disassembly video used in Technical Exploration
```

## Notes

This is an unofficial concept project. It is not affiliated with, endorsed
by, or sponsored by Tissot SA or the Swatch Group. "Tissot", "PRX" and
"Powermatic 80" are trademarks of their respective owners and are used here
only to identify the subject of the concept.

All product photography and press imagery (including the images in the News
section) belongs to its respective owners and is used solely for
non-commercial portfolio demonstration. Nothing on the site is for sale;
prices, cart and checkout are simulated.
