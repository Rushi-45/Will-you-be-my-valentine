"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const BODY_H   = 170;
const BAND_H   = 5;
const FILTER_H = 48;
const W        = 13;

// Wisps: tight central column, mostly upward
const wisps = [
  { delay: 0,    dur: 2.2, x: [0,  -2,  1, -3,  0] },
  { delay: 0.55, dur: 2.5, x: [0,   2, -1,  3,  1] },
  { delay: 1.1,  dur: 2.0, x: [0,  -1,  3, -2,  1] },
  { delay: 1.65, dur: 2.3, x: [0,   1, -3,  2, -1] },
];

// Billows: spread outward as they rise — left and right alternating
const billows = [
  { delay: 0,    dur: 3.2, x: [0,  -5, -11, -18, -24] },
  { delay: 0.4,  dur: 2.9, x: [0,   6,  12,  19,  25] },
  { delay: 0.8,  dur: 3.5, x: [0,  -4,  -9, -15, -20] },
  { delay: 1.2,  dur: 3.0, x: [0,   5,  10,  16,  22] },
  { delay: 1.6,  dur: 3.3, x: [0,  -7, -13, -20, -26] },
  { delay: 2.0,  dur: 2.8, x: [0,   7,  14,  21,  28] },
];

// Sparks: tiny bright dots that briefly shoot up from the ember
const sparks = [
  { delay: 0,   xEnd:  -5, dur: 0.55 },
  { delay: 1.3, xEnd:   6, dur: 0.50 },
  { delay: 2.5, xEnd:  -8, dur: 0.60 },
  { delay: 3.6, xEnd:   4, dur: 0.45 },
];

export function CigaretteScroll() {
  const { scrollYProgress } = useScroll();

  const ashHeight = useTransform(scrollYProgress, [0, 1], [0, BODY_H]);
  const emberTop  = useTransform(scrollYProgress, [0, 1], [0, BODY_H]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center md:flex"
    >
      {/* Rounded tobacco tip */}
      <div
        style={{
          width: W,
          height: 10,
          borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
          background: "linear-gradient(180deg, #d6cfc0, #ece5d5)",
        }}
      />

      {/* Paper body */}
      <div className="relative overflow-hidden" style={{ width: W, height: BODY_H }}>

        {/* Unburnt paper texture */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, #e8e2d4 0%, #f7f4ed 35%, #faf8f3 55%, #f0ebdf 100%)",
            boxShadow: "inset 2px 0 2px rgba(0,0,0,0.06), inset -2px 0 2px rgba(0,0,0,0.06)",
          }}
        />

        {/* Ash grows downward from top */}
        <motion.div
          className="absolute left-0 right-0 top-0"
          style={{
            height: ashHeight,
            background: "linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 15%, #2e2e2e 40%, #505050 68%, #7a7a7a 86%, #aaa 100%)",
          }}
        />

        {/* ── EMBER ── */}
        <motion.div
          className="absolute left-0 right-0 z-20"
          style={{ top: emberTop, translateY: "-50%" }}
        >
          {/* Layer 1 — wide red outer corona */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ scaleX: [1, 1.25, 1], scaleY: [1, 1.4, 1], opacity: [0.35, 0.6, 0.35] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            style={{
              width: W + 22, height: 14, borderRadius: 8,
              background: "radial-gradient(ellipse, rgba(185,28,28,0.55) 0%, transparent 70%)",
              filter: "blur(3px)",
            }}
          />

          {/* Layer 2 — orange mid glow */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ scaleX: [1, 1.15, 0.95, 1], scaleY: [1, 1.2, 0.9, 1], opacity: [0.65, 1, 0.55, 0.65] }}
            transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
            style={{
              width: W + 12, height: 9, borderRadius: 5,
              background: "radial-gradient(ellipse, rgba(251,146,60,0.9) 0%, rgba(220,38,38,0.5) 55%, transparent 80%)",
              filter: "blur(1.5px)",
            }}
          />

          {/* Layer 3 — core ember strip: red→orange→white→orange→red */}
          <motion.div
            animate={{
              opacity: [0.9, 1, 0.85, 1, 0.9],
              scaleY:  [1, 1.15, 0.9, 1.1, 1],
            }}
            transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
            style={{
              width: W, height: 5, borderRadius: 3,
              background: "linear-gradient(90deg, #991b1b 0%, #dc2626 12%, #ea580c 28%, #fb923c 42%, #fef08a 50%, #fb923c 58%, #ea580c 72%, #dc2626 88%, #991b1b 100%)",
              boxShadow: "0 0 4px 1px rgba(251,191,36,1), 0 0 9px 4px rgba(249,115,22,0.8), 0 0 18px 7px rgba(220,38,38,0.45)",
            }}
          />

          {/* Sparks */}
          {sparks.map((s, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ width: 2, height: 2, left: W / 2 - 1, top: 1, borderRadius: "50%", background: "#fef08a" }}
              animate={{
                y:       [0, -12, -22],
                x:       [0, s.xEnd * 0.5, s.xEnd],
                opacity: [1, 0.7, 0],
                scale:   [1.2, 0.8, 0],
              }}
              transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeOut" }}
            />
          ))}
        </motion.div>

        {/* ── SMOKE ── */}
        <motion.div
          className="pointer-events-none absolute"
          style={{ left: W / 2, top: emberTop }}
        >
          {/* Wisps — tight central column */}
          {wisps.map((p, i) => (
            <motion.div
              key={`w${i}`}
              className="absolute"
              style={{
                width: 4, height: 4,
                left: -2, top: -5,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(230,230,230,0.75) 0%, transparent 70%)",
                filter: "blur(1px)",
              }}
              animate={{
                y:       [0, -18, -36, -56, -75],
                x:       p.x,
                opacity: [0, 0.7,  0.5,  0.2,  0],
                scale:   [0.4, 1.0, 1.8,  2.8,  3.6],
              }}
              transition={{
                duration: p.dur, repeat: Infinity, delay: p.delay,
                ease: [0.2, 0.4, 0.6, 0.9],
                times: [0, 0.15, 0.4, 0.7, 1],
              }}
            />
          ))}

          {/* Billows — spreading outward, larger and more diffuse */}
          {billows.map((p, i) => (
            <motion.div
              key={`b${i}`}
              className="absolute"
              style={{
                width: 5, height: 5,
                left: -2.5, top: -5,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(200,205,210,0.55) 0%, rgba(170,175,180,0.15) 55%, transparent 100%)",
                filter: "blur(2.5px)",
              }}
              animate={{
                y:       [0, -12, -28, -48, -65],
                x:       p.x,
                opacity: [0, 0.5,  0.35, 0.15, 0],
                scale:   [0.3, 1.2,  2.5,  4.0,  5.5],
              }}
              transition={{
                duration: p.dur, repeat: Infinity, delay: p.delay,
                ease: [0.15, 0.35, 0.6, 0.9],
                times: [0, 0.12, 0.38, 0.68, 1],
              }}
            />
          ))}
        </motion.div>

      </div>

      {/* Gold separator band */}
      <div
        style={{
          width: W + 2, height: BAND_H,
          background: "linear-gradient(180deg, #e8c84a, #b8960c, #e8c84a)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />

      {/* Cork filter */}
      <div
        style={{
          width: W + 2, height: FILTER_H,
          borderRadius: "0 0 4px 4px",
          background: "repeating-linear-gradient(180deg, #bf7f45 0px, #a86530 2px, #cf9055 4px, #bf7f45 6px)",
          boxShadow: "inset 2px 0 4px rgba(0,0,0,0.18), inset -2px 0 4px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
}
