import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "AllConverter.tools — 250+ Free Online Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const categories = [
  "PDF Tools", "Image Tools", "Audio Tools", "Video Tools",
  "AI Tools", "Developer Tools", "SEO Tools", "Business Tools",
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0B0B0F 0%, #131320 50%, #0d0d1a 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "60px 72px",
          position: "relative",
        }}
      >
        {/* Accent glow top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* Accent glow bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "40px" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              color: "#fff",
              fontWeight: 700,
            }}
          >
            A
          </div>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>
            AllConverter.tools
          </span>
        </div>

        {/* Main headline — line 1 */}
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: 8,
          }}
        >
          250+ Free Online Tools
        </div>

        {/* Main headline — line 2 with gradient span */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: 28,
          }}
        >
          <span style={{ color: "#6366f1" }}>All in One Place.</span>
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "rgba(255,255,255,0.55)",
            fontWeight: 400,
            marginBottom: 48,
            letterSpacing: "-0.01em",
          }}
        >
          PDF · Images · Audio · AI · Developer · SEO · Business · More
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {categories.map((cat) => (
            <div
              key={cat}
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: "absolute",
            bottom: 52,
            right: 72,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }} />
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 16 }}>
            No sign-up · 100% free · Browser-based
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
