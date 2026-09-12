"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollControl } from "@/lib/scroll-context";

const CHAPTERS = [
  { label: "Fully Assembled", range: [0, 0.18] as [number, number] },
  { label: "Crystal & Bezel Lift", range: [0.18, 0.34] as [number, number] },
  { label: "Case Opens", range: [0.34, 0.5] as [number, number] },
  { label: "Movement Revealed", range: [0.5, 0.7] as [number, number] },
  { label: "Full Exploded View", range: [0.7, 1] as [number, number] },
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
