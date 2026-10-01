import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { LOGO_WORDMARK } from "@/components/layout/logo-paths";

/**
 * Obrázek, který se ukáže při sdílení odkazu na Facebooku, LinkedInu
 * nebo ve WhatsAppu. Černá plocha, bílá slovní značka a kóta pod ní —
 * stejné prvky jako na webu.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — realitní makléř, ${site.company}`;

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
          background: "#0A0A0A",
          color: "#FFFFFF",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: "#B3B3B3", letterSpacing: 4, textTransform: "uppercase" }}>
          <div style={{ width: 12, height: 12, background: "#FFFFFF" }} />
          {site.name} · Realitní makléř
        </div>

        <svg width="1040" height="144" viewBox="4 4 975 135" fill="#FFFFFF">
          <path d={LOGO_WORDMARK} />
        </svg>

        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <div style={{ width: 2, height: 22, background: "#B3B3B3" }} />
          <div style={{ flex: 1, height: 2, background: "#2E2E2E" }} />
          <div style={{ padding: "0 20px", fontSize: 22, color: "#B3B3B3", letterSpacing: 4, textTransform: "uppercase" }}>
            Prodej · Koupě · Pronájem
          </div>
          <div style={{ flex: 1, height: 2, background: "#2E2E2E" }} />
          <div style={{ width: 2, height: 22, background: "#B3B3B3" }} />
        </div>
      </div>
    ),
    size,
  );
}
