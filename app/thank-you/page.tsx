import type { Metadata } from "next";
import { Suspense } from "react";
import { ThankYouPage } from "@/components/ThankYouPage";
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
      title: "Thank You",
      description: "Send a heartfelt, personalized thank-you card. Let them know you see what they did for you.",
      openGraph: { type: "website" },
      twitter: { card: "summary_large_image" },
    };
  }

  const title = `Thank You, ${capitalize(name)}!`;
  const description = `A heartfelt thank-you card made just for ${capitalize(name)}.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function ThankYouRoute() {
  return (
    <>
      <Suspense fallback={null}>
        <ThankYouPage />
      </Suspense>
      <OccasionSeoCopy content={occasionSeoContent["thank-you"]} />
    </>
  );
}
