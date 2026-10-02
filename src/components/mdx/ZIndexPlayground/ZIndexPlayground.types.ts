// Live control values, narrowed from the generic demo-values record once at the component boundary.
export interface PlaygroundState {
  cardAZ: string;
  trigger: string;
  tooltipZ: number;
  cardBZ: string;
}

// The outcome plus the reasoning behind it, so the readout teaches the rule rather than just announcing a winner.
export interface PlaygroundVerdict {
  tooltipOnTop: boolean;
  explanation: string;
}
