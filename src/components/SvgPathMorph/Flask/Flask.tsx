"use client";

import { memo, useId } from "react";
import type { JSX } from "react";
import { elixirTone, pointTone, shapeAnchors, shapeToPathData, strokeWidthFor, viewBoxToString } from "@/components/SvgPathMorph/SvgPathMorph.utils";
import { FlaskFigure, FlaskSvg, FlaskTag, TagLetter, TagCaption } from "@/components/SvgPathMorph/Flask/Flask.styles";
import type { FlaskProps } from "@/components/SvgPathMorph/SvgPathMorph.types";

// The round-bottomed flask outline: a neck 28 units wide dropping into an 84-radius bulb, the arc meeting the neck exactly where the circle reaches x = 86/114.
const FLASK_OUTLINE = "M86 12 V75.2 A84 84 0 1 0 114 75.2 V12 Z";

/*
  One keyframe in its glass flask, drawn at the shared viewBox so A and B sit at the same scale.
  Every matched point is marked in an index-stepped colour (the same index gets the same colour in
  the other flask) and each subpath's start is ringed, which is what makes a bad start-point
  pairing visible at a glance. Memoised because the bench re-renders every animation frame.
*/
function Flask({ label, caption, shape, viewBox, renderMode, showPoints, side, toneIndex }: FlaskProps): JSX.Element {
  const clipId = `flask-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const tone = elixirTone(toneIndex);
  const anchors = shape && showPoints ? shapeAnchors(shape) : [];
  const radius = viewBox ? viewBox.width * 0.022 : 1;

  return (
    <>
      <FlaskFigure data-side={side}>
        <FlaskSvg viewBox="0 0 200 250" role="img" aria-label={`Keyframe ${label}${shape ? "" : " (empty — fix its path to fill the flask)"}`}>
          <defs>
            <clipPath id={clipId}>
              <path d={FLASK_OUTLINE} />
            </clipPath>
          </defs>
          <path d={FLASK_OUTLINE} className="glass" />
          <path d="M0 214 Q 50 206 100 214 T 200 214 V 260 H 0 Z" clipPath={`url(#${clipId})`} className="liquid" style={{ fill: tone }} />
          <path d="M44 128 A62 62 0 0 1 78 94" className="glint" />
          <rect x="78" y="4" width="44" height="10" rx="3" className="lip" />
          {shape && viewBox && (
            <svg x="40" y="96" width="120" height="120" viewBox={viewBoxToString(viewBox)} overflow="visible">
              <path
                d={shapeToPathData(shape)}
                style={
                  renderMode === "stroke"
                    ? { fill: "none", stroke: tone, strokeWidth: strokeWidthFor(viewBox), strokeLinecap: "round", strokeLinejoin: "round" }
                    : { fill: tone, fillOpacity: 0.85 }
                }
              />
              {anchors.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r={point.first ? radius * 1.5 : radius}
                  className={point.first ? "start-point" : "point"}
                  style={{ fill: pointTone(i, anchors.length) }}
                />
              ))}
            </svg>
          )}
        </FlaskSvg>
        <FlaskTag>
          <TagLetter style={{ color: tone }}>{label}</TagLetter>
          <TagCaption>{caption}</TagCaption>
        </FlaskTag>
      </FlaskFigure>
    </>
  );
}

Flask.displayName = "Flask";

export default memo(Flask);
