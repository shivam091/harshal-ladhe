import type { IconSpritePresetMeta, StarterIcon } from "@/components/IconSpriteBuilder/IconSpriteBuilder.types";

// Wraps hand-drawn 24×24 line artwork in a typical design-tool export, with a hard-coded stroke so the currentColor switch has something visible to do.
function lineIcon(body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n  ${body}\n</svg>`;
}

/*
  The starter packet: simple icons drawn for this tool, not lifted from any third-party set, so
  anyone can try the builder without having their own SVGs to hand.
*/
export const starterIcons: StarterIcon[] = [
  { slug: "home", name: "Home", source: lineIcon('<path d="M3 11 12 4l9 7"/>\n  <path d="M5 10v10h5v-6h4v6h5V10"/>') },
  { slug: "search", name: "Search", source: lineIcon('<circle cx="11" cy="11" r="6.5"/>\n  <path d="m16 16 5 5"/>') },
  { slug: "heart", name: "Heart", source: lineIcon('<path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10z"/>') },
  { slug: "star", name: "Star", source: lineIcon('<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>') },
  { slug: "bell", name: "Bell", source: lineIcon('<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/>\n  <path d="M10 20.5a2 2 0 0 0 4 0"/>') },
  { slug: "mail", name: "Mail", source: lineIcon('<rect x="3" y="5.5" width="18" height="13" rx="2"/>\n  <path d="m3.5 7 8.5 6.5L20.5 7"/>') },
  { slug: "user", name: "User", source: lineIcon('<circle cx="12" cy="8.5" r="4"/>\n  <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>') },
  { slug: "check", name: "Check", source: lineIcon('<path d="m4.5 12.5 5 5 10-11"/>') },
  { slug: "close", name: "Close", source: lineIcon('<path d="M6 6l12 12M18 6 6 18"/>') },
  {
    slug: "sun",
    name: "Sun",
    source: lineIcon('<circle cx="12" cy="12" r="4"/>\n  <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>')
  }
];

// Two badges that both define "grad" and "clip" — dropped side by side unprefixed, the second would quietly borrow the first one's gradient.
const SUNRISE_BADGE = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f97316"/>
      <stop offset="1" stop-color="#facc15"/>
    </linearGradient>
    <clipPath id="clip">
      <circle cx="16" cy="16" r="14"/>
    </clipPath>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="32" height="32" fill="url(#grad)"/>
    <circle cx="16" cy="22" r="7" fill="#fff7ed"/>
  </g>
</svg>`;

// The ocean twin of the sunrise badge, deliberately reusing the same internal ids.
const OCEAN_BADGE = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0ea5e9"/>
      <stop offset="1" stop-color="#1e3a8a"/>
    </linearGradient>
    <clipPath id="clip">
      <rect x="2" y="2" width="28" height="28" rx="7"/>
    </clipPath>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="32" height="32" fill="url(#grad)"/>
    <path d="M2 20c4-3 8 3 14 0s10-3 14 0v12H2z" fill="#e0f2fe"/>
  </g>
</svg>`;

// A masked leaf badge — the mask's white/black fills must survive the currentColor switch, which this demonstrates.
const LEAF_BADGE = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <mask id="cut">
    <rect width="32" height="32" fill="white"/>
    <path d="M10 22 22 10" stroke="black" stroke-width="2"/>
  </mask>
  <path d="M6 26C6 12 14 6 26 6c0 12-6 20-20 20z" fill="#16a34a" mask="url(#cut)"/>
</svg>`;

// A two-colour pin left in its designed colours, to show what the album looks like with currentColor switched off.
const MAP_PIN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path d="M12 22s7-6.4 7-12a7 7 0 0 0-14 0c0 5.6 7 12 7 12z" fill="#dc2626"/>
  <circle cx="12" cy="10" r="2.75" fill="#fef2f2"/>
</svg>`;

// An Inkscape-style save: editor namespaces and metadata the builder should tidy away.
const INKSCAPE_FLAG = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" id="svg5"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   sodipodi:docname="flag.svg">
  <sodipodi:namedview id="namedview7" pagecolor="#ffffff" inkscape:zoom="22.6"/>
  <metadata id="metadata1">Exported for the post office</metadata>
  <path id="path1" inkscape:label="pole" d="M5 21V4" style="fill:none;stroke:#334155;stroke-width:2;stroke-linecap:round"/>
  <path id="path2" inkscape:label="cloth" d="M5 4h12l-2.5 4L17 12H5z" style="fill:#2563eb;stroke:none"/>
</svg>`;

// Untrusted paste carrying every trick the sanitiser exists for — none of it should survive into the album.
const SUSPICIOUS_PARCEL = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" onload="alert('postmarked')">
  <script>alert("opened the parcel")</script>
  <style>body { display: none }</style>
  <a xlink:href="javascript:alert('franked')">
    <rect x="3" y="7" width="18" height="13" rx="1.5" fill="#a16207" onclick="alert('tampered')"/>
  </a>
  <path d="M3 11h18M12 7v13" stroke="#fef3c7" stroke-width="1.5"/>
  <foreignObject width="24" height="24"><div xmlns="http://www.w3.org/1999/xhtml">Hello</div></foreignObject>
  <use href="https://example.com/evil.svg#x"/>
</svg>`;

/*
  Curated album sets: a line-icon set that shows off currentColor, gradient badges that need
  their internal ids prefixed, a multi-colour set best left uncoloured, an editor save full of
  cruft, and a suspicious parcel that exercises the sanitiser.
*/
export const iconSpritePresets: IconSpritePresetMeta[] = [
  {
    slug: "interface-basics",
    name: "Interface basics",
    note: "Line icons · currentColor",
    currentColor: true,
    icons: [
      { id: "home", starter: "home" },
      { id: "search", starter: "search" },
      { id: "bell", starter: "bell" },
      { id: "user", starter: "user" },
      { id: "mail", starter: "mail" }
    ]
  },
  {
    slug: "gradient-badges",
    name: "Gradient badges",
    note: "Clashing ids, prefixed",
    currentColor: false,
    icons: [
      { id: "badge-sunrise", origin: "sunrise.svg", source: SUNRISE_BADGE },
      { id: "badge-ocean", origin: "ocean.svg", source: OCEAN_BADGE },
      { id: "badge-leaf", origin: "leaf.svg", source: LEAF_BADGE }
    ]
  },
  {
    slug: "full-colour",
    name: "Full colour",
    note: "currentColor off",
    currentColor: false,
    icons: [
      { id: "map-pin", origin: "map-pin.svg", source: MAP_PIN },
      { id: "flag", origin: "flag.svg (Inkscape)", source: INKSCAPE_FLAG },
      { id: "star", starter: "star" }
    ]
  },
  {
    slug: "suspicious-parcel",
    name: "Suspicious parcel",
    note: "Sanitiser at work",
    currentColor: false,
    icons: [
      { id: "parcel", origin: "parcel.svg (untrusted)", source: SUSPICIOUS_PARCEL },
      { id: "check", starter: "check" }
    ]
  }
];
