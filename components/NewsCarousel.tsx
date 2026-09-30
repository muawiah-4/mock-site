"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import GhostHeading from "@/components/GhostHeading";

/**
 * This used to just be the product catalog again — plain white flat-lay
 * photos with product-launch blurbs, identical to every other section on
 * the site. Real press coverage doesn't look like a shop grid: it's
 * campaign photography, milestones, and the occasional engineering
 * explainer, not another studio shot of the watch itself. Cards with no
 * `image` render as a stat/milestone card instead of forcing a photo that
 * doesn't exist.
 */
const NEWS = [
  {
    title: "Tissot Sprint highlights: Red Bull Grand Prix of San Marino and the Rimini Riviera",
    date: "Sep 12, 2026",
    source: "motogp.com",
    image: "/news/motogp-banner.jpg",
  },
  {
    title: "Vote for your TISSOT MVP and win a watch",
    date: "Sep 8, 2026",
    source: "FIBA",
    image: "/news/fiba-mvp-lineup.jpg",
  },
  {
    title: "Over 170 years of Swiss watchmaking",
    date: "Jul 30, 2026",
    stat: "1853",
    statLabel: "The year Tissot began, in Le Locle, Switzerland",
  },
] as const;

export default function NewsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Track scroll position directly and pick whichever card's own center is
  // closest to the track's center — this always matches what's visually
  // centered under snap-center, unlike an IntersectionObserver ratio
  // threshold, which can flag a "peeking" neighbor card as active when two
  // cards straddle the same visibility ratio during a scroll.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const update = () => {
      const trackRect = track.getBoundingClientRect();
      const centerX = trackRect.left + trackRect.width / 2;
      let closest = 0;
      let minDist = Infinity;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - centerX);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setActive(closest);
    };
    update();
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToIndex = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(NEWS.length - 1, idx));
    cardRefs.current[clamped]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  return (
    <section className="hairline-grid-dark relative overflow-hidden bg-dark py-20 md:py-28">
      <GhostHeading tone="light" align="left" className="-top-4 opacity-50 md:top-0">
        PRESS
      </GhostHeading>
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-tight text-white">
            Latest news
          </h3>
          <p className="mt-3 text-[15px] text-white/50">Discover what&rsquo;s happening at Tissot</p>
        </motion.div>
      </div>

      <div className="relative mt-14">
        <button
          onClick={() => scrollToIndex(active - 1)}
          aria-label="Previous"
          className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/20 sm:flex md:left-8"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => scrollToIndex(active + 1)}
          aria-label="Next"
          className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/20 sm:flex md:right-8"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div
          ref={trackRef}
          className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-[calc(50%-min(50vw,340px))] scroll-smooth"
        >
          {NEWS.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="w-[min(80vw,680px)] shrink-0 snap-center"
            >
              <motion.div
                animate={{ opacity: active === i ? 1 : 0.35, scale: active === i ? 1 : 0.94 }}
                transition={{ duration: 0.4 }}
                className="relative aspect-[16/10] overflow-hidden rounded-2xl"
              >
                {"image" in item ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    {"source" in item && (
                      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--navy-light)]" />
                        {item.source}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-dark-2 to-dark px-8 text-center">
                    <div
                      className="font-black leading-none tracking-tight text-white"
                      style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
                    >
                      {item.stat}
                    </div>
                    <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/50">{item.statLabel}</p>
                  </div>
                )}
              </motion.div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-xl px-6 text-center">
          <p className="text-[18px] font-semibold leading-snug text-white md:text-[20px]">{NEWS[active].title}</p>
          <p className="mt-2 text-[13px] text-white/55">{NEWS[active].date}</p>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {NEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                active === i ? "w-6 bg-white" : "w-1.5 bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
