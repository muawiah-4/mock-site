"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { CATALOG, formatPrice, type WatchVariant } from "@/lib/catalog";

export type CartLine = { slug: string; quantity: number };

type CartState = { lines: CartLine[]; isOpen: boolean };

type CartAction =
  | { type: "ADD"; slug: string; quantity?: number }
  | { type: "REMOVE"; slug: string }
  | { type: "SET_QTY"; slug: string; quantity: number }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "HYDRATE"; lines: CartLine[] };

const STORAGE_KEY = "prx-cart-v1";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, lines: action.lines };
    case "ADD": {
      const existing = state.lines.find((l) => l.slug === action.slug);
      const lines = existing
        ? state.lines.map((l) =>
            l.slug === action.slug ? { ...l, quantity: l.quantity + (action.quantity ?? 1) } : l
          )
        : [...state.lines, { slug: action.slug, quantity: action.quantity ?? 1 }];
      return { ...state, lines, isOpen: true };
    }
    case "REMOVE":
      return { ...state, lines: state.lines.filter((l) => l.slug !== action.slug) };
    case "SET_QTY":
      return {
        ...state,
        lines: state.lines
          .map((l) => (l.slug === action.slug ? { ...l, quantity: Math.max(1, action.quantity) } : l))
          .filter((l) => l.quantity > 0),
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
  const [state, dispatch] = useReducer(reducer, { lines: [], isOpen: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", lines: JSON.parse(raw) });
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // storage unavailable — cart still works for this session
    }
  }, [state.lines]);

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
