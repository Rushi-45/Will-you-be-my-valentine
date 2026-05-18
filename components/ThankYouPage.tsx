"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Heart, Instagram, Link2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { thankYouConfig, replaceSenderName } from "@/config/thank-you";
import { Avatar } from "@/components/Avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";

// ─── constants ────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_OUT = [0.4, 0, 0.2, 1] as const;

type Phase = "waiting" | "blooming" | "sending" | "revealed";

const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];

// Drifting petals for the sending interstitial
const DRIFT_PETALS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: (i * 47 + 13) % 90 + 5,
  y: (i * 37 + 7) % 82 + 5,
  char: i % 2 === 0 ? "✿" : "❋",
  size: 11 + (i % 4) * 4,
  color: ["#34d399", "#6ee7b7", "#10b981", "#a7f3d0", "#059669"][i % 5],
  baseOpacity: 0.2 + (i % 5) * 0.07,
  delay: (i % 9) * 0.28,
  duration: 2.2 + (i % 5) * 0.5,
}));

// ─── helpers ──────────────────────────────────────────────────────────────────

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// ─── FlowerPetal ─────────────────────────────────────────────────────────────
// Each petal's bottom is anchored at the flower center.
// transformOrigin: "bottom center" so scaleY grows outward radially.

function FlowerPetal({
  angle,
  open,
  delay,
}: {
  angle: number;
  open: boolean;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute h-16 w-7 rounded-full bg-emerald-300 dark:bg-emerald-500"
      style={{
        bottom: "50%",
        left: "calc(50% - 14px)",
        transformOrigin: "bottom center",
        rotate: angle,
      }}
      animate={{
        scaleY: open ? 1 : 0.18,
        scaleX: open ? 1 : 0.65,
        opacity: open ? 0.88 : 0.45,
      }}
      transition={{ duration: 0.65, delay: open ? delay : 0, ease: EASE }}
    />
  );
}

// ─── ThankYouPage ─────────────────────────────────────────────────────────────

