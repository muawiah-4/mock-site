"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollControl } from "@/lib/scroll-context";

const CHAPTERS = [
  { label: "Sapphire Crystal & Bezel", range: [0, 0.14] as [number, number] },
  { label: "Dial Construction", range: [0.14, 0.34] as [number, number] },
  { label: "Movement & Gear Train", range: [0.34, 0.58] as [number, number] },
  { label: "Case Assembly", range: [0.58, 0.82] as [number, number] },
  { label: "Final Assembly", range: [0.82, 1] as [number, number] },
];

export default function ExplodedTimeline() {
  const { progress, scrollToFraction } = useScrollControl();
  const [p, setP] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const unsub = progress.on("change", (v) => setP(v));
    return () => unsub();
  }, [progress]);

  const activeIndex = CHAPTERS.findIndex((c) => p >= c.range[0] && p < c.range[1]);
  const chapterIdx = activeIndex === -1 ? CHAPTERS.length - 1 : activeIndex;

  const scrubFromClientY = useCallback(
    (clientY: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const t = (clientY - rect.top) / rect.height;
      scrollToFraction(Math.min(1, Math.max(0, t)));
    },
    [scrollToFraction]
  );

  const scrubFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const t = (clientX - rect.left) / rect.width;
      scrollToFraction(Math.min(1, Math.max(0, t)));
    },
    [scrollToFraction]
  );

  return (
    <>
      {/* Desktop: vertical labeled rail with drag-to-scrub */}
      <div className="pointer-events-auto absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 items-stretch gap-4 lg:flex">
        <div className="flex flex-col justify-between rounded-2xl bg-white/70 py-3 pl-4 pr-3 text-right shadow-[0_8px_30px_-12px_rgba(20,23,26,0.25)] backdrop-blur-xl ring-1 ring-black/[0.05]">
          {CHAPTERS.map((c, i) => (
            <button
              key={c.label}
              onClick={() => scrollToFraction((c.range[0] + c.range[1]) / 2)}
              className={`text-[11px] font-medium leading-tight transition-colors ${
                i === chapterIdx ? "text-[var(--navy)]" : "text-[var(--ink-400)] hover:text-[var(--ink-600)]"
              }`}
              style={{ height: `${100 / CHAPTERS.length}%` }}
            >
              {String(i + 1).padStart(2, "0")} — {c.label}
            </button>
          ))}
        </div>
        <div
          ref={trackRef}
          className="relative h-64 w-1 cursor-pointer rounded-full bg-black/10"
          role="slider"
          aria-label="Watch construction progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(p * 100)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") scrollToFraction(Math.max(0, p - 0.03));
            if (e.key === "ArrowDown") scrollToFraction(Math.min(1, p + 0.03));
          }}
          onPointerDown={(e) => {
            dragging.current = true;
            (e.target as Element).setPointerCapture(e.pointerId);
            scrubFromClientY(e.clientY);
          }}
          onPointerMove={(e) => {
            if (dragging.current) scrubFromClientY(e.clientY);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
        >
          <div className="absolute inset-x-0 top-0 rounded-full bg-[var(--navy)]" style={{ height: `${p * 100}%` }} />
          <div
            className="absolute left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--navy)] bg-white shadow"
            style={{ top: `${p * 100}%` }}
          />
        </div>
      </div>

      {/* Mobile / tablet: bottom horizontal scrub bar */}
      <div className="pointer-events-auto absolute inset-x-6 bottom-6 lg:hidden">
        <div className="mb-2 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--ink-600)]">
          {String(chapterIdx + 1).padStart(2, "0")} — {CHAPTERS[chapterIdx].label}
        </div>
        <div
          ref={trackRef}
          className="relative h-1 w-full cursor-pointer rounded-full bg-black/10"
          role="slider"
          aria-label="Watch construction progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(p * 100)}
          onPointerDown={(e) => {
            dragging.current = true;
            (e.target as Element).setPointerCapture(e.pointerId);
            scrubFromClientX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (dragging.current) scrubFromClientX(e.clientX);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
        >
          <div className="absolute inset-y-0 left-0 rounded-full bg-[var(--navy)]" style={{ width: `${p * 100}%` }} />
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-[var(--navy)] bg-white shadow"
            style={{ left: `${p * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}
