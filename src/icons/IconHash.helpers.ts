import { IconToggleStatus } from "@/types/toggle-status";

type LineCoords = { x1: number; y1: number; x2: number; y2: number };

// Target coordinates for each of the icon's 4 strokes, per status.
export default function getLineData(status: IconToggleStatus): LineCoords[] {
  switch (status) {
    case "idle":
    case "hovering":
      return [
        { x1: 2, y1: 8, x2: 22, y2: 8 },
        { x1: 2, y1: 16, x2: 22, y2: 16 },
        { x1: 10, y1: 2, x2: 6, y2: 22 },
        { x1: 18, y1: 2, x2: 14, y2: 22 },
      ];
    case "booped": {
      const boopBy = 1;
      return [
        { x1: 2, y1: 8 + boopBy, x2: 22, y2: 8 + boopBy },
        { x1: 2, y1: 16 - boopBy, x2: 22, y2: 16 - boopBy },
        { x1: 10 + boopBy, y1: 2, x2: 6 + boopBy, y2: 22 },
        { x1: 18 - boopBy, y1: 2, x2: 14 - boopBy, y2: 22 },
      ];
    }
    case "pressed":
      return [
        { x1: 2, y1: 12, x2: 22, y2: 12 },
        { x1: 2, y1: 12, x2: 22, y2: 12 },
        { x1: 12, y1: 2, x2: 12, y2: 22 },
        { x1: 12, y1: 2, x2: 12, y2: 22 },
      ];
  }
}
