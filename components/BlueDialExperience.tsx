"use client";

import { motion } from "framer-motion";

const MAN_IMAGE = "/lifestyle/prx-lifestyle-blue-hd.jpg";
const WOMAN_IMAGE = "/lifestyle/prx-lifestyle-side-hd.jpg";

/**
 * A pure visual break — two different photos, flush side by side, filling
 * the full section with no copy competing for the same space. Both are
 * pre-upscaled+sharpened stills (see public/lifestyle) rather than the
 * original low-res source files, so stretching them to fill a full-height
 * column doesn't read as soft. Top/bottom padding reveals the section's
 * own dark background as a border framing the photos, so the full-bleed
 * pair doesn't hard-cut straight into the sections above and below.
 */
export default function BlueDialExperience() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0d1a26] py-4 md:py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-[60vh] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MAN_IMAGE}
            alt="A man wearing the TISSOT PRX on his wrist"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="h-[60vh] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={WOMAN_IMAGE}
            alt="A woman wearing a Tissot watch"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
