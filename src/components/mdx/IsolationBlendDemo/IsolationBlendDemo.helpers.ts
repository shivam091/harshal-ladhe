// The readout per isolation value — the blend mode only changes the colours, not which layers are blended.
export function describeOutcome(isolation: string, blendMode: string): { isolated: boolean; explanation: string } {
  if (isolation === "isolate") {
    return {
      isolated: true,
      explanation:
        `The group is its own stacking context, so mix-blend-mode: ${blendMode} only mixes the circles with each other. ` +
        "The finished group is then laid over the stripes like any normal element — same colours on every stripe."
    };
  }

  return {
    isolated: false,
    explanation:
      `The group isn't a stacking context, so each circle's mix-blend-mode: ${blendMode} reaches past the group to ` +
      "everything painted beneath it in the stage — including the stripes. Watch the colours shift from stripe to stripe."
  };
}

// The CSS the stage is running, so the readout, the picture, and the code always describe the same state.
export function buildCss(isolation: string, blendMode: string): string {
  return `
.group {
  isolation: ${isolation};
}

.group .circle {
  mix-blend-mode: ${blendMode};
}
`;
}
