"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Heart, Instagram, Link2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { getWellConfig, replaceSenderName } from "@/config/get-well";
import { Avatar } from "@/components/Avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";

// ─── constants ────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_OUT = [0.4, 0, 0.2, 1] as const;

type Phase = "wilted" | "healing" | "revealed";

// ─── helpers ──────────────────────────────────────────────────────────────────

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// ─── SunflowerSVG ─────────────────────────────────────────────────────────────
// Wilted: stem droops (rotate -35°, skewX), petals small
// Healed: stem upright, petals fully open

function SunflowerSVG({ healed }: { healed: boolean }) {
  const PETAL_COUNT = 12;
  const petalAngles = Array.from(
    { length: PETAL_COUNT },
    (_, i) => (i * 360) / PETAL_COUNT,
  );

  return (
    <div className="relative flex h-64 w-48 flex-col items-center justify-end">
      {/* Leaves */}
      <motion.div
        className="absolute bottom-[38%] left-[18%] h-7 w-12 rounded-full bg-green-400 dark:bg-green-500"
        style={{ rotate: -40, transformOrigin: "right center" }}
        animate={{ scaleX: healed ? 1 : 0.55, opacity: healed ? 1 : 0.45 }}
        transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
      />
      <motion.div
        className="absolute bottom-[52%] right-[14%] h-6 w-10 rounded-full bg-green-400 dark:bg-green-500"
        style={{ rotate: 40, transformOrigin: "left center" }}
        animate={{ scaleX: healed ? 1 : 0.5, opacity: healed ? 1 : 0.4 }}
        transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
      />

      {/* Stem — tilted when wilted, upright when healed */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-40 w-3 -translate-x-1/2 rounded-full bg-green-500 dark:bg-green-600"
        style={{ transformOrigin: "bottom center" }}
        animate={{ rotate: healed ? 0 : -28, scaleY: healed ? 1 : 0.88 }}
        transition={{
          rotate: { duration: 0.9, delay: 0, ease: EASE },
          scaleY: { duration: 0.7, ease: EASE },
        }}
      />

      {/* Flower head — positioned at top of stem */}
      <motion.div
        className="absolute"
        style={{ bottom: "calc(40% + 48px)", left: "50%", x: "-50%" }}
        animate={{
          rotate: healed ? 0 : -28,
          y: healed ? 0 : 14,
        }}
        transition={{ duration: 0.9, delay: 0, ease: EASE }}
      >
        {/* Petals container */}
        <div className="relative h-24 w-24">
          {petalAngles.map((angle, i) => (
            <motion.div
              key={angle}
              className="absolute h-9 w-4 rounded-full bg-yellow-300 dark:bg-yellow-400"
              style={{
                bottom: "50%",
                left: "calc(50% - 8px)",
                transformOrigin: "bottom center",
                rotate: angle,
              }}
              animate={{
                scaleY: healed ? 1 : 0.22,
                scaleX: healed ? 1 : 0.6,
                opacity: healed ? 1 : 0.35,
              }}
              transition={{
                duration: 0.55,
                delay: healed ? 0.35 + i * 0.04 : 0,
                ease: EASE,
              }}
            />
          ))}

          {/* Center disc */}
          <motion.div
            className="absolute left-1/2 top-1/2 z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-800 shadow-[0_2px_8px_-2px_rgba(120,53,15,0.4)] dark:bg-amber-900"
            animate={{ scale: healed ? 1.1 : 0.7 }}
            transition={{ duration: 0.5, delay: healed ? 0.5 : 0, ease: EASE }}
          />
        </div>
      </motion.div>
    </div>
  );
}

// ─── GetWellPage ──────────────────────────────────────────────────────────────

export function GetWellPage() {
  const searchParams = useSearchParams();

  const recipientName = useMemo(() => {
    const raw = searchParams.get("name")?.trim();
    return raw ? capitalize(raw) : null;
  }, [searchParams]);

  const senderName = useMemo(() => {
    const raw = searchParams.get("sender")?.trim();
    return raw ? capitalize(raw) : getWellConfig.senderName;
  }, [searchParams]);

  const headlineWords = useMemo(() => {
    const text = recipientName
      ? `Get well soon, ${recipientName}!`
      : `${getWellConfig.headline}!`;
    return text.split(" ");
  }, [recipientName]);

  const [phase, setPhase] = useState<Phase>("wilted");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
  }, []);

  const handleHeal = useCallback(async () => {
    if (phase !== "wilted") return;
    setPhase("healing");

    // Confetti — green healing shower
    setTimeout(async () => {
      const { default: confetti } = await import("canvas-confetti");
      const colors = [
        "#22c55e",
        "#4ade80",
        "#86efac",
        "#16a34a",
        "#bbf7d0",
        "#fbbf24",
        "#ffffff",
      ];
      confetti({
        particleCount: 70,
        spread: 90,
        origin: { x: 0.5, y: 0.38 },
        colors,
        startVelocity: 48,
      });
      setTimeout(() => {
        confetti({
          particleCount: 35,
          spread: 65,
          angle: 125,
          origin: { x: 0.65, y: 0.5 },
          colors,
          startVelocity: 35,
        });
      }, 220);
    }, 600);

    setTimeout(() => setPhase("revealed"), 1100);
  }, [phase]);

  const handleCopyLink = useCallback(() => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareUrl]);

  const whatsAppUrl = useMemo(() => {
    if (!shareUrl) return "#";
    return `https://wa.me/?text=${encodeURIComponent(`🌻 ${shareUrl}`)}`;
  }, [shareUrl]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-green-50/60 pb-20 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-16 text-stone-800 sm:px-5 sm:pb-24 sm:pt-20 dark:bg-slate-950/70 dark:text-slate-100">
      {/* Ambient glow rings */}
      <div
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        {([360, 500, 640] as const).map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-green-300/25 dark:border-green-700/20"
            style={{ width: size, height: size }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.1, 0.6] }}
            transition={{
              duration: 4.0,
              delay: i * 0.95,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Back link */}
      <div className="fixed left-4 top-4 z-40 sm:left-6 sm:top-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-green-200/70 bg-white/90 px-3 py-2 text-[0.75rem] font-semibold text-green-600 shadow-[0_4px_16px_-4px_rgba(34,197,94,0.18)] backdrop-blur-sm transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-green-400 dark:hover:bg-slate-900"
        >
          <Heart className="h-3.5 w-3.5 fill-current" aria-hidden />
          <span>Wishing Cards</span>
        </Link>
      </div>

      {/* Theme toggle */}
      <div className="fixed right-4 top-4 z-40 sm:right-6 sm:top-6">
        <ThemeToggle variant="floating" />
      </div>

      <AnimatePresence mode="wait">
        {phase !== "revealed" ? (
          <motion.div
            key="flower-view"
            initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              y: -16,
              transition: { duration: 0.3, ease: EASE_OUT },
            }}
            transition={{ duration: 0.52, ease: EASE }}
            className="flex flex-col items-center gap-4 text-center"
          >
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.08, ease: EASE_OUT }}
              className="text-[11px] font-semibold uppercase tracking-[0.3em] text-green-600 dark:text-green-400"
            >
              {getWellConfig.eyebrow}
            </motion.p>

            {/* Headline */}
            <AnimatedHeadline
              words={headlineWords}
              className="max-w-lg bg-linear-to-br from-green-600 via-lime-500 to-green-700 bg-clip-text text-[1.75rem] font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl md:text-[2.75rem]"
              ariaLabel={headlineWords.join(" ")}
            />

            {/* Sunflower */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
            >
              <SunflowerSVG healed={phase === "healing"} />
            </motion.div>

            {/* Heal button */}
            <AnimatePresence>
              {phase === "wilted" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.88,
                    transition: { duration: 0.15 },
                  }}
                  transition={{ delay: 0.55, duration: 0.32, ease: EASE }}
                >
                  <motion.button
                    type="button"
                    onClick={handleHeal}
                    whileHover={{
                      scale: 1.04,
                      y: -2,
                      boxShadow:
                        "0 10px 24px -6px rgba(34,197,94,0.45)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    className="inline-flex min-h-[52px] touch-manipulation items-center gap-2.5 rounded-full bg-linear-to-r from-green-500 to-lime-500 px-9 py-4 text-[0.9375rem] font-semibold text-white shadow-[0_4px_16px_-4px_rgba(34,197,94,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60 focus-visible:ring-offset-2"
                  >
                    <span>Send some love</span>
                    <span aria-hidden>🌻</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint */}
            <AnimatePresence>
              {phase === "wilted" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ delay: 0.8, duration: 0.32 }}
                  className="text-sm text-stone-500 dark:text-slate-400"
                >
                  Help the flower bloom 🌱
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ── Success card ── */
          <motion.section
            key="getwell-success"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="relative z-40 w-full max-w-xl overflow-hidden rounded-2xl border border-green-200/70 bg-white p-5 text-center shadow-[0_4px_24px_-4px_rgba(34,197,94,0.14),0_0_1px_0_rgba(0,0,0,0.04)] sm:rounded-3xl sm:p-8 dark:border-green-900/40 dark:bg-slate-900"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-12 top-0 h-44 bg-linear-to-b from-green-50/80 via-lime-50/40 to-transparent blur-3xl dark:from-green-950/50" />
              <div className="absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-lime-100/40 blur-3xl dark:bg-lime-900/20" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -15, y: 20 }}
                animate={{ scale: 1, rotate: 0, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 18,
                  delay: 0.1,
                }}
                className="text-6xl sm:text-7xl"
                aria-hidden
              >
                🌻
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.22, ease: EASE_OUT }}
                className="max-w-md bg-linear-to-br from-green-600 via-lime-500 to-green-700 bg-clip-text text-2xl font-extrabold leading-tight tracking-tight text-transparent sm:text-3xl"
              >
                {getWellConfig.success.headline}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.3, ease: EASE_OUT }}
                className="max-w-md text-balance text-[0.9375rem] leading-[1.65] text-stone-600 sm:text-base dark:text-slate-300"
              >
                {getWellConfig.message}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.4, ease: EASE_OUT }}
                className="max-w-md text-balance text-sm leading-[1.65] text-stone-500 dark:text-slate-400"
              >
                {replaceSenderName(getWellConfig.success.message, senderName)}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.32, delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400"
              >
                <Avatar name={senderName} size="sm" />
                <span className="text-[0.875rem] font-medium">
                  {replaceSenderName(
                    getWellConfig.success.signature,
                    senderName,
                  )}
                </span>
              </motion.div>

              {/* Share */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.6, ease: EASE_OUT }}
                className="mt-1 w-full sm:mt-2"
              >
                <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-wider text-stone-500 sm:text-[0.8125rem] dark:text-slate-400">
                  Share the healing
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on WhatsApp"
                    className="inline-flex min-h-[48px] shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl border border-green-200 bg-[#25D366]/10 px-5 py-3 text-[0.9375rem] font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/20 active:scale-[0.98] sm:px-6"
                  >
                    <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
                    <span>Share on WhatsApp</span>
                  </a>
                  <motion.button
                    type="button"
                    onClick={handleCopyLink}
                    disabled={!shareUrl}
                    aria-label={copied ? "Link copied" : "Copy link"}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex min-h-[48px] shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50/80 px-5 py-3 text-[0.9375rem] font-semibold text-green-700 transition-colors hover:bg-green-100 active:scale-[0.98] disabled:opacity-60 sm:px-6 dark:border-green-900/40 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-950/70"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 shrink-0" aria-hidden />
                    ) : (
                      <Link2 className="h-5 w-5 shrink-0" aria-hidden />
                    )}
                    <span>{copied ? "Copied!" : "Copy link"}</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer */}
      <AnimatePresence>
        {phase === "revealed" && (
          <motion.footer
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, delay: 1.5, ease: EASE }}
            className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-green-100/50 bg-white/85 py-2.5 backdrop-blur-sm sm:py-3 dark:border-green-900/30 dark:bg-slate-900/85"
          >
            <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-1.5 px-4 text-center sm:flex-row sm:gap-2 sm:px-5">
              <p className="text-[0.75rem] text-stone-600 sm:text-[0.8125rem] dark:text-slate-400">
                Loved this? Make one for someone special.
              </p>
              <a
                href="https://www.instagram.com/rushiii.js"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[40px] touch-manipulation items-center justify-center gap-1.5 rounded-full border border-green-200/60 bg-linear-to-r from-green-500 via-lime-500 to-green-600 px-4 py-2 text-[0.8125rem] font-semibold text-white shadow-[0_2px_8px_-2px_rgba(34,197,94,0.25)] transition-all duration-200 hover:scale-105 active:scale-[0.98] sm:min-h-[42px] sm:px-5 sm:py-2.5 sm:text-sm"
              >
                <Instagram className="h-4 w-4 shrink-0" aria-hidden />
                <span className="whitespace-nowrap">DM me on Instagram</span>
                <Heart className="h-3.5 w-3.5 shrink-0 fill-current" aria-hidden />
              </a>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
}
