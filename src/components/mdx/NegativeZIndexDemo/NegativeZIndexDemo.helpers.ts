// The readout per parent option — written out rather than generated, because each case teaches a different rule.
export function describeOutcome(parentStyle: string): { contained: boolean; explanation: string } {
  if (parentStyle === "z-index: auto") {
    return {
      contained: false,
      explanation:
        "The parent is positioned but has z-index: auto, so it doesn't form a stacking context. The child's z-index: -1 " +
        "is ranked against the stage instead, which paints it below every positioned and in-flow box in the stage — " +
        "including the parent's background. Only the corner that pokes out past the parent stays visible."
    };
  }

  const reason = parentStyle === "z-index: 0" ? "z-index: 0 on a positioned element" : "isolation: isolate";
  return {
    contained: true,
    explanation:
      `The parent forms a stacking context (${reason}), so z-index: -1 now means "the bottom of the parent's own stack". ` +
      "The child paints above the parent's background but still below the parent's text — exactly the layer decorative " +
      "shapes and pseudo-elements usually need."
  };
}

// The CSS the stage is running, kept next to the outcome logic so both describe the same state.
export function buildCss(parentStyle: string): string {
  return `
.parent {
  position: relative;
  ${parentStyle};
  background: var(--surface);
}

.parent .decoration {
  position: absolute;
  z-index: -1;
}
`;
}
