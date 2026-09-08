"use client";

import { useState } from "react";
import { motion, useSpring, useMotionTemplate, useTransform, AnimatePresence } from "framer-motion";
import { frameSrc } from "@/lib/frames";

const HOTSPOTS = [
  {
    id: "crystal",
    label: "Sapphire Crystal",
    x: 14,
    y: 48,
    copy: "Scratch-resistant sapphire crystal, engineered for exceptional clarity.",
  },
  {
    id: "dial",
    label: "Blue Dial",
    x: 30,
    y: 48,
    copy: "A refined blue sunburst dial designed to shift subtly with light.",
  },
  {
    id: "movement",
    label: "Automatic Movement",
    x: 58,
    y: 48,
    copy: "Precision Swiss mechanical engineering at the heart of the watch.",
  },
  {
    id: "bracelet",
    label: "Integrated Bracelet",
    x: 90,
    y: 50,
    copy: "A seamless architectural bracelet, designed as part of the case.",
  },
];

const FRAME = frameSrc(90);

export default function TechnicalExploration() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const spotX = useSpring(HOTSPOTS[0].x, { stiffness: 140, damping: 22 });
  const spotY = useSpring(HOTSPOTS[0].y, { stiffness: 140, damping: 22 });
  const radius = useSpring(activeId ? 24 : 0, { stiffness: 140, damping: 22 });
  const outerRadius = useTransform(radius, (r) => r + 22);
  const overlay = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, transparent ${radius}%, rgba(6,9,14,0.72) ${outerRadius}%)`;

  const active = HOTSPOTS.find((h) => h.id === activeId);

  const focus = (h: (typeof HOTSPOTS)[number]) => {
    spotX.set(h.x);
    spotY.set(h.y);
    setActiveId(h.id);
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
            Point at a part. Understand the whole.
          </h3>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
            Hover — or tap — any labeled component to see it isolated from the rest of the construction.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-[2rem] bg-[#c9cdcf] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FRAME} alt="TISSOT PRX exploded construction" className="h-full w-full object-cover" />

          <motion.div
            className="pointer-events-none absolute inset-0 transition-opacity"
            style={{ background: overlay, opacity: activeId ? 1 : 0 }}
          />

          {HOTSPOTS.map((h) => (
            <button
              key={h.id}
              onMouseEnter={() => focus(h)}
              onFocus={() => focus(h)}
              onClick={() => focus(h)}
              aria-label={h.label}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <span
                className={`block h-3 w-3 rounded-full border-2 border-white transition-all ${
                  activeId === h.id ? "scale-125 bg-white" : "bg-white/30 group-hover:bg-white/70"
                }`}
              />
              <span
                className={`absolute inset-0 -m-2 rounded-full border border-white/60 transition-opacity ${
                  activeId === h.id ? "animate-ping opacity-0" : "opacity-0"
                }`}
              />
            </button>
          ))}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-8">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block max-w-sm rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-2xl ring-1 ring-white/15"
                >
                  <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white">
                    {active.label}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">{active.copy}</p>
                </motion.div>
              ) : (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-block rounded-full bg-white/10 px-4 py-2 text-[12px] text-white/60 backdrop-blur-xl"
                >
                  Hover a marker to begin
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {HOTSPOTS.map((h) => (
            <button
              key={h.id}
              onClick={() => focus(h)}
              className={`rounded-full border px-4 py-2 text-[12px] font-medium transition ${
                activeId === h.id
                  ? "border-white bg-white text-[#05060a]"
                  : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
