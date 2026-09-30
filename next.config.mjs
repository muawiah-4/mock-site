import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy.
 *
 * Every asset is same-origin (next/font self-hosts Inter; images and video
 * live under /public), so no external origins are allowed.
 *
 * script-src keeps 'unsafe-inline' because Next.js injects inline bootstrap
 * scripts and app/layout.tsx has an inline scroll-restoration script. A
 * nonce-based CSP would need middleware and force every page to render
 * dynamically, losing static generation. For a static marketing site with no
 * user-generated content and no DOM sinks fed by untrusted input, that trade
 * isn't worth it; the residual risk is that an injection bug introduced later
 * would not be blocked by CSP. Dev additionally needs 'unsafe-eval' (React
 * Refresh) and ws: for HMR.
 *
 * upgrade-insecure-requests is deliberately omitted: it breaks `next start`
 * over plain http://localhost, and HSTS covers the production case.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // interest-cohort (FLoC) is no longer a recognised feature and only
  // produces console warnings, so it is left out.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Lint the test suite too (next lint skips tests/ by default).
  eslint: { dirs: ["app", "components", "lib", "tests"] },
  // Pin the tracing root to this project so a stray lockfile higher up the
  // filesystem is not mistaken for the workspace root.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  // next/image is not used anywhere; disabling the optimizer makes
  // /_next/image return 404, which removes the attack surface of the
  // open Image Optimization API advisories on Next 14.2.x.
  images: { unoptimized: true },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
