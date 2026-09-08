"use client";

import { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";

export type ScrollControl = {
  progress: MotionValue<number>;
  scrollToFraction: (fraction: number) => void;
};

export const ScrollControlContext = createContext<ScrollControl | null>(null);

export function useScrollControl(): ScrollControl {
  const ctx = useContext(ScrollControlContext);
  if (!ctx) {
    throw new Error("useScrollControl must be used within ScrollControlContext.Provider");
  }
  return ctx;
}
