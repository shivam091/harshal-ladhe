import { DigitSvg } from "@/components/HitCounter/Digit/Digit.styles";

// Standard a–g labelling (a = top, d = bottom, g = middle) so DIGIT_MAP reads like any seven-segment truth table.
const SEGMENT_PATHS = {
  a: "M4,2 L6,0 L18,0 L20,2 L18,4 L6,4 Z",
  b: "M22,3 L24,5 L24,17 L22,19 L20,17 L20,5 Z",
  c: "M22,21 L24,23 L24,35 L22,37 L20,35 L20,23 Z",
  d: "M4,38 L6,36 L18,36 L20,38 L18,40 L6,40 Z",
  e: "M2,21 L4,23 L4,35 L2,37 L0,35 L0,23 Z",
  f: "M2,3 L4,5 L4,17 L2,19 L0,17 L0,5 Z",
  g: "M4,20 L6,18 L18,18 L20,20 L18,22 L6,22 Z"
} as const;

// Derived from SEGMENT_PATHS so no segment can be referenced without a path.
type SegKey = keyof typeof SEGMENT_PATHS;

/*
  Explicit ordered array of segment keys — object key order is not guaranteed for iteration.
  Order must match the boolean tuple positions used in DIGIT_MAP.
*/
const SEG_KEYS: SegKey[] = ["a", "b", "c", "d", "e", "f", "g"];

// Tuple positions must follow SEG_KEYS order, since segments are matched by index.
const DIGIT_MAP: Record<string, boolean[]> = {
  "0": [true,  true,  true,  true,  true,  true,  false],
  "1": [false, true,  true,  false, false, false, false],
  "2": [true,  true,  false, true,  true,  false, true ],
  "3": [true,  true,  true,  true,  false, false, true ],
  "4": [false, true,  true,  false, false, true,  true ],
  "5": [true,  false, true,  true,  false, true,  true ],
  "6": [true,  false, true,  true,  true,  true,  true ],
  "7": [true,  true,  true,  false, false, false, false],
  "8": [true,  true,  true,  true,  true,  true,  true ],
  "9": [true,  true,  true,  true,  false, true,  true ]
};

// Falls back to "0" so a stray character can't render a blank, broken-looking digit.
export default function Digit({ digit }: { digit: string }) {
  const active = DIGIT_MAP[digit] ?? DIGIT_MAP["0"];

  return (
    <>
      <DigitSvg viewBox="0 0 24 40" aria-hidden="true">
        {SEG_KEYS.map((key, i) => (
          <path key={key} d={SEGMENT_PATHS[key]} data-active={String(active[i])} />
        ))}
      </DigitSvg>
    </>
  );
}

Digit.displayName = "Digit";