export function ThankYouPage() {
  const searchParams = useSearchParams();

  const recipientName = useMemo(() => {
    const raw = searchParams.get("name")?.trim();
    return raw ? capitalize(raw) : null;
  }, [searchParams]);

  const senderName = useMemo(() => {
    const raw = searchParams.get("sender")?.trim();
    return raw ? capitalize(raw) : thankYouConfig.senderName;
  }, [searchParams]);

  const headlineWords = useMemo(() => {
    const text = recipientName
      ? `Thank you, ${recipientName}!`
      : `${thankYouConfig.headline}!`;
    return text.split(" ");
  }, [recipientName]);

  const [phase, setPhase] = useState<Phase>("waiting");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
  }, []);

  const handleBloom = useCallback(() => {
    if (phase !== "waiting") return;
    setPhase("blooming");
    // Let the petals open, then step to the sending interstitial
    setTimeout(() => setPhase("sending"), 950);
  }, [phase]);

  const handleSendThanks = useCallback(async () => {
    const { default: confetti } = await import("canvas-confetti");
    const colors = [
      "#10b981", "#34d399", "#6ee7b7",
      "#059669", "#a7f3d0", "#ffffff", "#fbbf24",
    ];
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      colors,
      startVelocity: 50,
    });
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 70,
        angle: 110,
        origin: { x: 0.7, y: 0.5 },
        colors,
        startVelocity: 38,
      });
    }, 180);
    setPhase("revealed");
  }, []);

  const handleCopyLink = useCallback(() => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareUrl]);

  const whatsAppUrl = useMemo(() => {
    if (!shareUrl) return "#";
    return `https://wa.me/?text=${encodeURIComponent(`🌸 ${shareUrl}`)}`;
  }, [shareUrl]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-emerald-50/60 pb-20 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-16 text-stone-800 sm:px-5 sm:pb-24 sm:pt-20 dark:bg-slate-950/70 dark:text-slate-100">
      {/* Ambient glow rings */}
      <div
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        {([360, 500, 640] as const).map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-emerald-300/25 dark:border-emerald-700/20"
            style={{ width: size, height: size }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.1, 0.6] }}
            transition={{
              duration: 3.8,
              delay: i * 0.9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── Sending overlay + drifting petals (fixed, outside AnimatePresence) ── */}
      <AnimatePresence>
        {phase === "sending" && (
          <>
            <motion.div
              key="send-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-emerald-950/96 via-teal-950/92 to-emerald-950/96"
            />
            <motion.div
              key="petal-field"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
            >
              {DRIFT_PETALS.map((p) => (
                <motion.span
                  key={p.id}
                  className="absolute select-none"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    fontSize: p.size,
                    color: p.color,
                    opacity: p.baseOpacity,
                  }}
                  animate={{
                    y: [-10, 6, -10],
                    rotate: [-8, 8, -8],
                    opacity: [p.baseOpacity * 0.4, p.baseOpacity, p.baseOpacity * 0.4],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {p.char}
                </motion.span>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Back link */}
      <div className="fixed left-4 top-4 z-40 sm:left-6 sm:top-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-white/90 px-3 py-2 text-[0.75rem] font-semibold text-emerald-600 shadow-[0_4px_16px_-4px_rgba(16,185,129,0.18)] backdrop-blur-sm transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-emerald-400 dark:hover:bg-slate-900"
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
        {/* ── Phase 1 + 2: Flower (waiting → blooming) ── */}
        {(phase === "waiting" || phase === "blooming") && (
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
            className="flex flex-col items-center gap-5 text-center"
          >
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.08, ease: EASE_OUT }}
              className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400"
            >
              {thankYouConfig.eyebrow}
            </motion.p>

            {/* Headline */}
            <AnimatedHeadline
              words={headlineWords}
              className="max-w-lg bg-linear-to-br from-emerald-600 via-teal-500 to-emerald-700 bg-clip-text text-[1.75rem] font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl md:text-[2.75rem]"
              ariaLabel={headlineWords.join(" ")}
            />

            {/* Interactive flower — tap to bloom */}
            <motion.button
              type="button"
              onClick={handleBloom}
              disabled={phase !== "waiting"}
              aria-label="Tap to bloom"
              className="relative mt-4 h-44 w-44 cursor-pointer touch-manipulation focus-visible:outline-none disabled:cursor-default"
              whileHover={phase === "waiting" ? { scale: 1.05 } : undefined}
              whileTap={phase === "waiting" ? { scale: 0.97 } : undefined}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              {/* Petals */}
              {PETAL_ANGLES.map((angle, i) => (
                <FlowerPetal
                  key={angle}
                  angle={angle}
                  open={phase !== "waiting"}
                  delay={i * 0.07}
                />
              ))}

              {/* Center circle — breathing pulse when waiting */}
              <motion.div
                className="absolute left-1/2 top-1/2 z-10 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300 shadow-[0_2px_12px_-2px_rgba(234,179,8,0.45)] dark:bg-yellow-400"
                animate={
                  phase !== "waiting"
                    ? { scale: 1.18 }
                    : { scale: [1, 1.06, 1] }
                }
                transition={
                  phase !== "waiting"
                    ? {
                        duration: 0.42,
                        delay: 0.3,
                        ease: EASE,
                      }
                    : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                }
              />
            </motion.button>

            {/* Hint text */}
            <AnimatePresence>
              {phase === "waiting" && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: -4,
                    transition: { duration: 0.18 },
                  }}
                  transition={{ delay: 0.6, duration: 0.32, ease: EASE_OUT }}
                  className="text-sm text-stone-500 dark:text-slate-400"
                >
                  Tap the flower to bloom your thanks 🌸
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Phase 3: Sending interstitial ── */}
        {phase === "sending" && (
          <motion.div
            key="sending-screen"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.3 } }}
            transition={{ duration: 0.45, delay: 0.2, ease: EASE }}
            className="relative z-30 flex flex-col items-center gap-7 text-center"
          >
            {/* Pulsing flower */}
            <div className="relative">
              <motion.div
                className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-2xl"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.15, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                animate={{ scale: [1, 1.07, 1], rotate: [-5, 5, -5] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="text-[5.5rem] leading-none sm:text-[6.5rem]"
              >
                🌸
              </motion.div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1.5">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.35, ease: EASE_OUT }}
                className="text-lg font-medium text-emerald-200"
              >
                Your gratitude is on its way...
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.7, ease: EASE_OUT }}
                className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
              >
                ...blooming just for them 🌿
              </motion.p>
            </div>

            {/* Send button */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 1.3, ease: EASE }}
            >
              <motion.button
                type="button"
                onClick={handleSendThanks}
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 0 32px 8px rgba(52,211,153,0.2)",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="inline-flex min-h-[54px] touch-manipulation items-center gap-2.5 rounded-full border border-emerald-300/40 bg-white/10 px-10 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                <span>Send your thanks</span>
                <span aria-hidden>🌸</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ── Phase 4: Success card ── */}
        {phase === "revealed" && (
          <motion.section
            key="thankyou-success"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="relative z-40 w-full max-w-xl overflow-hidden rounded-2xl border border-emerald-200/70 bg-white p-5 text-center shadow-[0_4px_24px_-4px_rgba(16,185,129,0.14),0_0_1px_0_rgba(0,0,0,0.04)] sm:rounded-3xl sm:p-8 dark:border-emerald-900/40 dark:bg-slate-900"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-12 top-0 h-44 bg-linear-to-b from-emerald-50/80 via-teal-50/40 to-transparent blur-3xl dark:from-emerald-950/50" />
              <div className="absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-teal-100/40 blur-3xl dark:bg-teal-900/20" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
              {/* Flower emoji */}
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
                🌸
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.22, ease: EASE_OUT }}
                className="max-w-md bg-linear-to-br from-emerald-600 via-teal-500 to-emerald-700 bg-clip-text text-2xl font-extrabold leading-tight tracking-tight text-transparent sm:text-3xl"
              >
                {thankYouConfig.success.headline}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.3, ease: EASE_OUT }}
                className="max-w-md text-balance text-[0.9375rem] leading-[1.65] text-stone-600 sm:text-base dark:text-slate-300"
              >
                {thankYouConfig.message}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.4, ease: EASE_OUT }}
                className="max-w-md text-balance text-sm leading-[1.65] text-stone-500 dark:text-slate-400"
              >
                {replaceSenderName(thankYouConfig.success.message, senderName)}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.32, delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400"
              >
                <Avatar name={senderName} size="sm" />
                <span className="text-[0.875rem] font-medium">
                  {replaceSenderName(
                    thankYouConfig.success.signature,
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
                  Share the gratitude
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
                    className="inline-flex min-h-[48px] shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-5 py-3 text-[0.9375rem] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 active:scale-[0.98] disabled:opacity-60 sm:px-6 dark:border-emerald-900/40 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950/70"
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
            className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-emerald-100/50 bg-white/85 py-2.5 backdrop-blur-sm sm:py-3 dark:border-emerald-900/30 dark:bg-slate-900/85"
          >
            <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-1.5 px-4 text-center sm:flex-row sm:gap-2 sm:px-5">
              <p className="text-[0.75rem] text-stone-600 sm:text-[0.8125rem] dark:text-slate-400">
                Loved this? Make one for someone special.
              </p>
              <a
                href="https://www.instagram.com/rushiii.js"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[40px] touch-manipulation items-center justify-center gap-1.5 rounded-full border border-emerald-200/60 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 px-4 py-2 text-[0.8125rem] font-semibold text-white shadow-[0_2px_8px_-2px_rgba(16,185,129,0.25)] transition-all duration-200 hover:scale-105 active:scale-[0.98] sm:min-h-[42px] sm:px-5 sm:py-2.5 sm:text-sm"
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
