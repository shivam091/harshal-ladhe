import type { JSX } from "react";
import {
  BOX,
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
  INTRINSIC_OFFSET_X,
  INTRINSIC_OFFSET_Y,
  FIT_PANELS
} from "@/components/mdx/ObjectFitModesDiagram/ObjectFitModesDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ObjectFitModesDiagram/ObjectFitModesDiagram.styles";

/*
  Static SVG diagram comparing all 5 `object-fit` keyword values on the *same* source photo inside an
  *identical* square box, side by side — the single comparison beginners need but rarely get in one place.
  `fill` distorts the photo to match the box exactly; `contain` shrinks it to fit whole (letterboxing the
  leftover space); `cover` grows it to fill the box whole (cropping the overflow); `none` draws it at its
  real, unscaled size (cropped hard by the box, no resizing at all); and `scale-down` behaves like whichever
  of `none`/`contain` produces the smaller result — which, for a photo bigger than its box (the case here,
  and the common case in real layouts), is always `contain`. A dashed outline on the last two panels traces
  the photo's true intrinsic size, so it stays visible even where the box clips most of it away.
*/
export default function ObjectFitModesDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} role="img" aria-labelledby="object-fit-modes-title object-fit-modes-desc">
          <title id="object-fit-modes-title">CSS object-fit keyword comparison</title>
          <desc id="object-fit-modes-desc">
            The same landscape photo placed in an identical square box under all five object-fit values.
            Fill stretches and distorts it to match the box exactly. Contain shrinks it to fit inside the box
            whole, leaving empty space above and below. Cover grows it to fill the box whole, cropping the
            left and right edges. None draws it at its real size, cropping most of it away. Scale-down
            produces the same result as contain here, because the photo is larger than the box in both
            dimensions — a dashed outline on these last two panels shows the photo&apos;s true, unscaled size.
          </desc>

          <defs>
            <linearGradient id="object-fit-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SKY_TOP} />
              <stop offset="100%" stopColor={SKY_BOTTOM} />
            </linearGradient>
            {FIT_PANELS.map((panel) => (
              <clipPath key={`clip-${panel.keyword}`} id={`object-fit-clip-${panel.keyword}`}>
                <rect x={0} y={0} width={BOX} height={BOX} />
              </clipPath>
            ))}
          </defs>

          {FIT_PANELS.map((panel) => (
            <g key={panel.keyword} transform={`translate(${panel.panelX}, ${PANEL_Y})`}>
              {/* Box: the element's own content box, sized identically for every panel. */}
              <rect width={BOX} height={BOX} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1} />

              {/*
                Dashed reference showing the photo's true, unscaled size — drawn UNDER the visible photo, so
                it only peeks out where the actual rendered photo doesn't already cover it.
              */}
              {panel.showIntrinsicOutline && (
                <rect
                  x={INTRINSIC_OFFSET_X}
                  y={INTRINSIC_OFFSET_Y}
                  width={IMG_W}
                  height={IMG_H}
                  fill="none"
                  stroke="var(--color-border-attention-emphasis)"
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                />
              )}

              <g clipPath={`url(#object-fit-clip-${panel.keyword})`}>
                <g transform={`translate(${panel.offsetX}, ${panel.offsetY})`}>
                  <rect width={IMG_W} height={IMG_H} fill="url(#object-fit-sky)" />
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
              <rect width={BOX} height={BOX} fill="none" stroke="var(--color-border-muted)" strokeWidth={1} />

              <text x={BOX / 2} y={BOX + 22} textAnchor="middle" fontSize={14} fontWeight={600} fill="var(--color-fg-default)">
                {panel.keyword}
              </text>
              <text x={BOX / 2} y={BOX + 38} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
                {panel.note}
              </text>
            </g>
          ))}
        </Svg>
      </Wrapper>
    </>
  );
}

ObjectFitModesDiagram.displayName = "ObjectFitModesDiagram";
