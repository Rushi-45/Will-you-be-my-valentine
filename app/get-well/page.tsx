import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { getOccasion } from "@/config/occasions";

const occasion = getOccasion("get-well");

export const metadata: Metadata = {
  title: `${occasion.name} — Wishing Cards`,
  description: occasion.description,
};

export default function GetWellPage() {
  return <ComingSoon occasion={occasion} />;
}
