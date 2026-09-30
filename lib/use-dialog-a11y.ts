"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusableIn(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden"
  );
}

/**
 * Keyboard + focus behaviour shared by the site's overlays:
 * - Escape calls onClose
 * - with `autoFocus`, on open focuses `initialFocusRef` (or the first focusable
 *   in the container)
 * - with `trap`, Tab / Shift+Tab cycle inside the container, plus any
 *   `alsoInclude` elements that sit outside it (e.g. a toggle that stays
 *   visible above the overlay)
 * - on close, focus returns to whatever was focused when it opened (the trigger)
 * - with `lockScroll`, the page behind doesn't scroll while open
 *
 * The container is usually a Framer Motion element inside AnimatePresence, so
 * it's only mounted while `open` is true — the ref is read inside the effect.
 */
export function useDialogA11y({
  open,
  onClose,
  containerRef,
  initialFocusRef,
  alsoInclude,
  autoFocus = true,
  trap = true,
  lockScroll = false,
}: {
  open: boolean;
  onClose: () => void;
  containerRef: RefObject<HTMLElement>;
  initialFocusRef?: RefObject<HTMLElement>;
  alsoInclude?: RefObject<HTMLElement>[];
  autoFocus?: boolean;
  trap?: boolean;
  lockScroll?: boolean;
}) {
  // Callers often pass an inline arrow; keep the latest without re-running
  // the open/close effect (which would steal focus back on every render).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    // Mounted by the time this runs (it renders while `open`), and AnimatePresence
    // keeps the same node around through the exit animation.
    const openedContainer = containerRef.current;

    const raf = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container || !autoFocus) return;
      const target = initialFocusRef?.current ?? focusableIn(container)[0] ?? container;
      target.focus({ preventScroll: true });
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (!trap || e.key !== "Tab") return;
      const container = containerRef.current;
      if (!container) return;
      const extras = (alsoInclude ?? [])
        .map((r) => r.current)
        .filter((el): el is HTMLElement => !!el && el.isConnected);
      const items = [...extras, ...focusableIn(container)].sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      );
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside =
        active instanceof Node && (container.contains(active) || extras.some((el) => el.contains(active)));
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    if (lockScroll) document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      if (lockScroll) document.body.style.overflow = prevOverflow;
      // Only pull focus back if it's still inside the closing overlay (or was
      // dropped to <body>) — not if the user already moved it elsewhere.
      const active = document.activeElement;
      const lost = !active || active === document.body || (openedContainer && openedContainer.contains(active));
      if (lost && trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
    };
    // alsoInclude is read at keydown time; callers pass a fresh array literal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, trap, lockScroll, autoFocus, containerRef, initialFocusRef]);
}
