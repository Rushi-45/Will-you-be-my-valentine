import type { Metadata } from "next";
import { Suspense } from "react";
import { GraduationPage } from "@/components/GraduationPage";
import { OccasionSeoCopy } from "@/components/OccasionSeoCopy";
import { occasionSeoContent } from "@/config/seo-content";

type PageProps = {
  searchParams: Promise<{ name?: string; sender?: string; year?: string }> | { name?: string; sender?: string; year?: string };
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await Promise.resolve(searchParams);
  const name = params?.name?.trim();
  const rawYear = params?.year?.trim();
  const year = rawYear ? parseInt(rawYear, 10) : null;
  const validYear = year && Number.isFinite(year) && year > 1900 && year < 2200 ? year : null;

  if (!name) {
    return {
      title: "Congratulations, Graduate",
      description: "Send a personalized graduation card. Toss your cap and celebrate the milestone!",
      openGraph: { type: "website" },
      twitter: { card: "summary_large_image" },
    };
  }

  const eyebrow = validYear ? `Class of ${validYear}` : "Congratulations";
  const title = `${eyebrow}, ${capitalize(name)}!`;
  const description = `A special graduation card made just for ${capitalize(name)}.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function GraduationRoute() {
  return (
    <>
      <Suspense fallback={null}>
        <GraduationPage />
      </Suspense>
      <OccasionSeoCopy content={occasionSeoContent.graduation} />
    </>
  );
}
