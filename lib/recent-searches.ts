export const RECENT_KEY = "prx-recent-searches";
export const MAX_RECENT = 5;
export const MAX_TERM_LENGTH = 80;

/** Storage is user-editable: keep only a short list of short strings so a
 * malformed value can't crash the overlay (e.g. `.map` on a non-array). */
export function parseRecent(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter((t): t is string => typeof t === "string" && t.trim() !== "")
      .map((t) => t.slice(0, MAX_TERM_LENGTH))
      .filter((t, i, arr) => arr.indexOf(t) === i)
      .slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}
