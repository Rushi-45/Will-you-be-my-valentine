import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Wishing Cards — Beautiful cards for every occasion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 40%, #fce7f3 100%)",
          padding: "64px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", background: "rgba(255,255,255,0.35)", top: -160, right: -120, display: "flex" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.25)", bottom: -80, left: -60, display: "flex" }} />

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <span style={{ fontSize: 32, color: "#e11d48" }}>♥</span>
          <span style={{ fontSize: 30, fontWeight: 700, color: "#e11d48", letterSpacing: "-0.02em" }}>Wishing Cards</span>
        </div>

        {/* Emoji row */}
        <div style={{ display: "flex", gap: 20, fontSize: 56, marginBottom: 32 }}>
          <span>❤️</span>
          <span>🎂</span>
          <span>💜</span>
          <span>🎓</span>
          <span>🌸</span>
          <span>🌻</span>
          <span>🎉</span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: "#1c1917",
            textAlign: "center",
            lineHeight: 1.08,
            marginBottom: 20,
            letterSpacing: "-0.03em",
          }}
        >
          Beautiful cards for every occasion
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 26, color: "#78716c", textAlign: "center" }}>
          Animated · Personalized · Shareable · Free
        </div>
      </div>
    ),
    { ...size },
  );
}
