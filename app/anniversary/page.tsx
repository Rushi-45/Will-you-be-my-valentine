import type { Metadata } from "next";
import { Suspense } from "react";
import { AnniversaryPage } from "@/components/AnniversaryPage";

type PageProps = {
  searchParams: Promise<{ name?: string; sender?: string; years?: string }> | { name?: string; sender?: string; years?: string };
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await Promise.resolve(searchParams);
  const name = params?.name?.trim();
  const rawYears = params?.years?.trim();
  const years = rawYears ? parseInt(rawYears, 10) : null;
  const yearsLabel = years && Number.isFinite(years) && years > 0 ? ` ${ordinal(years)}` : "";

  if (!name) {
    return {
      title: "Happy Anniversary",
      description: "Send a personalized, animated anniversary card. Open the envelope and celebrate your love.",
      openGraph: { type: "website" },
      twitter: { card: "summary_large_image" },
    };
  }

  const title = `Happy${yearsLabel} Anniversary, ${capitalize(name)}!`;
  const description = `A special anniversary card made just for ${capitalize(name)}.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function AnniversaryRoute() {
  return (
    <Suspense fallback={null}>
      <AnniversaryPage />
    </Suspense>
  );
}
