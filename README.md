# TISSOT PRX — Concept Scrollytelling Site

A concept e-commerce/marketing site for the Tissot PRX watch, built around a
canvas-driven scroll sequence that "explodes" the watch into its components
as you scroll. This is a mock/demo project, not an official Tissot product.

## Tech stack

- **Next.js 15** (App Router) + React 19 + TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for scroll-linked and viewport-triggered animation

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3002](http://localhost:3002).

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Quality checks

CI (`.github/workflows/ci.yml`) runs these on every push and pull request to
`main`, using the Node version in `.nvmrc`:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm test            # vitest run (unit tests in tests/, node env)
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
| `BASE_URL`    | `http://localhost:3002`                                         |
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

## Analytics (optional)

Off by default: with no env vars set there is no analytics script, no CSP
change and no network call. To enable [Umami](https://umami.is) (cookieless,
no personal data), set these at build time (see `.env.example`):

| Env var                        | Default                            |
| ------------------------------ | ---------------------------------- |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | unset (analytics off); must be a UUID |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | `https://cloud.umami.is/script.js` (https only, or `http://localhost` for self-hosted dev) |

When enabled, the script origin is added to `script-src` and `connect-src`
(plus `https://gateway.umami.is`, where Umami Cloud sends events). The tracker
respects Do Not Track, and is limited to `NEXT_PUBLIC_SITE_URL`'s hostname
when that is set. Custom events (no free text; see `lib/analytics.ts`):

- `hero_scroll_depth` — `percent`: 25 / 50 / 75 / 100, once each per page view
- `configurator_change` — `option` (dial/size), `dial`, `size`
- `add_to_bag` — `source` (configurator/product_page), `variant`, `quantity`
- `cart_open` — `source` (header/mobile_menu)
- `search_submit` — `length` bucket (1-3/4-10/11+), `has_results`; never the query

## Notes

This is an unofficial concept project. It is not affiliated with, endorsed
by, or sponsored by Tissot SA or the Swatch Group. "Tissot", "PRX" and
"Powermatic 80" are trademarks of their respective owners and are used here
only to identify the subject of the concept.

All product photography and press imagery (including the images in the News
section) belongs to its respective owners and is used solely for
non-commercial portfolio demonstration. Nothing on the site is for sale;
prices, cart and checkout are simulated.
