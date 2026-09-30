"use client";

import { motion } from "framer-motion";

const LIFESTYLE_IMAGE = "/lifestyle/prx-lifestyle-red-hd.jpg";

/**
 * An emotional beat before the technical deep-dive — the source photo is
 * square, so it fills its column via object-cover with zero cropping, and
 * sits in its own grid column rather than overlapping the copy the way a
 * full-bleed hero treatment would.
 */
export default function LifestyleMoment() {
  return (
    <section className="bg-[var(--bg-0)] px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-square w-full overflow-hidden rounded-[2rem] shadow-[0_40px_100px_-40px_rgba(20,23,26,0.45)] md:order-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LIFESTYLE_IMAGE}
            alt="A woman checking her Tissot watch by a lake"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="md:order-1"
        >
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--navy)]">
            Everyday Icon
          </div>
          <h3 className="text-gradient text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-tight">
            Built for more than the wrist it&rsquo;s on.
          </h3>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--ink-600)]">
            A watch is never just parts on a bracelet — it&rsquo;s the second glance mid-conversation, the
            quiet check before a meeting starts. Every Tissot is built for that moment, not just the
            display case.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
