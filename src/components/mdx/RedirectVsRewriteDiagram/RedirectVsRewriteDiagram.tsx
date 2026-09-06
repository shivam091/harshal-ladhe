import type { JSX } from "react";
import {
  CANVAS_W,
  PANEL_H,
  TOP_PAD,
  BROWSER_W,
  BROWSER_H,
  ADDRESS_BAR_H,
  TITLE_Y,
  BROWSER_TOP_Y,
  BEFORE_BROWSER_X,
  AFTER_BROWSER_X,
  ARROW_Y,
  ARROW_LABEL_Y,
  NOTE_Y,
  REDIRECT_REWRITE_PANELS
} from "@/components/mdx/RedirectVsRewriteDiagram/RedirectVsRewriteDiagram.constants";
import { getAfterAddressBarColor, getAfterContentColor, type BrowserPartColor } from "@/components/mdx/RedirectVsRewriteDiagram/RedirectVsRewriteDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/RedirectVsRewriteDiagram/RedirectVsRewriteDiagram.styles";

const UNCHANGED_COLOR: BrowserPartColor = { fill: "var(--color-bg-muted)", stroke: "var(--color-border-muted)" };

interface BrowserMockupProps {
  x: number;
  url: string;
  content: string;
  addressBarColor: BrowserPartColor;
  contentColor: BrowserPartColor;
}

// One "browser window" — an address-bar strip over a content area — reused for every before/after slot.
function BrowserMockup({ x, url, content, addressBarColor, contentColor }: BrowserMockupProps): JSX.Element {
  const contentX = x + 6;
  const contentY = BROWSER_TOP_Y + ADDRESS_BAR_H + 6;
  const contentW = BROWSER_W - 12;
  const contentH = BROWSER_H - ADDRESS_BAR_H - 12;

  return (
    <g>
      <rect x={x} y={BROWSER_TOP_Y} width={BROWSER_W} height={BROWSER_H} rx={9} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />

      <rect x={x} y={BROWSER_TOP_Y} width={BROWSER_W} height={ADDRESS_BAR_H} rx={7} fill={addressBarColor.fill} stroke={addressBarColor.stroke} strokeWidth={1.25} />
      <text
        x={x + BROWSER_W / 2}
        y={BROWSER_TOP_Y + ADDRESS_BAR_H / 2 + 4}
        textAnchor="middle"
        fontSize={10.5}
        fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fill="var(--color-fg-default)"
      >
        {url}
      </text>

      <rect x={contentX} y={contentY} width={contentW} height={contentH} rx={6} fill={contentColor.fill} stroke={contentColor.stroke} strokeWidth={1.25} />
      <text x={x + BROWSER_W / 2} y={contentY + contentH / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-fg-default)">
        {content}
      </text>
    </g>
  );
}

/*
  Static SVG diagram contrasting the two response types beginners mix up most: NextResponse.redirect()
  really does send the browser somewhere else — a new request, a new address bar — while
  NextResponse.rewrite() serves different content without the visitor ever seeing evidence it
  happened. Both panels share the exact same before/after browser-mockup layout on purpose: the only
  thing that visually differs between them is which part — the address bar, or the content beneath
  it — actually changes color from "before" to "after."
*/
export default function RedirectVsRewriteDiagram(): JSX.Element {
  const height = TOP_PAD + REDIRECT_REWRITE_PANELS.length * PANEL_H;
  const arrowMidX = (BEFORE_BROWSER_X + BROWSER_W + AFTER_BROWSER_X) / 2;

  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 ${CANVAS_W} ${height}`} role="img" aria-labelledby="redirect-vs-rewrite-diagram-title redirect-vs-rewrite-diagram-desc">
          <title id="redirect-vs-rewrite-diagram-title">Redirect vs rewrite comparison diagram</title>
          <desc id="redirect-vs-rewrite-diagram-desc">
            Two panels, each showing a browser before and after a middleware response. In the redirect
            panel, the address bar changes from /dashboard to /login and a new request is made — the
            address bar is highlighted as the thing that changed. In the rewrite panel, the address bar
            stays at /home in both the before and after browsers, while the content area underneath
            changes from home variant A to home variant B — the content area is highlighted as the
            thing that changed instead.
          </desc>

          <defs>
            <marker id="redirect-rewrite-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {REDIRECT_REWRITE_PANELS.map((panel, index) => {
            const offsetY = TOP_PAD + index * PANEL_H;
            const afterAddressBarColor = getAfterAddressBarColor(panel);
            const afterContentColor = getAfterContentColor(panel);

            return (
              <g key={panel.title} transform={`translate(0, ${offsetY})`}>
                <text x={20} y={TITLE_Y} fontSize={12.5} fontWeight={600} fill="var(--color-fg-default)">{panel.title}</text>

                <BrowserMockup
                  x={BEFORE_BROWSER_X}
                  url={panel.beforeUrl}
                  content={panel.beforeContent}
                  addressBarColor={UNCHANGED_COLOR}
                  contentColor={UNCHANGED_COLOR}
                />

                <line
                  x1={BEFORE_BROWSER_X + BROWSER_W}
                  y1={ARROW_Y}
                  x2={AFTER_BROWSER_X}
                  y2={ARROW_Y}
                  stroke="var(--color-fg-muted)"
                  strokeWidth={1.75}
                  markerEnd="url(#redirect-rewrite-arrow)"
                />
                <text x={arrowMidX} y={ARROW_LABEL_Y} textAnchor="middle" fontSize={9.5} fontStyle="italic" fill="var(--color-fg-muted)">
                  {panel.arrowLabel}
                </text>

                <BrowserMockup
                  x={AFTER_BROWSER_X}
                  url={panel.afterUrl}
                  content={panel.afterContent}
                  addressBarColor={afterAddressBarColor}
                  contentColor={afterContentColor}
                />

                <text x={CANVAS_W / 2} y={NOTE_Y} textAnchor="middle" fontSize={10.5} fill="var(--color-fg-muted)">{panel.note}</text>
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

RedirectVsRewriteDiagram.displayName = "RedirectVsRewriteDiagram";
