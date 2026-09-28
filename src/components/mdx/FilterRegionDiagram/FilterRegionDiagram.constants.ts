/*
  Blur radius shared by both panels. Identical on purpose: the only variable between the two panels is the
  filter region, so any visible difference has to come from the region alone. 3 × 10 = 30 units of spill.
*/
export const BLUR_STD_DEVIATION = 10;

// Corner radius of the filtered shape — rounded so the blur's soft falloff reads clearly against the hard clip.
export const SHAPE_RADIUS = 12;

// Geometry for one panel: the element's own bbox, the region it's filtered within, and its labels.
export interface RegionPanel {
  key: string;
  bbox: { x: number; y: number; width: number; height: number };
  region: { x: number; y: number; width: number; height: number };
  title: string;
  regionLabel: string;
  caption: string;
  clipped: boolean;
}

/*
  The two panels, computed from the same 140 × 100 bbox. Left: the spec default (x/y = -10%, width/height = 120%)
  gives only 14/10 units of margin — far less than the blur's 30-unit spill, so it's cut off. Right: -30%/160%
  gives 42/30 units, enough to contain it.
*/
export const PANELS: RegionPanel[] = [
  {
    key: "default",
    bbox: { x: 90, y: 70, width: 140, height: 100 },
    region: { x: 76, y: 60, width: 168, height: 120 },
    title: "Default region (no x/y/width/height)",
    regionLabel: "x/y = -10%, width/height = 120%",
    caption: "blur clipped at the region edge",
    clipped: true
  },
  {
    key: "expanded",
    bbox: { x: 430, y: 70, width: 140, height: 100 },
    region: { x: 388, y: 40, width: 224, height: 160 },
    title: "Expanded region",
    regionLabel: "x/y = -30%, width/height = 160%",
    caption: "blur fits inside the region",
    clipped: false
  }
];
