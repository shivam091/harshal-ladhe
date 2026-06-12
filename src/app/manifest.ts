import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { LIGHT_COLORS_RAW } from "@/constants/themes/light";
import { toHex } from "@/utils/color";

// Generated so the installed app's name and colours follow siteConfig and the theme tokens instead of a hand-kept JSON copy.
export const dynamic = "force-static";

// The light theme is the server-rendered default, so the splash screen matches the page the app opens to.
const BACKGROUND = toHex(LIGHT_COLORS_RAW.colorBgDefault);

// Only sizes that exist in public/; the largest is 310px because no 512px icon has been exported yet.
const ICON_SIZES = [36, 48, 72, 96, 144, 192];

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Harshal LADHE",
    description: siteConfig.tagline,
    lang: siteConfig.lang,
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: BACKGROUND,
    theme_color: BACKGROUND,
    categories: ["education", "productivity"],
    icons: [
      ...ICON_SIZES.map((size) => ({
        src: `/assets/img/icons/android-icon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: "image/png"
      })),
      {
        src: "/assets/img/icons/ms-icon-310x310.png",
        sizes: "310x310",
        type: "image/png",
        purpose: "any"
      }
    ]
  };
}
