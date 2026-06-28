import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { DARK_COLORS_RAW } from "@/constants/themes/dark";
import { toHex, type ColorTuple } from "@/utils/color";
import { SEGMENT_COLORS } from "@/components/RainbowDivider/RainbowDivider.constants";
import { OG_IMAGE_SIZE } from "@/constants/og-image";

// Dark theme tokens so generated cards sit alongside the hand-made covers, which are mostly dark.
const COLORS = {
  background: toHex(DARK_COLORS_RAW.colorBgDefault),
  foreground: toHex(DARK_COLORS_RAW.colorFgDefault),
  muted: toHex(DARK_COLORS_RAW.colorFgMuted),
  accent: toHex(DARK_COLORS_RAW.colorFgAccent),
  heading: toHex(DARK_COLORS_RAW.colorFgHeading)
};

// RainbowDivider's stops, converted because they're authored as CSS hsl() strings.
const RAINBOW = SEGMENT_COLORS.map((color) => toHex((color.match(/\d+/g) ?? []).map(Number) as ColorTuple));

/*
  Fetched per render with only the glyphs in use, since next/og can't read the woff2 that
  next/font serves; the TTF Google returns to an unrecognised client is what it accepts.
*/
async function loadAlanSans(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Alan+Sans:wght@700&text=${encodeURIComponent(text)}`
    ).then((response) => response.text());
    const fontUrl = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!fontUrl) return null;
    return await fetch(fontUrl).then((response) => response.arrayBuffer());
  } catch {
    // Offline builds fall back to next/og's bundled font rather than failing the page.
    return null;
  }
}

// Titles carry inline markdown for the page heading; the card has no code styling, so the markers would show literally.
function plainTitle(title: string): string {
  return title.replace(/`|\*\*/g, "");
}

interface OgImageInput {
  title: string;
  // Content type shown as the eyebrow, e.g. "Tutorial".
  label: string;
}

export async function renderOgImage({ title, label }: OgImageInput): Promise<ImageResponse> {
  const heading = plainTitle(title);
  const host = new URL(siteConfig.url).host;
  // The eyebrow is uppercased at render time, so its capitals must be in the requested subset too.
  const font = await loadAlanSans(`${heading}${label.toUpperCase()}${siteConfig.name}${host}`);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px 80px",
          backgroundColor: COLORS.background,
          backgroundImage: `radial-gradient(circle at 85% 15%, ${COLORS.accent}33, transparent 55%)`,
          color: COLORS.foreground,
          fontFamily: font ? "Alan Sans" : undefined
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "8px 20px",
            border: `2px solid ${COLORS.accent}`,
            borderRadius: 999,
            color: COLORS.accent,
            fontSize: 28,
            letterSpacing: 3,
            textTransform: "uppercase"
          }}
        >
          {label}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: heading.length > 60 ? 60 : 72,
            lineHeight: 1.15,
            fontWeight: 700
          }}
        >
          {heading}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden" }}>
            {RAINBOW.map((color) => (
              <div key={color} style={{ flex: 1, backgroundColor: color }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30 }}>
            <span style={{ color: COLORS.heading }}>{siteConfig.name}</span>
            <span style={{ color: COLORS.muted }}>{host}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      ...(font && { fonts: [{ name: "Alan Sans", data: font, weight: 700 as const, style: "normal" as const }] })
    }
  );
}
