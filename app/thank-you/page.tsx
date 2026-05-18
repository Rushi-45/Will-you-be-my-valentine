import type { Metadata } from "next";
import { Suspense } from "react";
import { ThankYouPage } from "@/components/ThankYouPage";

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
    return { title: "Thank You — Wishing Cards" };
  }

  const title = `Thank You, ${capitalize(name)}!`;
  const description = `A heartfelt thank you message for ${capitalize(name)}.`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default function ThankYouRoute() {
  return (
    <Suspense fallback={null}>
      <ThankYouPage />
    </Suspense>
  );
}
