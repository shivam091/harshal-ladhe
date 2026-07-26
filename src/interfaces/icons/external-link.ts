import type { IconToggleStatus } from "@/types/toggle-status";

// Props for IconExternalLink — external-link glyph that boops diagonally toward its own arrowhead on hover.
export interface IconExternalLinkProps {
  size?: number;
  status?: IconToggleStatus;
  // Stroke colour while hovering/pressed/booped; defaults to currentColor.
  accentColor?: string;
}
