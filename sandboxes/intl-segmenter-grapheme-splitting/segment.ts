export interface SegmentResult {
  naive: string[];
  graphemes: string[];
}

// Splits `text` two ways: [...text] (spread — iterates by UTF-16 CODE POINT, still splitting
// multi-codepoint emoji apart) versus Intl.Segmenter('grapheme') (iterates by what a reader would
// actually call ONE character, joining combining marks and ZWJ emoji sequences correctly).
export function segmentText(text: string): SegmentResult {
  const naive = [...text];

  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  const graphemes = [...segmenter.segment(text)].map((s) => s.segment);

  return { naive, graphemes };
}
