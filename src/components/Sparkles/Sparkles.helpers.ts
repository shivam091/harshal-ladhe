import { generateId, random, sample } from "@/utils/random";
import type { GeneratePosition, SparkleType } from "@/types/sparkles";

/*
  Default position generator: scatters sparkles across the full width, splitting them
  between just above and just below the wrapped content's edge, with randomized z-index so
  they interleave in front of and behind the text they surround.
*/
export const defaultGeneratePosition: GeneratePosition = (size: number) => {
  const style: React.CSSProperties = {};
  style.left = `${random(0, 100)}%`;
  style.zIndex = sample([1, 3])[0];

  if (Math.random() > 0.5) {
    style.top = size * 0.5;
  } else {
    style.bottom = -size * 0.5;
  }

  return style;
};

/*
  Builds a single sparkle: random color from the palette, random size within [minSize, maxSize],
  and a freshly generated position.
*/
export const generateSparkle = (
  colors: Array<string>,
  minSize: number,
  maxSize: number,
  generatePosition: GeneratePosition
): SparkleType => {
  const size = random(minSize, maxSize);

  return {
    id: generateId(),
    color: sample(colors)[0],
    size,
    createdAt: Date.now(),
    style: generatePosition(size),
  };
};
