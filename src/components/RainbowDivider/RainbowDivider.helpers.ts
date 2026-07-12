import {
  NUM_SEGMENTS,
  SEGMENT_WIDTH,
  SEGMENT_OFFSET_STEP,
  LINE_HEIGHT,
  HOLD_STRETCH_FACTOR_BASE,
  HOLD_STRETCH_FACTOR_STEP,
  SEGMENT_COLORS
} from "@/components/RainbowDivider/RainbowDivider.constants";
import type { SegmentGeometry } from "@/components/RainbowDivider/RainbowDivider.types";

/*
  Precomputed since the geometry never changes. Flips keep y-coordinates fixed so react-spring can
  interpolate paths cleanly, and hold variants widen about each segment's center so the angle
  flattens without reversing.
*/
export function buildSegments(): SegmentGeometry[] {
  return Array.from({ length: NUM_SEGMENTS }, (_, index) => {
    const offset = index * SEGMENT_OFFSET_STEP;
    const low = offset;
    const high = offset + SEGMENT_WIDTH;

    const center = offset + SEGMENT_WIDTH / 2;
    const holdStretchFactor = HOLD_STRETCH_FACTOR_BASE + index * HOLD_STRETCH_FACTOR_STEP;
    const holdSpan = SEGMENT_WIDTH * holdStretchFactor;
    const holdLow = center - holdSpan / 2;
    const holdHigh = center + holdSpan / 2;

    return {
      color: SEGMENT_COLORS[index],
      index,
      restPath: `M ${low},${LINE_HEIGHT} L ${high},0`,
      flippedPath: `M ${high},${LINE_HEIGHT} L ${low},0`,
      restHoldPath: `M ${holdLow},${LINE_HEIGHT} L ${holdHigh},0`,
      flippedHoldPath: `M ${holdHigh},${LINE_HEIGHT} L ${holdLow},0`
    };
  });
}
