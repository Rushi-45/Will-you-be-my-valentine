import type { Metadata } from "next";
import { Suspense } from "react";
import { CongratulationsPage } from "@/components/CongratulationsPage";
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
      title: "Congratulations",
      description: "Send a personalized congratulations card. Pop the party popper and celebrate their achievement!",
      openGraph: { type: "website" },
      twitter: { card: "summary_large_image" },
    };
  }

  const title = `Congratulations, ${capitalize(name)}!`;
  const description = `A special congratulations card made just for ${capitalize(name)}.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function CongratulationsRoute() {
  return (
    <>
      <Suspense fallback={null}>
        <CongratulationsPage />
      </Suspense>
      <OccasionSeoCopy content={occasionSeoContent.congratulations} />
    </>
  );
}
