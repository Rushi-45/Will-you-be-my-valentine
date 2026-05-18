"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useAnimationControls,
} from "framer-motion";
import { Check, Heart, Instagram, Link2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { graduationConfig, replaceSenderName } from "@/config/graduation";
import { Avatar } from "@/components/Avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";

// ─── constants ────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_OUT = [0.4, 0, 0.2, 1] as const;

type Phase = "waiting" | "tossing" | "walking" | "revealed";

// Floating sparkles for the walking interstitial
const WALK_STARS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: (i * 47 + 13) % 90 + 5,
  y: (i * 37 + 7) % 82 + 5,
  char: i % 3 === 0 ? "✦" : i % 3 === 1 ? "★" : "·",
  size: 10 + (i % 4) * 5,
  color: ["#fbbf24", "#f59e0b", "#fcd34d", "#d97706", "#fde68a"][i % 5],
  baseOpacity: 0.2 + (i % 5) * 0.08,
  delay: (i % 9) * 0.3,
  duration: 2.0 + (i % 5) * 0.45,
}));

// ─── helpers ──────────────────────────────────────────────────────────────────

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

// ─── Mortarboard SVG ─────────────────────────────────────────────────────────

function Mortarboard({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 110"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* Board — wide flat top piece */}
      <rect x="8" y="32" width="124" height="15" rx="3" fill="#1e293b" />
      {/* Button — tassel attachment on top */}
      <rect x="59" y="22" width="22" height="13" rx="2.5" fill="#f59e0b" />
      {/* Tassel cord — curves from button to right side */}
      <path
        d="M 80 28 Q 108 38 103 66"
        stroke="#f59e0b"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tassel end piece */}
      <rect x="97" y="64" width="12" height="20" rx="3" fill="#f59e0b" />
      {/* Cap base — the dome below the board */}
      <rect x="36" y="47" width="68" height="44" rx="15" fill="#334155" />
    </svg>
  );
}

// ─── GraduationPage ───────────────────────────────────────────────────────────

