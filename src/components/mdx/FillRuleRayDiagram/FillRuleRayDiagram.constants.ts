/*
  Pentagram vertices in drawing order (every second point of a regular pentagon, radius 130 around 170,185).
  Skipping a vertex each time is what makes the edges cross and gives the centre a winding number of 2.
*/
export const STAR_POINTS = "170,55 246.4,290.2 46.4,144.8 293.6,144.8 93.6,290.2";

/*
  One direction arrow per edge, as start → arrow position → end. Each arrow sits at a hand-picked fraction of its
  edge rather than the midpoint so it never lands on a ray crossing or a label.
*/
export const EDGE_ARROWS = [
  "M170,55 L185.3,102 L246.4,290.2",
  "M246.4,290.2 L206.4,261.1 L46.4,144.8",
  "M46.4,144.8 L244.2,144.8 L293.6,144.8",
  "M293.6,144.8 L269.6,162.2 L93.6,290.2",
  "M93.6,290.2 L108.9,243.2 L170,55"
];

// Point A sits in the central pentagon, the one region where nonzero and evenodd disagree.
export const POINT_A = { x: 170, y: 185 };

// Point B sits inside the left arm, where both rules agree — included so the contrast with A is visible.
export const POINT_B = { x: 89.4, y: 152.5 };

/*
  Where A's rightward ray crosses the star's edges — both edges run the same way, so both count +1. Each "+1" label
  has its own position because the two edges converge just below the ray, leaving no single side clear for both.
*/
export const CROSSINGS_A = [
  { x: 212.2, y: 185, labelX: 224, labelY: 177 },
  { x: 238.3, y: 185, labelX: 238.3, labelY: 205 }
];

// Where B's leftward ray crosses the star's single lower-left edge.
export const CROSSING_B = { x: 56.9, y: 152.5 };

// Right-hand tally, one block per test point, spelling out both rules' arithmetic for that ray.
export const TALLY = [
  {
    y: 70,
    heading: "A — ray from the centre",
    note: "crosses 2 edges, both in the same direction",
    nonzero: "nonzero: +1 +1 = 2 → filled",
    evenodd: "evenodd: 2 crossings → even → empty"
  },
  {
    y: 190,
    heading: "B — ray from inside an arm",
    note: "crosses 1 edge",
    nonzero: "nonzero: +1 = 1 → filled",
    evenodd: "evenodd: 1 crossing → odd → filled"
  }
];
