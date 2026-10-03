# TISSOT PRX — Concept Scrollytelling Site

A concept product site for the Tissot PRX. As you scroll, a 240-frame canvas
sequence takes the watch apart into its components. The site also has a
working configurator, a full collection with product pages, and a cart that
keeps its contents between visits.

> **Unofficial concept.** This project is not affiliated with, endorsed by,
> or sponsored by Tissot SA or the Swatch Group. See [Notes](#notes).

![CI](https://github.com/muawiah-4/mock-site/actions/workflows/ci.yml/badge.svg)

## Features

- **Scroll-sequence hero** (`components/Experience.tsx`). This is a
  240-frame canvas that disassembles and reassembles the watch as you
  scroll.
  - The first visible frame loads straight away.
  - The other frames stream in six at a time, starting with the ones nearest
    the current scroll position.
  - If a frame hasn't loaded yet, the nearest loaded frame is drawn instead.
  - Story cards sit over the sequence (`StoryBeats.tsx`), alongside a chapter
    scrubber (`ExplodedTimeline.tsx`). A **Skip intro** link lets keyboard
    users jump past the hero.
- **Technical exploration.** A real disassembly video and a breakdown of the
  components. The video only plays when it's in view, and it respects reduced
  motion.
- **Configurator** (`Configurator.tsx`, logic in `lib/configurator.ts`). Pick
  a dial and a case size. You can only choose combinations that exist in
  `lib/catalog.ts`. Sizes that aren't available are disabled and labelled.
- **Collection and product pages** (`/collection`, `/collection/[id]` and
  `/watch/[slug]`). Each product page has a variant switcher for related
  watches and a zoom lightbox.
- **Cart and search.** The cart is saved in `localStorage` and checked when
  it loads, so bad data can't break the page. The search overlay remembers
  recent searches.
- **Editorial sections.** Campaign photography, a scattered gallery that
  shows prices on hover, a news carousel and a store locator.

## Tech stack

| | |
|---|---|
| Framework | Next.js 15.5 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 3 with CSS custom-property tokens (`app/globals.css`) |
| Motion | Framer Motion 11, with `MotionConfig reducedMotion="user"` across the whole site |
| Icons | lucide-react |
| Tests | Vitest 4: unit tests, node environment |
| CI | GitHub Actions: typecheck, lint, test and build on every PR |

## Getting started

You need Node 22 (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3002
```

For a production build:

```bash
npm run build
npm start          # http://localhost:3002
```

The default port is **3002**.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server on :3002 |
| `npm run build` | Builds for production. Every page is generated as static HTML |
| `npm start` | Serves the production build on :3002 |
| `npm run typecheck` | Runs `tsc --noEmit` |
| `npm run lint` | Runs `next lint` on `app/`, `components/`, `lib/` and `tests/` |
| `npm test` | Runs `vitest run`, the 145 unit tests in `tests/` |

CI (`.github/workflows/ci.yml`) runs typecheck, lint, test and build on every
push and pull request to `main`.

### Screenshot QA (optional, local)

`scripts/qa-screenshots.mjs` uses `puppeteer-core` to drive the Chrome you
already have installed against a running server. It doesn't download a
browser.

```bash
npm run dev   # in another terminal
node scripts/qa-screenshots.mjs
```

| Env var | Default |
|---|---|
| `CHROME_PATH` | `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` |
| `BASE_URL` | `http://localhost:3002` |
| `QA_OUT_DIR` | `/tmp/prx-qa` |
| `HEADFUL` | Unset, so Chrome runs headless. Set `HEADFUL=1` to show the window |

## Environment variables

All of these are optional. See `.env.example`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The site's public address, used for canonical URLs, Open Graph tags, the sitemap and JSON-LD. Defaults to `http://localhost:3002`. **Set this when you deploy.** |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Turns on Umami analytics. It must be a UUID. While it's unset, analytics is off. |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | The Umami script URL. Defaults to `https://cloud.umami.is/script.js`. |

### Analytics (optional)

Analytics is off by default. With no website ID set, there's no script, no
CSP change and no network call.

When you turn it on, [Umami](https://umami.is) loads. It uses no cookies and
respects Do Not Track. Its origin is added to `script-src` and `connect-src`.
These events are sent, and none of them include free text (see
`lib/analytics.ts`):

- `hero_scroll_depth`: sent at 25, 50, 75 and 100%, once each per page view
- `configurator_change`
- `add_to_bag`: from the configurator or a product page
- `cart_open`
- `search_submit`: a length bucket only, never the query itself

## Project structure

```
app/
  (site)/              Home, /collection, /collection/[id], /watch/[slug]
  layout.tsx           Root layout, default metadata, MotionProvider, analytics
  not-found.tsx        Custom 404
  sitemap.ts           /sitemap.xml
  robots.ts            /robots.txt
components/            One section or feature per file
  MagneticButton.tsx   Shared with EUROPA; keep both copies in sync
  GhostHeading.tsx     Shared with EUROPA
  MotionProvider.tsx   Shared with EUROPA
lib/
  catalog.ts           Product catalog; the source of truth for prices and sizes
  configurator.ts      Which dial and size combinations are available
  cart-context.tsx     Cart reducer, plus parsing and checking the saved cart
  frames.ts            Frame paths and story-card data
  use-dialog-a11y.ts   Escape to close, focus trap and focus return for dialogs
  site.ts              SITE_URL and metadata helpers
  analytics.ts         Opt-in Umami config and track()
tests/                 Vitest unit tests
scripts/               Local screenshot QA
public/
  frames/              The 240 hero frames (1280×720 JPEG)
  watches/             Product photography (JPEG, also used for Open Graph images)
  lifestyle/, news/    Editorial photography (WebP)
  video/               Disassembly video
```

## Quality notes

- **Accessibility**
  - Text contrast is at least 4.5:1.
  - The cart, search, mobile menu and lightbox close with Escape, keep
    keyboard focus inside while open, and return focus when they close.
  - Focus is always visible, each page has exactly one `<h1>`, and reduced
    motion is respected.
- **SEO**
  - Every page has its own title, description, canonical URL, and Open
    Graph and Twitter cards.
  - There's a sitemap, a robots file and a custom 404.
  - Pages include WebSite and BreadcrumbList JSON-LD. Product and Offer
    markup is left out on purpose, because the prices are simulated.
- **Security.** The site sends a strict Content-Security-Policy with no
  external origins, along with nosniff, Referrer-Policy, Permissions-Policy,
  X-Frame-Options, HSTS and COOP headers. The image optimizer is turned off.
  See [SECURITY.md](SECURITY.md).
- **Project rules.** [CLAUDE.md](CLAUDE.md) sets out the brand and IP,
  design token, accessibility, performance and security rules for
  contributors.

## Related

[EUROPA](https://github.com/muawiah-4/EUROPA) is a sibling concept: a
scroll-driven journey across ten European destinations. It's built on the
same stack and shares its motion components with this site.

## Notes

This is an unofficial concept project. It is not affiliated with, endorsed
by, or sponsored by Tissot SA or the Swatch Group. "Tissot", "PRX" and
"Powermatic 80" are trademarks of their respective owners. They appear here
only to identify the subject of the concept.

All product photography and press imagery, including the images in the News
section, belongs to its respective owners. It's used only for non-commercial
portfolio demonstration. Nothing on the site is for sale: the prices, cart
and checkout are all simulated.
