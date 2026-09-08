"use client";

import { motion } from "framer-motion";
import LightSweep from "@/components/LightSweep";

const DIAL_IMAGE = "/watches/prx-blue-powermatic-flat.jpg";

export default function BlueDialExperience() {
  return (
    <section className="relative h-[80vh] min-h-[560px] w-full overflow-hidden bg-[#0d1a26] md:h-screen">
      {/* Ambient backdrop — deliberately blurred, so the source photo's
          resolution never has to stretch further than it can stay sharp. */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, opacity: 0.7 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DIAL_IMAGE}
          alt=""
          aria-hidden
          className="h-full w-full scale-110 object-cover blur-3xl"
          style={{ objectPosition: "50% 40%" }}
        />
        <div className="absolute inset-0 bg-[#0d1a26]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a26]/40 via-transparent to-[#0d1a26]/80" />
      </motion.div>

      {/* Crisp dial — cropped modestly (~1.4x) so it stays sharp at its
          native resolution instead of being stretched full-bleed. */}
      <div className="absolute inset-0 flex items-center justify-center pb-[8vh] pt-14 md:pb-0 md:pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="relative h-[54vh] w-[54vh] max-h-[480px] max-w-[480px] overflow-hidden rounded-full shadow-[0_60px_140px_-40px_rgba(0,0,0,0.75)] ring-1 ring-white/10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DIAL_IMAGE}
            alt="Tissot PRX blue sunburst dial"
            className="h-full w-full scale-[1.4] object-cover"
            style={{ objectPosition: "50% 40%" }}
          />
          <LightSweep delay={500} />
        </motion.div>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-10 text-center md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="rounded-[28px] bg-white/[0.08] px-8 py-8 backdrop-blur-2xl ring-1 ring-white/[0.12] md:px-12 md:py-10"
        >
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-white/60">
            The Blue Dial, Redefined
          </div>
          <h3 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.05] tracking-tight text-white">
            Light doesn't hit this dial.
            <br />
            It moves across it.
          </h3>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/70 md:text-[16px]">
            A vertically brushed sunburst pattern, cut at a microscopic scale, so the dial reads a
            different shade of blue with every degree the wrist turns.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
