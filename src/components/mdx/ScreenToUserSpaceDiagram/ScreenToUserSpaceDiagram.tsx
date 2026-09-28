import type { JSX } from "react";
import { VIEWPORT, SVG_BOX, POINTER, USER_PANEL, VIEWBOX_SIZE, GRID_STEPS } from "@/components/mdx/ScreenToUserSpaceDiagram/ScreenToUserSpaceDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ScreenToUserSpaceDiagram/ScreenToUserSpaceDiagram.styles";

// Monospace stack for code-like labels, so the API call reads as code rather than prose.
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/*
  Static diagram of converting a pointer event's clientX/clientY (CSS pixels from the viewport's top-left)
  into the SVG's own viewBox user units. Exists because the two spaces differ by both an offset (where the
  <svg> sits on the page) and a scale (viewBox size vs rendered size), and getScreenCTM().inverse() undoes
  both at once — seeing the same point in each space makes the arithmetic concrete.
*/
export default function ScreenToUserSpaceDiagram(): JSX.Element {
  const svgX = VIEWPORT.x + SVG_BOX.left;
  const svgY = VIEWPORT.y + SVG_BOX.top;
  const pointerX = VIEWPORT.x + POINTER.clientX;
  const pointerY = VIEWPORT.y + POINTER.clientY;

  const unitsPerPixel = VIEWBOX_SIZE / SVG_BOX.size;
  const userX = (POINTER.clientX - SVG_BOX.left) * unitsPerPixel;
  const userY = (POINTER.clientY - SVG_BOX.top) * unitsPerPixel;

  const panelScale = USER_PANEL.size / VIEWBOX_SIZE;
  const pointX = USER_PANEL.x + userX * panelScale;
  const pointY = USER_PANEL.y + userY * panelScale;

  const leftCenter = VIEWPORT.x + VIEWPORT.width / 2;
  const rightCenter = USER_PANEL.x + USER_PANEL.size / 2;
  const gutterCenter = (VIEWPORT.x + VIEWPORT.width + USER_PANEL.x) / 2;
  const arrowY = (pointerY + pointY) / 2;

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 680 412" role="img" aria-labelledby="screen-to-user-space-diagram-title screen-to-user-space-diagram-desc">
          <title id="screen-to-user-space-diagram-title">Client pixels to SVG user units diagram</title>
          <desc id="screen-to-user-space-diagram-desc">
            Left: a browser viewport in CSS pixels with an svg element placed at left 40, top 60, rendered 200 by 200
            pixels. A pointer sits at clientX 190, clientY 160. Right: the same svg&apos;s user space, viewBox 0 0 100 100,
            where that pointer lands at x 75, y 50. An arrow labelled getScreenCTM().inverse() connects them: subtracting
            the offset and multiplying by 100 over 200 gives the user-unit coordinates.
          </desc>

          <defs>
            <marker id="screen-to-user-space-diagram-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* Left panel — the viewport in client (CSS pixel) space. */}
          <text x={leftCenter} y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">Client space (CSS pixels)</text>
          <rect x={VIEWPORT.x} y={VIEWPORT.y} width={VIEWPORT.width} height={VIEWPORT.height} rx={6} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={VIEWPORT.x + 6} y={VIEWPORT.y + 14} fontSize={10} fill="var(--color-fg-muted)">(0, 0)</text>

          {/* The rendered <svg> box, offset from the viewport origin. */}
          <rect x={svgX} y={svgY} width={SVG_BOX.size} height={SVG_BOX.size} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
          <text x={svgX + 8} y={svgY + 16} fontSize={11} fontWeight={600} fill="var(--color-fg-default)">&lt;svg&gt;</text>
          <text x={leftCenter} y={VIEWPORT.y + VIEWPORT.height + 18} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">&lt;svg&gt; box: left 40, top 60, 200 × 200 CSS px</text>

          {/* clientX / clientY guides measured from the viewport origin, not from the svg. */}
          <line x1={VIEWPORT.x} y1={pointerY} x2={pointerX} y2={pointerY} stroke="var(--color-border-danger-emphasis)" strokeWidth={1.5} strokeDasharray="4 3" />
          <line x1={pointerX} y1={VIEWPORT.y} x2={pointerX} y2={pointerY} stroke="var(--color-border-danger-emphasis)" strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={pointerX - 14} y={pointerY - 6} textAnchor="end" fontSize={10} fontFamily={MONO} fill="var(--color-fg-danger)">clientX = {POINTER.clientX}</text>
          <text x={pointerX - 6} y={VIEWPORT.y + 40} textAnchor="end" fontSize={10} fontFamily={MONO} fill="var(--color-fg-danger)">clientY = {POINTER.clientY}</text>

          {/* The pointer itself. */}
          <circle cx={pointerX} cy={pointerY} r={8} fill="none" stroke="var(--color-border-danger-emphasis)" strokeWidth={1.5} />
          <circle cx={pointerX} cy={pointerY} r={3.5} fill="var(--color-fg-danger)" />

          {/* Conversion arrow across the gutter. */}
          <line x1={VIEWPORT.x + VIEWPORT.width + 6} y1={arrowY} x2={USER_PANEL.x - 4} y2={arrowY} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#screen-to-user-space-diagram-arrow)" />
          <text x={gutterCenter} y={arrowY - 8} textAnchor="middle" fontSize={10} fontFamily={MONO} fill="var(--color-fg-muted)">getScreenCTM()</text>
          <text x={gutterCenter} y={arrowY + 16} textAnchor="middle" fontSize={10} fontFamily={MONO} fill="var(--color-fg-muted)">.inverse()</text>

          {/* Right panel — the same svg's user space, with quarter gridlines. */}
          <text x={rightCenter} y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">User space (viewBox 0 0 100 100)</text>
          <rect x={USER_PANEL.x} y={USER_PANEL.y} width={USER_PANEL.size} height={USER_PANEL.size} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
          {GRID_STEPS.map((step) => {
            const offset = step * panelScale;

            return (
              <g key={step}>
                <line x1={USER_PANEL.x + offset} y1={USER_PANEL.y} x2={USER_PANEL.x + offset} y2={USER_PANEL.y + USER_PANEL.size} stroke="var(--color-border-muted)" strokeWidth={1} />
                <line x1={USER_PANEL.x} y1={USER_PANEL.y + offset} x2={USER_PANEL.x + USER_PANEL.size} y2={USER_PANEL.y + offset} stroke="var(--color-border-muted)" strokeWidth={1} />
                <text x={USER_PANEL.x + offset} y={USER_PANEL.y - 6} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">{step}</text>
                <text x={USER_PANEL.x + USER_PANEL.size + 6} y={USER_PANEL.y + offset + 4} fontSize={10} fill="var(--color-fg-muted)">{step}</text>
              </g>
            );
          })}

          {/* The converted point and its guides back to the user-space axes. */}
          <line x1={USER_PANEL.x} y1={pointY} x2={pointX} y2={pointY} stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} strokeDasharray="4 3" />
          <line x1={pointX} y1={USER_PANEL.y} x2={pointX} y2={pointY} stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} strokeDasharray="4 3" />
          <circle cx={pointX} cy={pointY} r={8} fill="none" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
          <circle cx={pointX} cy={pointY} r={3.5} fill="var(--color-border-success-emphasis)" />
          <text x={pointX - 12} y={pointY + 22} textAnchor="middle" fontSize={11} fontWeight={600} fontFamily={MONO} fill="var(--color-fg-default)">({userX}, {userY})</text>

          {/* The API call and the arithmetic it performs for this example. */}
          <rect x={40} y={348} width={600} height={30} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1.5} />
          <text x={340} y={367} textAnchor="middle" fontSize={11} fontFamily={MONO} fill="var(--color-fg-default)">new DOMPoint(clientX, clientY).matrixTransform(svg.getScreenCTM().inverse())</text>
          <text x={340} y={400} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">x = (190 − 40) × 100 / 200 = 75 · y = (160 − 60) × 100 / 200 = 50</text>
        </Svg>
      </Wrapper>
    </>
  );
}

ScreenToUserSpaceDiagram.displayName = "ScreenToUserSpaceDiagram";
