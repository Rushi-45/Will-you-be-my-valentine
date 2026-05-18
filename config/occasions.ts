import {
  Heart,
  Cake,
  Gift,
  GraduationCap,
  MessageCircleHeart,
  Stethoscope,
  Star,
  type LucideIcon,
} from "lucide-react";

export type OccasionSlug =
  | "valentines"
  | "birthday"
  | "anniversary"
  | "graduation"
  | "thank-you"
  | "get-well"
  | "congratulations";

export type Occasion = {
  name: string;
  slug: OccasionSlug;
  description: string;
  icon: LucideIcon;
  gradient: string;
  bgGradient: string;
  implemented: boolean;
};

export const occasions: readonly Occasion[] = [
  {
    name: "Valentine's Day",
    slug: "valentines",
    description: "Ask someone to be your Valentine",
    icon: Heart,
    gradient: "from-rose-500 via-pink-500 to-rose-600",
    bgGradient: "from-rose-50 to-pink-50",
    implemented: true,
  },
  {
    name: "Birthday",
    slug: "birthday",
    description: "Celebrate their special day",
    icon: Cake,
    gradient: "from-blue-500 via-cyan-500 to-blue-600",
    bgGradient: "from-blue-50 to-cyan-50",
    implemented: true,
  },
  {
    name: "Anniversary",
    slug: "anniversary",
    description: "Celebrate your love story",
    icon: Gift,
    gradient: "from-purple-500 via-fuchsia-500 to-purple-600",
    bgGradient: "from-purple-50 to-fuchsia-50",
    implemented: true,
  },
  {
    name: "Graduation",
    slug: "graduation",
    description: "Congratulate their achievement",
    icon: GraduationCap,
    gradient: "from-amber-500 via-orange-500 to-amber-600",
    bgGradient: "from-amber-50 to-orange-50",
    implemented: true,
  },
  {
    name: "Thank You",
    slug: "thank-you",
    description: "Show your gratitude",
    icon: MessageCircleHeart,
    gradient: "from-emerald-500 via-teal-500 to-emerald-600",
    bgGradient: "from-emerald-50 to-teal-50",
    implemented: true,
  },
  {
    name: "Get Well",
    slug: "get-well",
    description: "Wish them a speedy recovery",
    icon: Stethoscope,
    gradient: "from-green-500 via-lime-500 to-green-600",
    bgGradient: "from-green-50 to-lime-50",
    implemented: true,
  },
  {
    name: "Congratulations",
    slug: "congratulations",
    description: "Celebrate their big news",
    icon: Star,
    gradient: "from-indigo-500 via-violet-500 to-indigo-600",
    bgGradient: "from-indigo-50 to-violet-50",
    implemented: false,
  },
] as const;

export function getOccasion(slug: OccasionSlug): Occasion {
  const found = occasions.find((o) => o.slug === slug);
  if (!found) throw new Error(`Unknown occasion slug: ${slug}`);
  return found;
}
