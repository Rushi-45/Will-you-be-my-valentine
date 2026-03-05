import { memo, useMemo } from "react";

type AvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
} as const;

const COLOR_PAIRS = [
  { bg: "bg-rose-500", text: "text-white" },
  { bg: "bg-pink-500", text: "text-white" },
  { bg: "bg-red-500", text: "text-white" },
  { bg: "bg-fuchsia-500", text: "text-white" },
  { bg: "bg-magenta-500", text: "text-white" },
  { bg: "bg-coral-500", text: "text-white" },
] as const;

function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % COLOR_PAIRS.length;
}

export const Avatar = memo(function Avatar({
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const initials = useMemo(() => getInitials(name), [name]);
  const colorIndex = useMemo(() => getColorIndex(name), [name]);
  const colors = COLOR_PAIRS[colorIndex];
  const sizeClass = SIZE_CLASSES[size];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold ${colors.bg} ${colors.text} ${sizeClass} ${className}`}
      aria-label={`Avatar for ${name}`}
      title={name}
    >
      {initials}
    </span>
  );
});
