"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * A single diagonal light sweep across the element it's layered on top of,
 * plus a slow, extremely subtle ambient shimmer loop after it — meant to
 * read as light moving across metal/glass, not a decorative flare.
 */
export default function LightSweep({ delay = 0 }: { delay?: number }) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-y-0 w-1/3 -skew-x-12"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
          mixBlendMode: "overlay",
        }}
        initial={{ x: "-120%" }}
        animate={{ x: "220%" }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: delay / 1000 }}
      />
      <motion.div
        className="absolute inset-y-0 w-1/4 -skew-x-12"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
          mixBlendMode: "overlay",
        }}
        initial={{ x: "-140%" }}
        animate={{ x: "240%" }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          delay: delay / 1000 + 2.2,
          repeat: Infinity,
          repeatDelay: 4,
        }}
      />
    </div>
  );
}
