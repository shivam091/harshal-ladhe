// Row data for ServerClientComponentDiagram — one capability, and whether each component kind supports it.
export interface ServerClientCapabilityRow {
  // Capability being compared, e.g. "useState / useReducer".
  label: string;
  // Whether a Server Component supports this capability.
  server: boolean;
  // Whether a Client Component supports this capability.
  client: boolean;
}

// Fill/stroke pair for one capability icon (a supported check or an unsupported cross).
export interface CapabilityIconStyle {
  fill: string;
  stroke: string;
}
