import { generateId, random, sample } from "@/utils/random";
import type { GeneratePosition, SparkleType } from "@/components/Sparkles/Sparkles.types";

/*
  Split above and below the content's edge with a randomised z-index so sparkles interleave
  in front of and behind the text they surround.
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

// Colour, size and position are all randomised so no two sparkles look alike.
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
    style: generatePosition(size)
  };
};
