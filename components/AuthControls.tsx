"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

/**
 * Auth control for the landing-page floating header area.
 * Renders Sign-in pill when signed out, UserButton when signed in.
 * The shared `Header` component embeds the same controls inline.
 */
export function AuthControls() {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return null;

  if (isSignedIn) return <UserButton />;

  return (
    <SignInButton mode="modal">
      <button
        type="button"
        className="inline-flex cursor-pointer items-center rounded-full border border-stone-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Sign in
      </button>
    </SignInButton>
  );
}
