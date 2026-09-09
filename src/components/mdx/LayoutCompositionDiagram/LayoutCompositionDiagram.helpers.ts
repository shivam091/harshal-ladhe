import type { SegmentStatus } from "@/types/layout-composition-diagram";
import {
  persistBoxClass,
  swapBoxClass
} from "@/components/mdx/LayoutCompositionDiagram/LayoutCompositionDiagram.styles";

// Maps a segment's status to its themed fill/stroke class, so persisting and swapping boxes are always colored consistently.
export function segmentClass(status: SegmentStatus): string {
  return status === "persists" ? persistBoxClass : swapBoxClass;
}

// Short tag rendered under each segment box's file path, reinforcing what its color already shows.
export function statusTag(status: SegmentStatus): string {
  return status === "persists" ? "persists — stays mounted" : "swaps — remounts";
}
