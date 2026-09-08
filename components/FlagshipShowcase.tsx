"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { getVariant } from "@/lib/catalog";
import ProductPhoto from "@/components/ProductPhoto";

const FLAGSHIP_SLUG = "prx-powermatic-80-blue";

export default function FlagshipShowcase() {
  const variant = getVariant(FLAGSHIP_SLUG);
  const cardRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(mx, [-0.5, 0.5], ["20%", "80%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["20%", "80%"]);
  const glowBackground = useTransform([glowX, glowY], (latest: string[]) => {
    const [x, y] = latest;
    return `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.35), transparent 60%)`;
  });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  if (!variant?.heroImage) return null;

  return (
    <section className="bg-[var(--bg-0)] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="mb-10 max-w-xl"
        >
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--navy)]">
            The Flagship
          </div>
          <h3 className="text-gradient text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-tight">
            Photographed, not rendered.
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-600)] md:text-[16px]">
            Every reflection on this case is real light on real steel. Move your cursor across it.
          </p>
        </motion.div>

        <motion.div
          ref={cardRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{ perspective: 1200 }}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-square w-full overflow-hidden rounded-[2rem] shadow-[0_40px_100px_-40px_rgba(20,23,26,0.5)] md:aspect-[16/10]"
        >
          <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="h-full w-full">
            <ProductPhoto
              src={variant.heroImage}
              alt={`${variant.name} — ${variant.dial.label}`}
              padding="9%"
            />
          </motion.div>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            style={{ background: glowBackground }}
          />
        </motion.div>
      </div>
    </section>
  );
}
