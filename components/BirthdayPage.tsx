"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useAnimationControls,
} from "framer-motion";
import { Check, Heart, Link2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { birthdayConfig, replaceSenderName } from "@/config/birthday";
import { Avatar } from "@/components/Avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";

// ─── constants ────────────────────────────────────────────────────────────────

const MAX_CANDLES = 8;

const CANDLE_GRADIENTS = [
  "from-rose-300 to-rose-400",
  "from-sky-300 to-sky-400",
  "from-amber-200 to-yellow-300",
  "from-emerald-300 to-emerald-400",
  "from-purple-300 to-purple-400",
  "from-pink-300 to-pink-400",
  "from-orange-300 to-orange-400",
  "from-teal-300 to-teal-400",
] as const;

// Deterministic star positions for the wishing screen
const WISH_STARS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: (i * 47 + 13) % 90 + 5,
  y: (i * 37 + 7) % 80 + 5,
  size: 1 + (i % 3),
  baseOpacity: 0.25 + (i % 5) * 0.1,
  delay: (i % 8) * 0.28,
  duration: 1.4 + (i % 4) * 0.45,
}));

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_OUT = [0.4, 0, 0.2, 1] as const;

type Phase = "blowing" | "wishing" | "revealed";

// ─── helpers ──────────────────────────────────────────────────────────────────

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

// ─── Flame ────────────────────────────────────────────────────────────────────

function Flame() {
  return (
    <div className="relative flex items-end justify-center">
      <motion.div
        className="absolute bottom-0 h-5 w-5 rounded-full bg-amber-300/50 blur-md"
        animate={{
          scale: [1, 1.3, 0.88, 1.2, 1],
          opacity: [0.5, 0.78, 0.32, 0.68, 0.5],
        }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative h-6 w-3 bg-linear-to-t from-orange-500 via-amber-400 to-yellow-200"
        style={{
          borderRadius: "50% 50% 20% 20% / 60% 60% 40% 40%",
          transformOrigin: "50% 100%",
        }}
        animate={{
          scaleX: [1, 0.84, 1.1, 0.88, 1],
          scaleY: [1, 1.12, 0.92, 1.08, 1],
          rotate: [-3, 5, -5, 2, -3],
        }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ─── Candle ───────────────────────────────────────────────────────────────────

const Candle = memo(function Candle({
  index,
  blown,
  showSmoke,
  onBlow,
}: {
  index: number;
  blown: boolean;
  showSmoke: boolean;
  onBlow: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onBlow}
      disabled={blown}
      aria-label={
        blown
          ? `Candle ${index + 1} blown out`
          : `Blow out candle ${index + 1}`
      }
      className="group flex flex-col items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2"
    >
      {/* Fixed-height slot — flame + smoke share this space */}
      <div className="relative flex h-8 w-5 items-end justify-center">
        <AnimatePresence>
          {!blown && (
            <motion.div
              key="flame"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                scale: 0,
                opacity: 0,
                y: -8,
                transition: { duration: 0.22 },
              }}
            >
              <Flame />
            </motion.div>
          )}
          {showSmoke && (
            <motion.div
              key="smoke"
              initial={{ opacity: 0.65, y: 0, scaleX: 1, x: 0 }}
              animate={{
                opacity: 0,
                y: -30,
                scaleX: 0.25,
                x: [0, -2, 2, -1, 0],
              }}
              transition={{ duration: 0.95, ease: "easeOut" }}
              className="pointer-events-none absolute bottom-1 left-1/2 h-6 w-1.5 -translate-x-1/2 rounded-full bg-stone-300/90 blur-[2px] dark:bg-stone-400/70"
            />
          )}
        </AnimatePresence>
      </div>
      {/* Wick */}
      <div className="h-1.5 w-px bg-stone-500 dark:bg-stone-400" />
      {/* Body */}
      <motion.div
        className={`w-3 rounded-t-sm bg-linear-to-b ${CANDLE_GRADIENTS[index % CANDLE_GRADIENTS.length]}`}
        style={{ height: 32 }}
        animate={{ opacity: blown ? 0.45 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </button>
  );
});

// ─── BirthdayCake ─────────────────────────────────────────────────────────────

function BirthdayCake({
  candleCount,
  blownCandles,
  recentlyBlown,
  onBlow,
}: {
  candleCount: number;
  blownCandles: Set<number>;
  recentlyBlown: Set<number>;
  onBlow: (i: number) => void;
}) {
  return (
    <div className="flex select-none flex-col items-center">
      {/* Candles */}
      <div className="flex items-end justify-center gap-2 px-2">
        {Array.from({ length: candleCount }, (_, i) => (
          <Candle
            key={i}
            index={i}
            blown={blownCandles.has(i)}
            showSmoke={recentlyBlown.has(i)}
            onBlow={() => onBlow(i)}
          />
        ))}
      </div>

      {/* Tier 1 — top */}
      <div className="relative w-36 sm:w-44">
        <div className="h-1.5 rounded-t-md bg-white/85 dark:bg-white/50" />
        <div className="h-10 bg-linear-to-b from-sky-100 to-sky-200 sm:h-12 dark:from-sky-700 dark:to-sky-800" />
        <div className="absolute -bottom-2 left-0 right-0 z-10 flex justify-around px-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-b-full bg-white/90 shadow-sm dark:bg-white/55"
            />
          ))}
        </div>
      </div>

      {/* Tier 2 — middle */}
      <div className="relative w-48 sm:w-56">
        <div className="h-11 bg-linear-to-b from-blue-200 to-blue-300 sm:h-13 dark:from-blue-600 dark:to-blue-700" />
        <div className="absolute -bottom-2 left-0 right-0 z-10 flex justify-around px-2.5">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-b-full bg-white/85 shadow-sm dark:bg-white/50"
            />
          ))}
        </div>
      </div>

      {/* Tier 3 — bottom */}
      <div className="w-60 sm:w-72">
        <div className="h-12 rounded-b-xl bg-linear-to-b from-blue-300 to-blue-400 sm:h-14 dark:from-blue-500 dark:to-blue-600" />
      </div>

      {/* Plate */}
      <div className="mt-1 h-3 w-64 rounded-full bg-stone-200 shadow-sm sm:w-80 dark:bg-stone-600" />
    </div>
  );
}

