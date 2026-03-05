"use client";

import { memo, isValidElement } from "react";
import type { LucideIcon } from "lucide-react";

export type IconVariant = "primary" | "secondary" | "success" | "danger" | "warning";
export type IconSize = "sm" | "md" | "lg";

export interface IconProps {
  /** The icon to display (Lucide icon component or custom React node) */
  icon: LucideIcon | React.ReactNode;
  /** Visual variant of the icon */
  variant?: IconVariant;
  /** Size of the icon */
  size?: IconSize;
  /** Whether the icon is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label */
  "aria-label"?: string;
  /** Click handler */
  onClick?: () => void;
}

const VARIANT_STYLES: Record<IconVariant, { bg: string; text: string }> = {
  primary: {
    bg: "bg-[var(--primary)]",
    text: "text-white",
  },
  secondary: {
    bg: "bg-[var(--secondary)]",
    text: "text-white",
  },
  success: {
    bg: "bg-[var(--success)]",
    text: "text-white",
  },
  danger: {
    bg: "bg-[var(--danger)]",
    text: "text-white",
  },
  warning: {
    bg: "bg-[var(--warning)]",
    text: "text-white",
  },
};

const SIZE_STYLES: Record<IconSize, { container: string; icon: string }> = {
  sm: {
    container: "h-8 w-8",
    icon: "h-4 w-4",
  },
  md: {
    container: "h-10 w-10",
    icon: "h-5 w-5",
  },
  lg: {
    container: "h-12 w-12",
    icon: "h-6 w-6",
  },
};

const SIZE_MAP: Record<string, number> = {
  "h-4 w-4": 16,
  "h-5 w-5": 20,
  "h-6 w-6": 24,
};

/**
 * Icon component with circular background.
 * Supports multiple variants, sizes, and disabled state.
 */
export const Icon = memo(function Icon({
  icon: IconNode,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
  onClick,
}: IconProps) {
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];
  const iconSize = SIZE_MAP[sizeStyle.icon] || 20;

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick?.();
    }
  };

  // If it's already a React element (JSX), render it directly
  if (isValidElement(IconNode)) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full ${variantStyle.bg} ${variantStyle.text} ${sizeStyle.container} ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${className}`}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        role={disabled ? "img" : "button"}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <span className={sizeStyle.icon}>{IconNode}</span>
      </span>
    );
  }

  // Otherwise treat it as a component type and instantiate it
  const IconComponent = IconNode as React.ComponentType<{ size?: number; className?: string }>;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${variantStyle.bg} ${variantStyle.text} ${sizeStyle.container} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      role={disabled ? "img" : "button"}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <IconComponent size={iconSize} className={sizeStyle.icon} />
    </span>
  );
});

export default Icon;
