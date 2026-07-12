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
  Builds every segment's geometry up front. Each is a two-point diagonal line; flipping swaps which
  end (low/high) sits on the left, keeping y-coordinates fixed so paths interpolate cleanly under
  react-spring. The hold variants widen each segment about its own center by a per-index stretch
  factor, flattening its angle without changing direction.
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
