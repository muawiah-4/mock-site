import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATALOG, getCollection, getVariant } from "@/lib/catalog";
import ProductDetail from "@/components/ProductDetail";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, absoluteUrl, pageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return CATALOG.map((v) => ({ slug: v.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const variant = getVariant(params.slug);
  // The page itself calls notFound(); keep this unindexable and canonical-free.
  if (!variant) return { title: "Watch not found", robots: { index: false } };
  // Several references share a model name, so the dial keeps titles unique.
  const name = `${variant.name} — ${variant.dial.label}`;
  return pageMetadata({
    title: name,
    socialTitle: `${name} · ${SITE_NAME}`,
    description: variant.blurb,
    path: `/watch/${variant.slug}`,
    image: variant.heroImage ? { url: variant.heroImage, alt: name } : undefined,
  });
}

export default function WatchPage({ params }: { params: { slug: string } }) {
  const variant = getVariant(params.slug);
  if (!variant) notFound();
  const collection = getCollection(variant.collectionId);

  const crumbs = [
    { name: "Home", url: absoluteUrl("/") },
    { name: "Collections", url: absoluteUrl("/collection") },
    ...(collection ? [{ name: collection.name, url: absoluteUrl(`/collection/${collection.id}`) }] : []),
    { name: `${variant.name} — ${variant.dial.label}`, url: absoluteUrl(`/watch/${variant.slug}`) },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: c.url,
          })),
        }}
      />
      <ProductDetail variant={variant} />
      <Footer />
    </>
  );
}
