import type { Metadata } from "next";
import { Suspense } from "react";
import { BirthdayPage } from "@/components/BirthdayPage";

type PageProps = {
  searchParams: Promise<{ name?: string; sender?: string; age?: string }> | { name?: string; sender?: string; age?: string };
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
  const rawAge = params?.age?.trim();
  const age = rawAge ? parseInt(rawAge, 10) : null;
  const ageLabel = age && Number.isFinite(age) && age > 0 ? ` ${ordinal(age)}` : "";

  if (!name) {
    return {
      title: "Happy Birthday",
      description: "Send a personalized, animated birthday card. Blow out the candles and make a wish!",
      openGraph: { type: "website" },
      twitter: { card: "summary_large_image" },
    };
  }

  const title = `Happy${ageLabel} Birthday, ${capitalize(name)}!`;
  const description = `A special birthday card made just for ${capitalize(name)}. Blow out the candles and make a wish!`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function BirthdayRoute() {
  return (
    <Suspense fallback={null}>
      <BirthdayPage />
    </Suspense>
  );
}
