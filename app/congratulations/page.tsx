import type { Metadata } from "next";
import { Suspense } from "react";
import { CongratulationsPage } from "@/components/CongratulationsPage";

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
    return { title: "Congratulations — Wishing Cards" };
  }

  const title = `Congratulations, ${capitalize(name)}!`;
  const description = `A heartfelt congratulations message for ${capitalize(name)}.`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default function CongratulationsRoute() {
  return (
    <Suspense fallback={null}>
      <CongratulationsPage />
    </Suspense>
  );
}
