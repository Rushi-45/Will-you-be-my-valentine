"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const BODY_H   = 170;
const BAND_H   = 5;
const FILTER_H = 48;
const TIP_H    = 10;
const W        = 15;          // widened from 13 for better proportions
const CX       = (W + 2) / 2; // 8.5 — centre of the wrapper column

// 8 smoke particles — staggered for a continuous rising column
const smokeParticles = [
  { delay: 0,    dur: 3.1, x: [0,  1, -1,  2,  0] },
  { delay: 0.35, dur: 2.9, x: [0, -1,  2, -1,  1] },
  { delay: 0.7,  dur: 3.3, x: [0,  2, -1,  1, -1] },
  { delay: 1.05, dur: 2.8, x: [0, -1,  1, -2,  0] },
  { delay: 1.4,  dur: 3.2, x: [0,  1, -2,  1,  2] },
  { delay: 1.75, dur: 3.0, x: [0, -2,  1, -1,  1] },
  { delay: 2.1,  dur: 3.4, x: [0,  1,  2, -1,  0] },
  { delay: 2.45, dur: 2.8, x: [0, -1, -1,  2, -1] },
];

// 6 sparks — glowing dots that briefly fly off the ember
const sparks = [
  { delay: 0,   xEnd: -8,  dur: 0.50, size: 2.5 },
  { delay: 0.9, xEnd:  9,  dur: 0.55, size: 1.5 },
  { delay: 1.7, xEnd: -10, dur: 0.60, size: 2.5 },
  { delay: 2.5, xEnd:  7,  dur: 0.48, size: 1.5 },
  { delay: 3.2, xEnd: -6,  dur: 0.52, size: 2.5 },
  { delay: 4.0, xEnd:  10, dur: 0.58, size: 1.5 },
];