// ─── BirthdayPage ─────────────────────────────────────────────────────────────

export function BirthdayPage() {
  const searchParams = useSearchParams();

  const recipientName = useMemo(() => {
    const raw = searchParams.get("name")?.trim();
    return raw ? capitalize(raw) : null;
  }, [searchParams]);

  const senderName = useMemo(() => {
    const raw = searchParams.get("sender")?.trim();
    return raw ? capitalize(raw) : birthdayConfig.senderName;
  }, [searchParams]);

  const age = useMemo(() => {
    const raw = searchParams.get("age")?.trim();
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [searchParams]);

  const candleCount = useMemo(
    () => Math.min(age ?? birthdayConfig.candleCount, MAX_CANDLES),
    [age],
  );

  const eyebrow = useMemo(
    () => (age ? `Happy ${ordinal(age)} Birthday` : birthdayConfig.eyebrow),
    [age],
  );

  const headlineWords = useMemo(() => {
    const text = recipientName
      ? `Make a Wish, ${recipientName}!`
      : "Make a Wish!";
    return text.split(" ");
  }, [recipientName]);

  const successHeadline = useMemo(() => {
    const base = age ? `Happy ${ordinal(age)} Birthday` : "Happy Birthday";
    return recipientName ? `${base}, ${recipientName}!` : `${base}!`;
  }, [age, recipientName]);

  const [blownCandles, setBlownCandles] = useState<Set<number>>(new Set());
  const [recentlyBlown, setRecentlyBlown] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState<Phase>("blowing");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const starControls = useAnimationControls();

  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
  }, []);

  const allBlown = blownCandles.size === candleCount;

  // All candles blown → transition to wishing screen after brief pause
  useEffect(() => {
    if (!allBlown || phase !== "blowing") return;
    const t = setTimeout(() => setPhase("wishing"), 650);
    return () => clearTimeout(t);
  }, [allBlown, phase]);

  // Star idle bob on wishing screen mount
  useEffect(() => {
    if (phase !== "wishing") return;
    starControls.start({
      y: [0, -12, 0],
      rotate: [0, 6, -6, 0],
      transition: { duration: 3.0, repeat: Infinity, ease: "easeInOut" },
    });
  }, [phase, starControls]);

  const handleBlow = useCallback((index: number) => {
    setBlownCandles((prev) => {
      if (prev.has(index)) return prev;
      return new Set([...prev, index]);
    });
    // Smoke wisp — visible for 950 ms
    setRecentlyBlown((prev) => new Set([...prev, index]));
    setTimeout(() => {
      setRecentlyBlown((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, 950);
  }, []);

  const handleWish = useCallback(async () => {
    // Shoot star off screen
    await starControls.start({
      y: -420,
      x: 90,
      rotate: 360,
      scale: 0.15,
      opacity: 0,
      transition: {
        duration: 0.7,
        ease: [0.15, 0, 0.55, 1],
        rotate: { duration: 0.7, ease: "linear" },
        opacity: { duration: 0.25, delay: 0.45 },
      },
    });

    // Triple confetti burst
    const { default: confetti } = await import("canvas-confetti");
    const colors = [
      "#f59e0b",
      "#60a5fa",
      "#34d399",
      "#f472b6",
      "#a78bfa",
      "#fb923c",
      "#ffffff",
    ];
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { x: 0.5, y: 0.35 },
      colors,
      startVelocity: 60,
    });
    setTimeout(() => {
      confetti({
        particleCount: 55,
        spread: 80,
        origin: { x: 0.25, y: 0.5 },
        colors,
        startVelocity: 48,
      });
    }, 150);
    setTimeout(() => {
      confetti({
        particleCount: 55,
        spread: 80,
        origin: { x: 0.75, y: 0.5 },
        colors,
        startVelocity: 48,
      });
    }, 280);

    setPhase("revealed");
  }, [starControls]);

  const handleCopyLink = useCallback(() => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareUrl]);

  const whatsAppUrl = useMemo(() => {
    if (!shareUrl) return "#";
    return `https://wa.me/?text=${encodeURIComponent(`🎂 ${shareUrl}`)}`;
  }, [shareUrl]);

  const blownLeft = candleCount - blownCandles.size;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-sky-50/60 pb-20 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-16 text-stone-800 sm:px-5 sm:pb-24 sm:pt-20 dark:bg-slate-950/70 dark:text-slate-100">
      {/* Ambient glow rings */}
      <div
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        {([360, 500, 640] as const).map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-sky-300/20 dark:border-sky-700/20"
            style={{ width: size, height: size }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.1, 0.6] }}
            transition={{
              duration: 3.5,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── Wishing screen overlay (fixed, outside AnimatePresence to avoid transform conflicts) ── */}
      <AnimatePresence>
        {phase === "wishing" && (
          <>
            {/* Dark backdrop */}
            <motion.div
              key="wish-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55 }}
              className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-slate-900/96 via-indigo-950/92 to-slate-900/96"
            />
            {/* Star field */}
            <motion.div
              key="starfield"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
            >
              {WISH_STARS.map((star) => (
                <motion.div
                  key={star.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: star.size,
                    height: star.size,
                  }}
                  animate={{
                    opacity: [
                      star.baseOpacity * 0.4,
                      star.baseOpacity,
                      star.baseOpacity * 0.25,
                      star.baseOpacity,
                    ],
                  }}
                  transition={{
                    duration: star.duration,
                    delay: star.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating back link */}
      <div className="fixed left-4 top-4 z-40 sm:left-6 sm:top-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/70 bg-white/90 px-3 py-2 text-[0.75rem] font-semibold text-sky-600 shadow-[0_4px_16px_-4px_rgba(14,165,233,0.18)] backdrop-blur-sm transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-sky-400 dark:hover:bg-slate-900"
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
        {/* ── Phase 1: Candle blowing ── */}
        {phase === "blowing" && (
          <motion.section
            key="birthday-question"
            initial={{ opacity: 0, y: 32, scale: 0.96, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              scale: 1.04,
              y: -16,
              transition: { duration: 0.35, ease: EASE_OUT },
            }}
            transition={{ duration: 0.52, ease: EASE }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-sky-200/70 bg-white px-5 py-6 shadow-[0_4px_24px_-4px_rgba(14,165,233,0.12),0_0_1px_0_rgba(0,0,0,0.04)] sm:rounded-3xl sm:px-8 sm:py-8 dark:border-sky-900/40 dark:bg-slate-900"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl dark:bg-sky-900/30" />
              <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-900/30" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4 text-center sm:gap-5">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.08, ease: EASE_OUT }}
                className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-500 dark:text-sky-400"
              >
                {eyebrow}
              </motion.p>

              <AnimatedHeadline
                words={headlineWords}
                className="max-w-lg bg-linear-to-br from-sky-600 via-blue-500 to-sky-700 bg-clip-text text-[1.75rem] font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl md:text-[2.75rem]"
                ariaLabel={headlineWords.join(" ")}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.52, delay: 0.22, ease: EASE }}
              >
                <BirthdayCake
                  candleCount={candleCount}
                  blownCandles={blownCandles}
                  recentlyBlown={recentlyBlown}
                  onBlow={handleBlow}
                />
              </motion.div>

              {/* Dynamic hint */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={blownLeft}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="text-[0.8125rem] text-stone-500 dark:text-slate-400"
                >
                  {blownLeft === candleCount
                    ? birthdayConfig.subtext
                    : blownLeft === 0
                      ? "All out! 🎉"
                      : `${blownLeft} candle${blownLeft > 1 ? "s" : ""} left — keep going!`}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {/* ── Phase 2: Make a wish ── */}
        {phase === "wishing" && (
          <motion.div
            key="wishing-screen"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.3 } }}
            transition={{ duration: 0.45, delay: 0.2, ease: EASE }}
            className="relative z-30 flex flex-col items-center gap-7 text-center"
          >
            {/* Pulsing star */}
            <div className="relative">
              <motion.div
                className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300/20 blur-2xl dark:bg-yellow-400/15"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div animate={starControls} className="text-[5.5rem] leading-none sm:text-[6.5rem]">
                ⭐
              </motion.div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1.5">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.35, ease: EASE_OUT }}
                className="text-lg font-medium text-slate-300"
              >
                Close your eyes...
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.7, ease: EASE_OUT }}
                className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
              >
                ...and make a wish 🌠
              </motion.p>
            </div>

            {/* Wish button */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 1.3, ease: EASE }}
            >
              <motion.button
                type="button"
                onClick={handleWish}
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 0 32px 8px rgba(253,224,71,0.25)",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="inline-flex min-h-[54px] touch-manipulation items-center gap-2.5 rounded-full border border-yellow-300/40 bg-white/10 px-10 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                <span>Send my wish</span>
                <span aria-hidden>✨</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ── Phase 3: Success card ── */}
        {phase === "revealed" && (
          <motion.section
            key="birthday-success"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            className="relative z-40 w-full max-w-xl overflow-hidden rounded-2xl border border-sky-200/70 bg-white text-center shadow-[0_4px_24px_-4px_rgba(14,165,233,0.12),0_0_1px_0_rgba(0,0,0,0.04)] sm:rounded-3xl dark:border-sky-900/40 dark:bg-slate-900"
          >
            {/* Gradient hero banner */}
            <div className="relative overflow-hidden bg-linear-to-br from-rose-400 via-pink-400 to-amber-400 px-5 pb-8 pt-7 sm:px-8 sm:pb-9 sm:pt-8">
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
                    🎂
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
              <div className="absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-pink-100/40 blur-3xl dark:bg-pink-900/20" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3 px-5 pb-5 pt-3 sm:gap-4 sm:px-8 sm:pb-8 sm:pt-4">

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.32, ease: EASE_OUT }}
                className="max-w-md text-balance text-[0.9375rem] leading-[1.6] text-stone-600 sm:text-base sm:leading-[1.65] dark:text-slate-300"
              >
                {replaceSenderName(birthdayConfig.success.message, senderName)}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.32, delay: 0.42 }}
                className="flex items-center justify-center gap-2 text-sky-600 dark:text-sky-400"
              >
                <Avatar name={senderName} size="sm" />
                <span className="text-[0.875rem] font-medium">
                  {replaceSenderName(birthdayConfig.success.signature, senderName)}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.52, ease: EASE_OUT }}
                className="mt-0 w-full"
              >
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.48, ease: EASE_OUT }}
                  className="mb-3 flex w-full items-center gap-3"
                  aria-hidden
                >
                  <div className="h-px flex-1 bg-stone-200/80 dark:bg-slate-700/50" />
                  <span className="text-xs text-stone-400 dark:text-slate-600">✦</span>
                  <div className="h-px flex-1 bg-stone-200/80 dark:bg-slate-700/50" />
                </motion.div>
                <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-wider text-stone-500 sm:text-[0.8125rem] dark:text-slate-400">
                  Share the celebration
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
                    className="inline-flex min-h-[48px] shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50/80 px-5 py-3 text-[0.9375rem] font-semibold text-sky-700 transition-colors hover:bg-sky-100 active:scale-[0.98] disabled:opacity-60 sm:px-6 dark:border-sky-900/40 dark:bg-sky-950/50 dark:text-sky-300 dark:hover:bg-sky-950/70"
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

      {/* Footer — only after reveal */}
      <AnimatePresence>
        {phase === "revealed" && (
          <motion.footer
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, delay: 1.5, ease: EASE }}
            className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-sky-200/40 bg-linear-to-r from-white/90 via-sky-50/90 to-white/90 py-3 backdrop-blur-sm sm:py-3.5 dark:border-sky-900/30 dark:from-slate-900/90 dark:via-sky-950/60 dark:to-slate-900/90"
          >
            <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-2 px-4 text-center sm:flex-row sm:gap-3 sm:px-5">
              <p className="text-[0.75rem] text-stone-500 sm:text-[0.8125rem] dark:text-slate-400">
                Want to make one for someone special?
              </p>
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[40px] touch-manipulation items-center justify-center gap-1.5 rounded-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-600 px-4 py-2 text-[0.8125rem] font-semibold text-white shadow-[0_2px_10px_-2px_rgba(190,18,60,0.3)] transition-all duration-200 hover:scale-105 hover:shadow-[0_4px_14px_-2px_rgba(190,18,60,0.4)] hover:brightness-105 active:scale-[0.98] sm:min-h-[42px] sm:px-5 sm:text-sm"
              >
                <Heart className="h-3.5 w-3.5 shrink-0 fill-current transition-transform duration-200 group-hover:scale-110 sm:h-4 sm:w-4" aria-hidden />
                <span className="whitespace-nowrap">Create your own card</span>
              </Link>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
}
