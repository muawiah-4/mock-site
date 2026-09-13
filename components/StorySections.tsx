"use client";

import { motion } from "framer-motion";
import ProductPhoto from "@/components/ProductPhoto";

type Section = {
  id: string;
  eyebrow: string;
  title: string;
  image: string;
  padding?: string;
};

const SECTIONS: Section[] = [
  {
    id: "design-philosophy",
    eyebrow: "01 — Philosophy",
    title: "Precision engineering, made visible.",
    image: "/watches/prx-mop-white.jpg",
  },
  {
    id: "craftsmanship",
    eyebrow: "02 — Heritage",
    title: "Swiss craftsmanship, hand-verified.",
    image: "/watches/gentleman-powermatic-80.jpg",
  },
  {
    id: "bracelet",
    eyebrow: "03 — Silhouette",
    title: "An integrated bracelet, not an afterthought.",
    image: "/watches/prx-green-bracelet.jpg",
    padding: "8%",
  },
  {
    id: "materials",
    eyebrow: "04 — Materials",
    title: "Sapphire crystal, virtually scratchproof.",
    image: "/watches/seastar-1000-chrono.jpg",
  },
  {
    id: "movement",
    eyebrow: "05 — Mechanism",
    title: "Powermatic 80 — automatic, unhurried.",
    image: "/watches/prx-black-flat.jpg",
  },
];

export default function StorySections() {
  return (
    <section className="bg-[var(--bg-0)] py-6 md:py-10">
      {SECTIONS.map((s, i) => (
        <div
          key={s.id}
          id={s.id}
          className={`mx-auto grid max-w-6xl scroll-mt-24 grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-2 md:gap-16 md:py-28 ${
            i > 0 ? "border-t border-black/[0.08]" : ""
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, filter: "grayscale(1)" }}
            whileInView={{ opacity: 1, y: 0, filter: "grayscale(0)" }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={`aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_30px_80px_-40px_rgba(20,23,26,0.45)] ${
              i % 2 === 1 ? "md:order-2" : ""
            }`}
          >
            <ProductPhoto src={s.image} alt={s.title} padding={s.padding ?? "11%"} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          >
            <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--navy)]">
              {s.eyebrow}
            </div>
            <h3 className="text-gradient text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.08] tracking-tight">
              {s.title}
            </h3>
          </motion.div>
        </div>
      ))}
    </section>
  );
}
