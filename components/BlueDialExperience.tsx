"use client";

import { motion } from "framer-motion";
import GhostHeading from "@/components/GhostHeading";

const MAN_IMAGE = "/lifestyle/prx-lifestyle-man2-hd.webp";
const WOMAN_IMAGE = "/lifestyle/prx-lifestyle-woman2-hd.webp";

/**
 * Two different photos, flush side by side, each given a slow one-time
 * Ken Burns settle (zoom in -> rest) rather than a flat cut-in, plus a
 * light color-grade so two different shoots read as one campaign. The
 * pull-quote lives in its own zone below the photos — never overlaid on
 * top of them — so it can never cover a face, a hand, or a watch.
 */
export default function BlueDialExperience() {
  return (
    <section
      id="after-intro"
      tabIndex={-1}
      className="relative w-full overflow-hidden bg-dark-2 pt-4 outline-none md:pt-6"
    >
      <div className="relative grid grid-cols-1 sm:grid-cols-2">
        <div className="relative h-[50vh] sm:h-[68vh] md:h-[74vh] overflow-hidden">
          <motion.img
            src={MAN_IMAGE}
            alt="A man wearing the TISSOT PRX on his wrist"
            width={1440}
            height={1440}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover [filter:saturate(1.06)_contrast(1.04)]"
            initial={{ scale: 1.1, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <div className="relative h-[50vh] sm:h-[68vh] md:h-[74vh] overflow-hidden">
          <motion.img
            src={WOMAN_IMAGE}
            alt="A woman wearing a Tissot watch"
            width={1341}
            height={1341}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover [filter:saturate(1.06)_contrast(1.04)]"
            initial={{ scale: 1.1, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-white/10 sm:block"
        />
      </div>

      {/* Quote zone — a dedicated space below the photos, not an overlay
          on top of them, so it never competes with a face or a watch. */}
      <div className="relative overflow-hidden px-6 py-16 md:py-20">
        <GhostHeading tone="light" align="center">
          “
        </GhostHeading>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto max-w-2xl text-center"
        >
          <p className="text-[clamp(1.15rem,2.2vw,1.6rem)] italic leading-relaxed text-white/90">
            The best watches don&rsquo;t ask for attention. They just keep it.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
