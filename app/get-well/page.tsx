import type { Metadata } from "next";
import { Suspense } from "react";
import { GetWellPage } from "@/components/GetWellPage";

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
    return { title: "Get Well Soon — Wishing Cards" };
  }

  const title = `Get Well Soon, ${capitalize(name)}!`;
  const description = `A heartfelt get-well message for ${capitalize(name)}.`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default function GetWellRoute() {
  return (
    <Suspense fallback={null}>
      <GetWellPage />
    </Suspense>
  );
}
