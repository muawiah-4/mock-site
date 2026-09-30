import { describe, expect, it } from "vitest";
import { CATALOG, getVariant } from "@/lib/catalog";
import {
  DEFAULT_VARIANT,
  DIALS,
  PRX_CATALOG,
  SIZES,
  STRAPS,
  findVariant,
  nearestForDial,
  variantForDial,
} from "@/lib/configurator";

const slugs = new Set(CATALOG.map((v) => v.slug));

describe("configurator option derivation", () => {
  it("only draws from the PRX collection", () => {
    expect(PRX_CATALOG.length).toBeGreaterThan(0);
    for (const v of PRX_CATALOG) expect(v.collectionId).toBe("prx");
  });

  it("offers each dial and size that at least one PRX reference has, and nothing else", () => {
    expect(DIALS.map((d) => d.id).sort()).toEqual([...new Set(PRX_CATALOG.map((v) => v.dial.id))].sort());
    expect(SIZES.map((s) => s.id).sort()).toEqual([...new Set(PRX_CATALOG.map((v) => v.size.id))].sort());
  });

  it("every PRX ships on the same bracelet, matching the single-strap UI copy", () => {
    expect(STRAPS).toEqual(["Integrated steel, quick-release"]);
  });

  it("defaults to a real 40mm PRX", () => {
    expect(DEFAULT_VARIANT.collectionId).toBe("prx");
    expect(DEFAULT_VARIANT.size.id).toBe("40");
    expect(slugs.has(DEFAULT_VARIANT.slug)).toBe(true);
  });

  it("every selectable dial × size resolves to a real catalog slug with that dial and size", () => {
    let available = 0;
    for (const d of DIALS) {
      for (const s of SIZES) {
        const v = findVariant(d.id, s.id);
        if (!v) continue; // rendered as disabled in the UI
        available++;
        expect(slugs.has(v.slug)).toBe(true);
        expect(getVariant(v.slug)).toBe(v);
        expect(v.dial.id).toBe(d.id);
        expect(v.size.id).toBe(s.id);
      }
    }
    // Each dial has at least one size, so each dial swatch leads somewhere.
    for (const d of DIALS) expect(SIZES.some((s) => findVariant(d.id, s.id))).toBe(true);
    expect(available).toBe(PRX_CATALOG.length);
  });

  it("dial×size combinations are unambiguous (one PRX per pair)", () => {
    const keys = PRX_CATALOG.map((v) => `${v.dial.id}/${v.size.id}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("switching dial from any state lands on a valid PRX with that dial", () => {
    for (const current of PRX_CATALOG) {
      for (const d of DIALS) {
        const next = variantForDial(d.id, current.size.id);
        expect(next, `${current.slug} -> ${d.id}`).toBeDefined();
        expect(next.collectionId).toBe("prx");
        expect(next.dial.id).toBe(d.id);
        expect(SIZES).toContain(next.size);
        expect(findVariant(next.dial.id, next.size.id)).toBe(next);
        // Size only changes when the current size isn't offered with the new dial.
        if (findVariant(d.id, current.size.id)) expect(next.size.id).toBe(current.size.id);
        else expect(next.size.id).not.toBe(current.size.id);
      }
    }
  });

  it("keeps the size when it's available: 40mm black -> mother-of-pearl stays 40mm", () => {
    expect(variantForDial("mop", "40").slug).toBe("prx-powermatic-80-mop");
  });

  it("moves to the nearest size when it isn't: 35mm -> black/green/silver jump to 40mm", () => {
    expect(variantForDial("black", "35").slug).toBe("prx-powermatic-80-black");
    expect(variantForDial("green", "35").slug).toBe("prx-powermatic-80-green");
    expect(variantForDial("silver", "35").slug).toBe("prx-powermatic-80-silver-two-tone");
  });

  it("never suggests a non-PRX watch that shares a dial id", () => {
    // Heritage Visodate and Everytime share the silver dial; Seastar shares blue.
    for (const size of ["30", "35", "40", "45", "45.5"]) {
      expect(nearestForDial("silver", size).collectionId).toBe("prx");
      expect(nearestForDial("blue", size).collectionId).toBe("prx");
    }
  });
});
