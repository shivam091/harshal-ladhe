import type { ImageFormatOutcome } from "@/components/mdx/ImageFormatNegotiationDiagram/ImageFormatNegotiationDiagram.types";

// Overall canvas — three format columns fanning out from one shared optimization-endpoint box.
export const CANVAS_W = 640;

// The one stored source file, centered at the top of the canvas.
export const SOURCE_BOX_W = 220;
export const SOURCE_BOX_H = 38;
export const SOURCE_BOX_X = (CANVAS_W - SOURCE_BOX_W) / 2;
export const SOURCE_BOX_Y = 16;

// The single optimization endpoint every request passes through before a format is chosen.
export const ENDPOINT_BOX_W = 340;
export const ENDPOINT_BOX_H = 48;
export const ENDPOINT_BOX_X = (CANVAS_W - ENDPOINT_BOX_W) / 2;
export const ENDPOINT_BOX_Y = SOURCE_BOX_Y + SOURCE_BOX_H + 34;

// y where the fan-out lines leave the endpoint box, and the shared x center of each of the 3 columns.
export const BRANCH_START_Y = ENDPOINT_BOX_Y + ENDPOINT_BOX_H;
export const COLUMN_CENTERS = [98, 320, 542];

// Each column's condition box (the Accept-header match) and, below it, its result box.
export const CONDITION_BOX_Y = BRANCH_START_Y + 46;
export const CONDITION_BOX_W = 184;
export const CONDITION_BOX_H = 44;

export const RESULT_BOX_Y = CONDITION_BOX_Y + CONDITION_BOX_H + 24;
export const RESULT_BOX_W = 184;
export const RESULT_BOX_H = 96;

export const CANVAS_H = RESULT_BOX_Y + RESULT_BOX_H + 16;

/*
  Three outcomes one image request can resolve to, ordered "best case" to "safe fallback" — the same
  source file every time, with the optimization endpoint's own inspection of the request's Accept
  header (sent automatically by every browser) deciding which one comes back. No separate manual
  exports exist anywhere for this — a visitor on an older browser and a visitor on a brand-new one hit
  the exact same <Image> markup and the exact same stored file, and still each get a format their own
  browser can actually decode.
*/
export const IMAGE_FORMAT_OUTCOMES: ImageFormatOutcome[] = [
  {
    kind: "avif",
    label: "AVIF",
    condition: "Accept: image/avif",
    result: "Smallest file of the three. Served to Chrome, Edge, and other browsers whose Accept header lists AVIF support."
  },
  {
    kind: "webp",
    label: "WebP",
    condition: "Accept: image/webp (no avif)",
    result: "Smaller than the original, broader support than AVIF. Served when a browser accepts WebP but not AVIF."
  },
  {
    kind: "original",
    label: "Original",
    condition: "Neither avif nor webp accepted",
    result: "The source file's own format (e.g. JPEG or PNG) — the safe fallback for any browser, or a request with no Accept header at all."
  }
];
