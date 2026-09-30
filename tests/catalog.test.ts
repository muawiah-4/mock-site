import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CATALOG,
  COLLECTIONS,
  DIAL_OPTIONS,
  SIZE_OPTIONS,
  STRAP_OPTIONS,
  getVariant,
  modelVariants,
} from "@/lib/catalog";

const ROOT = join(__dirname, "..");
const bySlug = (slug: string) => {
  const v = getVariant(slug);
  if (!v) throw new Error(`missing catalog slug ${slug}`);
  return v;
};

describe("catalog data integrity", () => {
  it.each(CATALOG.map((v) => [v.slug, v] as const))("%s: size label matches case diameter", (_slug, v) => {
    expect(v.size.label).toBe(v.specs.caseDiameter);
  });

  it("every size option label matches its id", () => {
    for (const s of SIZE_OPTIONS) expect(s.label).toBe(`${s.id}mm`);
  });

  it("every slug is unique and URL-safe", () => {
    const slugs = CATALOG.map((v) => v.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("option ids are unique", () => {
    for (const opts of [DIAL_OPTIONS, STRAP_OPTIONS, SIZE_OPTIONS, COLLECTIONS]) {
      const ids = opts.map((o) => o.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("every variant resolves its dial, strap, size and collection", () => {
    for (const v of CATALOG) {
      expect(DIAL_OPTIONS).toContain(v.dial);
      expect(STRAP_OPTIONS).toContain(v.strap);
      expect(SIZE_OPTIONS).toContain(v.size);
      expect(COLLECTIONS.map((c) => c.id)).toContain(v.collectionId);
    }
  });

  it("prices are positive whole dollars", () => {
    for (const v of CATALOG) {
      expect(Number.isInteger(v.price)).toBe(true);
      expect(v.price).toBeGreaterThan(0);
    }
  });

  it("every heroImage points at a file under /public", () => {
    for (const v of CATALOG) {
      if (v.heroImage === null) continue;
      expect(v.heroImage.startsWith("/")).toBe(true);
      expect(existsSync(join(ROOT, "public", v.heroImage)), v.heroImage).toBe(true);
    }
  });
});

describe("modelVariants", () => {
  it("groups the PRX Powermatic 80 family (5 variants, catalog order, includes itself)", () => {
    const blue = bySlug("prx-powermatic-80-blue");
    const family = modelVariants(blue);
    expect(family.map((v) => v.slug)).toEqual([
      "prx-powermatic-80-blue",
      "prx-powermatic-80-black",
      "prx-powermatic-80-green",
      "prx-powermatic-80-silver-two-tone",
      "prx-powermatic-80-mop",
    ]);
    // Same family from any member.
    for (const member of family) expect(modelVariants(member)).toEqual(family);
  });

  it("groups the PRX Quartz family (2 variants)", () => {
    expect(modelVariants(bySlug("prx-quartz-blue-35")).map((v) => v.slug)).toEqual([
      "prx-quartz-mop-35",
      "prx-quartz-blue-35",
    ]);
  });

  it("singletons return only themselves, so no picker is shown", () => {
    for (const slug of [
      "gentleman-powermatic-80",
      "seastar-1000-chronograph",
      "everytime-30",
      "t-touch-connect-solar",
      "heritage-visodate",
    ]) {
      const v = bySlug(slug);
      expect(modelVariants(v)).toEqual([v]);
    }
  });

  it("families partition the catalog and never cross collections", () => {
    const seen = new Set<string>();
    for (const v of CATALOG) {
      const family = modelVariants(v);
      expect(family).toContain(v);
      for (const m of family) {
        expect(m.collectionId).toBe(v.collectionId);
        expect(m.name).toBe(v.name);
      }
      seen.add(family.map((m) => m.slug).join(","));
    }
    const total = [...seen].reduce((n, key) => n + key.split(",").length, 0);
    expect(total).toBe(CATALOG.length);
  });
});