export function CigaretteScroll() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();

  const ashHeight    = useTransform(scrollYProgress, [0, 1], [0, BODY_H]);
  const emberTop     = useTransform(scrollYProgress, [0, 1], [0, BODY_H]);
  // Add TIP_H so the ember sits at the correct absolute y within the wrapper
  const emberTopAbs  = useTransform(emberTop, (v: number) => v + TIP_H);
  // Fade ember in over the first 5px of ash so it doesn't float above the unburnt tip
  const emberOpacity = useTransform(ashHeight, [0, 5], [0, 1]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 md:block"
    >
      {/* SVG turbulence filter — referenced by smoke container for organic curl */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", overflow: "visible" }}
      >
        <defs>
          <filter id="cig-smoke" x="-100%" y="-100%" width="300%" height="300%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.025 0.06"
              numOctaves={4}
              seed={5}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={10}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Relative wrapper — ember & smoke are absolutely positioned here,
          outside the overflow-hidden paper body so glows/smoke aren't clipped */}
      <div
        className="relative flex flex-col items-center"
        style={{ width: W + 2, filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.20))" }}
      >

        {/* Tobacco tip — flat cut face with compressed tobacco grain */}
        <div
          style={{
            width: W,
            height: TIP_H,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            background:
              "radial-gradient(ellipse 60% 50% at 50% 60%, #5a3a1a 0%, #7a5230 35%, #a07040 60%, #c49060 80%, #b8855a 100%)",
          }}
        />

        {/* Paper body — overflow-hidden clips ash and paper texture only */}
        <div className="relative overflow-hidden" style={{ width: W, height: BODY_H }}>
          {/* Base paper gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #e8e2d4 0%, #f7f4ed 35%, #faf8f3 55%, #f0ebdf 100%)",
            }}
          />
          {/* Cylindrical edge shadow — gives the paper a 3D cross-section feel */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.14) 0%, transparent 28%, transparent 72%, rgba(0,0,0,0.11) 100%)",
            }}
          />
          {/* Ash column — chalky light grey at tip (oldest), darkens toward ember */}
          <motion.div
            className="absolute left-0 right-0 top-0"
            style={{
              height: ashHeight,
              background:
                "linear-gradient(180deg, #e2dfd8 0%, #c8c4bc 12%, #a09b94 28%, #78726a 50%, #4a4440 70%, #28201c 86%, #1a1008 94%, #3d1a06 100%)",
            }}
          >
            {/* Subtle flaky-layer texture — simulates layered ash */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(180deg, transparent 0px, transparent 5px, rgba(255,255,255,0.04) 5px, rgba(255,255,255,0.04) 6px)",
              }}
            />
          </motion.div>
          {/* Brand ring — printed line near the filter, disappears under ash */}
          <div
            className="absolute left-0 right-0"
            style={{
              height: 1,
              bottom: 12,
              background: "rgba(175,155,120,0.40)",
            }}
          />
          {/* Heat glow on the burning face of the ash */}
          <motion.div
            className="absolute left-0 right-0"
            animate={reducedMotion ? undefined : { opacity: [0.55, 0.95, 0.45, 0.85, 0.55] }}
            transition={
              reducedMotion
                ? undefined
                : { repeat: Infinity, duration: 1.1, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }
            }
            style={{
              height: 10,
              top: ashHeight,
              translateY: "-100%",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(120,45,8,0.4) 35%, rgba(190,70,8,0.8) 75%, rgba(220,90,12,1) 100%)",
            }}
          />
        </div>

        {/* Gold separator band */}
        <div
          style={{
            width: W + 2,
            height: BAND_H,
            background: "linear-gradient(180deg, #e8c84a, #b8960c, #e8c84a)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        />

        {/* Cork filter — layered radial blobs over stripes break up the uniformity */}
        <div
          style={{
            width: W + 2,
            height: FILTER_H,
            borderRadius: "0 0 4px 4px",
            background: [
              "radial-gradient(ellipse 55% 28% at 28% 38%, rgba(210,150,75,0.18) 0%, transparent 100%)",
              "radial-gradient(ellipse 45% 22% at 72% 62%, rgba(140,80,30,0.14) 0%, transparent 100%)",
              "radial-gradient(ellipse 38% 18% at 52% 18%, rgba(225,165,90,0.12) 0%, transparent 100%)",
              "radial-gradient(ellipse 40% 20% at 40% 82%, rgba(160,95,40,0.13) 0%, transparent 100%)",
              "repeating-linear-gradient(180deg, #bf7f45 0px, #a06030 2px, #d09560 5px, #b87840 8px, #9a5f2e 10px, #ca8f55 13px, #bf7f45 14px)",
            ].join(", "),
            boxShadow:
              "inset 2px 0 4px rgba(0,0,0,0.18), inset -2px 0 4px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.2)",
          }}
        />

        {/* ── EMBER — outside overflow-hidden so glow bleeds beyond cigarette edges ── */}
        <motion.div
          className="absolute z-20"
          style={{ top: emberTopAbs, left: CX, translateX: "-50%", width: W, opacity: emberOpacity }}
        >
          {/* Layer A — deep atmospheric glow (largest, slowest pulse) */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            animate={reducedMotion ? undefined : { opacity: [0.25, 0.5, 0.22, 0.45, 0.25] }}
            transition={
              reducedMotion
                ? undefined
                : { repeat: Infinity, duration: 2.6, ease: "easeInOut" }
            }
            style={{
              width: W + 20,
              height: 22,
              top: -16,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at 50% 75%, rgba(160,40,5,0.5) 0%, transparent 70%)",
              filter: "blur(7px)",
              opacity: reducedMotion ? 0.3 : undefined,
            }}
          />

          {/* Layer B — coal face: white-yellow core → orange → deep red */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            animate={
              reducedMotion
                ? undefined
                : {
                    opacity: [0.8, 1,    0.65, 0.95, 0.8],
                    scale:   [1,   1.08, 0.94, 1.04, 1],
                  }
            }
            transition={
              reducedMotion
                ? undefined
                : { repeat: Infinity, duration: 1.1, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }
            }
            style={{
              width: W + 4,
              height: 10,
              top: -7,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse 80% 70% at 50% 60%, #ffe566 0%, #fbbf24 18%, #f97316 38%, #dc2626 65%, #7f1d1d 90%, transparent 100%)",
              filter: "blur(1.5px)",
              opacity: reducedMotion ? 0.85 : undefined,
            }}
          />

          {/* Layer C — paper edge ignition: thin bright line at ash/paper boundary */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            animate={
              reducedMotion
                ? undefined
                : {
                    opacity: [0.9, 1,   0.7, 1,   0.9],
                    scaleY:  [1,   1.4, 0.6, 1.3, 1],
                  }
            }
            transition={
              reducedMotion
                ? undefined
                : { repeat: Infinity, duration: 0.8, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }
            }
            style={{
              width: W,
              height: 3,
              top: 0,
              borderRadius: 1,
              background:
                "linear-gradient(90deg, #7f1d1d 0%, #ea580c 20%, #fbbf24 40%, #fffbeb 50%, #fbbf24 60%, #ea580c 80%, #7f1d1d 100%)",
              boxShadow:
                "0 0 2px 1px rgba(255,235,100,0.9), 0 0 6px 2px rgba(251,146,36,0.8), 0 0 14px 5px rgba(220,38,38,0.5)",
              opacity: reducedMotion ? 0.9 : undefined,
            }}
          />

          {/* Sparks — glowing dots that shoot off the ember */}
          {!reducedMotion &&
            sparks.map((s, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: s.size,
                  height: s.size,
                  left: W / 2 - s.size / 2,
                  top: -1,
                  borderRadius: "50%",
                  background: "#fde68a",
                  boxShadow: "0 0 3px 2px rgba(253,230,138,0.95)",
                }}
                animate={{
                  y:       [0, -16, -30],
                  x:       [0, s.xEnd * 0.5, s.xEnd],
                  opacity: [1, 0.65, 0],
                  scale:   [1.3, 0.8, 0],
                }}
                transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeOut" }}
              />
            ))}
        </motion.div>

        {/* ── SMOKE — thread-to-bloom column with SVG turbulence for organic curl ── */}
        {!reducedMotion && (
          <motion.div
            className="pointer-events-none absolute"
            style={{ left: CX, top: emberTopAbs, translateY: "-6px" }}
          >
            {/* SVG filter applied to the particle group for organic warp */}
            <div style={{ filter: "url(#cig-smoke)" }}>
              {smokeParticles.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: 3,
                    height: 3,
                    left: -1.5,
                    top: -4,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(210,210,215,0.8) 0%, transparent 70%)",
                    filter: "blur(1.5px)",
                  }}
                  animate={{
                    y:       [0, -20, -45, -72, -100],
                    x:       p.x,
                    opacity: [0, 0.55, 0.45, 0.2, 0],
                    scale:   [0.2, 2, 5, 9, 13],
                  }}
                  transition={{
                    duration: p.dur,
                    repeat: Infinity,
                    delay: p.delay,
                    ease: [0.2, 0.4, 0.65, 0.9],
                    times: [0, 0.15, 0.4, 0.7, 1],
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
