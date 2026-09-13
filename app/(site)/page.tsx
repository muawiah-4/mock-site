import Experience from "@/components/Experience";
import BlueDialExperience from "@/components/BlueDialExperience";
import StorySections from "@/components/StorySections";
import FlagshipShowcase from "@/components/FlagshipShowcase";
import LifestyleMoment from "@/components/LifestyleMoment";
import TechnicalExploration from "@/components/TechnicalExploration";
import Configurator from "@/components/Configurator";
import EditorialShowcase from "@/components/EditorialShowcase";
import ScatteredGallery from "@/components/ScatteredGallery";
import CollectionGrid from "@/components/CollectionGrid";
import NewsCarousel from "@/components/NewsCarousel";
import StoreLocator from "@/components/StoreLocator";
import SectionDivider from "@/components/SectionDivider";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Experience />

      <BlueDialExperience />

      <StorySections />
      <SectionDivider />
      <FlagshipShowcase />

      <LifestyleMoment />

      <TechnicalExploration />

      <SectionDivider />
      <Configurator />

      <ScatteredGallery />

      <EditorialShowcase />

      <section id="collection" className="scroll-mt-24 bg-[var(--bg-0)] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div className="max-w-xl">
              <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--navy)]">
                Beyond PRX
              </div>
              <h3 className="text-gradient text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-tight">
                Six collections. One watchmaker.
              </h3>
            </div>
            <Link
              href="/collection"
              className="hidden shrink-0 text-[13px] font-medium text-[var(--navy)] underline underline-offset-4 md:block"
            >
              View all collections
            </Link>
          </div>
          <CollectionGrid limit={8} />
          <Link
            href="/collection"
            className="mt-8 block text-center text-[13px] font-medium text-[var(--navy)] underline underline-offset-4 md:hidden"
          >
            View all collections
          </Link>
        </div>
      </section>

      <NewsCarousel />

      <StoreLocator />
      <Footer />
    </main>
  );
}
