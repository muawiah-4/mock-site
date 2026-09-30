"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { frameSrc } from "@/lib/frames";

const PARTS = [
  {
    label: "Sapphire Crystal",
    copy: "Scratch-resistant sapphire crystal, engineered for exceptional clarity.",
  },
  {
    label: "Blue Dial",
    copy: "A refined blue sunburst dial designed to shift subtly with light.",
  },
  {
    label: "Automatic Movement",
    copy: "Precision Swiss mechanical engineering at the heart of the watch.",
  },
  {
    label: "Integrated Bracelet",
    copy: "A seamless architectural bracelet, designed as part of the case.",
  },
];

// Poster frame only — shown before the real video has enough data to paint,
// and as the static fallback under prefers-reduced-motion. The construction
// footage itself (not this low-res still) is what actually renders once
// playable, so the section reads crisp at any viewport width instead of a
// 1280px JPEG stretched full-bleed.
const POSTER = frameSrc(90);
const VIDEO = "/video/prx-disassembly.mp4";

/**
 * Used to be a click-to-reveal hotspot diagram — markers on the footage,
 * then a button row driving a single active caption. Neither step actually
 * needed a click: there are only four parts, so showing all four at once is
 * both fewer interactions and more information than making a visitor
 * discover them one at a time.
 */
export default function TechnicalExploration() {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  const playOnceInView = () => {
    // With preload="metadata", play() is what kicks off the full download.
    if (!prefersReducedMotion) videoRef.current?.play().catch(() => {});
  };

  return (
    <section className="bg-[#05060a] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="mb-10 max-w-xl"
        >
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">
            Technical Exploration
          </div>
          <h3 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-tight text-white">
            Every layer, accounted for.
          </h3>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
            The construction, broken down into what actually matters — from crystal to bracelet.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onViewportEnter={playOnceInView}
          className="relative w-full overflow-hidden rounded-[2rem] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)]"
        >
          <div className="relative aspect-[16/9] w-full bg-[#c9cdcf]">
            {/* Starts only once this section actually scrolls into view
                (see onViewportEnter above), then plays once and holds on
                its final frame — the fully exploded composition the
                descriptions below refer to. Autoplaying on page load meant
                it had already finished by the time anyone scrolled here. */}
            <video
              ref={videoRef}
              src={VIDEO}
              poster={POSTER}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          </div>

          <div className="grid grid-cols-1 gap-px bg-white/[0.06] sm:grid-cols-2">
            {PARTS.map((p) => (
              <div key={p.label} className="bg-[#0a0d14] px-5 py-5 md:px-8 md:py-6">
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white">{p.label}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">{p.copy}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
