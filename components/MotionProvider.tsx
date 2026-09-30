"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Framer Motion animates via inline styles / WAAPI, so the global CSS
 * prefers-reduced-motion override doesn't reach it. reducedMotion="user"
 * makes every motion component drop transform/layout animation (opacity
 * fades still run) when the OS asks for reduced motion.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
