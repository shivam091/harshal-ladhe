import type { PlaygroundState, PlaygroundVerdict } from "@/components/mdx/ZIndexPlayground/ZIndexPlayground.types";

// `auto` and `0` paint on the same layer, so collapsing them to one number is all the comparisons need.
function zLevel(value: string): number {
  return value === "auto" ? 0 : Number(value);
}

// Mirrors the browser's own rule: any non-auto z-index on a positioned element, or any trigger property, seals Card A.
export function cardAFormsContext(state: PlaygroundState): boolean {
  return state.cardAZ !== "auto" || state.trigger !== "nothing";
}

// Card B always follows the tooltip in the source, so it wins every tie — the readout says so explicitly.
function describeComparison(contender: number, cardB: number, winText: string): string {
  if (contender > cardB) return winText;
  if (contender === cardB) return "they share the same level, so the element that comes later in the source — Card B — paints on top and covers the tooltip.";
  return "Card B is higher, so it paints over the tooltip.";
}

/*
  Re-derives the stacking outcome from the same rules the browser applies, so the explanation always matches what
  the reader can see in the live stage above it.
*/
export function resolveVerdict(state: PlaygroundState): PlaygroundVerdict {
  const bLevel = zLevel(state.cardBZ);

  if (cardAFormsContext(state)) {
    const aLevel = zLevel(state.cardAZ);
    const reason = state.cardAZ !== "auto" ? `z-index: ${state.cardAZ}` : state.trigger;
    const aLabel = state.cardAZ !== "auto" ? `z-index: ${state.cardAZ}` : "level 0, the same as z-index: 0";

    return {
      tooltipOnTop: aLevel > bLevel,
      explanation:
        `Card A forms a stacking context (${reason}), so the tooltip's z-index: ${state.tooltipZ} only ranks it inside Card A. ` +
        `At the root, Card A (${aLabel}) is compared with Card B (z-index: ${state.cardBZ}): ` +
        describeComparison(aLevel, bLevel, "Card A is higher, so the tooltip travels with it and paints above Card B.")
    };
  }

  return {
    tooltipOnTop: state.tooltipZ > bLevel,
    explanation:
      `Card A doesn't form a stacking context, so the tooltip competes at the root directly: z-index: ${state.tooltipZ} ` +
      `against Card B's z-index: ${state.cardBZ} — ` +
      describeComparison(state.tooltipZ, bLevel, "the tooltip is higher, so it paints above Card B.")
  };
}

// The exact CSS the stage is running, so readers can copy a state they've reasoned through into their own code.
export function buildCss(state: PlaygroundState): string {
  const trigger = state.trigger === "nothing" ? "" : `\n  ${state.trigger};`;

  return `
.card-a {
  position: relative;
  z-index: ${state.cardAZ};${trigger}
}

.card-a .tooltip {
  position: absolute;
  z-index: ${state.tooltipZ};
}

.card-b {
  position: relative;
  z-index: ${state.cardBZ};
}
`;
}
