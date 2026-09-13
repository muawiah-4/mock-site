"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GhostHeading from "@/components/GhostHeading";
import ProductPhoto from "@/components/ProductPhoto";
import { CATALOG, formatPrice } from "@/lib/catalog";

/** Looks up the real name/price for a gallery photo from the catalog it's
 *  actually sold in, rather than hardcoding a second copy of that data
 *  here that could drift out of sync. */
function catalogInfoFor(src: string) {
  return CATALOG.find((v) => v.heroImage === src);
}

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
    src: "/watches/prx-silver-sunray-flat.jpg",
    alt: "Tissot PRX, silver sunray dial, two-tone case",
    rotate: -8,
  },
  {
    src: "/watches/prx-blue-quartz-flat.jpg",
    alt: "Tissot PRX Quartz, blue dial, 35mm",
    rotate: 6,
  },
  {
    src: "/watches/prx-green-bracelet.jpg",
    alt: "Tissot PRX Powermatic 80, racing green dial",
    rotate: -5,
  },
  {
    src: "/watches/t-touch-connect.jpg",
    alt: "Tissot T-Touch Connect Solar",
    rotate: 4,
  },
] as const;

// Per-card scatter position, only applied from md up — below that the
// cards fall back to a simple two-column flow so nothing overlaps. Z-index
// is handled separately (see BASE_Z) so the featured card can actually
// come to the front rather than just changing opacity/scale in place.
// Two loose rows (top ~0-20%, bottom anchored to the container's bottom
// edge) with four cards each, spaced across the full width so no more than
// two cards ever share a zone — a tight three-card pileup read as clutter
// rather than a deliberate scatter.
const CARD_LAYOUT = [
  "md:absolute md:left-[0%] md:top-0 md:w-64 lg:w-72",
  "md:absolute md:left-[26%] md:top-[4%] md:w-40 lg:w-48",
  "md:absolute md:left-auto md:right-[0%] md:top-[2%] md:w-56 lg:w-64",
  "md:absolute md:left-[4%] md:top-auto md:bottom-0 md:w-40 lg:w-44",
  "md:absolute md:left-[48%] md:top-[12%] md:w-44 lg:w-52",
  "md:absolute md:left-[30%] md:top-auto md:bottom-[6%] md:w-36 lg:w-40",
  "md:absolute md:left-auto md:right-[2%] md:top-auto md:bottom-[2%] md:w-48 lg:w-56",
  "md:absolute md:left-[56%] md:top-auto md:bottom-[16%] md:w-40 lg:w-44",
];

// Resting stack order (matches the original visual layering); the
// featured card jumps above all of these regardless of its resting z.
const BASE_Z = [20, 10, 30, 10, 15, 15, 20, 12];
const FEATURED_Z = 40;

export default function ScatteredGallery() {
  const [featured, setFeatured] = useState(0);

  return (
    <section id="gallery" className="relative overflow-hidden bg-[var(--bg-0)] px-6 py-20 md:py-28">
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
              style={{ zIndex: featured === i ? FEATURED_Z : BASE_Z[i] }}
              className={`relative w-full ${CARD_LAYOUT[i]}`}
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
                className="group block w-full rounded-2xl bg-white p-3 text-left shadow-xl md:p-4"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                  <ProductPhoto src={photo.src} alt={photo.alt} padding="10%" />
                  {(() => {
                    const info = catalogInfoFor(photo.src);
                    if (!info) return null;
                    return (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-3 py-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <p className="truncate text-[12px] font-medium text-white">{info.name}</p>
                        <p className="text-[12px] font-semibold text-white">{formatPrice(info.price)}</p>
                      </div>
                    );
                  })()}
                </div>
              </motion.button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
