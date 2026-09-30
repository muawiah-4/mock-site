"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { TOTAL_FRAMES, frameSrc, frameForProgress } from "@/lib/frames";
import { ScrollControlContext } from "@/lib/scroll-context";
import StoryBeats from "@/components/StoryBeats";
import ExplodedTimeline from "@/components/ExplodedTimeline";
import LightSweep from "@/components/LightSweep";

const SEQUENCE_LENGTH_VH = 620;
// Frames stream in the background with this many requests in flight, so the
// frame the visitor is actually looking at never queues behind 239 others.
const MAX_CONCURRENT_FRAMES = 6;

const FRAME_IDLE = 0;
const FRAME_LOADING = 1;
const FRAME_LOADED = 2;
const FRAME_FAILED = 3;

export default function Experience({ children }: { children?: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const statusRef = useRef<Uint8Array>(new Uint8Array(TOTAL_FRAMES));
  const currentFrameRef = useRef<number>(frameForProgress(0));
  // 0-based index of the frame last painted, or -1 before anything is drawn.
  const drawnIndexRef = useRef<number>(-1);

  /** Nearest successfully loaded frame to `target` (0-based), or -1. */
  const nearestLoaded = useCallback((target: number) => {
    const status = statusRef.current;
    for (let d = 0; d < TOTAL_FRAMES; d++) {
      if (target - d >= 0 && status[target - d] === FRAME_LOADED) return target - d;
      if (target + d < TOTAL_FRAMES && status[target + d] === FRAME_LOADED) return target + d;
    }
    return -1;
  }, []);

  const drawFrame = useCallback((frameNumber: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Frames that haven't arrived yet (or failed) fall back to the closest
    // one that has, so the canvas is never left blank mid-sequence.
    const target = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameNumber) - 1));
    const index = nearestLoaded(target);
    if (index === -1) return;
    const img = imagesRef.current[index];
    if (!img) return;
    drawnIndexRef.current = index;

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
  }, [nearestLoaded]);

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
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    let cancelled = false;
    let inFlight = 0;
    const status = statusRef.current;
    const imgs = imagesRef.current;

    const requestFrame = (index: number, highPriority: boolean) => {
      status[index] = FRAME_LOADING;
      inFlight += 1;
      const img = new Image();
      img.decoding = "async";
      if (highPriority) img.fetchPriority = "high";
      img.onload = () => {
        if (cancelled) return;
        inFlight -= 1;
        status[index] = FRAME_LOADED;
        imgs[index] = img;
        // Repaint if this frame is a closer match for the scroll position
        // than whatever is on the canvas now.
        const target = Math.round(currentFrameRef.current) - 1;
        const drawn = drawnIndexRef.current;
        if (drawn === -1 || Math.abs(index - target) < Math.abs(drawn - target)) {
          drawFrame(currentFrameRef.current);
        }
        pump();
      };
      img.onerror = () => {
        if (cancelled) return;
        inFlight -= 1;
        status[index] = FRAME_FAILED;
        pump();
      };
      img.src = frameSrc(index + 1);
    };

    // Fill free slots with the not-yet-requested frames nearest the one
    // currently on screen, so scrubbing in either direction finds its
    // neighbours already loaded.
    const pump = () => {
      while (inFlight < MAX_CONCURRENT_FRAMES) {
        const target = Math.round(currentFrameRef.current) - 1;
        let next = -1;
        for (let d = 0; d < TOTAL_FRAMES && next === -1; d++) {
          if (target - d >= 0 && status[target - d] === FRAME_IDLE) next = target - d;
          else if (target + d < TOTAL_FRAMES && status[target + d] === FRAME_IDLE) next = target + d;
        }
        if (next === -1) return;
        requestFrame(next, false);
      }
    };

    // The frame for the current scroll position (frame 240 at the top of
    // the page) goes first, on its own, at high priority.
    currentFrameRef.current = frameForProgress(scrollYProgress.get());
    const first = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current) - 1));
    requestFrame(first, true);

    return () => {
      cancelled = true;
      // Anything still in flight is abandoned; mark it requestable again so
      // a remount (e.g. Strict Mode) doesn't treat it as permanently pending.
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (status[i] === FRAME_LOADING) status[i] = FRAME_IDLE;
      }
    };
  }, [drawFrame, scrollYProgress]);

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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <ScrollControlContext.Provider value={{ progress: scrollYProgress, scrollToFraction }}>
      {/* Keyboard users otherwise have to page through ~6 viewports of
          scroll-driven sequence to reach the rest of the page. */}
      <a
        href="#after-intro"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-2.5 focus:text-[13px] focus:font-medium focus:text-[var(--ink-900)] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
      >
        Skip intro
      </a>
      <div ref={containerRef} style={{ height: `${SEQUENCE_LENGTH_VH}vh` }} className="relative">
        <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="viewport-vignette absolute inset-0" />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          <LightSweep delay={1000} />
          <div className="pointer-events-none absolute inset-0">
            <StoryBeats />
          </div>
          <ExplodedTimeline />
        </div>
      </div>

      {children}
    </ScrollControlContext.Provider>
  );
}
