// Both panels share one size, so the only visible difference between them is which axes get an arrow.
export const PANEL_W = 190;
export const PANEL_H = 150;

/*
  The 2 `container-type` values that actually establish a query context — `normal` is deliberately
  left out, since it's the "not a container at all" case, not a third option to contrast against.
  `inline-size` only ever watches the container's own inline (width) axis, which is why its height
  stays free; `size` watches both axes, which is why it's the one that needs a definite height.
*/
type Axis = "horizontal" | "vertical";

export const CONTAINMENT_PANELS: {
  panelX: number;
  panelY: number;
  value: string;
  watches: string;
  note: string;
  axes: Axis[];
}[] = [
  {
    panelX: 20,
    panelY: 30,
    value: "inline-size",
    watches: "width only",
    note: "height stays free to grow with content",
    axes: ["horizontal"]
  },
  {
    panelX: 250,
    panelY: 30,
    value: "size",
    watches: "width + height",
    note: "needs a definite height, or it collapses to 0px",
    axes: ["horizontal", "vertical"]
  }
];
