import type { JSX } from "react";
import type { BorderBoxLayersDiagramProps } from "@/components/mdx/BorderBoxLayersDiagram/BorderBoxLayersDiagram.types";
import BoxModelView from "@/components/mdx/BorderBoxLayersDiagram/BoxModelView";
import LayersView from "@/components/mdx/BorderBoxLayersDiagram/LayersView";
import { Wrapper } from "@/components/mdx/BorderBoxLayersDiagram/BorderBoxLayersDiagram.styles";

/*
  Static SVG diagrams for the gradient-borders post's box model: `box-model` shows the nested boxes and the background
  running under a transparent border; `layers` breaks the background-clip technique into its two layers and the result.
*/
export default function BorderBoxLayersDiagram({ variant }: BorderBoxLayersDiagramProps): JSX.Element {
  return (
    <>
      <Wrapper>
        {variant === "box-model" ? <BoxModelView /> : <LayersView />}
      </Wrapper>
    </>
  );
}

BorderBoxLayersDiagram.displayName = "BorderBoxLayersDiagram";
