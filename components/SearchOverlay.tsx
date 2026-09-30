"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { CATALOG, getCollection, formatPrice } from "@/lib/catalog";
import { useDialogA11y } from "@/lib/use-dialog-a11y";

const RECENT_KEY = "prx-recent-searches";

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogA11y({ open, onClose, containerRef: dialogRef, initialFocusRef: inputRef, lockScroll: true });

  useEffect(() => {
    if (open) {
      setQuery("");
      try {
        setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"));
      } catch {
        setRecent([]);
      }
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CATALOG.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        (getCollection(v.collectionId)?.name ?? "").toLowerCase().includes(q) ||
        v.dial.label.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  const commitSearch = (term: string) => {
    if (!term.trim()) return;
    try {
      const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      setRecent(next);
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          className="fixed inset-0 z-[80] flex flex-col bg-white/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 pt-28 md:pt-36">
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="flex items-center gap-4 border-b border-black/10 pb-4 transition-colors focus-within:border-[var(--navy)]"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[var(--ink-300)]">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
                <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitSearch(query);
                }}
                placeholder="Search PRX, collections, dial colors…"
                className="w-full bg-transparent text-2xl font-medium tracking-tight text-[var(--ink-900)] placeholder:text-[var(--ink-400)] focus:outline-none md:text-3xl"
                aria-label="Search"
              />
              <button
                onClick={onClose}
                aria-label="Close search"
                className="rounded-full p-2 text-[var(--ink-600)] transition hover:bg-black/[0.05]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </motion.div>

            <div className="mt-8 flex-1 overflow-y-auto pb-16">
              {query.trim() === "" ? (
                <div>
                  {recent.length > 0 && (
                    <div className="mb-10">
                      <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--ink-400)]">
                        Recent searches
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button
                            key={r}
                            onClick={() => setQuery(r)}
                            className="rounded-full border border-black/10 px-4 py-1.5 text-[13px] text-[var(--ink-600)] transition hover:border-[var(--navy)] hover:text-[var(--navy)]"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--ink-400)]">
                    Suggested
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {CATALOG.slice(0, 4).map((v) => (
                      <Link
                        key={v.slug}
                        href={`/watch/${v.slug}`}
                        onClick={() => {
                          commitSearch(v.name);
                          onClose();
                        }}
                        className="group flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-black/[0.03]"
                      >
                        <span>
                          <span className="block text-[15px] font-medium text-[var(--ink-900)]">{v.name}</span>
                          <span className="block text-[13px] text-[var(--ink-400)]">{v.dial.label}</span>
                        </span>
                        <span className="text-[13px] text-[var(--ink-600)]">{formatPrice(v.price)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-1">
                  {results.length === 0 && (
                    <p className="py-8 text-center text-[14px] text-[var(--ink-400)]">
                      No results for “{query}”.
                    </p>
                  )}
                  {results.map((v) => (
                    <Link
                      key={v.slug}
                      href={`/watch/${v.slug}`}
                      onClick={() => {
                        commitSearch(v.name);
                        onClose();
                      }}
                      className="group flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-black/[0.03]"
                    >
                      <span>
                        <span className="block text-[15px] font-medium text-[var(--ink-900)]">{v.name}</span>
                        <span className="block text-[13px] text-[var(--ink-400)]">
                          {getCollection(v.collectionId)?.name} — {v.dial.label}
                        </span>
                      </span>
                      <span className="text-[13px] text-[var(--ink-600)]">{formatPrice(v.price)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
