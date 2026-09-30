import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FRAME_BREAKPOINTS, STORY_BEATS, TOTAL_FRAMES, frameForProgress, frameSrc } from "@/lib/frames";

const ROOT = join(__dirname, "..");

describe("frameSrc", () => {
  const all = Array.from({ length: TOTAL_FRAMES }, (_, i) => frameSrc(i + 1));

  it("generates 240 unique, zero-padded frame paths", () => {
    expect(TOTAL_FRAMES).toBe(240);
    expect(new Set(all).size).toBe(240);
    expect(all[0]).toBe("/frames/ezgif-frame-001.jpg");
    expect(all[239]).toBe("/frames/ezgif-frame-240.jpg");
    for (const src of all) expect(src).toMatch(/^\/frames\/ezgif-frame-\d{3}\.jpg$/);
  });

  it("every generated path exists under /public", () => {
    for (const src of all) expect(existsSync(join(ROOT, "public", src)), src).toBe(true);
  });

  it("clamps and rounds out-of-range indices", () => {
    expect(frameSrc(0)).toBe(frameSrc(1));
    expect(frameSrc(-10)).toBe(frameSrc(1));
    expect(frameSrc(241)).toBe(frameSrc(240));
    expect(frameSrc(1.4)).toBe(frameSrc(1));
    expect(frameSrc(1.6)).toBe(frameSrc(2));
  });
});

describe("frameForProgress", () => {
  it("breakpoints are ordered, span [0,1] and stay within the frame range", () => {
    expect(FRAME_BREAKPOINTS[0].p).toBe(0);
    expect(FRAME_BREAKPOINTS[FRAME_BREAKPOINTS.length - 1].p).toBe(1);
    for (let i = 1; i < FRAME_BREAKPOINTS.length; i++) {
      expect(FRAME_BREAKPOINTS[i].p).toBeGreaterThan(FRAME_BREAKPOINTS[i - 1].p);
    }
    for (const { f } of FRAME_BREAKPOINTS) {
      expect(f).toBeGreaterThanOrEqual(1);
      expect(f).toBeLessThanOrEqual(TOTAL_FRAMES);
    }
  });

  it("plays the footage backwards: assembled at the top, exploded at the end", () => {
    expect(frameForProgress(0)).toBe(240);
    expect(frameForProgress(1)).toBe(1);
    expect(frameForProgress(-5)).toBe(240);
    expect(frameForProgress(5)).toBe(1);
  });

  it("hits each breakpoint exactly and is monotonic non-increasing in between", () => {
    for (const { p, f } of FRAME_BREAKPOINTS) expect(frameForProgress(p)).toBeCloseTo(f, 10);
    let prev = Infinity;
    for (let i = 0; i <= 1000; i++) {
      const f = frameForProgress(i / 1000);
      expect(f).toBeLessThanOrEqual(prev);
      expect(f).toBeGreaterThanOrEqual(1);
      prev = f;
    }
  });
});

describe("STORY_BEATS", () => {
  it("ids are unique", () => {
    const ids = STORY_BEATS.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ranges are within [0,1], non-empty, ordered and contiguous from 0 to 1", () => {
    expect(STORY_BEATS[0].range[0]).toBe(0);
    expect(STORY_BEATS[STORY_BEATS.length - 1].range[1]).toBe(1);
    STORY_BEATS.forEach(({ range: [start, end] }, i) => {
      expect(start).toBeGreaterThanOrEqual(0);
      expect(end).toBeLessThanOrEqual(1);
      expect(end).toBeGreaterThan(start);
      if (i > 0) expect(start).toBe(STORY_BEATS[i - 1].range[1]);
    });
  });

  it("only the convergence beat carries CTAs", () => {
    expect(STORY_BEATS.filter((b) => b.cta).map((b) => b.id)).toEqual(["convergence"]);
  });

  it("the final reveal beat renders no card", () => {
    const last = STORY_BEATS[STORY_BEATS.length - 1];
    expect(last.id).toBe("reveal");
    expect(last.headline).toBeUndefined();
    expect(last.cta).toBeUndefined();
  });

  it("CTA hrefs point at a real route or an anchor rendered on the home page", () => {
    const hrefs = STORY_BEATS.flatMap((b) => (b.cta ? [b.cta.primary, b.cta.secondary] : []))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .map((c) => c.href);
    expect(hrefs).toEqual(["/collection", "#configurator"]);

    const home = readFileSync(join(ROOT, "app/(site)/page.tsx"), "utf8");
    const componentsDir = join(ROOT, "components");

    for (const href of hrefs) {
      if (href.startsWith("#")) {
        const id = href.slice(1);
        // Find the component that renders id="<anchor>" and check the home page renders it.
        const owners = readdirSync(componentsDir).filter((f) =>
          readFileSync(join(componentsDir, f), "utf8").includes(`id="${id}"`)
        );
        expect(owners, href).toHaveLength(1);
        const name = owners[0].replace(/\.tsx$/, "");
        expect(home, `${name} must be rendered on the home page`).toMatch(new RegExp(`<${name}\\b`));
      } else {
        expect(href.startsWith("/")).toBe(true);
        expect(existsSync(join(ROOT, "app/(site)", href, "page.tsx")), href).toBe(true);
      }
    }
  });
});
