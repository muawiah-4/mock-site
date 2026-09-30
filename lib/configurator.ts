import { CATALOG, DIAL_OPTIONS, SIZE_OPTIONS } from "@/lib/catalog";
import type { WatchVariant } from "@/lib/catalog";

// The configurator only ever builds a PRX — never suggest a variant from
// another collection just because it happens to share a dial color id.
export const PRX_CATALOG = CATALOG.filter((v) => v.collectionId === "prx");

// Every option is derived from real PRX references, so any selection the UI
// allows resolves to an actual catalog entry (and a real cart slug).
export const DIALS = DIAL_OPTIONS.filter((d) => PRX_CATALOG.some((v) => v.dial.id === d.id));
export const SIZES = SIZE_OPTIONS.filter((s) => PRX_CATALOG.some((v) => v.size.id === s.id));
export const STRAPS = Array.from(new Set(PRX_CATALOG.map((v) => v.specs.bracelet)));

export const DEFAULT_VARIANT = PRX_CATALOG.find((v) => v.size.id === "40") ?? PRX_CATALOG[0];

export const findVariant = (dialId: string, sizeId: string) =>
  PRX_CATALOG.find((v) => v.dial.id === dialId && v.size.id === sizeId);

/** The variant with this dial whose case size is closest to `sizeId`. */
export function nearestForDial(dialId: string, sizeId: string): WatchVariant {
  const target = parseFloat(sizeId);
  return PRX_CATALOG.filter((v) => v.dial.id === dialId).sort(
    (a, b) => Math.abs(parseFloat(a.size.id) - target) - Math.abs(parseFloat(b.size.id) - target)
  )[0];
}

/** The variant to show when the user picks `dialId` while `sizeId` is selected:
 * the exact dial×size match, else the same dial in the nearest offered size. */
export function variantForDial(dialId: string, sizeId: string): WatchVariant {
  return findVariant(dialId, sizeId) ?? nearestForDial(dialId, sizeId);
}
