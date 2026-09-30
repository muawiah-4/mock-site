import { describe, expect, it } from "vitest";
import { CATALOG } from "@/lib/catalog";
import {
  MAX_QTY,
  cartReducer,
  clampQty,
  parseStoredLines,
  type CartAction,
  type CartState,
} from "@/lib/cart-context";

const A = CATALOG[0].slug;
const B = CATALOG[1].slug;
const store = (value: unknown) => JSON.stringify(value);

describe("clampQty", () => {
  it.each([
    [1, 1],
    [5, 5],
    [0, 1],
    [-3, 1],
    [1.7, 1],
    [2.999, 2],
    [MAX_QTY, MAX_QTY],
    [MAX_QTY + 1, MAX_QTY],
    [1e9, MAX_QTY],
    [NaN, 1],
    [Infinity, 1],
    [-Infinity, 1],
  ])("clampQty(%s) === %s", (input, expected) => {
    expect(clampQty(input)).toBe(expected);
  });
});

describe("parseStoredLines", () => {
  it.each([
    ["null", null],
    ["empty string", ""],
    ["corrupt JSON", "{"],
    ["truncated JSON", '[{"slug":"prx'],
    ["NaN literal (invalid JSON)", `[{"slug":"${A}","quantity":NaN}]`],
    ["object", "{}"],
    ["object with numeric keys", '{"0":{"slug":"x","quantity":1},"length":1}'],
    ["string", '"hello"'],
    ["number", "42"],
    ["JSON null", "null"],
    ["boolean", "true"],
    ["empty array", "[]"],
  ])("returns [] for %s", (_label, raw) => {
    expect(parseStoredLines(raw)).toEqual([]);
  });

  it("keeps well-formed lines in order", () => {
    expect(parseStoredLines(store([{ slug: A, quantity: 2 }, { slug: B, quantity: 1 }]))).toEqual([
      { slug: A, quantity: 2 },
      { slug: B, quantity: 1 },
    ]);
  });

  it("drops non-object entries and entries with missing or mistyped fields", () => {
    const raw = store([
      null,
      1,
      "str",
      [A, 1],
      { slug: A },
      { quantity: 1 },
      { slug: A, quantity: "2" },
      { slug: 123, quantity: 1 },
      { slug: A, quantity: null },
      { slug: B, quantity: 3 },
    ]);
    expect(parseStoredLines(raw)).toEqual([{ slug: B, quantity: 3 }]);
  });

  it("drops slugs that are not in the catalog", () => {
    expect(parseStoredLines(store([{ slug: "rolex-submariner", quantity: 1 }, { slug: A, quantity: 1 }]))).toEqual([
      { slug: A, quantity: 1 },
    ]);
  });

  it("keeps only the first line for a duplicated slug", () => {
    expect(
      parseStoredLines(store([{ slug: A, quantity: 4 }, { slug: A, quantity: 9 }, { slug: A, quantity: 1 }]))
    ).toEqual([{ slug: A, quantity: 4 }]);
  });

  it.each([
    [0, 1],
    [-5, 1],
    [1.7, 1],
    [1e9, MAX_QTY],
    [100, MAX_QTY],
  ])("clamps stored quantity %s to %s", (quantity, expected) => {
    expect(parseStoredLines(store([{ slug: A, quantity }]))).toEqual([{ slug: A, quantity: expected }]);
  });

  it("drops non-finite quantities (1e999 parses to Infinity)", () => {
    expect(parseStoredLines(`[{"slug":"${A}","quantity":1e999}]`)).toEqual([]);
  });

  it("rejects prototype-ish slugs", () => {
    const raw = store(
      ["__proto__", "constructor", "prototype", "toString", "hasOwnProperty"].map((slug) => ({ slug, quantity: 1 }))
    );
    expect(parseStoredLines(raw)).toEqual([]);
  });

  it("ignores __proto__ keys and never copies extra properties or pollutes Object.prototype", () => {
    const raw = `[{"__proto__":{"slug":"${A}","quantity":1,"polluted":true}},{"slug":"${B}","quantity":2,"__proto__":{"polluted":true},"price":0}]`;
    const lines = parseStoredLines(raw);
    expect(lines).toEqual([{ slug: B, quantity: 2 }]);
    expect(Object.keys(lines[0]).sort()).toEqual(["quantity", "slug"]);
    expect(Object.getPrototypeOf(lines[0])).toBe(Object.prototype);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it("handles an oversized array quickly and only inspects a bounded prefix", () => {
    const junk = Array.from({ length: 200_000 }, () => ({ slug: "nope", quantity: 1 }));
    const start = performance.now();
    expect(parseStoredLines(store([...junk, { slug: A, quantity: 1 }]))).toEqual([]);
    expect(performance.now() - start).toBeLessThan(1000);
  });

  it("returns every catalog slug once from a huge array of repeats", () => {
    const all = CATALOG.map((v) => ({ slug: v.slug, quantity: 1 }));
    const lines = parseStoredLines(store([...all, ...all, ...all, ...all]));
    expect(lines.map((l) => l.slug)).toEqual(CATALOG.map((v) => v.slug));
  });

  it("only ever returns integer quantities in [1, MAX_QTY]", () => {
    const qtys = [-1e9, -1, 0, 0.5, 1, 1.5, 42, 98.9, 99, 99.1, 1e308];
    const raw = store(qtys.map((quantity, i) => ({ slug: CATALOG[i % CATALOG.length].slug, quantity })));
    for (const { quantity } of parseStoredLines(raw)) {
      expect(Number.isInteger(quantity)).toBe(true);
      expect(quantity).toBeGreaterThanOrEqual(1);
      expect(quantity).toBeLessThanOrEqual(MAX_QTY);
    }
  });
});

describe("cartReducer", () => {
  const empty: CartState = { lines: [], isOpen: false, hydrated: true };
  const run = (state: CartState, ...actions: CartAction[]) => actions.reduce(cartReducer, state);

  it("HYDRATE replaces lines and marks hydrated", () => {
    const next = cartReducer({ lines: [], isOpen: false, hydrated: false }, {
      type: "HYDRATE",
      lines: [{ slug: A, quantity: 2 }],
    });
    expect(next).toEqual({ lines: [{ slug: A, quantity: 2 }], isOpen: false, hydrated: true });
  });

  it("ADD appends a new line with quantity 1 and opens the cart", () => {
    expect(cartReducer(empty, { type: "ADD", slug: A })).toEqual({
      lines: [{ slug: A, quantity: 1 }],
      isOpen: true,
      hydrated: true,
    });
  });

  it("ADD increments an existing line instead of duplicating it", () => {
    const next = run(empty, { type: "ADD", slug: A }, { type: "ADD", slug: B }, { type: "ADD", slug: A, quantity: 3 });
    expect(next.lines).toEqual([
      { slug: A, quantity: 4 },
      { slug: B, quantity: 1 },
    ]);
  });

  it("ADD caps at MAX_QTY", () => {
    const state: CartState = { ...empty, lines: [{ slug: A, quantity: MAX_QTY - 1 }] };
    expect(run(state, { type: "ADD", slug: A, quantity: 5 }).lines).toEqual([{ slug: A, quantity: MAX_QTY }]);
    expect(cartReducer(empty, { type: "ADD", slug: A, quantity: 1e9 }).lines).toEqual([
      { slug: A, quantity: MAX_QTY },
    ]);
  });

  it("ADD clamps odd quantities for new lines", () => {
    expect(cartReducer(empty, { type: "ADD", slug: A, quantity: 0 }).lines[0].quantity).toBe(1);
    expect(cartReducer(empty, { type: "ADD", slug: A, quantity: -4 }).lines[0].quantity).toBe(1);
    expect(cartReducer(empty, { type: "ADD", slug: A, quantity: 2.6 }).lines[0].quantity).toBe(2);
    expect(cartReducer(empty, { type: "ADD", slug: A, quantity: NaN }).lines[0].quantity).toBe(1);
  });

  it("ADD with an unknown slug returns the same state object", () => {
    const state: CartState = { ...empty, lines: [{ slug: A, quantity: 1 }] };
    expect(cartReducer(state, { type: "ADD", slug: "not-a-watch" })).toBe(state);
    expect(cartReducer(state, { type: "ADD", slug: "__proto__" })).toBe(state);
  });

  it("SET_QTY sets a clamped quantity on the matching line only", () => {
    const state: CartState = { ...empty, lines: [{ slug: A, quantity: 1 }, { slug: B, quantity: 2 }] };
    expect(cartReducer(state, { type: "SET_QTY", slug: A, quantity: 7 }).lines).toEqual([
      { slug: A, quantity: 7 },
      { slug: B, quantity: 2 },
    ]);
    expect(cartReducer(state, { type: "SET_QTY", slug: A, quantity: 1e9 }).lines[0].quantity).toBe(MAX_QTY);
    expect(cartReducer(state, { type: "SET_QTY", slug: A, quantity: 0 }).lines[0].quantity).toBe(1);
    expect(cartReducer(state, { type: "SET_QTY", slug: A, quantity: -2 }).lines[0].quantity).toBe(1);
    expect(cartReducer(state, { type: "SET_QTY", slug: A, quantity: 3.9 }).lines[0].quantity).toBe(3);
    expect(cartReducer(state, { type: "SET_QTY", slug: A, quantity: NaN }).lines[0].quantity).toBe(1);
  });

  it("SET_QTY never creates a line for a slug that is not in the cart", () => {
    const state: CartState = { ...empty, lines: [{ slug: A, quantity: 1 }] };
    expect(cartReducer(state, { type: "SET_QTY", slug: B, quantity: 5 }).lines).toEqual([{ slug: A, quantity: 1 }]);
    expect(cartReducer(state, { type: "SET_QTY", slug: "not-a-watch", quantity: 5 }).lines).toEqual([
      { slug: A, quantity: 1 },
    ]);
  });

  it("REMOVE drops the line; removing an absent slug is a no-op", () => {
    const state: CartState = { ...empty, lines: [{ slug: A, quantity: 1 }, { slug: B, quantity: 2 }] };
    expect(cartReducer(state, { type: "REMOVE", slug: A }).lines).toEqual([{ slug: B, quantity: 2 }]);
    expect(cartReducer(state, { type: "REMOVE", slug: "not-a-watch" }).lines).toEqual(state.lines);
  });

  it("OPEN / CLOSE toggle isOpen without touching lines", () => {
    const state: CartState = { ...empty, lines: [{ slug: A, quantity: 1 }] };
    expect(cartReducer(state, { type: "OPEN" })).toEqual({ ...state, isOpen: true });
    expect(cartReducer({ ...state, isOpen: true }, { type: "CLOSE" })).toEqual(state);
  });

  it("never mutates the previous state", () => {
    const state: CartState = { ...empty, lines: [{ slug: A, quantity: 1 }] };
    const snapshot = structuredClone(state);
    run(
      state,
      { type: "ADD", slug: A },
      { type: "ADD", slug: B },
      { type: "SET_QTY", slug: A, quantity: 9 },
      { type: "REMOVE", slug: B }
    );
    cartReducer(state, { type: "ADD", slug: A });
    cartReducer(state, { type: "SET_QTY", slug: A, quantity: 9 });
    expect(state).toEqual(snapshot);
  });
});
