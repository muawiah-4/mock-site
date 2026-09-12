"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import Link from "next/link";

const MotionLink = motion(Link);

/**
 * Wraps a button (or, with `href`, a nav Link) with a subtle magnetic pull
 * toward the cursor within its own bounds — restrained on purpose, a
 * ~10-14px pull, not a gimmick.
 */
export default function MagneticButton({
  children,
  className,
  onClick,
  href,
  strength = 14,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set((relX / rect.width) * strength);
    y.set((relY / rect.height) * strength);
  };
  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (href) {
    return (
      <MotionLink
        ref={ref}
        href={href}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ x: springX, y: springY }}
        className={className}
      >
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
