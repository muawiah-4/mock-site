import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "TISSOT PRX — Every second, engineered in the open.",
  description:
    "The TISSOT PRX, explored: a scroll-driven exploded-view construction story, a hands-on case viewer, a live configurator, and the full PRX collection.",
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
        {children}
      </body>
    </html>
  );
}
