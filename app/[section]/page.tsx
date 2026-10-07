import type { Metadata } from "next";
import { Site } from "@/components/site";
import { sections } from "@/lib/data";

// only the real sections get a page — anything else is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return sections.map((s) => ({ section: s.id }));
}

type Props = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const label = sections.find((s) => s.id === section)?.label;
  return { title: `${label} — Manikandan B` };
}

export default async function SectionPage({ params }: Props) {
  const { section } = await params;
  return <Site section={section} />;
}
