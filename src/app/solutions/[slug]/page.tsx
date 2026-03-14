import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sectors, getSectorBySlug } from "@/data/sectors";
import SectorDetail from "./SectorDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return sectors.map((sector) => ({
    slug: sector.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);
  if (!sector) return {};

  return {
    title: `${sector.title} — Textile Solutions`,
    description: sector.description,
  };
}

export default async function SectorPage({ params }: Props) {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);

  if (!sector) {
    notFound();
  }

  return <SectorDetail sector={sector} />;
}
