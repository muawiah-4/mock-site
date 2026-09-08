"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { TOTAL_FRAMES, frameSrc, frameForProgress } from "@/lib/frames";
import { ScrollControlContext } from "@/lib/scroll-context";
import StoryBeats from "@/components/StoryBeats";
import ExplodedTimeline from "@/components/ExplodedTimeline";
import LightSweep from "@/components/LightSweep";

const SEQUENCE_LENGTH_VH = 620;

export default function Experience({ children }: { children?: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(1);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  const drawFrame = useCallback((frameNumber: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[Math.round(frameNumber) - 1];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    ctx.clearRect(0, 0, cw, ch);

    // The source footage is landscape (~16:9). On a portrait viewport, fitting
    // it to "contain" shrinks the watch to a thin horizontal strip with dead
    // space above and below. Fill the viewport instead there, cropping the
    // (empty, background-only) left/right margins — the same "cover" logic
    // used on desktop only when the canvas itself is portrait.
    const canvasIsPortrait = cw < ch;
    const scale = canvasIsPortrait ? Math.max(cw / iw, ch / ih) : Math.min(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);

    // The source frames carry a couple of encoder border pixels of pure
    // black at their very edge, so sample a row/column just inside that
    // to extend the frame's real background tone into the letterbox gap
    // (and paint over the border pixels) with no visible seam.
    const INSET = 14;
    if (dy > 0.5) {
      const topY = Math.min(INSET, ih - 1);
      const bottomY = Math.max(ih - 1 - INSET, 0);
      ctx.drawImage(img, 0, topY, iw, 1, dx, 0, dw, dy + topY * scale + 1);
      ctx.drawImage(
        img,
        0,
        bottomY,
        iw,
        1,
        dx,
        dy + bottomY * scale - 1,
        dw,
        ch - (dy + bottomY * scale) + 1
      );
    } else if (dx > 0.5) {
      const leftX = Math.min(INSET, iw - 1);
      const rightX = Math.max(iw - 1 - INSET, 0);
      ctx.drawImage(img, leftX, 0, 1, ih, 0, dy, dx + leftX * scale + 1, dh);
      ctx.drawImage(
        img,
        rightX,
        0,
        1,
        ih,
        dx + rightX * scale - 1,
        dy,
        cw - (dx + rightX * scale) + 1,
        dh
      );
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const sticky = stickyRef.current;
    if (!canvas || !sticky) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(sticky.clientWidth * dpr);
    canvas.height = Math.round(sticky.clientHeight * dpr);
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  useEffect(() => {
    let cancelled = false;
    let count = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameSrc(i);
      const onDone = () => {
        count += 1;
        if (!cancelled && (count % 6 === 0 || count === TOTAL_FRAMES)) {
          setLoaded(count);
        }
        if (count === TOTAL_FRAMES && !cancelled) {
          setReady(true);
        }
      };
      img.onload = onDone;
      img.onerror = onDone;
      imgs.push(img);
    }
    imagesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    if (ready) {
      resizeCanvas();
      drawFrame(currentFrameRef.current);
    }
  }, [ready, resizeCanvas, drawFrame]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const frame = frameForProgress(v);
    currentFrameRef.current = frame;
    drawFrame(frame);
  });

  const scrollToFraction = useCallback((fraction: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const scrollRange = el.offsetHeight - window.innerHeight;
    const target = containerTop + Math.min(1, Math.max(0, fraction)) * scrollRange;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  const pct = Math.round((loaded / TOTAL_FRAMES) * 100);

  return (
    <ScrollControlContext.Provider value={{ progress: scrollYProgress, scrollToFraction }}>
      <div ref={containerRef} style={{ height: `${SEQUENCE_LENGTH_VH}vh` }} className="relative">
        <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="viewport-vignette absolute inset-0" />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          <LightSweep delay={1000} />
          <div className="pointer-events-none absolute inset-0">
            <StoryBeats />
          </div>
          <ExplodedTimeline />

          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[var(--bg-0)] transition-opacity duration-700 ${
              ready ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="text-[11px] uppercase tracking-[0.3em] text-[var(--ink-400)]">
              Loading sequence
            </div>
            <div className="h-px w-40 overflow-hidden bg-black/10">
              <div
                className="h-full bg-[var(--navy)] transition-all duration-200 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="font-mono text-[11px] text-[var(--ink-400)]">{pct}%</div>
          </div>
        </div>
      </div>

      {children}
    </ScrollControlContext.Provider>
  );
}
