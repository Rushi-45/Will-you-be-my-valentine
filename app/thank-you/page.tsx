import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { getOccasion } from "@/config/occasions";

const occasion = getOccasion("thank-you");

export const metadata: Metadata = {
  title: `${occasion.name} — Wishing Cards`,
  description: occasion.description,
};

export default function ThankYouPage() {
  return <ComingSoon occasion={occasion} />;
}
