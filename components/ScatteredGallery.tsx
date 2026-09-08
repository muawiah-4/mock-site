"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GhostHeading from "@/components/GhostHeading";
import ProductPhoto from "@/components/ProductPhoto";

/**
 * Loose, candid photo collage — five polaroid-framed shots scattered and
 * rotated across a ghost-heading backdrop rather than lined up in a grid.
 * Pattern reference: the tilted photo-stack seen on nickho-motorsports.nl,
 * reimplemented from scratch for this site's light, glassmorphic palette.
 */
const PHOTOS = [
  {
    src: "/watches/prx-blue-powermatic-flat.jpg",
    alt: "Tissot PRX Powermatic 80, blue dial, flat lay",
    rotate: -6,
  },
  {
    src: "/watches/prx-black-flat.jpg",
    alt: "Tissot PRX, black dial, flat lay",
    rotate: 5,
  },
  {
    src: "/watches/seastar-1000-chrono.jpg",
    alt: "Tissot Seastar 1000 Chronograph",
    rotate: -3,
  },
  {
    src: "/watches/gentleman-powermatic-80.jpg",
    alt: "Tissot Gentleman Powermatic 80",
    rotate: 8,
  },
  {
    src: "/frames/ezgif-frame-090.jpg",
    alt: "Exploded movement detail",
    rotate: -8,
  },
] as const;

// Per-card scatter position, only applied from md up — below that the
// cards fall back to a simple two-column flow so nothing overlaps.
const CARD_LAYOUT = [
  "md:absolute md:left-[0%] md:top-0 md:w-64 md:z-20 lg:w-72",
  "md:absolute md:left-[34%] md:top-[6%] md:w-44 md:z-10 lg:w-52",
  "md:absolute md:left-auto md:right-[2%] md:top-[14%] md:w-56 md:z-30 lg:w-64",
  "md:absolute md:left-[8%] md:top-auto md:bottom-0 md:w-40 md:z-10 lg:w-44",
  "md:absolute md:left-auto md:right-[20%] md:top-auto md:bottom-[4%] md:w-48 md:z-20 lg:w-56",
];

const TICK_COUNT = 8;

/** Small radial "loading" tick — purely decorative, cycles on its own. */
function RadialIndicator({ activeTick }: { activeTick: number }) {
  const radius = 22;
  return (
    <div aria-hidden className="relative h-14 w-14 shrink-0">
      {Array.from({ length: TICK_COUNT }).map((_, i) => {
        const angle = (i * 360) / TICK_COUNT;
        const rad = (angle * Math.PI) / 180;
        const x = Math.sin(rad) * radius;
        const y = -Math.cos(rad) * radius;
        const isActive = i === activeTick;
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-2.5 w-[2px] rounded-full transition-colors duration-300"
            style={{
              transform: `translate(${x - 1}px, ${y - 5}px) rotate(${angle}deg)`,
              backgroundColor: isActive ? "var(--navy)" : "rgba(20, 23, 26, 0.18)",
            }}
          />
        );
      })}
      <span
        className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-[2px]"
        style={{ backgroundColor: "var(--navy)" }}
      />
    </div>
  );
}

export default function ScatteredGallery() {
  const [featured, setFeatured] = useState(0);
  const [tick, setTick] = useState(0);

  // Purely decorative — cycles the radial indicator's active tick, not
  // tied to which photo is featured.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % TICK_COUNT), 2500);
    return () => clearInterval(id);
  }, []);

  const next = () => setFeatured((f) => (f + 1) % PHOTOS.length);
  const prev = () => setFeatured((f) => (f - 1 + PHOTOS.length) % PHOTOS.length);

  return (
    <section id="gallery" className="relative overflow-hidden bg-white px-6 py-20 md:py-28">
      <GhostHeading tone="dark" align="center">
        GALLERY
      </GhostHeading>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--navy)]">
            From the Studio
          </div>
          <h3 className="text-gradient text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-tight">
            Every angle, unposed
          </h3>
        </motion.div>

        <div className="relative mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-24 md:block md:h-[620px] md:gap-0">
          {PHOTOS.map((photo, i) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, y: 24, rotate: photo.rotate * 1.3 }}
              whileInView={{ opacity: 1, y: 0, rotate: photo.rotate }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`relative ${i === 4 ? "col-span-2 mx-auto w-40 sm:col-span-1 sm:w-full" : "w-full"} ${CARD_LAYOUT[i]}`}
            >
              <motion.button
                type="button"
                onClick={() => setFeatured(i)}
                aria-label={photo.alt}
                animate={{
                  scale: featured === i ? 1.04 : 0.97,
                  opacity: featured === i ? 1 : 0.55,
                }}
                whileHover={{ scale: 1.06, rotate: -photo.rotate, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="block w-full rounded-2xl bg-white p-3 text-left shadow-xl md:p-4"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-lg">
                  <ProductPhoto src={photo.src} alt={photo.alt} padding="10%" />
                </div>
              </motion.button>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-6 md:mt-16">
          <RadialIndicator activeTick={tick} />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="flex h-9 items-center justify-center rounded-full border border-[var(--ink-400)] px-4 text-[var(--ink-900)] transition hover:border-[var(--navy)] hover:text-[var(--navy)]"
            >
              <span aria-hidden>‹</span>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="flex h-9 items-center justify-center rounded-full border border-[var(--ink-400)] px-4 text-[var(--ink-900)] transition hover:border-[var(--navy)] hover:text-[var(--navy)]"
            >
              <span aria-hidden>›</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
