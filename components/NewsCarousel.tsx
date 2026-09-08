"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ProductPhoto from "@/components/ProductPhoto";
import GhostHeading from "@/components/GhostHeading";

const NEWS = [
  {
    title: "PRX Powermatic 80: Every second, engineered in the open",
    date: "Sep 6, 2026",
    image: "/watches/prx-blue-powermatic-flat.jpg",
  },
  {
    title: "Seastar 1000 Chronograph: Built for depth, styled for the surface",
    date: "Aug 22, 2026",
    image: "/watches/seastar-1000-chrono.jpg",
  },
  {
    title: "T-Touch Connect Solar: Power that never runs out",
    date: "Jul 30, 2026",
    image: "/watches/t-touch-connect.jpg",
  },
  {
    title: "Everytime 30: The quiet argument for less",
    date: "Jun 14, 2026",
    image: "/watches/everytime-30.jpg",
  },
  {
    title: "Gentleman Powermatic 80 Silicium: Precision, refined",
    date: "May 10, 2026",
    image: "/watches/gentleman-powermatic-80.jpg",
  },
];

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
    <section className="hairline-grid-dark relative overflow-hidden bg-[#0a0a0b] py-20 md:py-28">
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
          <p className="mt-3 text-[15px] text-white/50">Discover what's happening at Tissot</p>
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
                className="aspect-[16/10] overflow-hidden rounded-2xl"
              >
                <ProductPhoto src={item.image} alt={item.title} padding="10%" />
              </motion.div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-xl px-6 text-center">
          <p className="text-[18px] font-semibold leading-snug text-white md:text-[20px]">{NEWS[active].title}</p>
          <p className="mt-2 text-[13px] text-white/40">{NEWS[active].date}</p>
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
