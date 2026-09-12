export const TOTAL_FRAMES = 240;

export function frameSrc(index: number): string {
  const clamped = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(index)));
  return `/frames/ezgif-frame-${String(clamped).padStart(3, "0")}.jpg`;
}

/**
 * Scroll-progress (0-1) to frame-number breakpoints, hand-tuned against the
 * source footage. The raw footage itself plays exploded -> assembled as its
 * frame number increases (it opens already exploded, holds while components
 * drift, then snaps together into the reassembled hero shot around frame
 * 152-240) — the reverse of the story this site tells. We play the footage
 * backwards instead: the watch holds fully assembled at the top of the page,
 * begins separating as you scroll, passes through the dramatic case-opening
 * break around the midpoint, and holds on the fully exploded technical
 * composition by the end — so scrolling down disassembles the watch and
 * scrolling back up reassembles it.
 */
export const FRAME_BREAKPOINTS: { p: number; f: number }[] = [
  { p: 0, f: 240 },
  { p: 0.18, f: 173 },
  { p: 0.34, f: 152 },
  { p: 0.42, f: 126 },
  { p: 0.66, f: 92 },
  { p: 0.9, f: 14 },
  { p: 1, f: 1 },
];

export function frameForProgress(progress: number): number {
  const p = Math.min(1, Math.max(0, progress));
  const pts = FRAME_BREAKPOINTS;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (p >= a.p && p <= b.p) {
      const t = b.p === a.p ? 0 : (p - a.p) / (b.p - a.p);
      return a.f + (b.f - a.f) * t;
    }
  }
  return pts[pts.length - 1].f;
}

export type StoryBeat = {
  id: string;
  range: [number, number];
  align: "center" | "left" | "right";
  eyebrow?: string;
  /** Omit entirely to render no card for this beat's range — used for the
   *  final stretch of the exploded-view scroll, where the diagram itself
   *  is the payoff and nothing should sit on top of it. */
  headline?: string;
  body?: string[];
  cta?: { primary: string; secondary?: string };
  micro?: string;
};

export const STORY_BEATS: StoryBeat[] = [
  {
    id: "hero",
    range: [0, 0.15],
    align: "center",
    eyebrow: "TISSOT — PRX",
    headline: "Every second, engineered in the open.",
    body: [
      "A resolutely 1970s silhouette, rebuilt component by component with modern Swiss precision.",
    ],
  },
  {
    id: "engineering",
    range: [0.15, 0.34],
    align: "left",
    eyebrow: "Construction",
    headline: "Precision, laid bare.",
    body: [
      "Sapphire crystal, integrated steel bezel, and a hand-finished sunburst dial — every layer engineered to align within microns of the next.",
      "Nothing here is decorative. Every surface serves the movement beneath it.",
    ],
  },
  {
    id: "movement",
    range: [0.34, 0.42],
    align: "right",
    eyebrow: "The movement",
    headline: "Built to outlast the trend it started.",
    body: [
      "A Swiss automatic caliber, visible in every exploded layer of the case.",
      "138 components, assembled and regulated by hand.",
    ],
  },
  {
    id: "stress-test",
    range: [0.42, 0.62],
    align: "center",
    eyebrow: "Stress Tested",
    headline: "Pushed apart on purpose.",
    body: [
      "Every PRX is shaken, shocked, and pressure-tested before it ever reaches a wrist — this is what that looks like from the inside.",
    ],
  },
  {
    id: "convergence",
    range: [0.62, 0.82],
    align: "center",
    eyebrow: "Full Disassembly",
    headline: "Every layer, laid open.",
    body: [
      "At full extension, 138 components hold their exact relationship to one another — nothing hidden, nothing decorative.",
    ],
  },
  {
    id: "reveal",
    range: [0.82, 1],
    align: "center",
  },
];
