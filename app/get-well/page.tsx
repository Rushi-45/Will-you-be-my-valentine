import type { Metadata } from "next";
import { Suspense } from "react";
import { GetWellPage } from "@/components/GetWellPage";
import { OccasionSeoCopy } from "@/components/OccasionSeoCopy";
import { occasionSeoContent } from "@/config/seo-content";

type PageProps = {
  searchParams: Promise<{ name?: string; sender?: string }> | { name?: string; sender?: string };
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await Promise.resolve(searchParams);
  const name = params?.name?.trim();

  if (!name) {
    return {
      title: "Get Well Soon",
      description: "Send a warm, personalized get-well card. Remind them that tough days don't last forever.",
      openGraph: { type: "website" },
      twitter: { card: "summary_large_image" },
    };
  }

  const title = `Get Well Soon, ${capitalize(name)}!`;
  const description = `A warm get-well card made just for ${capitalize(name)}.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function GetWellRoute() {
  return (
    <>
      <Suspense fallback={null}>
        <GetWellPage />
      </Suspense>
      <OccasionSeoCopy content={occasionSeoContent["get-well"]} />
    </>
  );
}
