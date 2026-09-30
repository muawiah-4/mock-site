import type { Metadata } from "next";

/**
 * Canonical origin for absolute URLs (canonicals, sitemap, JSON-LD, OG).
 * There's no production domain yet — set NEXT_PUBLIC_SITE_URL at deploy time.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const SITE_NAME = "TISSOT PRX Concept";

export const SITE_DEFAULT_TITLE = "TISSOT PRX — Every second, engineered in the open.";

export const SITE_DESCRIPTION =
  "An unofficial design concept exploring the TISSOT PRX: a scroll-driven exploded-view construction story, a hands-on case viewer, a live configurator, and the full PRX collection.";

/** Existing product photo under /public, used when a page has no image of its own. */
export const DEFAULT_OG_IMAGE = {
  url: "/watches/prx-blue-powermatic-flat.jpg",
  alt: "TISSOT PRX Powermatic 80 with blue dial on the integrated steel bracelet",
};

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Per-page metadata with a canonical plus full openGraph/twitter blocks.
 * Next merges these objects shallowly (a child's openGraph replaces the
 * parent's wholesale), so every page needs the complete set.
 */
export function pageMetadata({
  title,
  socialTitle,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
}: {
  /** Document title; string goes through the root template, `{ absolute }` bypasses it. */
  title: Metadata["title"];
  /** Title for OG/Twitter cards (no template applied there). */
  socialTitle: string;
  description: string;
  path: string;
  image?: { url: string; alt: string };
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: socialTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image.url],
    },
  };
}
