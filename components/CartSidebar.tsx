"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/catalog";
import MagneticButton from "@/components/MagneticButton";

export default function CartSidebar() {
  const { lines, isOpen, close, removeFromCart, setQuantity, subtotalFormatted } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-black/[0.06] px-6 py-5">
              <h2 className="text-[15px] font-semibold tracking-tight text-[var(--ink-900)]">
                Your Bag {lines.length > 0 && `(${lines.reduce((s, l) => s + l.quantity, 0)})`}
              </h2>
              <button
                onClick={close}
                aria-label="Close bag"
                className="rounded-full p-2 text-[var(--ink-600)] transition hover:bg-black/[0.05]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <p className="text-[15px] font-medium text-[var(--ink-900)]">Your bag is empty</p>
                  <p className="text-[13px] text-[var(--ink-400)]">
                    Explore the collection and add a PRX to your bag.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-6">
                  {lines.map(({ slug, quantity, variant }) => (
                    <li key={slug} className="flex gap-4">
                      <div
                        className="h-20 w-20 shrink-0 rounded-2xl"
                        style={{
                          background: `radial-gradient(circle at 35% 30%, ${variant.dial.hex}22, #e8eaeb)`,
                        }}
                      >
                        <div
                          className="mx-auto mt-4 h-11 w-11 rounded-full ring-4 ring-white"
                          style={{ background: variant.dial.hex }}
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[14px] font-medium text-[var(--ink-900)]">{variant.name}</p>
                            <p className="text-[12px] text-[var(--ink-400)]">
                              {variant.dial.label} · {variant.strap.label} · {variant.size.label}
                            </p>
                          </div>
                          <p className="whitespace-nowrap text-[14px] font-medium text-[var(--ink-900)]">
                            {formatPrice(variant.price * quantity)}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-black/10">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => setQuantity(slug, quantity - 1)}
                              className="px-3 py-1 text-[14px] text-[var(--ink-600)] transition hover:text-[var(--ink-900)]"
                            >
                              −
                            </button>
                            <span className="min-w-[1.5rem] text-center text-[13px] text-[var(--ink-900)]">
                              {quantity}
                            </span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => setQuantity(slug, quantity + 1)}
                              className="px-3 py-1 text-[14px] text-[var(--ink-600)] transition hover:text-[var(--ink-900)]"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(slug)}
                            className="text-[12px] text-[var(--ink-400)] underline underline-offset-2 transition hover:text-[var(--ink-900)]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-black/[0.06] px-6 py-6">
                <div className="mb-4 flex items-center justify-between text-[14px]">
                  <span className="text-[var(--ink-600)]">Subtotal</span>
                  <span className="font-semibold text-[var(--ink-900)]">{subtotalFormatted}</span>
                </div>
                <p className="mb-4 text-[11px] text-[var(--ink-400)]">
                  Shipping and taxes calculated at checkout.
                </p>
                <MagneticButton
                  onClick={() => setCheckedOut(true)}
                  className="btn-primary w-full rounded-full py-3.5 text-[14px] font-medium text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  strength={8}
                >
                  {checkedOut ? "Order placed — thank you" : "Checkout"}
                </MagneticButton>
                {checkedOut && (
                  <p className="mt-3 text-center text-[11px] text-[var(--ink-400)]">
                    This is a concept demo — no payment was processed.
                  </p>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
