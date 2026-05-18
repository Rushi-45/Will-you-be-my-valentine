"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Check, Heart, Link2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { congratulationsConfig, replaceSenderName } from "@/config/congratulations";
import { Avatar } from "@/components/Avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";

// ─── constants ────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_OUT = [0.4, 0, 0.2, 1] as const;

type Phase = "ready" | "firing" | "celebrating" | "revealed";

const CELEB_STARS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  char: (["★", "✦", "·", "✦", "★"] as const)[i % 5],
  x: (i * 47 + 13) % 90 + 5,
  y: (i * 37 + 7) % 82 + 5,
  color: (["#818cf8", "#a78bfa", "#c084fc", "#e879f9", "#fbbf24", "#6366f1"] as const)[i % 6],
  delay: (i * 0.13) % 1.8,
  duration: 2.2 + (i * 0.19) % 1.6,
  floatY: 18 + (i * 11) % 28,
  size: 14 + (i * 7) % 16,
}));

// ─── helpers ──────────────────────────────────────────────────────────────────

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// ─── PartyPopperSVG ───────────────────────────────────────────────────────────

function PartyPopperSVG({ fired }: { fired: boolean }) {
  return (
    <svg
      viewBox="0 0 160 180"
      fill="none"
      className="h-52 w-44 drop-shadow-md"
      aria-hidden
    >
      {/* Streamers — appear on fire */}
      <AnimatePresence>
        {fired && (
          <>
            {/* Streamer 1 — top right */}
            <motion.path
              d="M 105 55 Q 130 30 145 15"
              stroke="#a855f7"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            />
            {/* Streamer 2 — upper right */}
            <motion.path
              d="M 110 70 Q 140 55 155 42"
              stroke="#ec4899"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.04, ease: EASE }}
            />
            {/* Streamer 3 — right */}
            <motion.path
              d="M 112 85 Q 145 80 158 72"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.08, ease: EASE }}
            />
            {/* Streamer 4 — upper left */}
            <motion.path
              d="M 95 52 Q 80 25 82 8"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.06, ease: EASE }}
            />
            {/* Confetti dots */}
            {[
              { cx: 132, cy: 22, r: 4, fill: "#a855f7" },
              { cx: 148, cy: 38, r: 3, fill: "#fbbf24" },
              { cx: 122, cy: 12, r: 3, fill: "#ec4899" },
              { cx: 155, cy: 58, r: 3.5, fill: "#6366f1" },
              { cx: 140, cy: 10, r: 2.5, fill: "#10b981" },
              { cx: 72, cy: 8, r: 3, fill: "#f43f5e" },
            ].map(({ cx, cy, r, fill }, i) => (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill={fill}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, delay: 0.1 + i * 0.03, ease: EASE }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Cone body — pointing up-right */}
      <rect
        x="20"
        y="80"
        width="90"
        height="90"
        rx="8"
        fill="url(#popper-gradient)"
        transform="rotate(-35 20 80)"
      />

      {/* Cone stripes */}
      <rect
        x="20"
        y="80"
        width="20"
        height="90"
        rx="4"
        fill="rgba(255,255,255,0.18)"
        transform="rotate(-35 20 80)"
      />
      <rect
        x="50"
        y="80"
        width="20"
        height="90"
        rx="4"
        fill="rgba(255,255,255,0.12)"
        transform="rotate(-35 20 80)"
      />

      {/* Mouth of the popper — the opening */}
      <motion.ellipse
        cx="105"
        cy="75"
        rx="18"
        ry="10"
        fill={fired ? "#c4b5fd" : "#7c3aed"}
        animate={{ ry: fired ? 14 : 10 }}
        transition={{ duration: 0.2, ease: EASE }}
      />

      {/* Handle — at the bottom of the cone */}
      <rect
        x="22"
        y="154"
        width="14"
        height="20"
        rx="7"
        fill="#5b21b6"
      />

      {/* String — droops down, gets pulled on fire */}
      <motion.path
        d="M 29 174 Q 18 192 22 205"
        stroke="#7c3aed"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        animate={fired ? { d: "M 29 174 Q 22 188 24 198" } : { d: "M 29 174 Q 18 192 22 205" }}
        transition={{ duration: 0.2, ease: EASE }}
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="popper-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── CongratulationsPage ──────────────────────────────────────────────────────

export function CongratulationsPage() {
  const searchParams = useSearchParams();

  const recipientName = useMemo(() => {
    const raw = searchParams.get("name")?.trim();
    return raw ? capitalize(raw) : null;
  }, [searchParams]);

  const senderName = useMemo(() => {
    const raw = searchParams.get("sender")?.trim();
    return raw ? capitalize(raw) : congratulationsConfig.senderName;
  }, [searchParams]);

  const headlineWords = useMemo(() => {
    const text = recipientName
      ? `Congratulations, ${recipientName}!`
      : `${congratulationsConfig.headline}!`;
    return text.split(" ");
  }, [recipientName]);

  const [phase, setPhase] = useState<Phase>("ready");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const popperControls = useAnimationControls();

  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
  }, []);

  // Idle bob animation
  useEffect(() => {
    popperControls.start({
      rotate: [-3, 3, -3],
      y: [0, -6, 0],
      transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
    });
  }, [popperControls]);

  const handlePop = useCallback(async () => {
    if (phase !== "ready") return;
    setPhase("firing");

    // Quick recoil animation
    await popperControls.start({
      scale: [1, 1.15, 0.95, 1],
      rotate: [-3, 8, -2, 0],
      transition: { duration: 0.38, ease: EASE },
    });

    setPhase("celebrating");
  }, [phase, popperControls]);

  const handleCelebrate = useCallback(async () => {
    const { default: confetti } = await import("canvas-confetti");
    const colors = [
      "#7c3aed", "#a855f7", "#c4b5fd",
      "#6366f1", "#ec4899", "#fbbf24", "#ffffff",
    ];
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { x: 0.5, y: 0.32 },
      colors,
      startVelocity: 62,
    });
    setTimeout(() => {
      confetti({
        particleCount: 55,
        spread: 80,
        angle: 115,
        origin: { x: 0.7, y: 0.45 },
        colors,
        startVelocity: 44,
      });
    }, 180);
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 70,
        angle: 65,
        origin: { x: 0.3, y: 0.5 },
        colors,
        startVelocity: 38,
      });
    }, 320);

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
    return `https://wa.me/?text=${encodeURIComponent(`🎉 ${shareUrl}`)}`;
  }, [shareUrl]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-indigo-50/60 pb-20 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-16 text-stone-800 sm:px-5 sm:pb-24 sm:pt-20 dark:bg-slate-950/70 dark:text-slate-100">
      {/* Ambient glow rings */}
      <div
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        {([360, 500, 640] as const).map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-indigo-300/25 dark:border-indigo-700/20"
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

      {/* Back link */}
      <div className="fixed left-4 top-4 z-40 sm:left-6 sm:top-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/70 bg-white/90 px-3 py-2 text-[0.75rem] font-semibold text-indigo-600 shadow-[0_4px_16px_-4px_rgba(99,102,241,0.18)] backdrop-blur-sm transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-indigo-400 dark:hover:bg-slate-900"
        >
          <Heart className="h-3.5 w-3.5 fill-current" aria-hidden />
          <span>Wishing Cards</span>
        </Link>
      </div>

      {/* Theme toggle */}
      <div className="fixed right-4 top-4 z-40 sm:right-6 sm:top-6">
        <ThemeToggle variant="floating" />
      </div>

      {/* ── Celebrating backdrop + star field (outside mode="wait" to avoid stacking-context breakage) ── */}
      <AnimatePresence>
        {phase === "celebrating" && (
          <>
            <motion.div
              key="celeb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="fixed inset-0 z-20 bg-linear-to-br from-indigo-950/96 via-violet-950/92 to-indigo-950/96"
              aria-hidden
            />
            {CELEB_STARS.map((s) => (
              <motion.span
                key={s.id}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, s.id % 3 === 0 ? 0.9 : 0.6, 0, s.id % 3 === 0 ? 0.9 : 0.6],
                  y: [`${s.y}vh`, `${s.y - s.floatY * 0.5}vh`, `${s.y}vh`],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: s.duration,
                  delay: s.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none fixed z-20 select-none"
                style={{
                  left: `${s.x}vw`,
                  top: `${s.y}vh`,
                  color: s.color,
                  fontSize: s.size,
                  textShadow: `0 0 8px ${s.color}99`,
                }}
                aria-hidden
              >
                {s.char}
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(phase === "ready" || phase === "firing") ? (
          <motion.div
            key="popper-view"
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
              className="text-[11px] font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400"
            >
              {congratulationsConfig.eyebrow}
            </motion.p>

            {/* Headline */}
            <AnimatedHeadline
              words={headlineWords}
              className="max-w-lg bg-linear-to-br from-indigo-600 via-violet-500 to-indigo-700 bg-clip-text text-[1.75rem] font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl md:text-[2.75rem]"
              ariaLabel={headlineWords.join(" ")}
            />

            {/* Party popper */}
            <motion.button
              type="button"
              onClick={handlePop}
              disabled={phase !== "ready"}
              aria-label="Pop the party popper"
              animate={popperControls}
              className="mt-2 cursor-pointer touch-manipulation focus-visible:outline-none disabled:cursor-default"
              whileHover={phase === "ready" ? { scale: 1.06 } : undefined}
              whileTap={phase === "ready" ? { scale: 0.95 } : undefined}
            >
              <PartyPopperSVG fired={phase === "firing"} />
            </motion.button>

            {/* Hint */}
            <AnimatePresence>
              {phase === "ready" && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
                  transition={{ delay: 0.55, duration: 0.32, ease: EASE_OUT }}
                  className="text-sm text-stone-500 dark:text-slate-400"
                >
                  Tap to pop the confetti 🎉
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ) : phase === "celebrating" ? (
          /* ── Celebrating interstitial ── */
          <motion.div
            key="celebrating-view"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.25, ease: EASE_OUT } }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative z-30 flex flex-col items-center gap-6 text-center"
          >
            {/* Pulsing 🎉 with glow */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.25, 0.08, 0.25] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-32 w-32 rounded-full bg-violet-500/30 blur-2xl"
                aria-hidden
              />
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="relative text-[5.5rem] leading-none drop-shadow-lg sm:text-[6.5rem]"
                aria-hidden
              >
                🎉
              </motion.span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4, ease: EASE_OUT }}
                className="text-lg font-semibold text-violet-200 sm:text-xl"
              >
                You set your sights on something...
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.4, ease: EASE_OUT }}
                className="text-base text-indigo-300/80 sm:text-lg"
              >
                ...and you went and did it 🎉
              </motion.p>
            </div>

            <motion.button
              type="button"
              onClick={handleCelebrate}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4, ease: EASE_OUT }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="min-h-[52px] touch-manipulation rounded-2xl border border-violet-300/40 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:outline-none"
            >
              Celebrate! 🎉
            </motion.button>
          </motion.div>
        ) : (
          /* ── Success card ── */
          <motion.section
            key="congrats-success"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="relative z-40 w-full max-w-xl overflow-hidden rounded-2xl border border-indigo-200/70 bg-white text-center shadow-[0_4px_24px_-4px_rgba(99,102,241,0.14),0_0_1px_0_rgba(0,0,0,0.04)] sm:rounded-3xl dark:border-indigo-900/40 dark:bg-slate-900"
          >
            {/* Gradient hero banner */}
            <div className="relative overflow-hidden bg-linear-to-br from-indigo-500 via-violet-500 to-purple-500 px-5 pb-8 pt-7 sm:px-8 sm:pb-9 sm:pt-8">
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
                    🎉
                  </motion.div>
                </div>
                <AnimatedHeadline
                  words={congratulationsConfig.success.headline.split(" ")}
                  className="text-xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] sm:text-2xl"
                  ariaLabel={congratulationsConfig.success.headline}
                />
              </div>
            </div>

            {/* Ambient background blobs */}
            <div className="pointer-events-none absolute inset-0 z-0">
              <div className="absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-violet-100/40 blur-3xl dark:bg-violet-900/20" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3 px-5 pb-5 pt-3 sm:gap-4 sm:px-8 sm:pb-8 sm:pt-4">

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.3, ease: EASE_OUT }}
                className="max-w-md text-balance text-[0.9375rem] leading-[1.65] text-stone-600 sm:text-base dark:text-slate-300"
              >
                {congratulationsConfig.message}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.4, ease: EASE_OUT }}
                className="max-w-md text-balance text-sm leading-[1.65] text-stone-500 dark:text-slate-400"
              >
                {replaceSenderName(congratulationsConfig.success.message, senderName)}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.32, delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400"
              >
                <Avatar name={senderName} size="sm" />
                <span className="text-[0.875rem] font-medium">
                  {replaceSenderName(
                    congratulationsConfig.success.signature,
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
                    className="inline-flex min-h-[48px] shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 px-5 py-3 text-[0.9375rem] font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 active:scale-[0.98] disabled:opacity-60 sm:px-6 dark:border-indigo-900/40 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-950/70"
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
            className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-indigo-200/40 bg-linear-to-r from-white/90 via-indigo-50/90 to-white/90 py-3 backdrop-blur-sm sm:py-3.5 dark:border-indigo-900/30 dark:from-slate-900/90 dark:via-indigo-950/60 dark:to-slate-900/90"
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
