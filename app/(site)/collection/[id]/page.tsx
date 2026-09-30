import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COLLECTIONS, getCollection, variantsForCollection } from "@/lib/catalog";
import CollectionGrid from "@/components/CollectionGrid";
import Footer from "@/components/Footer";
import { SITE_NAME, pageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const collection = getCollection(params.id);
  // The page itself calls notFound(); keep this unindexable and canonical-free.
  if (!collection) return { title: "Collection not found", robots: { index: false } };
  const lead = variantsForCollection(collection.id).find((v) => v.heroImage);
  return pageMetadata({
    title: `${collection.name} Collection`,
    socialTitle: `${collection.name} Collection · ${SITE_NAME}`,
    description: collection.description,
    path: `/collection/${collection.id}`,
    image:
      lead && lead.heroImage
        ? { url: lead.heroImage, alt: `${lead.name} — ${lead.dial.label}` }
        : undefined,
  });
}

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
  const collection = getCollection(params.id);
  if (!collection) notFound();
  const variants = variantsForCollection(params.id);

  return (
    <main>
      <section className="tail-fade px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--navy)]">
            Collection
          </div>
          <h1 className="text-gradient max-w-2xl text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-tight">
            {collection.name}
          </h1>
          <p className="mt-3 max-w-xl text-[16px] font-medium text-[var(--ink-600)]">{collection.tagline}</p>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--ink-600)]">{collection.description}</p>
        </div>
      </section>

      <section className="bg-[var(--bg-0)] px-6 pb-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          {variants.length > 0 ? (
            <CollectionGrid collectionId={collection.id} />
          ) : (
            <p className="py-16 text-center text-[14px] text-[var(--ink-400)]">
              References for this collection are coming soon.
            </p>
          )}
          <div className="mt-12 text-center">
            <Link href="/collection" className="text-[13px] font-medium text-[var(--navy)] underline underline-offset-4">
              View all collections
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
