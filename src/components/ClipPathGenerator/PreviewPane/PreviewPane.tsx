import type { JSX } from "react";
import { compileClipPathValue } from "@/utils/clip-path";
import { interpolateShape } from "@/utils/clip-path-animation";
import ShapeOverlay from "@/components/ClipPathGenerator/ShapeOverlay/ShapeOverlay";
import type { PreviewPaneProps } from "@/interfaces/clip-path";
import { PreviewStage, ColorSubject, ImageSubject, TextSubject } from "@/components/ClipPathGenerator/PreviewPane/PreviewPane.styles";

/*
  The bounded stage the shape is clipped within. The clip subject swaps between a color swatch, one
  of the site's own portrait photos, and the user's own text — the same shape reads very differently
  clipping a flat color versus a photo versus glyph strokes, which is the point of exposing the choice
  at all rather than hard-coding one demo subject like most clip-path tools do.

  ShapeOverlay always edits/displays `state.shape` (Shape A) directly, even while morph is enabled —
  only the CLIPPED SUBJECT swaps to the live-interpolated shape at the morph scrub position, so
  dragging a handle always manipulates the shape's real vertices, never a blended phantom of them.
*/
export default function PreviewPane({ state, actions }: PreviewPaneProps): JSX.Element {
  const { morph } = state;
  const clipShape = morph?.enabled ? interpolateShape(state.shape, morph.shapeB, morph.t) : state.shape;
  const clipPath = compileClipPathValue(clipShape);

  return (
    <>
      <PreviewStage>
        {state.previewSubject === "color" && (
          <ColorSubject style={{ clipPath, ["--subject-color" as string]: state.previewColor }} />
        )}
        {state.previewSubject === "image" && (
          <ImageSubject
            src={`/assets/img/${state.previewImageId}.png`}
            alt=""
            style={{ clipPath }}
          />
        )}
        {state.previewSubject === "text" && (
          <TextSubject style={{ clipPath, ["--subject-color" as string]: state.previewColor }}>
            {state.previewText || "Clip Path"}
          </TextSubject>
        )}

        <ShapeOverlay shape={state.shape} selection={state.selection} actions={actions} ghostShape={morph?.enabled ? morph.shapeB : null} />
      </PreviewStage>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
