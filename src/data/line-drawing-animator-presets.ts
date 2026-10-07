import type { LineDrawingPreset } from "@/components/LineDrawingAnimator/LineDrawingAnimator.types";

// A flowing cursive autograph with an underline flourish — the case "signature" (constant pen speed) mode exists for.
const SIGNATURE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 160" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M58 118 C 52 92, 56 52, 70 30 C 74 24, 78 28, 74 40 C 66 72, 60 100, 62 124" />
  <path d="M40 82 C 70 70, 104 66, 118 70 C 112 88, 108 108, 112 120 C 118 104, 128 92, 140 92 C 150 92, 146 112, 152 118 C 160 124, 168 104, 176 98 C 186 92, 192 104, 186 112 C 180 120, 170 112, 176 102 C 184 92, 198 96, 204 110 C 208 118, 214 112, 220 100 C 226 90, 234 96, 230 108 C 228 116, 236 120, 244 112 C 252 102, 258 60, 266 40 C 270 30, 276 36, 272 50 C 266 76, 262 104, 266 120 C 270 106, 280 96, 290 98 C 300 100, 296 116, 302 120 C 310 124, 318 100, 330 96 C 340 92, 344 108, 336 116 C 328 122, 322 110, 330 100 C 336 94, 346 104, 352 116 C 356 124, 366 108, 372 52 C 374 36, 380 34, 378 50 C 374 84, 372 108, 380 118" />
  <path d="M228 76 c 1 -2, 3 -2, 3 0" />
  <path d="M30 140 C 120 128, 250 126, 400 134 C 360 140, 330 146, 300 150" />
</svg>`;

// A small lighthouse scene built from every basic shape, so spatial ordering (top → bottom) has something to sort.
const LIGHTHOUSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <ellipse cx="70" cy="34" rx="26" ry="8" />
  <circle cx="262" cy="30" r="12" />
  <path d="M140 48 L160 30 L180 48" />
  <rect x="144" y="48" width="32" height="24" rx="2" />
  <circle cx="160" cy="60" r="6" />
  <line x1="186" y1="58" x2="290" y2="40" />
  <line x1="186" y1="64" x2="290" y2="86" />
  <line x1="134" y1="58" x2="30" y2="40" />
  <line x1="134" y1="64" x2="30" y2="86" />
  <rect x="132" y="72" width="56" height="8" />
  <polygon points="140,80 180,80 190,188 130,188" />
  <line x1="138" y1="120" x2="182" y2="120" />
  <line x1="136" y1="150" x2="184" y2="150" />
  <path d="M152 188 V 170 A 8 8 0 0 1 168 170 V 188" />
  <path d="M60 112 q 8 -8 16 0 q 8 -8 16 0" />
  <path d="M20 200 C 60 186, 90 196, 120 188 C 150 180, 190 190, 230 186 C 260 184, 290 192, 300 198" />
  <polyline points="20,218 40,212 60,218 80,212 100,218 120,212 140,218" />
  <path d="M170 224 q 15 -8 30 0 t 30 0 t 30 0 t 30 0" />
</svg>`;

// A monogram badge mixing outlines with fill-only shapes, to show outlining fills and fading them in afterwards.
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" stroke-width="4" />
  <circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" stroke-width="1.5" />
  <path fill="currentColor" fill-rule="evenodd" d="M100 40 L128 96 C 128 122, 114 140, 100 156 C 86 140, 72 122, 72 96 Z M93 86 a 7 7 0 1 0 14 0 a 7 7 0 1 0 -14 0 Z" />
  <polygon fill="currentColor" points="48,88 51,97 60,100 51,103 48,112 45,103 36,100 45,97" />
  <polygon fill="currentColor" points="152,88 155,97 164,100 155,103 152,112 149,103 140,100 149,97" />
  <rect x="62" y="162" width="76" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="2" />
</svg>`;

// Six outline icons in a grid — left → right ordering with heavy overlap turns a set into a ripple.
const ICON_SET_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <g transform="translate(20 20) scale(2.5)">
    <path d="M3 10 L12 3 L21 10 V21 H3 Z" />
    <path d="M9 21 V14 H15 V21" />
  </g>
  <g transform="translate(120 20) scale(2.5)">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <polyline points="2,7 12,13 22,7" />
  </g>
  <g transform="translate(220 20) scale(2.5)">
    <path d="M12 20 C 5 15, 2 11, 2 8 A 5 5 0 0 1 12 6 A 5 5 0 0 1 22 8 C 22 11, 19 15, 12 20 Z" />
  </g>
  <g transform="translate(20 120) scale(2.5)">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </g>
  <g transform="translate(120 120) scale(2.5)">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16" y2="16" />
  </g>
  <g transform="translate(220 120) scale(2.5)">
    <polygon points="12,2 15,9 22,9.5 17,14.5 18.5,22 12,18 5.5,22 7,14.5 2,9.5 9,9" />
  </g>
</svg>`;

// The preset gallery's drawings, each with the pacing that suits it — the first doubles as the tool's default.
export const lineDrawingPresets: LineDrawingPreset[] = [
  {
    slug: "signature",
    name: "Signature",
    description: "Cursive autograph at a constant pen speed",
    source: SIGNATURE_SVG,
    settings: { order: "document", durationMode: "proportional", speed: 520, overlap: 0, stagger: 120, easing: "linear", outlineFills: false, fillFade: "off", loop: "once" }
  },
  {
    slug: "lighthouse",
    name: "Line-art lighthouse",
    description: "Every basic shape, drawn top to bottom",
    source: LIGHTHOUSE_SVG,
    settings: { order: "top-bottom", durationMode: "fixed", duration: 700, overlap: 45, stagger: 0, easing: "ease-in-out", outlineFills: false, fillFade: "off", loop: "once" }
  },
  {
    slug: "logo",
    name: "Monogram logo",
    description: "Outlined fills that ink in afterwards",
    source: LOGO_SVG,
    settings: { order: "document", durationMode: "fixed", duration: 900, overlap: 30, stagger: 0, easing: "nib", outlineFills: true, fillFade: "each", fillDuration: 500, loop: "once" }
  },
  {
    slug: "icon-set",
    name: "Icon set",
    description: "Six icons rippling left to right, yoyoing",
    source: ICON_SET_SVG,
    settings: { order: "left-right", durationMode: "fixed", duration: 600, overlap: 60, stagger: 60, easing: "ease-out", outlineFills: false, fillFade: "off", loop: "yoyo", hold: 800 }
  }
];
