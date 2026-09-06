// Bounds of the single annotated container box — wider than it is tall, so cqi (width) is the
// larger axis and cqb (height) is the smaller one, matching most real card/sidebar containers.
export const BOX = { x: 60, y: 40, w: 300, h: 170 };

/*
  The 4 container query length units, each keyed to one measurement drawn on the box above. cqmin
  and cqmax don't measure a fixed axis — they pick whichever of cqi/cqb is smaller or larger AT THE
  BOX'S CURRENT SHAPE, which is why their callouts point at the same two arrows instead of a third
  and fourth one of their own.
*/
export const UNITS = [
  { unit: "cqi", meaning: "1% of inline size (width)" },
  { unit: "cqb", meaning: "1% of block size (height)" },
  { unit: "cqmin", meaning: "smaller of cqi / cqb — here, cqb" },
  { unit: "cqmax", meaning: "larger of cqi / cqb — here, cqi" }
];
