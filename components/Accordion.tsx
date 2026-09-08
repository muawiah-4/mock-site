"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type AccordionItem = { title: string; content: React.ReactNode };

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-black/[0.07] border-y border-black/[0.07]">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <div key={item.title}>
            <button
              onClick={() => setOpen(expanded ? null : i)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="text-[14px] font-medium text-[var(--ink-900)]">{item.title}</span>
              <motion.span
                animate={{ rotate: expanded ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-[18px] text-[var(--ink-400)]"
                aria-hidden
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 text-[14px] leading-relaxed text-[var(--ink-600)]">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
