import { describe, expect, it } from "vitest";
import { MAX_RECENT, MAX_TERM_LENGTH, parseRecent } from "@/lib/recent-searches";

describe("parseRecent", () => {
  it.each([
    ["null", null],
    ["empty string", ""],
    ["corrupt JSON", "[\"prx"],
    ["object", '{"0":"prx","length":1}'],
    ["string", '"prx"'],
    ["number", "5"],
    ["JSON null", "null"],
  ])("returns [] for %s", (_label, raw) => {
    expect(parseRecent(raw)).toEqual([]);
  });

  it("keeps valid strings in order", () => {
    expect(parseRecent(JSON.stringify(["prx", "seastar", "blue dial"]))).toEqual(["prx", "seastar", "blue dial"]);
  });

  it("drops non-strings and blank strings", () => {
    const raw = JSON.stringify([1, null, {}, ["prx"], true, "", "   ", "prx", { toString: "x" }, "gentleman"]);
    expect(parseRecent(raw)).toEqual(["prx", "gentleman"]);
  });

  it("truncates long strings to MAX_TERM_LENGTH", () => {
    const [term] = parseRecent(JSON.stringify(["x".repeat(10_000)]));
    expect(term).toHaveLength(MAX_TERM_LENGTH);
  });

  it("dedupes, including terms that only collide after truncation", () => {
    const long = "a".repeat(MAX_TERM_LENGTH);
    expect(parseRecent(JSON.stringify(["prx", "prx", `${long}1`, `${long}2`]))).toEqual(["prx", long]);
  });

  it("keeps at most MAX_RECENT (the most recent first entries)", () => {
    const terms = Array.from({ length: 50 }, (_, i) => `term ${i}`);
    expect(parseRecent(JSON.stringify(terms))).toEqual(terms.slice(0, MAX_RECENT));
    expect(MAX_RECENT).toBe(5);
  });

  it("counts the cap after filtering junk, not before", () => {
    const raw = JSON.stringify([null, 1, "", "a", "b", "a", "c", "d", "e", "f"]);
    expect(parseRecent(raw)).toEqual(["a", "b", "c", "d", "e"]);
  });
});
