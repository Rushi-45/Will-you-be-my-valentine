"use client";

import Icon from "@/components/ui/Icon";
import { Heart, Check, X, AlertTriangle, Star, Settings, User, Home, Menu } from "lucide-react";

export default function PreviewPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] p-8">
      <h1 className="text-3xl font-bold mb-8 text-[var(--foreground)]">
        Icon Component Preview
      </h1>

      {/* Variants Section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
          Variants (size: md)
        </h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon icon={Heart} variant="primary" aria-label="Primary icon" />
            <span className="text-sm text-[var(--muted)]">primary</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={Star} variant="secondary" aria-label="Secondary icon" />
            <span className="text-sm text-[var(--muted)]">secondary</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={Check} variant="success" aria-label="Success icon" />
            <span className="text-sm text-[var(--muted)]">success</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={X} variant="danger" aria-label="Danger icon" />
            <span className="text-sm text-[var(--muted)]">danger</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={AlertTriangle} variant="warning" aria-label="Warning icon" />
            <span className="text-sm text-[var(--muted)]">warning</span>
          </div>
        </div>
      </section>

      {/* Sizes Section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
          Sizes (variant: primary)
        </h2>
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon icon={Home} size="sm" aria-label="Small icon" />
            <span className="text-sm text-[var(--muted)]">sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={User} aria-label="Medium icon" />
            <span className="text-sm text-[var(--muted)]">md (default)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={Settings} size="lg" aria-label="Large icon" />
            <span className="text-sm text-[var(--muted)]">lg</span>
          </div>
        </div>
      </section>

      {/* Disabled State Section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
          Disabled State
        </h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon icon={Heart} variant="primary" disabled aria-label="Disabled primary" />
            <span className="text-sm text-[var(--muted)]">primary</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={Check} variant="success" disabled aria-label="Disabled success" />
            <span className="text-sm text-[var(--muted)]">success</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={X} variant="danger" disabled aria-label="Disabled danger" />
            <span className="text-sm text-[var(--muted)]">danger</span>
          </div>
        </div>
      </section>

      {/* All Combinations Section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
          All Combinations
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {(["primary", "secondary", "success", "danger", "warning"] as const).map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <div className="flex gap-2">
                <Icon icon={Menu} variant={variant} size="sm" aria-label={`${variant} sm`} />
                <Icon icon={Menu} variant={variant} aria-label={`${variant} md`} />
                <Icon icon={Menu} variant={variant} size="lg" aria-label={`${variant} lg`} />
              </div>
              <span className="text-sm text-[var(--muted)]">{variant}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
          Interactive Demo (click the icons)
        </h2>
        <div className="flex flex-wrap gap-4">
          <Icon
            icon={Heart}
            variant="primary"
            onClick={() => console.log("Heart clicked!")}
            aria-label="Click me"
          />
          <Icon
            icon={Star}
            variant="warning"
            onClick={() => console.log("Star clicked!")}
            aria-label="Click me"
          />
          <Icon
            icon={Check}
            variant="success"
            onClick={() => console.log("Check clicked!")}
            aria-label="Click me"
          />
        </div>
      </section>
    </main>
  );
}
