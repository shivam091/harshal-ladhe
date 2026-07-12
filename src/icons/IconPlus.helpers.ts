// SVG line coordinates for the two lines that morph plus → chevron (and back).
export const LINE_DATA = [
  {
    plus:    { x1: 6,  y1: 12, x2: 18, y2: 12 },
    flat:    { x1: 8,  y1: 12, x2: 16, y2: 12 },
    chevron: { x1: 6,  y1: 9,  x2: 12, y2: 15 },
  },
  {
    plus:    { x1: 12, y1: 18, x2: 12, y2: 6  },
    flat:    { x1: 8,  y1: 12, x2: 16, y2: 12 },
    chevron: { x1: 12, y1: 15, x2: 18, y2: 9  },
  },
] as const;
