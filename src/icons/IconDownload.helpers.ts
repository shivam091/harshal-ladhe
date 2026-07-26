// Tray/arrow geometry for the resting and pressed-and-held shapes — the spring interpolates between these directly.
export const SHAPE_DATA = {
  idle: { trayLeft: 21, trayRight: 5, arrowY: 10, shaftY2: 3 },
  pressed: { trayLeft: 23, trayRight: 3, arrowY: 15, shaftY2: 6 },
} as const;

// Tray path — its mouth widens as the arrow above retracts into it.
export function getTrayPath(left: number, right: number): string {
  return `M${left} 15v4a2 2 0 0 1-2 2H${right}a2 2 0 0 1-2-2v-4`;
}

// Arrowhead chevron — flattens from a downward point to a level line as it meets the tray.
export function getArrowPoints(y: number): string {
  return `7,${y} 12,15 17,${y}`;
}
