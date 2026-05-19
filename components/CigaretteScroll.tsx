"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const BODY_H   = 170;
const BAND_H   = 5;
const FILTER_H = 48;
const TIP_H    = 10;
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

// Center of the cigarette column within the W+2 wide wrapper
const CX = (W + 2) / 2;

export function CigaretteScroll() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();

  const ashHeight = useTransform(scrollYProgress, [0, 1], [0, BODY_H]);
  const emberTop  = useTransform(scrollYProgress, [0, 1], [0, BODY_H]);

  // Ember/smoke are positioned relative to the outer wrapper, not the paper body.
  // Add TIP_H so the position accounts for the rounded tip sitting above the paper body.
  const emberTopAbs = useTransform(emberTop, (v: number) => v + TIP_H);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 md:block"
    >
      {/* Relative wrapper — ember & smoke are absolutely positioned here,
          outside the overflow-hidden paper body so glows/smoke aren't clipped */}
      <div className="relative flex flex-col items-center" style={{ width: W + 2 }}>

        {/* Rounded tobacco tip */}
        <div
          style={{
            width: W,
            height: TIP_H,
            borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            background: "linear-gradient(180deg, #d6cfc0, #ece5d5)",
          }}
        />

        {/* Paper body — overflow-hidden clips ash and paper texture only */}
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
              background: "linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 15%, #2e2e2e 40%, #505050 68%, #767676 85%, #6b3010 94%, #4a1a04 100%)",
            }}
          />
          {/* Heat glow on the burning face of the ash — clipped to cigarette width naturally */}
          <motion.div
            className="absolute left-0 right-0"
            animate={reducedMotion ? undefined : { opacity: [0.55, 0.95, 0.45, 0.85, 0.55] }}
            transition={reducedMotion ? undefined : { repeat: Infinity, duration: 1.1, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
            style={{
              height: 10,
              top: ashHeight,
              translateY: "-100%",
              background: "linear-gradient(180deg, transparent 0%, rgba(140,50,8,0.5) 40%, rgba(200,80,10,0.85) 80%, rgba(220,100,15,1) 100%)",
            }}
          />
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

        {/* ── EMBER — outside overflow-hidden so glow bleeds beyond cigarette edges ── */}
        <motion.div
          className="absolute z-20"
          style={{ top: emberTopAbs, left: CX, translateX: "-50%", width: W }}
        >
          {/* Outer soft glow — biased upward into ash, ~2× cigarette width */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            animate={reducedMotion ? undefined : { opacity: [0.3, 0.55, 0.28, 0.5, 0.3], scaleX: [1, 1.15, 1] }}
            transition={reducedMotion ? undefined : { repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            style={{
              width: W + 16, height: 20,
              top: -14,
              borderRadius: "50%",
              background: "radial-gradient(ellipse at 50% 70%, rgba(180,55,10,0.55) 0%, rgba(160,40,8,0.25) 50%, transparent 75%)",
              filter: "blur(5px)",
              opacity: reducedMotion ? 0.35 : undefined,
            }}
          />

          {/* Main orange halo — concentrated, biased into ash */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            animate={reducedMotion ? undefined : { scaleX: [1, 1.12, 0.94, 1], scaleY: [1, 1.2, 0.88, 1], opacity: [0.75, 1, 0.6, 0.75] }}
            transition={reducedMotion ? undefined : { repeat: Infinity, duration: 1.15, ease: "easeInOut" }}
            style={{
              width: W + 8, height: 14,
              top: -10,
              borderRadius: "50%",
              background: "radial-gradient(ellipse at 50% 65%, rgba(240,110,20,0.9) 0%, rgba(210,60,10,0.55) 50%, transparent 80%)",
              filter: "blur(2px)",
              opacity: reducedMotion ? 0.75 : undefined,
            }}
          />

          {/* Burning ring — the hot line at the ash/paper boundary */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            animate={reducedMotion ? undefined : {
              opacity: [0.85, 1, 0.75, 1, 0.85],
              scaleY:  [1, 1.35, 0.75, 1.25, 1],
            }}
            transition={reducedMotion ? undefined : { repeat: Infinity, duration: 0.85, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
            style={{
              width: W + 2, height: 4,
              top: -2,
              borderRadius: 2,
              background: "linear-gradient(90deg, #7f1d1d 0%, #b91c1c 18%, #ea580c 35%, #fb923c 46%, #fde68a 50%, #fb923c 54%, #ea580c 65%, #b91c1c 82%, #7f1d1d 100%)",
              boxShadow: "0 0 3px 1px rgba(253,230,138,0.85), 0 0 8px 3px rgba(249,115,22,0.75), 0 0 16px 6px rgba(220,38,38,0.45)",
            }}
          />

          {/* Sparks */}
          {!reducedMotion && sparks.map((s, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ width: 2, height: 2, left: W / 2 - 1, top: -1, borderRadius: "50%", background: "#fde68a" }}
              animate={{
                y:       [0, -13, -24],
                x:       [0, s.xEnd * 0.5, s.xEnd],
                opacity: [1, 0.65, 0],
                scale:   [1.3, 0.8, 0],
              }}
              transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeOut" }}
            />
          ))}
        </motion.div>

        {/* ── SMOKE — rises freely from just above the burning ring ── */}
        {!reducedMotion && (
          <motion.div
            className="pointer-events-none absolute"
            style={{ left: CX, top: emberTopAbs, translateY: "-8px" }}
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
        )}

      </div>
    </div>
  );
}
