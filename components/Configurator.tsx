"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATALOG, DIAL_OPTIONS, STRAP_OPTIONS, SIZE_OPTIONS, formatPrice } from "@/lib/catalog";
import { useCart } from "@/lib/cart-context";
import ProductPhoto from "@/components/ProductPhoto";
import MagneticButton from "@/components/MagneticButton";

// The configurator only ever builds a PRX — never suggest a variant from
// another collection just because it happens to share a dial color id.
const PRX_CATALOG = CATALOG.filter((v) => v.collectionId === "prx");

export default function Configurator() {
  const [dialId, setDialId] = useState(DIAL_OPTIONS[0].id);
  const [strapId, setStrapId] = useState<(typeof STRAP_OPTIONS)[number]["id"]>(STRAP_OPTIONS[0].id);
  const [sizeId, setSizeId] = useState("40");
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart, open } = useCart();

  const dial = DIAL_OPTIONS.find((d) => d.id === dialId)!;

  const match = useMemo(
    () => PRX_CATALOG.find((v) => v.dial.id === dialId && v.strap.id === strapId && v.size.id === sizeId),
    [dialId, strapId, sizeId]
  );

  const alternatives = useMemo(
    () => PRX_CATALOG.filter((v) => v.dial.id === dialId && v !== match).slice(0, 2),
    [dialId, match]
  );

  return (
    <section
      className="relative overflow-hidden px-6 py-20 md:py-28"
      id="configurator"
      style={{ background: "radial-gradient(120% 100% at 50% 0%, #e6e9ea 0%, var(--bg-0) 55%, #c7cbcd 100%)" }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="relative aspect-square w-full overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-40px_rgba(20,23,26,0.45)] md:sticky md:top-24 md:aspect-auto md:h-[520px]"
        >
          <AnimatePresence mode="wait">
            {match?.heroImage ? (
              <motion.div
                key={match.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="h-full w-full"
              >
                <ProductPhoto src={match.heroImage} alt={`${match.name} — ${match.dial.label}`} padding="10%" />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full w-full flex-col items-center justify-center gap-3 bg-white"
              >
                <span className="h-16 w-16 rounded-full ring-4 ring-black/5 shadow" style={{ background: dial.hex }} />
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--ink-400)]">
                  Photography coming soon
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="rounded-[2rem] bg-white/40 p-7 shadow-[0_20px_60px_-30px_rgba(20,23,26,0.35)] backdrop-blur-2xl ring-1 ring-white/60 md:p-9"
        >
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--navy)]">
            Configure your PRX
          </div>
          <h3 className="text-gradient text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-tight tracking-tight">
            Build the reference that&rsquo;s yours.
          </h3>

          <div className="mt-8">
            <div className="mb-3 text-[13px] font-medium text-[var(--ink-900)]">
              Dial — <span className="text-[var(--ink-400)]">{dial.label}</span>
            </div>
            <div className="flex gap-3">
              {DIAL_OPTIONS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDialId(d.id)}
                  aria-label={d.label}
                  aria-pressed={dialId === d.id}
                  className={`h-10 w-10 rounded-full ring-2 ring-offset-2 ring-offset-white/40 transition ${
                    dialId === d.id ? "ring-[var(--navy)] scale-110" : "ring-transparent hover:ring-black/15"
                  }`}
                  style={{ background: d.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-3 text-[13px] font-medium text-[var(--ink-900)]">Strap</div>
            <div className="flex flex-wrap gap-2">
              {STRAP_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStrapId(s.id)}
                  aria-pressed={strapId === s.id}
                  className={`rounded-full border px-4 py-2 text-[13px] font-medium transition ${
                    strapId === s.id
                      ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                      : "border-black/10 bg-white/30 text-[var(--ink-600)] hover:border-black/20"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-3 text-[13px] font-medium text-[var(--ink-900)]">Case size</div>
            <div className="flex gap-2">
              {SIZE_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSizeId(s.id)}
                  aria-pressed={sizeId === s.id}
                  className={`rounded-full border px-4 py-2 text-[13px] font-medium transition ${
                    sizeId === s.id
                      ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                      : "border-black/10 bg-white/30 text-[var(--ink-600)] hover:border-black/20"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-black/[0.08] pt-6">
            {match ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[14px] text-[var(--ink-600)]">{match.name}</span>
                  <span className="text-[18px] font-semibold text-[var(--ink-900)]">
                    {formatPrice(match.price)}
                  </span>
                </div>
                <MagneticButton
                  onClick={() => {
                    addToCart(match.slug);
                    setJustAdded(true);
                    setTimeout(() => open(), 300);
                  }}
                  className="btn-primary w-full rounded-full py-3.5 text-[14px] font-medium text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  strength={10}
                >
                  {justAdded ? "Added ✓" : "Add to Bag"}
                </MagneticButton>
              </>
            ) : (
              <div>
                <p className="mb-4 text-[13px] text-[var(--ink-600)]">
                  This exact combination isn&rsquo;t part of the current collection.
                  {alternatives.length > 0 && " Try one of these instead:"}
                </p>
                <div className="flex flex-col gap-2">
                  {alternatives.map((v) => (
                    <button
                      key={v.slug}
                      onClick={() => {
                        setStrapId(v.strap.id);
                        setSizeId(v.size.id);
                      }}
                      className="flex items-center justify-between rounded-xl border border-black/10 bg-white/30 px-4 py-3 text-left text-[13px] transition hover:border-[var(--navy)]"
                    >
                      <span>
                        {v.strap.label} · {v.size.label}
                      </span>
                      <span className="font-medium">{formatPrice(v.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
