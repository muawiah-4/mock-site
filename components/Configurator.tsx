"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/catalog";
import {
  DEFAULT_VARIANT,
  DIALS,
  PRX_CATALOG,
  SIZES,
  STRAPS,
  findVariant,
  variantForDial,
} from "@/lib/configurator";
import { useCart } from "@/lib/cart-context";
import { track } from "@/lib/analytics";
import ProductPhoto from "@/components/ProductPhoto";
import MagneticButton from "@/components/MagneticButton";

export default function Configurator() {
  const [slug, setSlug] = useState(DEFAULT_VARIANT.slug);
  const [notice, setNotice] = useState("");
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart, open } = useCart();

  const match = useMemo(() => PRX_CATALOG.find((v) => v.slug === slug) ?? DEFAULT_VARIANT, [slug]);
  const dial = match.dial;

  const selectDial = (dialId: string) => {
    const next = variantForDial(dialId, match.size.id);
    setNotice(
      next.size.id !== match.size.id
        ? `${next.dial.label} is only offered in ${next.size.label} — case size updated.`
        : ""
    );
    setSlug(next.slug);
    setJustAdded(false);
    if (next.slug !== match.slug) track("configurator_change", { option: "dial", dial: next.dial.id, size: next.size.id });
  };

  const selectSize = (sizeId: string) => {
    const next = findVariant(dial.id, sizeId);
    if (!next) return;
    setNotice("");
    setSlug(next.slug);
    setJustAdded(false);
    if (next.slug !== match.slug) track("configurator_change", { option: "size", dial: next.dial.id, size: next.size.id });
  };

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
          className="relative aspect-square w-full overflow-hidden rounded-[2rem] shadow-media md:sticky md:top-24 md:aspect-auto md:h-[520px]"
        >
          <AnimatePresence mode="wait">
            {match.heroImage ? (
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
          className="rounded-[2rem] bg-white/40 p-7 shadow-float backdrop-blur-2xl ring-1 ring-white/60 md:p-9"
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
              {DIALS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => selectDial(d.id)}
                  aria-label={d.label}
                  aria-pressed={dial.id === d.id}
                  className={`h-10 w-10 rounded-full ring-2 ring-offset-2 ring-offset-white/40 transition ${
                    dial.id === d.id ? "ring-[var(--navy)] scale-110" : "ring-transparent hover:ring-black/15"
                  }`}
                  style={{ background: d.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-3 text-[13px] font-medium text-[var(--ink-900)]">
              Strap — <span className="text-[var(--ink-400)]">{match.specs.bracelet}</span>
            </div>
            {STRAPS.length === 1 && (
              <p className="text-[12px] text-[var(--ink-400)]">Every PRX ships on its integrated steel bracelet.</p>
            )}
          </div>

          <div className="mt-7">
            <div className="mb-3 text-[13px] font-medium text-[var(--ink-900)]" id="configurator-size-label">
              Case size
            </div>
            <div className="flex gap-2" role="group" aria-labelledby="configurator-size-label">
              {SIZES.map((s) => {
                const available = Boolean(findVariant(dial.id, s.id));
                const selected = match.size.id === s.id;
                const reason = `Not available with the ${dial.label} dial`;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => available && selectSize(s.id)}
                    aria-pressed={selected}
                    aria-disabled={!available}
                    title={available ? undefined : reason}
                    className={`rounded-full border px-4 py-2 text-[13px] font-medium transition ${
                      selected
                        ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                        : available
                          ? "border-black/10 bg-white/30 text-[var(--ink-600)] hover:border-black/20"
                          : "cursor-not-allowed border-dashed border-black/10 bg-transparent text-[var(--ink-400)] line-through decoration-black/20"
                    }`}
                  >
                    {s.label}
                    {!available && <span className="sr-only"> — {reason}</span>}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 min-h-[1.25rem] text-[12px] text-[var(--ink-400)]" role="status" aria-live="polite">
              {notice}
            </p>
          </div>

          <div className="mt-10 border-t border-black/[0.08] pt-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="text-[14px] text-[var(--ink-600)]">
                {match.name} <span className="text-[var(--ink-400)]">· {match.size.label}</span>
              </span>
              <span className="text-[18px] font-semibold text-[var(--ink-900)]">{formatPrice(match.price)}</span>
            </div>
            <MagneticButton
              onClick={() => {
                addToCart(match.slug);
                track("add_to_bag", { source: "configurator", variant: match.slug, quantity: 1 });
                setJustAdded(true);
                setTimeout(() => open(), 300);
              }}
              className="btn-primary w-full rounded-full py-3.5 text-[14px] font-medium text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
              maxOffsetPx={5}
            >
              {justAdded ? "Added ✓" : "Add to Bag"}
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
