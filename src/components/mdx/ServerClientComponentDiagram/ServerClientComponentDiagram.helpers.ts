import type { CapabilityIconStyle } from "@/components/mdx/ServerClientComponentDiagram/ServerClientComponentDiagram.types";

// Colors for a capability's supported (check) vs unsupported (cross) icon — shared by both columns.
export function getCapabilityIconStyle(supported: boolean): CapabilityIconStyle {
  return supported
    ? { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" }
    : { fill: "var(--color-bg-danger-muted)", stroke: "var(--color-border-danger-emphasis)" };
}
