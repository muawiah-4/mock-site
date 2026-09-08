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
    <div className={`grid grid-cols-2 divide-x sm:grid-cols-4 ${dividerColor}`}>
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="px-4 py-2 first:pl-0 sm:px-6"
        >
          <div className={`font-black leading-none tracking-tight ${valueColor}`} style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}>
            {s.value}
          </div>
          <div className={`mt-2 text-[11px] uppercase tracking-[0.16em] ${labelColor}`}>{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
