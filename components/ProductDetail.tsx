"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WatchVariant } from "@/lib/catalog";
import { CATALOG, getCollection, formatPrice, modelVariants } from "@/lib/catalog";
import { useCart } from "@/lib/cart-context";
import Accordion from "@/components/Accordion";
import ProductPhoto from "@/components/ProductPhoto";
import MagneticButton from "@/components/MagneticButton";
import { useDialogA11y } from "@/lib/use-dialog-a11y";

export default function ProductDetail({ variant }: { variant: WatchVariant }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const { addToCart, open } = useCart();
  const zoomRef = useRef<HTMLDivElement>(null);
  const zoomCloseRef = useRef<HTMLButtonElement>(null);

  useDialogA11y({
    open: zoomOpen,
    onClose: () => setZoomOpen(false),
    containerRef: zoomRef,
    initialFocusRef: zoomCloseRef,
    lockScroll: true,
  });

  const collection = getCollection(variant.collectionId);
  const family = modelVariants(variant);
  const showSize = new Set(family.map((v) => v.size.id)).size > 1;
  const siblings = CATALOG.filter((v) => v.slug !== variant.slug && v.collectionId === variant.collectionId);

  return (
    <main className="bg-[var(--bg-0)]">
      <section className="px-6 pb-20 pt-28 md:px-10 md:pt-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square w-full overflow-hidden rounded-[2rem] shadow-media md:sticky md:top-24 md:h-[560px] md:aspect-auto"
          >
            {variant.heroImage ? (
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                aria-label="Zoom product photo"
                className="group relative block h-full w-full cursor-zoom-in focus-visible:outline-offset-[-6px] focus-visible:rounded-[2rem]"
              >
                <ProductPhoto
                  src={variant.heroImage}
                  alt={`${variant.name} — ${variant.dial.label}`}
                  padding="10%"
                  priority
                  imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                />
                <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-medium text-[var(--ink-600)] opacity-0 shadow-sm backdrop-blur-md ring-1 ring-black/[0.04] transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  Zoom
                </span>
              </button>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                <span
                  className="h-16 w-16 rounded-full ring-4 ring-white/80 shadow"
                  style={{ background: variant.dial.hex }}
                />
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--ink-400)]">
                  Photography coming soon
                </span>
              </div>
            )}
          </motion.div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--ink-400)]">{collection?.name}</p>
              <h1 className="text-gradient mt-2 text-[clamp(1.8rem,3.6vw,2.6rem)] font-semibold leading-tight tracking-tight">
                {variant.name}
              </h1>
              <p className="mt-2 text-[13px] text-[var(--ink-400)]">
                {variant.dial.label} · {variant.strap.label} · {variant.size.label}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            >
              <p className="mt-5 text-[22px] font-semibold text-[var(--ink-900)]">{formatPrice(variant.price)}</p>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--ink-600)]">{variant.blurb}</p>
            </motion.div>

            {family.length > 1 && (
              <motion.nav
                aria-label={`${variant.name} variants`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.42 }}
                className="mt-7"
              >
                <p className="mb-3 text-[13px] font-medium text-[var(--ink-900)]">
                  Dial{showSize && " & size"} — <span className="text-[var(--ink-400)]">{variant.dial.label}</span>
                </p>
                <ul className="flex flex-wrap gap-2">
                  {family.map((v) => {
                    const current = v.slug === variant.slug;
                    return (
                      <li key={v.slug}>
                        <Link
                          href={`/watch/${v.slug}`}
                          aria-current={current ? "page" : undefined}
                          scroll={false}
                          className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-[12px] font-medium transition ${
                            current
                              ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                              : "border-black/10 bg-white/30 text-[var(--ink-600)] hover:border-black/20"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="h-5 w-5 rounded-full ring-1 ring-black/10"
                            style={{ background: v.dial.hex }}
                          />
                          {v.dial.label}
                          {showSize && <span className={current ? "text-white/70" : "text-[var(--ink-400)]"}>{v.size.label}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </motion.nav>
            )}

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="mt-8 flex items-center gap-4"
            >
              <div className="flex items-center rounded-full border border-black/10">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 text-[15px] text-[var(--ink-600)] hover:text-[var(--ink-900)]"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-[14px]">{qty}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-2.5 text-[15px] text-[var(--ink-600)] hover:text-[var(--ink-900)]"
                >
                  +
                </button>
              </div>
              <MagneticButton
                onClick={() => {
                  addToCart(variant.slug, qty);
                  setAdded(true);
                  setTimeout(() => open(), 300);
                }}
                className="btn-primary flex-1 rounded-full py-3.5 text-[14px] font-medium text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
                maxOffsetPx={5}
              >
                {added ? "Added ✓" : "Add to Bag"}
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
              className="mt-12"
            >
              <Accordion
                items={[
                  {
                    title: "Technical specifications",
                    content: (
                      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                        {Object.entries({
                          Movement: variant.specs.movement,
                          "Case diameter": variant.specs.caseDiameter,
                          "Water resistance": variant.specs.waterResistance,
                          Crystal: variant.specs.crystal,
                          Material: variant.specs.material,
                          Bracelet: variant.specs.bracelet,
                          ...(variant.specs.powerReserve ? { "Power reserve": variant.specs.powerReserve } : {}),
                        }).map(([k, v]) => (
                          <div key={k} className="flex justify-between border-b border-black/[0.05] py-1.5 sm:block sm:border-0 sm:py-0">
                            <dt className="text-[12px] uppercase tracking-[0.1em] text-[var(--ink-400)]">{k}</dt>
                            <dd className="text-[13px] text-[var(--ink-900)]">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    ),
                  },
                  {
                    title: "Shipping & returns",
                    content: "Free worldwide shipping. 60-day returns. 2-year international warranty.",
                  },
                  {
                    title: "Care instructions",
                    content:
                      "Rinse after exposure to saltwater or chlorine. Avoid operating the crown underwater. Service the movement every 4–6 years.",
                  },
                ]}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {zoomOpen && variant.heroImage && (
          <motion.div
            ref={zoomRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${variant.name}, full size`}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-dark/90 p-6 backdrop-blur-md md:p-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setZoomOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white"
            >
              <ProductPhoto
                src={variant.heroImage}
                alt={`${variant.name} — ${variant.dial.label}, full size`}
                padding="8%"
              />
            </motion.div>
            <button
              ref={zoomCloseRef}
              onClick={() => setZoomOpen(false)}
              aria-label="Close zoom"
              className="absolute right-5 top-5 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20 focus-visible:outline-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {siblings.length > 0 && (
        <section className="bg-[var(--bg-0)] px-6 py-16 md:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--navy)]">
              You may also like
            </p>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/watch/${s.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-black/[0.06] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="relative block aspect-square overflow-hidden bg-white">
                    {s.heroImage ? (
                      <span className="block h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                        <ProductPhoto src={s.heroImage} alt={`${s.name} — ${s.dial.label}`} padding="12%" />
                      </span>
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#eef0f1] to-[#dde0e2]">
                        <span className="h-10 w-10 rounded-full ring-2 ring-white/80 shadow-sm" style={{ background: s.dial.hex }} />
                      </span>
                    )}
                  </span>
                  <span className="flex flex-col gap-0.5 px-4 py-4 sm:px-5">
                    <span className="truncate text-[13px] font-medium text-[var(--ink-900)] sm:text-[14px]">{s.name}</span>
                    <span className="text-[12px] text-[var(--ink-400)]">{formatPrice(s.price)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
