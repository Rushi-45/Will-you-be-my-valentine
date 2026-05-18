import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { searchParams: Promise<{ name?: string; age?: string }> | { name?: string; age?: string } };

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

export default async function Image({ searchParams }: Props) {
  const params = await Promise.resolve(searchParams);
  const name = params?.name?.trim();
  const rawAge = params?.age?.trim();
  const age = rawAge ? parseInt(rawAge, 10) : null;
  const ageLabel = age && Number.isFinite(age) && age > 0 ? ` ${ordinal(age)}` : "";
  const displayName = name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : null;
  const title = displayName
    ? `Happy${ageLabel} Birthday, ${displayName}!`
    : "Happy Birthday!";

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
          background: "linear-gradient(135deg, #e0f2fe 0%, #7dd3fc 50%, #38bdf8 100%)",
          padding: "64px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ position: "absolute", width: 440, height: 440, borderRadius: "50%", background: "rgba(255,255,255,0.2)", top: -140, right: -100, display: "flex" }} />
        <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.15)", bottom: -70, left: -50, display: "flex" }} />

        <div style={{ fontSize: 110, marginBottom: 28 }}>🎂</div>
        <div style={{ fontSize: 62, fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.03em", textShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 24, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
          <span>♥</span>
          <span>Wishing Cards</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
