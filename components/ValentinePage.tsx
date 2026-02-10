"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { valentineConfig, replaceSenderName } from "@/config/valentine";
import { FloatingHearts } from "@/components/FloatingHearts";

const MusicToggle = memo(function MusicToggle({
  musicOn,
  onToggle,
}: {
  musicOn: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      onClick={onToggle}
      aria-label={musicOn ? "Mute background music" : "Play background music"}
      className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-pink-200/80 bg-white/90 shadow-[0_4px_16px_-4px_rgba(190,18,60,0.15)] backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-pink-50 sm:bottom-6 sm:right-6"
    >
      <span className="text-xl" aria-hidden="true">
        {musicOn ? "🔊" : "🔇"}
      </span>
    </motion.button>
  );
});

function getRecipientName(
  searchParams: ReturnType<typeof useSearchParams>,
): string | null {
  const name = searchParams.get("name");
  if (!name || typeof name !== "string") return null;
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function capitalizeName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

type CursorVariant = "default" | "interactive" | "disabled" | "loading";

const CURSOR_CLASSES: Record<CursorVariant, string> = {
  default: "cursor-default",
  interactive: "cursor-pointer",
  disabled: "cursor-not-allowed",
  loading: "cursor-wait",
};

const NO_MESSAGES = valentineConfig.noButtonMessages;

const MOTION = {
  ease: [0.16, 1, 0.3, 1] as const,
  easeOut: [0.4, 0, 0.2, 1] as const,
  duration: { fast: 0.2, normal: 0.32, slow: 0.48, entrance: 0.52, exit: 0.4 },
  stagger: 0.08,
} as const;

function getNoButtonLabel(clickCount: number): string {
  const index = Math.min(clickCount, NO_MESSAGES.length - 1);
  return NO_MESSAGES[index];
}

export function ValentinePage() {
  const searchParams = useSearchParams();
  const recipientName = useMemo(() => {
    const raw = getRecipientName(searchParams);
    return raw ? capitalizeName(raw) : null;
  }, [searchParams]);

  const [noClickCount, setNoClickCount] = useState(0);
  const [noOffsets, setNoOffsets] = useState({ x: 0, y: 0 });
  const [yesScale, setYesScale] = useState(1);
  const [noScale, setNoScale] = useState(1);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isConfettiRunning, setIsConfettiRunning] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicSrc = valentineConfig.backgroundMusic ?? null;

  const headlineLine1 = useMemo(
    () =>
      recipientName
        ? `${recipientName}, will you be`
        : valentineConfig.headline.line1,
    [recipientName],
  );
  const successHeadline = useMemo(
    () =>
      recipientName
        ? `You said yes, ${recipientName}!`
        : valentineConfig.success.headline,
    [recipientName],
  );

  const noButtonLabel = useMemo(
    () => getNoButtonLabel(noClickCount),
    [noClickCount],
  );

  const handleNoHover = useCallback(() => {
    const randomX = (Math.random() - 0.5) * 140;
    const randomY = (Math.random() - 0.5) * 80;
    setNoOffsets({ x: randomX, y: randomY });
  }, []);

  const handleNoClick = useCallback(() => {
    setNoClickCount((previous) => previous + 1);
    setYesScale((previous) => Math.min(previous + 0.2, 3));
    setNoScale((previous) => Math.max(previous - 0.08, 0.5));
  }, []);

  const triggerConfetti = useCallback(async () => {
    setIsConfettiRunning(true);

    const { default: confetti } = await import("canvas-confetti");

    const duration = 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    let frameCount = 0;

    const frame = () => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        setIsConfettiRunning(false);
        return;
      }

      const particleCount = 18 * (timeLeft / duration);

      if (frameCount % 3 === 0) {
        confetti({
          particleCount,
          spread: 80,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          particleCount,
          spread: 80,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }
      frameCount += 1;

      requestAnimationFrame(frame);
    };

    frame();
  }, []);

  const handleYesClick = useCallback(() => {
    if (isConfettiRunning) return;

    setIsAccepted(true);
    triggerConfetti();
  }, [isConfettiRunning, triggerConfetti]);

  useEffect(() => {
    if (isAccepted) {
      setNoOffsets({ x: 0, y: 0 });
      setNoScale(1);
    }
  }, [isAccepted]);

  const toggleMusic = useCallback(() => {
    if (!musicSrc) return;
    if (musicOn) {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        setMusicOn(false);
      }
    } else {
      let audio = audioRef.current;
      if (!audio) {
        audio = new Audio(musicSrc);
        audio.loop = true;
        audioRef.current = audio;
      }
      audio
        .play()
        .then(() => setMusicOn(true))
        .catch(() => setMusicOn(false));
    }
  }, [musicOn, musicSrc]);

  const showMusicToggle = Boolean(musicSrc);

  const yesCursorClasses = useMemo(
    () => CURSOR_CLASSES[isConfettiRunning ? "loading" : "interactive"],
    [isConfettiRunning],
  );

  const noCursorClasses = CURSOR_CLASSES.interactive;

  const containerScale = useMemo(() => {
    const extraClicks = Math.max(noClickCount - 5, 0);
    const added = extraClicks * 0.12;
    return Math.min(1 + added, 1.9);
  }, [noClickCount]);

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-pink-50/90 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] text-stone-800 sm:justify-center sm:py-16 sm:px-5">
      {showMusicToggle && (
        <MusicToggle musicOn={musicOn} onToggle={toggleMusic} />
      )}
      <FloatingHearts />
      <AnimatePresence mode="wait">
        {!isAccepted && (
          <motion.section
            key="valentine-question"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: containerScale }}
            exit={{
              opacity: [1, 1, 0],
              scale: [1, 1.04, 1.08],
              y: [0, 0, -16],
              transition: {
                duration: MOTION.duration.exit,
                times: [0, 0.4, 1],
                ease: MOTION.easeOut,
              },
            }}
            transition={{
              duration: MOTION.duration.entrance,
              ease: MOTION.ease,
            }}
            className="relative mt-5 w-full max-w-xl overflow-hidden rounded-2xl border border-pink-200/80 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(190,18,60,0.12),0_0_1px_0_rgba(0,0,0,0.04)] sm:mt-0 sm:rounded-3xl sm:p-10 md:p-12"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-rose-100/60 blur-3xl" />
              <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-pink-100/50 blur-3xl" />
              <div className="absolute right-1/3 top-1/3 h-40 w-40 rounded-full bg-rose-50/50 blur-2xl" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: MOTION.stagger * 4,
                duration: MOTION.duration.normal,
                ease: MOTION.ease,
              }}
              className="absolute right-4 top-4 z-20 overflow-hidden rounded-xl border border-pink-200/70 shadow-md sm:right-5 sm:top-5"
            >
              <Image
                src={valentineConfig.images.cornerCat}
                alt=""
                width={72}
                height={72}
                className="h-14 w-14 object-cover sm:h-18 sm:w-18"
                priority
              />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center gap-8 text-center sm:gap-10">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: MOTION.duration.normal,
                  delay: MOTION.stagger,
                  ease: MOTION.easeOut,
                }}
                className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-500"
              >
                {valentineConfig.eyebrow}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: MOTION.duration.entrance,
                  delay: MOTION.stagger * 2,
                  ease: MOTION.ease,
                }}
                className="max-w-lg bg-linear-to-br from-rose-700 via-pink-600 to-rose-800 bg-clip-text text-[2rem] font-extrabold leading-tight tracking-tight text-transparent sm:text-5xl md:text-[3.25rem] md:leading-[1.12]"
              >
                {headlineLine1}
                <span className="mt-1.5 block text-pink-600">
                  {valentineConfig.headline.line2}
                </span>
              </motion.h1>

              <AnimatePresence>
                {noClickCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.88, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="flex justify-center"
                  >
                    <img
                      src={valentineConfig.images.cryingCat}
                      alt=""
                      className="h-20 w-20 object-cover sm:h-24 sm:w-24"
                      width={96}
                      height={96}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: MOTION.duration.normal,
                  delay: MOTION.stagger * 3,
                  ease: MOTION.easeOut,
                }}
                className="max-w-md text-balance text-[0.9375rem] leading-[1.6] text-stone-600 sm:text-base sm:leading-[1.65]"
              >
                {valentineConfig.promise}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: MOTION.duration.normal,
                  delay: MOTION.stagger * 4,
                  ease: MOTION.easeOut,
                }}
                className="mt-1 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
              >
                <motion.button
                  type="button"
                  whileHover={{
                    scale: isConfettiRunning ? 1 : yesScale + 0.04,
                    y: isConfettiRunning ? 0 : -2,
                    boxShadow:
                      "0 10px 24px -6px rgba(190, 18, 60, 0.35), 0 0 0 1px rgba(255,255,255,0.25) inset",
                  }}
                  whileTap={{
                    scale: isConfettiRunning
                      ? 1
                      : Math.max(yesScale - 0.02, 0.98),
                    y: 0,
                  }}
                  animate={{ scale: yesScale }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  onClick={handleYesClick}
                  disabled={isConfettiRunning}
                  className={`inline-flex items-center justify-center rounded-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-600 px-8 py-3.5 text-[0.9375rem] font-semibold text-white shadow-[0_4px_14px_-2px_rgba(190,18,60,0.35)] transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${yesCursorClasses}`}
                >
                  <span className="mr-1.5">Yes</span>
                  <span aria-hidden="true" className="text-lg">
                    💕
                  </span>
                </motion.button>

                <motion.div
                  className="relative h-11 w-full sm:h-auto sm:w-auto origin-center"
                  animate={{
                    x: noOffsets.x,
                    y: noOffsets.y,
                    scale: noScale,
                  }}
                  transition={{
                    x: { type: "spring", stiffness: 180, damping: 16 },
                    y: { type: "spring", stiffness: 180, damping: 16 },
                    scale: { type: "spring", stiffness: 320, damping: 22 },
                  }}
                >
                  <motion.button
                    type="button"
                    onMouseEnter={handleNoHover}
                    onClick={handleNoClick}
                    whileHover={{
                      scale: 1.03,
                      y: -1,
                      boxShadow:
                        "0 4px 12px -2px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.6) inset",
                    }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    className={`inline-flex h-11 w-full items-center justify-center rounded-full border border-pink-200 bg-pink-50/80 px-5 text-[0.875rem] font-medium text-stone-600 shadow-sm transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto ${noCursorClasses}`}
                  >
                    <span className="mr-1.5">
                      {noClickCount === 0 ? "No" : noButtonLabel}
                    </span>
                    <span aria-hidden="true" className="text-base">
                      😢
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>

              <motion.a
                href="https://wa.me/917016552650?text=Hi%2C%20I'd%20like%20to%20create%20my%20own%20custom%20Valentine%20page"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: MOTION.duration.normal,
                  delay: MOTION.stagger * 5,
                }}
                className="mt-6 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-rose-600 underline decoration-rose-200 underline-offset-2 transition-colors hover:text-rose-700 hover:decoration-rose-400 cursor-pointer sm:mt-8 sm:text-sm"
              >
                Create Your Own Custom Valentine Page →
              </motion.a>
            </div>
          </motion.section>
        )}

        {isAccepted && (
          <motion.section
            key="valentine-accepted"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{
              duration: MOTION.duration.entrance,
              delay: MOTION.duration.fast,
              ease: MOTION.ease,
            }}
            className="relative mt-5 w-full max-w-xl overflow-hidden rounded-2xl border border-pink-200/80 bg-white p-6 text-center shadow-[0_4px_24px_-4px_rgba(190,18,60,0.12),0_0_1px_0_rgba(0,0,0,0.04)] sm:mt-0 sm:rounded-3xl sm:p-10 md:p-12"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-12 top-0 h-44 bg-linear-to-b from-rose-50/70 via-pink-50/40 to-transparent blur-3xl" />
              <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-pink-100/40 blur-3xl" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: MOTION.stagger * 3,
                duration: MOTION.duration.normal,
                ease: MOTION.ease,
              }}
              className="absolute right-4 top-4 z-20 overflow-hidden rounded-xl border border-pink-200/70 shadow-md sm:right-5 sm:top-5"
            >
              <Image
                src={valentineConfig.images.cornerCat}
                alt=""
                width={72}
                height={72}
                className="h-14 w-14 object-cover sm:h-18 sm:w-18"
              />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8">
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 18,
                  delay: MOTION.stagger,
                }}
                className="flex justify-center"
              >
                <img
                  src={valentineConfig.images.huggingCat}
                  alt=""
                  className="h-36 w-36 object-cover sm:h-44 sm:w-44"
                  width={176}
                  height={176}
                />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: MOTION.duration.normal,
                  delay: MOTION.stagger * 2,
                  ease: MOTION.easeOut,
                }}
                className="max-w-md bg-linear-to-br from-rose-700 via-pink-600 to-rose-800 bg-clip-text text-2xl font-extrabold leading-tight tracking-tight text-transparent sm:text-3xl"
              >
                {successHeadline}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: MOTION.duration.normal,
                  delay: MOTION.stagger * 3,
                  ease: MOTION.easeOut,
                }}
                className="max-w-md text-balance text-[0.9375rem] leading-[1.6] text-stone-600 sm:text-base sm:leading-[1.65]"
              >
                {replaceSenderName(
                  valentineConfig.success.message,
                  valentineConfig.senderName,
                )}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: MOTION.duration.normal,
                  delay: MOTION.stagger * 4,
                }}
                className="mt-2 text-[0.875rem] font-medium text-rose-600"
              >
                {replaceSenderName(
                  valentineConfig.success.signature,
                  valentineConfig.senderName,
                )}
              </motion.p>

              <motion.a
                href="https://wa.me/917016552650?text=Hi%2C%20I'd%20like%20to%20create%20my%20own%20custom%20Valentine%20page"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: MOTION.duration.normal,
                  delay: MOTION.stagger * 5,
                }}
                className="mt-6 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-rose-600 underline decoration-rose-200 underline-offset-2 transition-colors hover:text-rose-700 hover:decoration-rose-400 cursor-pointer sm:mt-8 sm:text-sm"
              >
                Create Your Own Custom Valentine Page →
              </motion.a>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
