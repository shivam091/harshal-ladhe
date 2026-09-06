import type { JSX } from "react";
import {
  BOX_W,
  BOX_H,
  IMG_W,
  IMG_H,
  PANEL_Y,
  CANVAS_W,
  CANVAS_H,
  SKY_TOP,
  SKY_BOTTOM,
  SUN_COLOR,
  GROUND_COLOR,
  MOUNTAIN_COLOR,
  POSITION_PANELS
} from "@/components/mdx/ObjectPositionDiagram/ObjectPositionDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ObjectPositionDiagram/ObjectPositionDiagram.styles";

/*
  Static SVG diagram for `object-position`, isolated from `object-fit` by using `object-fit: none` — the
  photo is never scaled, only slid around inside a box smaller than it in both dimensions, so every panel
  has genuine room to move both horizontally and vertically. The one fact this diagram exists to teach: an
  `object-position` value pins a matching point on the photo to that same point on the box — "top left"
  pins the photo's own top-left corner to the box's top-left corner, "100% 100%" pins its bottom-right
  corner to the box's, and so on. A crosshair marks that shared pinned point on every panel, and a dashed
  outline traces the photo's full extent so it's clear how much is being cropped away outside the box.
*/
export default function ObjectPositionDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} role="img" aria-labelledby="object-position-title object-position-desc">
          <title id="object-position-title">CSS object-position diagram</title>
          <desc id="object-position-desc">
            The same landscape photo, larger than its box in both directions, cropped at four different
            object-position values: center (the default), top left, bottom right, and a custom 25% 75%. A
            crosshair marks the point shared by the photo and the box at each value, and a dashed outline
            shows how much of the photo extends past the box and gets cropped away.
          </desc>

          <defs>
            <linearGradient id="object-position-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SKY_TOP} />
              <stop offset="100%" stopColor={SKY_BOTTOM} />
            </linearGradient>
            {POSITION_PANELS.map((panel) => (
              <clipPath key={`clip-${panel.value}`} id={`object-position-clip-${panel.value.replace(/\s|%/g, "")}`}>
                <rect width={BOX_W} height={BOX_H} />
              </clipPath>
            ))}
          </defs>

          {POSITION_PANELS.map((panel) => {
            const clipId = `object-position-clip-${panel.value.replace(/\s|%/g, "")}`;
            return (
              <g key={panel.value} transform={`translate(${panel.panelX}, ${PANEL_Y})`}>
                {/* Box: the element's own content box, sized identically for every panel. */}
                <rect width={BOX_W} height={BOX_H} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1} />

                {/* Dashed reference showing the photo's full extent, drawn UNDER the visible crop. */}
                <rect
                  x={panel.offsetX}
                  y={panel.offsetY}
                  width={IMG_W}
                  height={IMG_H}
                  fill="none"
                  stroke="var(--color-border-attention-emphasis)"
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                />

                <g clipPath={`url(#${clipId})`}>
                  <g transform={`translate(${panel.offsetX}, ${panel.offsetY})`}>
                    <rect width={IMG_W} height={IMG_H} fill="url(#object-position-sky)" />
                    <circle cx={IMG_W * 0.78} cy={IMG_H * 0.28} r={IMG_H * 0.16} fill={SUN_COLOR} />
                    <rect y={IMG_H * 0.62} width={IMG_W} height={IMG_H * 0.38} fill={GROUND_COLOR} />
                    <polygon
                      points={`0,${IMG_H * 0.62} ${IMG_W * 0.32},${IMG_H * 0.3} ${IMG_W * 0.58},${IMG_H * 0.62}`}
                      fill={MOUNTAIN_COLOR}
                    />
                    <polygon
                      points={`${IMG_W * 0.4},${IMG_H * 0.62} ${IMG_W * 0.68},${IMG_H * 0.22} ${IMG_W},${IMG_H * 0.62}`}
                      fill={MOUNTAIN_COLOR}
                      opacity={0.8}
                    />
                  </g>
                </g>

                {/* Box border redrawn on top so the clipped photo's cut edges always read crisply. */}
                <rect width={BOX_W} height={BOX_H} fill="none" stroke="var(--color-border-muted)" strokeWidth={1} />

                {/* Crosshair: the single point shared by the photo and the box at this object-position value. */}
                <line x1={panel.anchorX - 9} y1={panel.anchorY} x2={panel.anchorX + 9} y2={panel.anchorY} stroke="var(--color-fg-accent)" strokeWidth={1.75} />
                <line x1={panel.anchorX} y1={panel.anchorY - 9} x2={panel.anchorX} y2={panel.anchorY + 9} stroke="var(--color-fg-accent)" strokeWidth={1.75} />
                <circle cx={panel.anchorX} cy={panel.anchorY} r={3} fill="var(--color-fg-accent)" stroke="var(--color-bg-default)" strokeWidth={1} />

                <text x={BOX_W / 2} y={BOX_H + 22} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">
                  {panel.value}
                </text>
                <text x={BOX_W / 2} y={BOX_H + 38} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
                  {panel.note}
                </text>
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

ObjectPositionDiagram.displayName = "ObjectPositionDiagram";
