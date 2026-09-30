import Link from "next/link";
import Footer from "@/components/Footer";
import GhostHeading from "@/components/GhostHeading";

/**
 * Root 404. It renders inside the root layout only — the (site) group layout
 * (Header, cart) doesn't wrap it, and Header needs the cart context — so this
 * page carries its own minimal top bar and the site footer.
 */
export default function NotFound() {
  return (
    <>
      <div className="flex h-16 items-center px-5 md:px-8">
        <Link href="/" className="text-[15px] font-semibold tracking-[0.18em] text-[var(--ink-900)]">
          TISSOT
        </Link>
      </div>

      <main>
        <section className="tail-fade hairline-grid relative overflow-hidden px-6 pb-24 pt-20 md:px-10 md:pb-32 md:pt-28">
          <GhostHeading tone="light" align="right" className="top-4 opacity-70 md:top-8">
            404
          </GhostHeading>
          <div className="relative mx-auto max-w-6xl">
            <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--navy)]">
              Error 404
            </div>
            <h1 className="text-gradient max-w-2xl text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-tight">
              This page has lost its time.
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--ink-600)] md:text-[16px]">
              The page you were looking for doesn&rsquo;t exist or has moved. Start again from the PRX story, or
              browse every collection.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="btn-primary inline-block rounded-full px-7 py-3 text-[14px] font-medium text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                Back to home
              </Link>
              <Link
                href="/collection"
                className="text-[14px] font-medium text-[var(--ink-900)] underline decoration-[var(--navy)]/40 underline-offset-4 transition hover:decoration-[var(--navy)]"
              >
                View all collections
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
