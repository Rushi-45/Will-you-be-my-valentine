import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { searchParams: Promise<{ name?: string }> | { name?: string } };

export default async function Image({ searchParams }: Props) {
  const params = await Promise.resolve(searchParams);
  const name = params?.name?.trim();
  const title = name
    ? `${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}, will you be my Valentine?`
    : "Will you be my Valentine?";

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
          background: "linear-gradient(135deg, #ffe4e6 0%, #fda4af 50%, #fb7185 100%)",
          padding: "64px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ position: "absolute", width: 440, height: 440, borderRadius: "50%", background: "rgba(255,255,255,0.2)", top: -140, right: -100, display: "flex" }} />
        <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.15)", bottom: -70, left: -50, display: "flex" }} />

        <div style={{ fontSize: 110, marginBottom: 28 }}>❤️</div>
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

export async function generateAlt({ searchParams }: Props) {
  const params = await Promise.resolve(searchParams);
  const name = params?.name?.trim();
  return name ? `Valentine card for ${name}` : "Will you be my Valentine?";
}
