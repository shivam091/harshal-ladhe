import type { MiddlewareOutcomeKind, MiddlewareOutcomeColor } from "@/components/mdx/MiddlewareRequestFlowDiagram/MiddlewareRequestFlowDiagram.types";

/*
  Maps an outcome's kind to the colors its boxes and connecting line render with — kept consistent
  with RedirectVsRewriteDiagram's palette (redirect = attention/amber, since it's a real round trip
  the visitor pays for; rewrite = accent/indigo, since it's the "invisible" one; next = neutral,
  since it's simply "carry on").
*/
export function getMiddlewareOutcomeColor(kind: MiddlewareOutcomeKind): MiddlewareOutcomeColor {
  switch (kind) {
    case "redirect":
      return { fill: "var(--color-bg-attention-muted)", stroke: "var(--color-border-attention-emphasis)" };
    case "rewrite":
      return { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" };
    default:
      return { fill: "var(--color-bg-neutral-muted)", stroke: "var(--color-border-neutral-muted)" };
  }
}
