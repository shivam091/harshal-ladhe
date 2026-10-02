// Props for <LiveCode> — the code is a derived string, so the block re-highlights whenever its source state changes.
export interface LiveCodeProps {
  code: string;
  // Shiki language id, e.g. "css" or "html".
  language: string;
  // Accessible name for the scrollable region, so screen readers announce what the code describes.
  label: string;
}
