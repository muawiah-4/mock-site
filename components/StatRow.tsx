"use client";

import { motion } from "framer-motion";

export type Stat = { value: string; label: string };

/**
 * A row of oversized display-numeral stats — the "17 podiums / 14 circuits"
 * treatment: the number carries the section, the label sits small beneath
 * it. Each stat reveals with a short delayed stagger on scroll-in.
 */
export default function StatRow({ stats, tone = "dark" }: { stats: Stat[]; tone?: "dark" | "light" }) {
  const valueColor = tone === "dark" ? "text-[var(--ink-900)]" : "text-white";
  const labelColor = tone === "dark" ? "text-[var(--ink-400)]" : "text-white/50";
  const dividerColor = tone === "dark" ? "border-black/[0.08]" : "border-white/[0.12]";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4">
      {stats.map((s, i) => {
        // A plain `divide-x` isn't row-aware: on the 2-col mobile wrap it
        // still borders the 3rd item (first in its own row), producing a
        // stray rule that doesn't align to any real column boundary. Key
        // the border to each breakpoint's actual row position instead.
        const baseBorder = i % 2 === 1 ? "border-l" : "";
        const smBorder = i === 0 ? "sm:border-l-0" : "sm:border-l";
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={`${baseBorder} ${smBorder} ${dividerColor} px-4 py-2 first:pl-0 sm:px-6`}
          >
            <div className={`font-black leading-none tracking-tight ${valueColor}`} style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}>
              {s.value}
            </div>
            <div className={`mt-2 text-[11px] uppercase tracking-[0.16em] ${labelColor}`}>{s.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
