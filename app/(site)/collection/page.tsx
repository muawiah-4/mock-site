import type { Metadata } from "next";
import Link from "next/link";
import { COLLECTIONS } from "@/lib/catalog";
import CollectionGrid from "@/components/CollectionGrid";
import Footer from "@/components/Footer";
import GhostHeading from "@/components/GhostHeading";

export const metadata: Metadata = {
  title: "All Collections — TISSOT",
  description: "Browse every current TISSOT collection: PRX, Gentleman, Seastar, Everytime, T-Touch, and Heritage.",
};

export default function CollectionPage() {
  return (
    <main>
      <section className="tail-fade hairline-grid relative overflow-hidden px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <GhostHeading tone="dark" align="right" className="top-4 opacity-70 md:top-8">
          COLLECTIONS
        </GhostHeading>
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--navy)]">
            All Collections
          </div>
          <h1 className="text-gradient max-w-2xl text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-tight">
            Six collections. One watchmaker.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--ink-600)] md:text-[16px]">
            From the integrated-bracelet icon that is PRX to dive-rated tool watches and archive reissues —
            every current TISSOT line, in one place.
          </p>
        </div>
      </section>

      {COLLECTIONS.map((c) => (
        <section key={c.id} id={c.id} className="scroll-mt-24 bg-[var(--bg-0)] px-6 py-14 md:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold tracking-tight text-[var(--ink-900)]">
                  {c.name}
                </h2>
                <p className="mt-1 text-[13px] text-[var(--ink-400)]">{c.tagline}</p>
              </div>
              <Link
                href={`/collection/${c.id}`}
                className="hidden shrink-0 text-[13px] font-medium text-[var(--navy)] underline underline-offset-4 md:block"
              >
                View {c.name}
              </Link>
            </div>
            <CollectionGrid collectionId={c.id} limit={4} />
          </div>
        </section>
      ))}

      <Footer />
    </main>
  );
}
