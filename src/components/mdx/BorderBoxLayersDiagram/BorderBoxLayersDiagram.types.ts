// Props for BorderBoxLayersDiagram — selects which of its two views to render.
export interface BorderBoxLayersDiagramProps {
  // Which view to render: the nested box model, or the two-layer background-clip breakdown.
  variant: BorderBoxLayersDiagramVariant;
}

/*
  "box-model" sits in the post's "How a Border Is Painted" section; "layers" sits in the background-clip section —
  split so each view appears next to the paragraph that explains it, instead of one tall diagram ahead of both.
*/
export type BorderBoxLayersDiagramVariant = "box-model" | "layers";
