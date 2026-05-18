import type { Metadata } from "next";
import { Suspense } from "react";
import { ValentinePage } from "@/components/ValentinePage";
import { valentineConfig } from "@/config/valentine";
import { OccasionSeoCopy } from "@/components/OccasionSeoCopy";
import { occasionSeoContent } from "@/config/seo-content";

type PageProps = {
  searchParams: Promise<{ name?: string }> | { name?: string };
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await Promise.resolve(searchParams);
  const name = params?.name?.trim();
  if (!name) {
    return {
      title: "Will You Be My Valentine?",
      description: "Send a personalized, animated Valentine's card — impossible to say no to.",
      openGraph: { type: "website" },
      twitter: { card: "summary_large_image" },
    };
  }
  const title = `${capitalize(name)}, will you be my Valentine?`;
  const description = `A special Valentine's card made just for ${capitalize(name)}.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function ValentinesRoute() {
  return (
    <>
      <Suspense fallback={null}>
        <ValentinePage />
      </Suspense>
      <OccasionSeoCopy content={occasionSeoContent.valentines} />
    </>
  );
}
