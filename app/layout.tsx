import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";
import { analyticsConfig } from "@/lib/analytics";
import { DEFAULT_OG_IMAGE, SITE_DEFAULT_TITLE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_DEFAULT_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title: SITE_DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {/* Chrome restores the previous scroll position on a plain reload
            by default, which fights the pinned scrollytelling hero — a
            refresh should land back at the top, like a fresh visit, not
            wherever the scroll happened to be. Runs before hydration so
            there's no visible jump-then-correct. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; } window.scrollTo(0, 0);",
          }}
        />
        <MotionProvider>{children}</MotionProvider>
        {/* Opt-in, cookieless Umami — rendered only when NEXT_PUBLIC_UMAMI_WEBSITE_ID is set. */}
        {analyticsConfig && (
          <Script
            src={analyticsConfig.scriptUrl}
            data-website-id={analyticsConfig.websiteId}
            data-do-not-track="true"
            {...(analyticsConfig.domain ? { "data-domains": analyticsConfig.domain } : {})}
            strategy="afterInteractive"
            defer
          />
        )}
      </body>
    </html>
  );
}
