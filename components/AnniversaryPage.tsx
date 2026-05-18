"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Heart, Instagram, Link2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { anniversaryConfig, replaceSenderName } from "@/config/anniversary";
import { Avatar } from "@/components/Avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";

// ─── constants ────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_OUT = [0.4, 0, 0.2, 1] as const;

type Phase = "sealed" | "opening" | "sending" | "revealed";

// Deterministic floating hearts for the sending screen
const FLOAT_HEARTS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: (i * 47 + 13) % 90 + 5,
  y: (i * 37 + 7) % 82 + 5,
  size: 11 + (i % 4) * 4,
  color: ["#c084fc", "#e879f9", "#f0abfc", "#a855f7", "#d946ef"][i % 5],
  baseOpacity: 0.22 + (i % 5) * 0.08,
  delay: (i % 9) * 0.28,
  duration: 2.2 + (i % 5) * 0.5,
  floatY: 12 + (i % 4) * 6,
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

// ─── Envelope ─────────────────────────────────────────────────────────────────

const Envelope = memo(function Envelope({
  phase,
  onOpen,
}: {
  phase: Phase;
  onOpen: () => void;
}) {
  const isOpen = phase !== "sealed";

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      disabled={isOpen}
      aria-label="Open the anniversary envelope"
      animate={!isOpen ? { y: [0, -7, 0] } : { y: 0 }}
      transition={
        !isOpen
          ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.3 }
      }
      whileHover={!isOpen ? { scale: 1.03 } : {}}
      whileTap={!isOpen ? { scale: 0.98 } : {}}
      className="relative cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 focus-visible:ring-offset-4 disabled:cursor-default"
      style={{ perspective: "900px" }}
    >
      {/* Envelope body */}
      <div className="relative h-48 w-72 overflow-hidden rounded-b-2xl shadow-[0_8px_32px_-8px_rgba(147,51,234,0.25)] sm:h-52 sm:w-80 dark:shadow-[0_8px_32px_-8px_rgba(147,51,234,0.4)]">
        <div className="absolute inset-0 bg-linear-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/70 dark:to-fuchsia-900/70" />
        <div
          className="absolute inset-0 bg-purple-200/70 dark:bg-purple-700/50"
          style={{ clipPath: "polygon(0% 0%, 50% 52%, 0% 100%)" }}
        />
        <div
          className="absolute inset-0 bg-fuchsia-200/70 dark:bg-fuchsia-700/50"
          style={{ clipPath: "polygon(100% 0%, 50% 52%, 100% 100%)" }}
        />
        <div
          className="absolute inset-0 bg-purple-300/50 dark:bg-purple-600/40"
          style={{ clipPath: "polygon(0% 100%, 50% 52%, 100% 100%)" }}
        />
      </div>

      {/* Flap */}
      <motion.div
        className="absolute left-0 right-0 top-0 z-10 overflow-hidden"
        style={{
          height: "55%",
          clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
          transformOrigin: "top center",
          backfaceVisibility: "hidden",
        }}
        animate={{ rotateX: isOpen ? -175 : 0 }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-purple-200 to-fuchsia-300 dark:from-purple-700 dark:to-fuchsia-800" />
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.15 } }}
              className="absolute bottom-2 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-purple-600 shadow-md dark:bg-purple-500"
            >
              <Heart className="h-4 w-4 fill-white text-white" aria-hidden />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
});

// ─── AnniversaryPage ──────────────────────────────────────────────────────────