export function GraduationPage() {
  const searchParams = useSearchParams();

  const recipientName = useMemo(() => {
    const raw = searchParams.get("name")?.trim();
    return raw ? capitalize(raw) : null;
  }, [searchParams]);

  const senderName = useMemo(() => {
    const raw = searchParams.get("sender")?.trim();
    return raw ? capitalize(raw) : graduationConfig.senderName;
  }, [searchParams]);

  const year = useMemo(() => {
    const raw = searchParams.get("year")?.trim();
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 1900 && n < 2200 ? n : null;
  }, [searchParams]);

  const eyebrow = useMemo(
    () => (year ? `Class of ${year}` : graduationConfig.eyebrow),
    [year],
  );

  const headlineWords = useMemo(() => {
    const text = recipientName
      ? `You did it, ${recipientName}!`
      : `${graduationConfig.headline}!`;
    return text.split(" ");
  }, [recipientName]);

  const successHeadline = useMemo(() => {
    const base = graduationConfig.success.headline;
    return recipientName ? `${base}, ${recipientName}!` : `${base}!`;
  }, [recipientName]);

  const [phase, setPhase] = useState<Phase>("waiting");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
  }, []);

  // Cap animation controls — starts bobbing on mount, toss on click
  const capControls = useAnimationControls();

  useEffect(() => {
    capControls.start({
      y: [0, -10, 0],
      rotate: [-3, 3, -3],
      transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
    });
  }, [capControls]);

  const handleToss = useCallback(async () => {
    if (phase !== "waiting") return;
    setPhase("tossing");

    // Cap flies up and away
    await capControls.start({
      y: -460,
      x: 70,
      rotate: 720,
      opacity: 0,
      transition: {
        duration: 0.95,
        ease: [0.15, 0, 0.55, 1],
        rotate: { duration: 0.95, ease: "linear" },
        opacity: { duration: 0.28, delay: 0.67 },
      },
    });

    // Cap is gone — step to the interstitial
    setPhase("walking");
  }, [phase, capControls]);

  const handleClaim = useCallback(async () => {
    const { default: confetti } = await import("canvas-confetti");
    const colors = [
      "#f59e0b", "#d97706", "#fbbf24",
      "#1d4ed8", "#15803d", "#fb923c", "#ffffff",
    ];
    confetti({
      particleCount: 90,
      spread: 110,
      origin: { x: 0.5, y: 0.35 },
      colors,
      startVelocity: 58,
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 80,
        angle: 120,
        origin: { x: 0.75, y: 0.45 },
        colors,
        startVelocity: 45,
      });
    }, 200);
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
    return `https://wa.me/?text=${encodeURIComponent(`🎓 ${shareUrl}`)}`;
  }, [shareUrl]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-amber-50/60 pb-20 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-16 text-stone-800 sm:px-5 sm:pb-24 sm:pt-20 dark:bg-slate-950/70 dark:text-slate-100">
      {/* Ambient glow rings — amber palette */}
      <div
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        {([360, 500, 640] as const).map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-amber-300/25 dark:border-amber-700/20"
            style={{ width: size, height: size }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.1, 0.6] }}
            transition={{
              duration: 3.6,
              delay: i * 0.85,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── Walking interstitial overlay (fixed, outside AnimatePresence) ── */}
      <AnimatePresence>
        {phase === "walking" && (
          <>
            <motion.div
              key="walk-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-amber-950/96 via-stone-950/92 to-amber-950/96"
            />
            <motion.div
              key="walk-stars"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
            >
              {WALK_STARS.map((s) => (
                <motion.span
                  key={s.id}
                  className="absolute select-none"
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    fontSize: s.size,
                    color: s.color,
                    opacity: s.baseOpacity,
                  }}
                  animate={{
                    opacity: [s.baseOpacity * 0.3, s.baseOpacity, s.baseOpacity * 0.3],
                    scale: [0.85, 1.1, 0.85],
                  }}
                  transition={{
                    duration: s.duration,
                    delay: s.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {s.char}
                </motion.span>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating back link */}
      <div className="fixed left-4 top-4 z-40 sm:left-6 sm:top-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/70 bg-white/90 px-3 py-2 text-[0.75rem] font-semibold text-amber-600 shadow-[0_4px_16px_-4px_rgba(245,158,11,0.18)] backdrop-blur-sm transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-amber-400 dark:hover:bg-slate-900"
        >
          <Heart className="h-3.5 w-3.5 fill-current" aria-hidden />
          <span>Wishing Cards</span>
        </Link>
      </div>

      {/* Floating theme toggle */}
      <div className="fixed right-4 top-4 z-40 sm:right-6 sm:top-6">
        <ThemeToggle variant="floating" />
      </div>

      <AnimatePresence mode="wait">
        {/* ── Phase 1 + 2: Cap view (waiting → tossing) ── */}
        {(phase === "waiting" || phase === "tossing") && (
          <motion.div
            key="cap-view"
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
              className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400"
            >
              {eyebrow}
            </motion.p>

            {/* Headline */}
            <AnimatedHeadline
              words={headlineWords}
              className="max-w-lg bg-linear-to-br from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-[1.75rem] font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl md:text-[2.75rem]"
              ariaLabel={headlineWords.join(" ")}
            />

            {/* Mortarboard cap */}
            <motion.div animate={capControls} className="mt-2">
              <Mortarboard className="h-36 w-52 drop-shadow-md sm:h-40 sm:w-56" />
            </motion.div>

            {/* Toss button */}
            <AnimatePresence>
              {phase === "waiting" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.88,
                    transition: { duration: 0.15 },
                  }}
                  transition={{ delay: 0.48, duration: 0.32, ease: EASE }}
                >
                  <motion.button
                    type="button"
                    onClick={handleToss}
                    whileHover={{ scale: 1.04, y: -2, boxShadow: "0 10px 24px -6px rgba(245,158,11,0.45)" }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    className="inline-flex min-h-[52px] touch-manipulation items-center gap-2.5 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-9 py-4 text-[0.9375rem] font-semibold text-white shadow-[0_4px_16px_-4px_rgba(245,158,11,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2"
                  >
                    <span>Toss the cap!</span>
                    <span aria-hidden>🎓</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Phase 3: Walking interstitial ── */}
        {phase === "walking" && (
          <motion.div
            key="walking-screen"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.3 } }}
            transition={{ duration: 0.45, delay: 0.2, ease: EASE }}
            className="relative z-30 flex flex-col items-center gap-7 text-center"
          >
            {/* Pulsing cap */}
            <div className="relative">
              <motion.div
                className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/20 blur-2xl"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.15, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                animate={{ scale: [1, 1.07, 1], rotate: [-4, 4, -4] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                className="text-[5.5rem] leading-none sm:text-[6.5rem]"
              >
                🎓
              </motion.div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1.5">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.35, ease: EASE_OUT }}
                className="text-lg font-medium text-amber-200"
              >
                The ceremony is over...
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.7, ease: EASE_OUT }}
                className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
              >
                ...your future begins now 🌟
              </motion.p>
            </div>

            {/* Claim button */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 1.3, ease: EASE }}
            >
              <motion.button
                type="button"
                onClick={handleClaim}
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 0 32px 8px rgba(251,191,36,0.2)",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="inline-flex min-h-[54px] touch-manipulation items-center gap-2.5 rounded-full border border-amber-300/40 bg-white/10 px-10 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                <span>Step into the light</span>
                <span aria-hidden>✨</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ── Phase 4: Success card ── */}
        {phase === "revealed" && (
          <motion.section
            key="graduation-success"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="relative z-40 w-full max-w-xl overflow-hidden rounded-2xl border border-amber-200/70 bg-white text-center shadow-[0_4px_24px_-4px_rgba(245,158,11,0.14),0_0_1px_0_rgba(0,0,0,0.04)] sm:rounded-3xl dark:border-amber-900/40 dark:bg-slate-900"
          >
            {/* Gradient hero banner */}
            <div className="relative overflow-hidden bg-linear-to-br from-amber-400 via-yellow-400 to-orange-400 px-5 pb-8 pt-7 sm:px-8 sm:pb-9 sm:pt-8">
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
                    🎓
                  </motion.div>
                </div>
                <AnimatedHeadline
                  words={successHeadline.split(" ")}
                  className="text-xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] sm:text-2xl"
                  ariaLabel={successHeadline}
                />
              </div>
            </div>

            {/* Ambient background blobs */}
            <div className="pointer-events-none absolute inset-0 z-0">
              <div className="absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-orange-100/40 blur-3xl dark:bg-orange-900/20" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3 px-5 pb-5 pt-3 sm:gap-4 sm:px-8 sm:pb-8 sm:pt-4">

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.3, ease: EASE_OUT }}
                className="max-w-md text-balance text-[0.9375rem] leading-[1.65] text-stone-600 sm:text-base dark:text-slate-300"
              >
                {graduationConfig.message}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.4, ease: EASE_OUT }}
                className="max-w-md text-balance text-sm leading-[1.65] text-stone-500 dark:text-slate-400"
              >
                {replaceSenderName(graduationConfig.success.message, senderName)}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.32, delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400"
              >
                <Avatar name={senderName} size="sm" />
                <span className="text-[0.875rem] font-medium">
                  {replaceSenderName(
                    graduationConfig.success.signature,
                    senderName,
                  )}
                </span>
              </motion.div>

              {/* Share buttons */}
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
                  Share the achievement
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
                    className="inline-flex min-h-[48px] shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-5 py-3 text-[0.9375rem] font-semibold text-amber-700 transition-colors hover:bg-amber-100 active:scale-[0.98] disabled:opacity-60 sm:px-6 dark:border-amber-900/40 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-950/70"
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
            className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-amber-100/50 bg-white/85 py-2.5 backdrop-blur-sm sm:py-3 dark:border-amber-900/30 dark:bg-slate-900/85"
          >
            <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-1.5 px-4 text-center sm:flex-row sm:gap-2 sm:px-5">
              <p className="text-[0.75rem] text-stone-600 sm:text-[0.8125rem] dark:text-slate-400">
                Loved this? Make one for someone special.
              </p>
              <a
                href="https://www.instagram.com/rushiii.js"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[40px] touch-manipulation items-center justify-center gap-1.5 rounded-full border border-amber-200/60 bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-2 text-[0.8125rem] font-semibold text-white shadow-[0_2px_8px_-2px_rgba(245,158,11,0.25)] transition-all duration-200 hover:scale-105 active:scale-[0.98] sm:min-h-[42px] sm:px-5 sm:py-2.5 sm:text-sm"
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
