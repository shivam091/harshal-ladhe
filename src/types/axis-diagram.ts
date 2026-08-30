// The four writing-mode/direction combinations AxisDiagram illustrates.
export type AxisDiagramVariant = 
    "horizontal-ltr" | 
    "horizontal-rtl" | 
    "vertical-rl" | 
    "vertical-lr";

// One axis is always "inline", the other always "block" — never both the same.
export type Axis = "inline" | "block";