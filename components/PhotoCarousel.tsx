"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type GalleryImage = { src: string; caption?: string };

type Props = {
  images: readonly GalleryImage[];
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? "100%" : "-100%", opacity: 0 }),
};

const ease = [0.16, 1, 0.3, 1] as const;

export function PhotoCarousel({ images }: Props) {
  const [[idx, dir], setSlide] = useState([0, 0]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const count = images.length;

  const go = useCallback(
    (newDir: number) => {
      setSlide(([prev]) => [(prev + newDir + count) % count, newDir]);
    },
    [count],
  );

  if (count === 0) return null;

  const current = images[idx];

  return (
    <>
      <div className="w-full">
        <p className="mb-3 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-rose-500 dark:text-rose-400">
          Our memories
        </p>

        <div className="group relative overflow-hidden rounded-2xl border border-pink-200/70 shadow-[0_4px_24px_-4px_rgba(190,18,60,0.10)] dark:border-rose-900/40">
          {/* Square image frame */}
          <div
            className="relative aspect-square w-full cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
          >
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={idx}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease }}
                className="absolute inset-0"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                }}
              >
                <Image
                  src={current.src}
                  alt={current.caption ?? `Photo ${idx + 1}`}
                  fill
                  className="select-none object-cover"
                  draggable={false}
                  unoptimized
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Desktop arrow buttons — revealed on hover */}
          {count > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-rose-600 opacity-0 shadow-md backdrop-blur-sm transition-opacity duration-200 hover:bg-white group-hover:opacity-100 dark:bg-slate-900/85 dark:text-rose-400 dark:hover:bg-slate-900"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); go(1); }}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-rose-600 opacity-0 shadow-md backdrop-blur-sm transition-opacity duration-200 hover:bg-white group-hover:opacity-100 dark:bg-slate-900/85 dark:text-rose-400 dark:hover:bg-slate-900"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </>
          )}
        </div>

        {/* Caption */}
        <AnimatePresence mode="wait">
          {current.caption && (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="mt-2 text-center text-[0.8125rem] italic text-stone-500 dark:text-slate-400"
            >
              {current.caption}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Dot indicators */}
        {count > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide([i, i > idx ? 1 : -1])}
                aria-label={`Photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === idx
                    ? "w-4 bg-rose-500"
                    : "w-1.5 bg-rose-200 hover:bg-rose-300 dark:bg-rose-800 dark:hover:bg-rose-700"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              className="flex max-h-[88vh] max-w-[92vw] flex-col items-center"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={current.src}
                alt={current.caption ?? `Photo ${idx + 1}`}
                width={1200}
                height={1200}
                className="max-h-[80vh] w-auto max-w-[92vw] rounded-xl object-contain shadow-2xl"
                unoptimized
              />
              {current.caption && (
                <p className="mt-3 text-center text-sm text-white/70">
                  {current.caption}
                </p>
              )}
            </motion.div>

            <button
              onClick={() => setLightboxOpen(false)}
              aria-label="Close photo"
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
