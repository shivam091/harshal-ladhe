/*
  One point set, drawn twice at different x offsets. The ends sit at different heights so the implicit closing
  chord is visibly slanted and can't be mistaken for a baseline or axis.
*/
const LOCAL_POINTS: Array<[number, number]> = [
  [20, 220],
  [80, 70],
  [150, 160],
  [210, 90],
  [280, 200]
];

// Shifts the shared point set into a panel, so both panels are guaranteed to use literally the same geometry.
function offsetPoints(dx: number): Array<[number, number]> {
  return LOCAL_POINTS.map(([x, y]) => [x + dx, y]);
}

/*
  The open and closed panels. Each carries its own start/end vertex so the closing chord can be drawn between
  them without re-deriving indexes in the component.
*/
export const PANELS = [
  {
    key: "polyline",
    centre: 170,
    points: offsetPoints(20),
    title: "<polyline>, fill not set",
    subtitle: "fill still defaults to black",
    chordLabel: "phantom fill boundary: filled, never stroked"
  },
  {
    key: "polygon",
    centre: 490,
    points: offsetPoints(340),
    title: "<polygon>",
    subtitle: "closes itself back to the start",
    chordLabel: "auto closing segment: stroked and joined"
  }
];
