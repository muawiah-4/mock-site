"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { CATALOG, formatPrice, type WatchVariant } from "@/lib/catalog";

export type CartLine = { slug: string; quantity: number };

// `hydrated` flips in the same update that loads the stored lines, so the
// save effect never persists the initial empty cart over the real one.
type CartState = { lines: CartLine[]; isOpen: boolean; hydrated: boolean };

type CartAction =
  | { type: "ADD"; slug: string; quantity?: number }
  | { type: "REMOVE"; slug: string }
  | { type: "SET_QTY"; slug: string; quantity: number }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "HYDRATE"; lines: CartLine[] };

const STORAGE_KEY = "prx-cart-v1";
const MAX_QTY = 99;

/** Whole number in [1, MAX_QTY]; NaN/Infinity fall back to 1. */
function clampQty(n: number): number {
  return Number.isFinite(n) ? Math.min(MAX_QTY, Math.max(1, Math.floor(n))) : 1;
}

/** Storage is user-editable, so treat it as untrusted: keep only well-formed
 * lines for slugs still in the catalog, with sane integer quantities. */
function parseStoredLines(raw: string | null): CartLine[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];

  const lines: CartLine[] = [];
  // Only catalog slugs survive and duplicates are skipped, so anything past
  // the catalog size is junk — don't spend time walking a huge array.
  for (const item of data.slice(0, CATALOG.length * 2)) {
    if (typeof item !== "object" || item === null) continue;
    const { slug, quantity } = item as Record<string, unknown>;
    if (typeof slug !== "string" || typeof quantity !== "number" || !Number.isFinite(quantity)) continue;
    if (!CATALOG.some((v) => v.slug === slug)) continue;
    if (lines.some((l) => l.slug === slug)) continue;
    lines.push({ slug, quantity: clampQty(quantity) });
  }
  return lines;
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, lines: action.lines, hydrated: true };
    case "ADD": {
      if (!CATALOG.some((v) => v.slug === action.slug)) return state;
      const existing = state.lines.find((l) => l.slug === action.slug);
      const lines = existing
        ? state.lines.map((l) =>
            l.slug === action.slug ? { ...l, quantity: clampQty(l.quantity + (action.quantity ?? 1)) } : l
          )
        : [...state.lines, { slug: action.slug, quantity: clampQty(action.quantity ?? 1) }];
      return { ...state, lines, isOpen: true };
    }
    case "REMOVE":
      return { ...state, lines: state.lines.filter((l) => l.slug !== action.slug) };
    case "SET_QTY":
      return {
        ...state,
        lines: state.lines
          .map((l) => (l.slug === action.slug ? { ...l, quantity: clampQty(action.quantity) } : l)),
      };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

type CartContextValue = {
  lines: (CartLine & { variant: WatchVariant })[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  subtotalFormatted: string;
  addToCart: (slug: string, quantity?: number) => void;
  removeFromCart: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], isOpen: false, hydrated: false });

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch {
      // storage unavailable — start with an empty cart
    }
    // Always dispatch, even with nothing stored, so saving is enabled.
    dispatch({ type: "HYDRATE", lines: parseStoredLines(raw) });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // storage unavailable — cart still works for this session
    }
  }, [state.lines, state.hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const lines = state.lines
      .map((l) => {
        const variant = CATALOG.find((v) => v.slug === l.slug);
        return variant ? { ...l, variant } : null;
      })
      .filter(Boolean) as (CartLine & { variant: WatchVariant })[];

    const subtotal = lines.reduce((sum, l) => sum + l.variant.price * l.quantity, 0);
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);

    return {
      lines,
      isOpen: state.isOpen,
      count,
      subtotal,
      subtotalFormatted: formatPrice(subtotal),
      addToCart: (slug, quantity) => dispatch({ type: "ADD", slug, quantity }),
      removeFromCart: (slug) => dispatch({ type: "REMOVE", slug }),
      setQuantity: (slug, quantity) => dispatch({ type: "SET_QTY", slug, quantity }),
      open: () => dispatch({ type: "OPEN" }),
      close: () => dispatch({ type: "CLOSE" }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
