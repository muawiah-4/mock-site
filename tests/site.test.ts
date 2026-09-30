import { afterEach, describe, expect, it, vi } from "vitest";

// SITE_URL is computed at import time from the env, so each case re-imports the module.
async function loadSite(siteUrl: string | undefined) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", siteUrl);
  return import("@/lib/site");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("SITE_URL", () => {
  it("defaults to localhost when unset", async () => {
    const { SITE_URL } = await loadSite(undefined);
    expect(SITE_URL).toBe("http://localhost:3000");
  });

  it.each(["https://prx.example", "https://prx.example/", "https://prx.example///"])(
    "strips trailing slashes from %s",
    async (value) => {
      const { SITE_URL } = await loadSite(value);
      expect(SITE_URL).toBe("https://prx.example");
    }
  );
});

describe("absoluteUrl", () => {
  it.each([
    ["/collection", "https://prx.example/collection"],
    ["collection", "https://prx.example/collection"],
    ["/", "https://prx.example/"],
    ["", "https://prx.example/"],
    ["/watch/prx-powermatic-80-blue", "https://prx.example/watch/prx-powermatic-80-blue"],
    ["/collection?x=1#top", "https://prx.example/collection?x=1#top"],
  ])("absoluteUrl(%j) with a trailing-slash SITE_URL -> %s", async (path, expected) => {
    const { absoluteUrl } = await loadSite("https://prx.example/");
    expect(absoluteUrl(path)).toBe(expected);
  });

  it("never produces a double slash after the origin", async () => {
    const { absoluteUrl } = await loadSite("https://prx.example//");
    for (const path of ["/a", "a", "/", ""]) {
      expect(absoluteUrl(path).slice("https://".length)).not.toContain("//");
    }
  });
});
