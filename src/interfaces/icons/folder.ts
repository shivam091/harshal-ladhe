import type { IconToggleStatus } from "@/types/toggle-status";

// Props for IconFolder — cross-fades between the closed `folder` and open `folderOpen` glyphs as isOpen toggles.
export interface IconFolderProps {
  size?: number;
  isOpen?: boolean;
  status?: IconToggleStatus;
}
