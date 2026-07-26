import type { IconToggleStatus } from "@/types/toggle-status";

// Props for IconDownload — spring-morphs a downward arrow into an open tray while pressed and held.
export interface IconDownloadProps {
  size?: number;
  status?: IconToggleStatus;
  // Arrow stroke colour while status is "pressed" — the tray keeps currentColor throughout.
  accentColor?: string;
}
