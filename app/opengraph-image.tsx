import { ImageResponse } from "next/og";

export const alt = "Muhammad Kasyaf Anugrah, Full Stack Developer & Cyber Security, Bandung, Indonesia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PRODUCTS = ["DepUp Office", "depup.cloud", "Depup Code", "Sentinel-ID"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 85% 15%, #0f3b33 0%, #05070d 55%)",
          color: "#eaf0fb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#39e6b5", letterSpacing: 4 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#39e6b5" }} />
          KASYAF.ID
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>Muhammad Kasyaf</div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, color: "#39e6b5" }}>Anugrah</div>
          <div style={{ marginTop: 24, fontSize: 32, color: "#9aa8c5" }}>
            Full Stack Developer &amp; Cyber Security · Bandung, Indonesia
          </div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {PRODUCTS.map((p) => (
            <div
              key={p}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                border: "2px solid #1f2c45",
                fontSize: 24,
                color: "#c3cde3",
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
