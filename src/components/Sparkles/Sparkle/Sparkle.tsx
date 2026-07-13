import type { SparkleType } from "@/types/sparkles";
import { SparkleWrapper, SparkleSvg } from "@/components/Sparkles/Sparkle/Sparkle.styles";

// The 4-point sparkle star outline, centered in a 184x184 box.
const SPARKLE_PATH = "M92 0C92 0 96 63.4731 108.263 75.7365C120.527 88 184 92 184 92C184 92 118.527 98 108.263 108.263C98 118.527 92 184 92 184C92 184 86.4731 119 75.7365 108.263C65 97.5269 0 92 0 92C0 92 63.9731 87.5 75.7365 75.7365C87.5 63.9731 92 0 92 0Z";

// Renders one sparkle: a spinning 4-point star SVG, positioned via the style computed by `generatePosition`.
export default function Sparkle({ size, color, style }: Pick<SparkleType, "size" | "color" | "style">) {
  return (
    <>
      <SparkleWrapper style={style}>
        <SparkleSvg width={size} height={size} viewBox="0 0 184 184" fill="none">
          <path d={SPARKLE_PATH} fill={color} />
        </SparkleSvg>
      </SparkleWrapper>
    </>
  );
}

Sparkle.displayName = "Sparkle";
