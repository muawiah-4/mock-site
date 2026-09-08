"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const BOUTIQUES = [
  { city: "New York", address: "693 Fifth Avenue, NY 10022", hours: "Mon–Sat, 10:00–19:00" },
  { city: "London", address: "138 Regent Street, W1B 5TA", hours: "Mon–Sat, 10:00–18:30" },
  { city: "Paris", address: "12 Rue de la Paix, 75002", hours: "Mon–Sat, 10:00–19:00" },
  { city: "Zurich", address: "Bahnhofstrasse 64, 8001", hours: "Mon–Fri, 09:30–18:30" },
  { city: "Dubai", address: "The Dubai Mall, Fashion Ave", hours: "Daily, 10:00–22:00" },
  { city: "Singapore", address: "391A Orchard Rd, ION", hours: "Daily, 10:00–21:30" },
];

export default function StoreLocator() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => BOUTIQUES.filter((b) => b.city.toLowerCase().includes(query.trim().toLowerCase())),
    [query]
  );

  return (
    <section id="stores" className="scroll-mt-24 bg-[var(--bg-0)] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--navy)]">
            Store Locator
          </div>
          <h3 className="text-gradient text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-tight">
            Find a boutique near you.
          </h3>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city…"
            className="mt-6 w-full max-w-sm rounded-full border border-black/10 bg-white px-5 py-3 text-[14px] text-[var(--ink-900)] placeholder:text-[var(--ink-400)] focus:border-[var(--navy)] focus:outline-none"
            aria-label="Search boutiques by city"
          />
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((b) => (
            <div key={b.city} className="rounded-2xl border border-black/[0.06] bg-white p-5">
              <p className="text-[14px] font-medium text-[var(--ink-900)]">{b.city}</p>
              <p className="mt-1 text-[13px] text-[var(--ink-600)]">{b.address}</p>
              <p className="mt-1 text-[12px] text-[var(--ink-400)]">{b.hours}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-2 py-6 text-center text-[13px] text-[var(--ink-400)]">
              No boutiques match “{query}”.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
