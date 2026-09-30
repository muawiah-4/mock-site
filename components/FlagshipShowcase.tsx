"use client";

import { motion } from "framer-motion";
import { getVariant } from "@/lib/catalog";
import ProductPhoto from "@/components/ProductPhoto";
import StatRow from "@/components/StatRow";

const FLAGSHIP_SLUG = "prx-powermatic-80-blue";

/**
 * A cursor-tracking tilt/glare card used to live here — motion with no real
 * information behind it. This is the flagship reference instead: the photo,
 * plus the actual facts that make it the one the rest of the PRX line is
 * built from.
 */
export default function FlagshipShowcase() {
  const variant = getVariant(FLAGSHIP_SLUG);
  if (!variant?.heroImage) return null;

  const stats = [
    { value: variant.specs.caseDiameter, label: "Case diameter" },
    { value: "80h", label: "Power reserve" },
    { value: variant.specs.waterResistance.split(" / ")[0], label: "Water resistance" },
    { value: "Sapphire", label: "Scratch-resistant crystal" },
  ];

  return (
    <section className="bg-[var(--bg-0)] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="mb-10 max-w-xl"
        >
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--navy)]">
            The Flagship
          </div>
          <h3 className="text-gradient text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-tight">
            The reference the whole line is built around.
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square w-full overflow-hidden rounded-[2rem] shadow-media"
          >
            <ProductPhoto
              src={variant.heroImage}
              alt={`${variant.name} — ${variant.dial.label}`}
              padding="9%"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[15px] leading-relaxed text-[var(--ink-600)] md:text-[16px]">
              {variant.blurb} Every other reference in the PRX line descends from its proportions —
              the integrated bracelet, the stepped bezel, the sunburst dial.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-600)] md:text-[16px]">
              Inside, a Swiss automatic {variant.specs.movement.replace("Swiss Automatic, ", "")} movement,
              regulated by hand before it ever leaves the manufacture.
            </p>

            <div className="mt-8 border-t border-black/[0.08] pt-6">
              <StatRow stats={stats} tone="dark" columns={2} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
