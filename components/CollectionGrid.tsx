"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CATALOG, getCollection, formatPrice, type WatchVariant } from "@/lib/catalog";
import { useCart } from "@/lib/cart-context";
import ProductPhoto from "@/components/ProductPhoto";

function specLine(v: WatchVariant): string {
  const parts = [v.specs.caseDiameter, v.specs.movement.replace("Swiss ", "")];
  if (v.specs.powerReserve) parts.push(v.specs.powerReserve.replace("Up to ", ""));
  return parts.join(" · ");
}

function ProductImage({ variant }: { variant: WatchVariant }) {
  if (variant.heroImage) {
    return (
      <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
        <ProductPhoto src={variant.heroImage} alt={`${variant.name} — ${variant.dial.label}`} padding="10%" />
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#eef0f1] to-[#dde0e2]">
      <span className="h-10 w-10 rounded-full ring-2 ring-white/80 shadow-sm" style={{ background: variant.dial.hex }} />
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--ink-400)]">
        Photography coming soon
      </span>
    </div>
  );
}

export default function CollectionGrid({ limit, collectionId }: { limit?: number; collectionId?: string }) {
  let items = collectionId ? CATALOG.filter((v) => v.collectionId === collectionId) : CATALOG;
  if (limit) items = items.slice(0, limit);
  const { addToCart, open } = useCart();

  // A collection with only 1-2 references leaves the 4-col grid mostly empty.
  // Fill the row with a quiet "more references coming" tile instead of dead
  // whitespace, but only when we're rendering a single collection's own grid
  // (not the "all collections" catalog view, where a short row is expected).
  const sparseFillCount = collectionId && items.length > 0 && items.length < 4 ? 4 - items.length : 0;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((v, i) => {
        const collection = getCollection(v.collectionId);
        return (
          <motion.div
            key={v.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col overflow-hidden rounded-3xl border border-black/[0.06] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(20,23,26,0.35)]"
          >
            <Link href={`/watch/${v.slug}`} className="relative block aspect-square overflow-hidden bg-white">
              <ProductImage variant={v} />
              {/* light reflection sweep on hover */}
              <span className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <span
                  className="absolute inset-y-0 w-1/4 -skew-x-12 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[350%]"
                  style={{ mixBlendMode: "overlay" }}
                />
              </span>
              <span className="absolute right-3 top-3 rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--ink-600)] opacity-0 backdrop-blur-md ring-1 ring-black/[0.04] transition-opacity group-hover:opacity-100">
                Quick view
              </span>
            </Link>
            <div className="flex flex-1 flex-col px-5 py-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-400)]">{collection?.name}</p>
              <Link href={`/watch/${v.slug}`} className="mt-1 text-[15px] font-medium text-[var(--ink-900)] hover:underline">
                {v.name}
              </Link>
              <p className="mt-1 text-[12px] text-[var(--ink-400)]">{specLine(v)}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[15px] font-semibold text-[var(--ink-900)]">{formatPrice(v.price)}</span>
                <button
                  onClick={() => {
                    addToCart(v.slug);
                    open();
                  }}
                  className="rounded-full border border-black/10 px-3.5 py-1.5 text-[12px] font-medium text-[var(--ink-600)] transition hover:border-[var(--navy)] hover:text-[var(--navy)]"
                >
                  Add to Bag
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
      {sparseFillCount > 0 &&
        Array.from({ length: sparseFillCount }).map((_, i) => (
          <motion.div
            key={`more-${i}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: ((items.length + i) % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-black/[0.1] bg-black/[0.015] px-6 py-10 text-center"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.04]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-[var(--ink-400)]" />
              </svg>
            </span>
            <p className="text-[13px] font-medium text-[var(--ink-600)]">More references coming</p>
            <Link
              href="/collection"
              className="text-[12px] font-medium text-[var(--navy)] underline underline-offset-4"
            >
              Browse other collections
            </Link>
          </motion.div>
        ))}
    </div>
  );
}
