import type { UnitConverterPresetMeta } from "@/components/UnitConverter/UnitConverter.types";

/*
  Curated contexts shown in the preset gallery — the browser default, the classic 62.5% root trick,
  the two viewport widths designs are most often handed over at, and a narrow card container, since
  a converter's answer is only as good as the surroundings it assumes.
*/
export const unitConverterPresets: UnitConverterPresetMeta[] = [
  {
    slug: "browser-default",
    name: "Browser default",
    summary: "16px root · 1280×800",
    context: { rootFontSize: 16, parentFontSize: 16, viewportWidth: 1280, viewportHeight: 800, containerInlineSize: 640, parentWidth: 960 }
  },
  {
    slug: "root-62-5",
    name: "62.5% root",
    summary: "10px root · 1rem = 10px",
    // html { font-size: 62.5% } turns the 16px default into 10px so rem maths is a decimal shift — still respects a reader's larger default, unlike a px root.
    context: { rootFontSize: 10, parentFontSize: 16, viewportWidth: 1280, viewportHeight: 800, containerInlineSize: 640, parentWidth: 960 }
  },
  {
    slug: "mobile-375",
    name: "Mobile 375",
    summary: "375×667 viewport",
    // The iPhone SE/8 width most mobile mockups are still drawn at.
    context: { rootFontSize: 16, parentFontSize: 16, viewportWidth: 375, viewportHeight: 667, containerInlineSize: 343, parentWidth: 343 }
  },
  {
    slug: "desktop-1440",
    name: "Desktop 1440",
    summary: "1440×900 viewport",
    // The default desktop frame in most design tools, so "it's 24px in the mockup" usually means 24px at this width.
    context: { rootFontSize: 16, parentFontSize: 16, viewportWidth: 1440, viewportHeight: 900, containerInlineSize: 1200, parentWidth: 1200 }
  },
  {
    slug: "card-320",
    name: "Card container",
    summary: "320px container · 18px text",
    // A typical card in a grid — the case cqi exists for, with a slightly larger parent font-size to show em drifting away from rem.
    context: { rootFontSize: 16, parentFontSize: 18, viewportWidth: 1280, viewportHeight: 800, containerInlineSize: 320, parentWidth: 320 }
  },
  {
    slug: "large-text",
    name: "Large text",
    summary: "20px root · zoomed reader",
    // A reader who has raised their browser's default font-size — the context that shows why px-only layouts stop scaling.
    context: { rootFontSize: 20, parentFontSize: 20, viewportWidth: 1280, viewportHeight: 800, containerInlineSize: 640, parentWidth: 960 }
  }
];
