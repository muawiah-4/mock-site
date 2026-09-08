"use client";

import { motion } from "framer-motion";
import ProductPhoto from "@/components/ProductPhoto";

type Section = {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  padding?: string;
};

const SECTIONS: Section[] = [
  {
    id: "design-philosophy",
    eyebrow: "01 — Philosophy",
    title: "Precision engineering, made visible.",
    copy: "Every PRX begins as a technical drawing before it becomes an icon. We build the case for you to see the engineering, not just admire the finish — because the two are inseparable in Swiss watchmaking.",
    image: "/watches/prx-mop-white.jpg",
  },
  {
    id: "craftsmanship",
    eyebrow: "02 — Heritage",
    title: "Swiss craftsmanship, hand-verified.",
    copy: "Each movement is cased, regulated, and quality-checked by hand in our Le Locle manufacture — the same valley where Tissot has built watches since 1853.",
    image: "/watches/gentleman-powermatic-80.jpg",
  },
  {
    id: "bracelet",
    eyebrow: "03 — Silhouette",
    title: "An integrated bracelet, not an afterthought.",
    copy: "The bracelet flows directly from the case in one uninterrupted line — the defining trait of 1970s integrated design, re-engineered with a quick-release clasp for modern comfort.",
    image: "/watches/prx-green-bracelet.jpg",
    padding: "8%",
  },
  {
    id: "materials",
    eyebrow: "04 — Materials",
    title: "Sapphire crystal, virtually scratchproof.",
    copy: "Rated 9 on the Mohs hardness scale, a domed sapphire crystal keeps the dial pristine for decades — brushed and polished stainless steel finish every surface it doesn't cover.",
    image: "/watches/seastar-1000-chrono.jpg",
  },
  {
    id: "movement",
    eyebrow: "05 — Mechanism",
    title: "Powermatic 80 — automatic, unhurried.",
    copy: "An 80-hour power reserve means the PRX keeps time through a long weekend off the wrist. A silicon hairspring resists magnetism and temperature shifts, keeping the gear train honest.",
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
          className="mx-auto grid max-w-6xl scroll-mt-24 grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-2 md:gap-16 md:py-28"
        >
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--ink-600)] md:text-[16px]">
              {s.copy}
            </p>
          </motion.div>
        </div>
      ))}
    </section>
  );
}
