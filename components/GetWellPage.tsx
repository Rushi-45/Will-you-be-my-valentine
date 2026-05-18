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

type Phase = "wilted" | "healing" | "glowing" | "revealed";

// Healing light particles for the glowing interstitial
const GLOW_PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: (i * 47 + 13) % 90 + 5,
  y: (i * 37 + 7) % 82 + 5,
  char: i % 3 === 0 ? "✦" : i % 3 === 1 ? "·" : "○",
  size: 10 + (i % 4) * 5,
  color: ["#4ade80", "#86efac", "#22c55e", "#bbf7d0", "#fbbf24"][i % 5],
  baseOpacity: 0.2 + (i % 5) * 0.08,
  delay: (i % 9) * 0.28,
  duration: 2.0 + (i % 5) * 0.5,
}));

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

  const handleHeal = useCallback(() => {
    if (phase !== "wilted") return;
    setPhase("healing");
    // Let the sunflower finish healing, then step to glowing interstitial
    setTimeout(() => setPhase("glowing"), 1100);
  }, [phase]);

  const handleSendHealing = useCallback(async () => {
    const { default: confetti } = await import("canvas-confetti");
    const colors = [
      "#22c55e", "#4ade80", "#86efac",
      "#16a34a", "#bbf7d0", "#fbbf24", "#ffffff",
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

      {/* ── Glowing interstitial overlay (fixed, outside AnimatePresence) ── */}
      <AnimatePresence>
        {phase === "glowing" && (
          <>
            <motion.div
              key="glow-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-green-950/96 via-emerald-950/90 to-lime-950/96"
            />
            <motion.div
              key="glow-particles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
            >
              {GLOW_PARTICLES.map((p) => (
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
                    opacity: [p.baseOpacity * 0.3, p.baseOpacity, p.baseOpacity * 0.3],
                    scale: [0.85, 1.15, 0.85],
                    y: [-6, 6, -6],
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
        {/* ── Phase 1 + 2: Sunflower (wilted → healing) ── */}
        {(phase === "wilted" || phase === "healing") && (
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
        )}

        {/* ── Phase 3: Glowing interstitial ── */}
        {phase === "glowing" && (
          <motion.div
            key="glowing-screen"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.3 } }}
            transition={{ duration: 0.45, delay: 0.2, ease: EASE }}
            className="relative z-30 flex flex-col items-center gap-7 text-center"
          >
            {/* Pulsing sunflower */}
            <div className="relative">
              <motion.div
                className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/25 blur-2xl"
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0.15, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                animate={{ scale: [1, 1.07, 1], rotate: [-3, 3, -3] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="text-[5.5rem] leading-none sm:text-[6.5rem]"
              >
                🌻
              </motion.div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1.5">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.35, ease: EASE_OUT }}
                className="text-lg font-medium text-green-200"
              >
                The healing is on its way...
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.7, ease: EASE_OUT }}
                className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
              >
                ...sending all my warmth 🌱
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
                onClick={handleSendHealing}
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 0 32px 8px rgba(74,222,128,0.2)",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="inline-flex min-h-[54px] touch-manipulation items-center gap-2.5 rounded-full border border-green-300/40 bg-white/10 px-10 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                <span>Send your love</span>
                <span aria-hidden>🌻</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ── Phase 4: Success card ── */}
        {phase === "revealed" && (
          <motion.section
            key="getwell-success"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="relative z-40 w-full max-w-xl overflow-hidden rounded-2xl border border-green-200/70 bg-white text-center shadow-[0_4px_24px_-4px_rgba(34,197,94,0.14),0_0_1px_0_rgba(0,0,0,0.04)] sm:rounded-3xl dark:border-green-900/40 dark:bg-slate-900"
          >
            {/* Gradient hero banner */}
            <div className="relative overflow-hidden bg-linear-to-br from-green-400 via-emerald-400 to-lime-400 px-5 pb-8 pt-7 sm:px-8 sm:pb-9 sm:pt-8">
              <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle,white_1.5px,transparent_1.5px)] [background-size:22px_22px]" aria-hidden />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl" aria-hidden />
              {/* Shimmer sweep */}
              <motion.div
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 0.85, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                aria-hidden
              />
              {/* Floating mini-particles */}
              {Array.from({ length: 8 }, (_, i) => (
                <motion.span
                  key={i}
                  className="pointer-events-none absolute select-none text-white/70"
                  style={{
                    left: `${(i * 53 + 17) % 80 + 10}%`,
                    bottom: `${20 + (i * 41 + 9) % 50}%`,
                    fontSize: `${10 + (i * 7) % 8}px`,
                  }}
                  animate={{ y: [0, -(20 + (i * 9) % 18), 0], opacity: [0.35, 0.7, 0.35] }}
                  transition={{
                    duration: 2.2 + (i * 0.31) % 1.4,
                    delay: (i * 0.23) % 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  aria-hidden
                >
                  {(["✦", "·", "★", "✦", "·", "★", "✦", "·"] as const)[i]}
                </motion.span>
              ))}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-b from-transparent to-white dark:to-slate-900" aria-hidden />
              <div className="relative flex flex-col items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <motion.div
                    className="absolute h-24 w-24 rounded-full bg-white/20 blur-xl"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.12, 0.6] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    aria-hidden
                  />
                  <motion.div
                    initial={{ scale: 0, rotate: -20, y: 12 }}
                    animate={{ scale: 1, rotate: 0, y: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
                    className="relative text-5xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] sm:text-6xl"
                    aria-hidden
                  >
                    🌻
                  </motion.div>
                </div>
                <AnimatedHeadline
                  words={getWellConfig.success.headline.split(" ")}
                  className="text-xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] sm:text-2xl"
                  ariaLabel={getWellConfig.success.headline}
                />
              </div>
            </div>

            {/* Ambient background blobs */}
            <div className="pointer-events-none absolute inset-0 z-0">
              <div className="absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-lime-100/40 blur-3xl dark:bg-lime-900/20" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3 px-5 pb-5 pt-3 sm:gap-4 sm:px-8 sm:pb-8 sm:pt-4">

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
                className="mt-0 w-full"
              >
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.55, ease: EASE_OUT }}
                  className="mb-3 flex w-full items-center gap-3"
                  aria-hidden
                >
                  <div className="h-px flex-1 bg-stone-200/80 dark:bg-slate-700/50" />
                  <span className="text-xs text-stone-400 dark:text-slate-600">✦</span>
                  <div className="h-px flex-1 bg-stone-200/80 dark:bg-slate-700/50" />
                </motion.div>
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