export function AnniversaryPage() {
  const searchParams = useSearchParams();

  const recipientName = useMemo(() => {
    const raw = searchParams.get("name")?.trim();
    return raw ? capitalize(raw) : null;
  }, [searchParams]);

  const senderName = useMemo(() => {
    const raw = searchParams.get("sender")?.trim();
    return raw ? capitalize(raw) : anniversaryConfig.senderName;
  }, [searchParams]);

  const years = useMemo(() => {
    const raw = searchParams.get("years")?.trim();
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [searchParams]);

  const eyebrow = useMemo(
    () =>
      years
        ? `Happy ${ordinal(years)} Anniversary`
        : anniversaryConfig.eyebrow,
    [years],
  );

  const headlineWords = useMemo(() => {
    const base = recipientName
      ? `A little something for you, ${recipientName}`
      : anniversaryConfig.headline;
    return base.split(" ");
  }, [recipientName]);

  const successHeadline = useMemo(() => {
    const base = years
      ? `Happy ${ordinal(years)} Anniversary`
      : "Happy Anniversary";
    return recipientName ? `${base}, ${recipientName}!` : `${base}!`;
  }, [years, recipientName]);

  const [phase, setPhase] = useState<Phase>("sealed");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
  }, []);

  const handleOpenEnvelope = useCallback(() => {
    if (phase !== "sealed") return;
    setPhase("opening");
    // After flap opens, move to the sending interstitial
    setTimeout(() => setPhase("sending"), 1050);
  }, [phase]);

  const handleSendLove = useCallback(async () => {
    const { default: confetti } = await import("canvas-confetti");
    const colors = [
      "#9333ea",
      "#d946ef",
      "#f472b6",
      "#c4b5fd",
      "#ffffff",
      "#fbbf24",
    ];
    confetti({
      particleCount: 65,
      spread: 85,
      origin: { x: 0.28, y: 0.45 },
      colors,
      startVelocity: 44,
    });
    confetti({
      particleCount: 65,
      spread: 85,
      origin: { x: 0.72, y: 0.45 },
      colors,
      startVelocity: 44,
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { x: 0.5, y: 0.35 },
        colors,
        startVelocity: 52,
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
    return `https://wa.me/?text=${encodeURIComponent(`💜 ${shareUrl}`)}`;
  }, [shareUrl]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-purple-50/60 pb-20 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-16 text-stone-800 sm:px-5 sm:pb-24 sm:pt-20 dark:bg-slate-950/70 dark:text-slate-100">
      {/* Ambient glow rings */}
      <div
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        {([360, 500, 640] as const).map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-purple-300/20 dark:border-purple-700/20"
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

      {/* ── Sending overlay + hearts (fixed, outside AnimatePresence) ── */}
      <AnimatePresence>
        {phase === "sending" && (
          <>
            <motion.div
              key="send-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-rose-950/96 via-purple-950/92 to-fuchsia-950/96"
            />
            <motion.div
              key="heart-field"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
            >
              {FLOAT_HEARTS.map((h) => (
                <motion.span
                  key={h.id}
                  className="absolute select-none"
                  style={{
                    left: `${h.x}%`,
                    top: `${h.y}%`,
                    fontSize: h.size,
                    color: h.color,
                    opacity: h.baseOpacity,
                  }}
                  animate={{
                    y: [-h.floatY, 0, -h.floatY],
                    opacity: [
                      h.baseOpacity * 0.4,
                      h.baseOpacity,
                      h.baseOpacity * 0.4,
                    ],
                    scale: [0.88, 1.08, 0.88],
                  }}
                  transition={{
                    duration: h.duration,
                    delay: h.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ♥
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
          className="inline-flex items-center gap-1.5 rounded-full border border-purple-200/70 bg-white/90 px-3 py-2 text-[0.75rem] font-semibold text-purple-600 shadow-[0_4px_16px_-4px_rgba(147,51,234,0.18)] backdrop-blur-sm transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-purple-400 dark:hover:bg-slate-900"
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
        {/* ── Phase 1 + 2: Envelope (sealed → opening) ── */}
        {(phase === "sealed" || phase === "opening") && (
          <motion.div
            key="envelope-view"
            initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: -12,
              transition: { duration: 0.32, ease: EASE_OUT },
            }}
            transition={{ duration: 0.52, ease: EASE }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.08, ease: EASE_OUT }}
              className="text-[11px] font-semibold uppercase tracking-[0.3em] text-purple-500 dark:text-purple-400"
            >
              {eyebrow}
            </motion.p>

            <AnimatedHeadline
              words={headlineWords}
              className="max-w-lg bg-linear-to-br from-purple-700 via-fuchsia-600 to-purple-800 bg-clip-text text-[1.75rem] font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl md:text-[2.75rem]"
              ariaLabel={headlineWords.join(" ")}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.52, delay: 0.24, ease: EASE }}
            >
              <Envelope phase={phase} onOpen={handleOpenEnvelope} />
            </motion.div>

            <AnimatePresence>
              {phase === "sealed" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="text-[0.8125rem] text-stone-500 dark:text-slate-400"
                >
                  {anniversaryConfig.openHint}
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
            {/* Pulsing heart */}
            <div className="relative">
              <motion.div
                className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/20 blur-2xl"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.15, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                className="text-[5.5rem] leading-none sm:text-[6.5rem]"
              >
                💜
              </motion.div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1.5">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.35, ease: EASE_OUT }}
                className="text-lg font-medium text-purple-200"
              >
                Written with love...
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.7, ease: EASE_OUT }}
                className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
              >
                ...and sealed just for you 💌
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
                onClick={handleSendLove}
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 0 32px 8px rgba(216,180,254,0.2)",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="inline-flex min-h-[54px] touch-manipulation items-center gap-2.5 rounded-full border border-purple-300/40 bg-white/10 px-10 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                <span>Send with love</span>
                <span aria-hidden>💜</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ── Phase 4: Success card ── */}
        {phase === "revealed" && (
          <motion.section
            key="anniversary-success"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="relative z-40 w-full max-w-xl overflow-hidden rounded-2xl border border-purple-200/70 bg-white p-5 text-center shadow-[0_4px_24px_-4px_rgba(147,51,234,0.12),0_0_1px_0_rgba(0,0,0,0.04)] sm:rounded-3xl sm:p-8 dark:border-purple-900/40 dark:bg-slate-900"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-12 top-0 h-48 bg-linear-to-b from-purple-50/80 via-fuchsia-50/40 to-transparent blur-3xl dark:from-purple-950/50 dark:via-fuchsia-950/30" />
              <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-fuchsia-100/40 blur-3xl dark:bg-fuchsia-900/20" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-5">
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 18,
                  delay: 0.1,
                }}
                className="text-6xl sm:text-7xl"
                aria-hidden
              >
                💜
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.22, ease: EASE_OUT }}
                className="max-w-md bg-linear-to-br from-purple-700 via-fuchsia-600 to-purple-800 bg-clip-text text-2xl font-extrabold leading-tight tracking-tight text-transparent sm:text-3xl"
              >
                {successHeadline}
              </motion.h2>

              <div className="flex flex-col gap-1.5 text-center">
                {anniversaryConfig.letterLines.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.42,
                      delay: 0.32 + i * 0.2,
                      ease: EASE_OUT,
                    }}
                    className="text-[0.9375rem] italic leading-[1.7] text-stone-600 dark:text-slate-300"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.32,
                  delay: 0.32 + anniversaryConfig.letterLines.length * 0.2,
                  ease: EASE_OUT,
                }}
                className="max-w-md text-balance text-sm leading-[1.65] text-stone-500 dark:text-slate-400"
              >
                {replaceSenderName(anniversaryConfig.success.message, senderName)}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.32,
                  delay: 0.5 + anniversaryConfig.letterLines.length * 0.2,
                }}
                className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400"
              >
                <Avatar name={senderName} size="sm" />
                <span className="text-[0.875rem] font-medium">
                  {replaceSenderName(anniversaryConfig.success.signature, senderName)}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.32,
                  delay: 0.65 + anniversaryConfig.letterLines.length * 0.2,
                  ease: EASE_OUT,
                }}
                className="mt-1 w-full sm:mt-2"
              >
                <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-wider text-stone-500 sm:text-[0.8125rem] dark:text-slate-400">
                  Share the love
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
                    className="inline-flex min-h-[48px] shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50/80 px-5 py-3 text-[0.9375rem] font-semibold text-purple-700 transition-colors hover:bg-purple-100 active:scale-[0.98] disabled:opacity-60 sm:px-6 dark:border-purple-900/40 dark:bg-purple-950/50 dark:text-purple-300 dark:hover:bg-purple-950/70"
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
            transition={{ duration: 0.4, delay: 1.8, ease: EASE }}
            className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-purple-100/50 bg-white/85 py-2.5 backdrop-blur-sm sm:py-3 dark:border-purple-900/30 dark:bg-slate-900/85"
          >
            <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-1.5 px-4 text-center sm:flex-row sm:gap-2 sm:px-5">
              <p className="text-[0.75rem] text-stone-600 sm:text-[0.8125rem] dark:text-slate-400">
                Loved this? Make one for someone special.
              </p>
              <a
                href="https://www.instagram.com/rushiii.js"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[40px] touch-manipulation items-center justify-center gap-1.5 rounded-full border border-purple-200/60 bg-linear-to-r from-purple-500 via-fuchsia-500 to-purple-600 px-4 py-2 text-[0.8125rem] font-semibold text-white shadow-[0_2px_8px_-2px_rgba(147,51,234,0.25)] transition-all duration-200 hover:scale-105 active:scale-[0.98] sm:min-h-[42px] sm:px-5 sm:py-2.5 sm:text-sm"
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
