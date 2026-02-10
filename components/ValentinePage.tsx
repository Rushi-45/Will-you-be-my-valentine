"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { valentineConfig, replaceSenderName } from "@/config/valentine";
import { FloatingHearts } from "@/components/FloatingHearts";

type CursorVariant = "default" | "interactive" | "disabled" | "loading";

const CURSOR_CLASSES: Record<CursorVariant, string> = {
  default: "cursor-default",
  interactive: "cursor-pointer",
  disabled: "cursor-not-allowed",
  loading: "cursor-wait",
};

const NO_MESSAGES = valentineConfig.noButtonMessages;

function getNoButtonLabel(clickCount: number): string {
  const index = Math.min(clickCount, NO_MESSAGES.length - 1);
  return NO_MESSAGES[index];
}

export function ValentinePage() {
  const [noClickCount, setNoClickCount] = useState(0);
  const [noOffsets, setNoOffsets] = useState({ x: 0, y: 0 });
  const [yesScale, setYesScale] = useState(1);
  const [noScale, setNoScale] = useState(1);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isConfettiRunning, setIsConfettiRunning] = useState(false);

  const noButtonLabel = useMemo(
    () => getNoButtonLabel(noClickCount),
    [noClickCount],
  );

  const handleNoHover = useCallback(() => {
    // Move the button to a random nearby position on hover.
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

  const yesCursorClasses =
    CURSOR_CLASSES[isConfettiRunning ? "loading" : "interactive"];

  const noCursorClasses = CURSOR_CLASSES["interactive"];

  const containerScale = useMemo(() => {
    const extraClicks = Math.max(noClickCount - 5, 0);
    const added = extraClicks * 0.12;
    return Math.min(1 + added, 1.9);
  }, [noClickCount]);

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-pink-50/80 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] text-stone-800 sm:justify-center sm:py-12 sm:px-4">
      <FloatingHearts />
      <AnimatePresence mode="wait">
        {!isAccepted && (
          <motion.section
            key="valentine-question"
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: containerScale }}
            exit={{
              opacity: [1, 1, 0],
              scale: [1, 1.06, 1.1],
              y: [0, 0, -24],
              transition: {
                duration: 0.55,
                times: [0, 0.35, 1],
                ease: [0.4, 0, 0.2, 1],
              },
            }}
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative mt-4 w-full max-w-xl overflow-hidden rounded-2xl border-2 border-pink-200/90 bg-white p-6 shadow-[0_12px_48px_-12px_rgba(244,114,182,0.25),0_0_0_1px_rgba(255,255,255,0.9)_inset] sm:mt-0 sm:rounded-4xl sm:p-12"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-rose-200/50 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-pink-200/50 blur-3xl" />
              <div className="absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-amber-200/40 blur-2xl" />
            </div>

            {/* Cat photo - top right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="absolute right-3 top-3 z-20 overflow-hidden rounded-2xl border-2 border-pink-200/80 shadow-lg sm:right-4 sm:top-4"
            >
              <Image
                src={valentineConfig.images.cornerCat}
                alt=""
                width={72}
                height={72}
                className="h-16 w-16 object-cover sm:h-20 sm:w-20"
              />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center gap-10 text-center">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="text-xs font-semibold uppercase tracking-[0.35em] text-pink-500"
              >
                {valentineConfig.eyebrow}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="max-w-lg bg-linear-to-br from-rose-600 via-pink-500 to-rose-700 bg-clip-text text-4xl font-extrabold leading-[1.15] tracking-tight text-transparent sm:text-5xl md:text-6xl md:leading-[1.12]"
              >
                {valentineConfig.headline.line1}
                <span className="mt-1 block text-pink-500">
                  {valentineConfig.headline.line2}
                </span>
              </motion.h1>

              <AnimatePresence>
                {noClickCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="flex justify-center"
                  >
                    <img
                      src={valentineConfig.images.cryingCat}
                      alt=""
                      className="h-24 w-24 object-cover sm:h-28 sm:w-28"
                      width={112}
                      height={112}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="max-w-md text-balance text-base leading-relaxed text-stone-600 sm:text-lg sm:leading-relaxed"
              >
                {valentineConfig.promise}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28, ease: "easeOut" }}
                className="mt-2 flex w-full flex-col items-center justify-center gap-5 sm:flex-row sm:gap-6"
              >
                <motion.button
                  type="button"
                  whileHover={{
                    scale: isConfettiRunning ? 1 : yesScale + 0.05,
                    y: isConfettiRunning ? 0 : -3,
                    boxShadow:
                      "0 12px 28px -8px rgba(190, 18, 60, 0.45), 0 0 0 1px rgba(255,255,255,0.3) inset",
                  }}
                  whileTap={{
                    scale: isConfettiRunning ? 1 : yesScale - 0.03,
                    y: 0,
                  }}
                  animate={{ scale: yesScale }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  onClick={handleYesClick}
                  disabled={isConfettiRunning}
                  className={`inline-flex items-center justify-center rounded-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-600 px-11 py-4 text-base font-semibold text-white shadow-[0_8px_24px_-4px_rgba(190,18,60,0.4)] transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${yesCursorClasses}`}
                >
                  <span className="mr-2 text-lg">Yes</span>
                  <span aria-hidden="true" className="text-xl">
                    💕
                  </span>
                </motion.button>

                <motion.div
                  className="relative h-12 w-full sm:h-auto sm:w-auto origin-center"
                  animate={{
                    x: noOffsets.x,
                    y: noOffsets.y,
                    scale: noScale,
                  }}
                  transition={{
                    x: { type: "spring", stiffness: 160, damping: 14 },
                    y: { type: "spring", stiffness: 160, damping: 14 },
                    scale: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                >
                  <motion.button
                    type="button"
                    onMouseEnter={handleNoHover}
                    onClick={handleNoClick}
                    whileHover={{
                      scale: 1.04,
                      y: -2,
                      boxShadow:
                        "0 8px 20px -4px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.8) inset",
                    }}
                    whileTap={{ scale: 0.97, y: 0 }}
                    className={`inline-flex h-12 w-full items-center justify-center rounded-full border-2 border-pink-200 bg-pink-50 px-6 text-sm font-medium text-stone-600 shadow-md transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto ${noCursorClasses}`}
                  >
                    <span className="mr-1.5">
                      {noClickCount === 0 ? "No" : noButtonLabel}
                    </span>
                    <span aria-hidden="true" className="text-lg">
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
                transition={{ delay: 0.35 }}
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-pink-600 underline decoration-pink-300 underline-offset-2 transition hover:text-pink-700 hover:decoration-pink-500 cursor-pointer"
              >
                Create Your Own Custom Valentine Page →
              </motion.a>
            </div>
          </motion.section>
        )}

        {isAccepted && (
          <motion.section
            key="valentine-accepted"
            initial={{ opacity: 0, scale: 0.88, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{
              duration: 0.55,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative mt-4 w-full max-w-xl overflow-hidden rounded-2xl border-2 border-pink-200/90 bg-white p-6 text-center shadow-[0_12px_48px_-12px_rgba(244,114,182,0.25),0_0_0_1px_rgba(255,255,255,0.9)_inset] sm:mt-0 sm:rounded-4xl sm:p-12"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-10 top-0 h-40 bg-linear-to-b from-amber-100/60 via-rose-100/40 to-transparent blur-3xl" />
              <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-pink-200/40 blur-3xl" />
            </div>

            {/* Success screen cat - top right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute right-3 top-3 z-20 overflow-hidden rounded-2xl border-2 border-pink-200/80 shadow-lg sm:right-4 sm:top-4"
            >
              <Image
                src={valentineConfig.images.cornerCat}
                alt=""
                width={72}
                height={72}
                className="h-16 w-16 object-cover sm:h-20 sm:w-20"
              />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center gap-8">
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 14,
                  delay: 0.1,
                }}
                className="flex justify-center"
              >
                <img
                  src={valentineConfig.images.huggingCat}
                  alt=""
                  className="h-44 w-44 object-cover sm:h-56 sm:w-56"
                  width={224}
                  height={224}
                />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18, ease: "easeOut" }}
                className="max-w-md bg-linear-to-br from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-3xl font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl"
              >
                {valentineConfig.success.headline}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.22, ease: "easeOut" }}
                className="max-w-md text-balance text-base leading-relaxed text-stone-600 sm:text-lg sm:leading-relaxed"
              >
                {replaceSenderName(
                  valentineConfig.success.message,
                  valentineConfig.senderName,
                )}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-4 text-sm font-medium text-pink-600"
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
                transition={{ delay: 0.4 }}
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-pink-600 underline decoration-pink-300 underline-offset-2 transition hover:text-pink-700 hover:decoration-pink-500 cursor-pointer"
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
