export const TOTAL_FRAMES = 240;

export function frameSrc(index: number): string {
  const clamped = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(index)));
  return `/frames/ezgif-frame-${String(clamped).padStart(3, "0")}.jpg`;
}

/**
 * Scroll-progress (0-1) to frame-number breakpoints, hand-tuned against the
 * source footage: it opens already exploded, holds while components drift,
 * snaps together around 58-82%, then holds on the reassembled hero shot.
 */
export const FRAME_BREAKPOINTS: { p: number; f: number }[] = [
  { p: 0, f: 1 },
  { p: 0.1, f: 14 },
  { p: 0.34, f: 92 },
  { p: 0.58, f: 126 },
  { p: 0.66, f: 152 },
  { p: 0.82, f: 173 },
  { p: 1, f: 240 },
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
  headline: string;
  body?: string[];
  cta?: { primary: string; secondary?: string };
  micro?: string;
};

export const STORY_BEATS: StoryBeat[] = [
  {
    id: "hero",
    range: [0, 0.1],
    align: "center",
    eyebrow: "TISSOT — PRX",
    headline: "Every second, engineered in the open.",
    body: [
      "A resolutely 1970s silhouette, rebuilt component by component with modern Swiss precision.",
    ],
  },
  {
    id: "engineering",
    range: [0.1, 0.34],
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
    range: [0.34, 0.44],
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
    range: [0.44, 0.62],
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
    eyebrow: "Assembly",
    headline: "Engineered to come together.",
    body: ["In an instant — tolerances so tight the whole case reseats itself."],
  },
  {
    id: "reveal",
    range: [0.82, 1],
    align: "center",
    eyebrow: "PRX",
    headline: "Time, perfected.",
    body: ["Heritage design, re-engineered for today. Swiss made since 1853."],
    cta: { primary: "Discover PRX", secondary: "See full specs" },
    micro: "Available in steel, two-tone, and PVD finishes.",
  },
];
