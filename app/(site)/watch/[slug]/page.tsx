import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATALOG, getVariant } from "@/lib/catalog";
import ProductDetail from "@/components/ProductDetail";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return CATALOG.map((v) => ({ slug: v.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const variant = getVariant(params.slug);
  if (!variant) return { title: "PRX — TISSOT" };
  return {
    title: `${variant.name} — ${variant.dial.label} | TISSOT PRX`,
    description: variant.blurb,
  };
}

export default function WatchPage({ params }: { params: { slug: string } }) {
  const variant = getVariant(params.slug);
  if (!variant) notFound();

  return (
    <>
      <ProductDetail variant={variant} />
      <Footer />
    </>
  );
}
