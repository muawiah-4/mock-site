"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProductPhoto from "@/components/ProductPhoto";
import GhostHeading from "@/components/GhostHeading";

const CARDS = [
  {
    eyebrow: "PRX Powermatic 80",
    title: "The Icon",
    image: "/watches/prx-blue-powermatic-flat.jpg",
    href: "/collection/prx",
  },
  {
    eyebrow: "Seastar 1000",
    title: "Built for Depth",
    image: "/watches/seastar-1000-chrono.jpg",
    href: "/collection/seastar",
  },
  {
    eyebrow: "T-Touch Connect",
    title: "Under Your Command",
    image: "/watches/t-touch-connect.jpg",
    href: "/collection/t-touch",
  },
];

export default function EditorialShowcase() {
  return (
    <section className="hairline-grid-dark relative overflow-hidden bg-[#0a0a0b] px-6 py-20 md:py-28">
      <GhostHeading tone="light" align="center" className="top-6 opacity-60 md:top-10">
        DISCIPLINE
      </GhostHeading>
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">
            The World of Tissot
          </div>
          <h3 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-tight text-white">
            Three watches. Three disciplines.
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={c.href}
                className="group block overflow-hidden rounded-3xl bg-white/[0.04] ring-1 ring-white/[0.08] backdrop-blur-xl transition-colors hover:bg-white/[0.07]"
              >
                <div className="aspect-square overflow-hidden">
                  <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]">
                    <ProductPhoto src={c.image} alt={c.title} padding="10%" />
                  </div>
                </div>
                <div className="px-6 py-5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
                    {c.eyebrow}
                  </p>
                  <p className="mt-1 text-[19px] font-semibold tracking-tight text-white">{c.title}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
