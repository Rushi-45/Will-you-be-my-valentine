import type { Metadata } from "next";
import { Suspense } from "react";
import { ValentinePage } from "@/components/ValentinePage";
import { valentineConfig } from "@/config/valentine";

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
  if (!name) return {};
  const title = `${capitalize(name)}, will you be my Valentine?`;
  const description = `A special Valentine's request for ${capitalize(name)}.`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <ValentinePage />
    </Suspense>
  );
}
