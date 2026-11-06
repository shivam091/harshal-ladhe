import type { JSX } from "react";
import {
  PLANE_LEFT,
  PLANE_RIGHT,
  TOP_LAYER_Y,
  TOP_LAYER_H,
  DOCUMENT_Y,
  DOCUMENT_H,
  DIALOG_DOM,
  DIALOG_TOP,
} from "@/components/mdx/TopLayerDiagram/TopLayerDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/TopLayerDiagram/TopLayerDiagram.styles";

/*
  Static SVG diagram of the top layer as a separate plane above the document: the dialog is written deep
  inside clipping, transformed and z-indexed ancestors, yet renders above all of them once promoted.
*/
export default function TopLayerDiagram(): JSX.Element {
  const planeWidth = PLANE_RIGHT - PLANE_LEFT;

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 420 350" role="img" aria-labelledby="top-layer-diagram-title top-layer-diagram-desc">
          <title id="top-layer-diagram-title">The top layer sits above every stacking context in the document</title>
          <desc id="top-layer-diagram-desc">
            Two planes. The lower plane is the document: a header with z-index 9999, and a card with overflow hidden
            containing a transformed wrapper, inside which the dialog element is written. The upper plane is the top
            layer. Calling showModal promotes the dialog up into it, where it renders above the whole document along
            with its ::backdrop, ignoring the clipping ancestor, the transform and the z-index on the header.
          </desc>

          <defs>
            <marker id="top-layer-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-accent)" />
            </marker>
          </defs>

          {/* Top layer — the backdrop spans the full plane, the dialog floats above it. */}
          <text x={PLANE_LEFT} y={TOP_LAYER_Y - 10} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">Top layer</text>
          <rect x={PLANE_LEFT} y={TOP_LAYER_Y} width={planeWidth} height={TOP_LAYER_H} rx={8} fill="var(--color-fg-default)" fillOpacity={0.12} stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
          <text x={PLANE_RIGHT - 8} y={TOP_LAYER_Y + TOP_LAYER_H - 8} textAnchor="end" fontSize={9.5} fill="var(--color-fg-muted)">::backdrop</text>
          <rect x={DIALOG_TOP.x} y={DIALOG_TOP.y} width={DIALOG_TOP.w} height={DIALOG_TOP.h} rx={6} fill="var(--color-bg-default)" stroke="var(--color-border-accent-emphasis)" strokeWidth={2} />
          <text x={DIALOG_TOP.x + DIALOG_TOP.w / 2} y={DIALOG_TOP.y + DIALOG_TOP.h / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-fg-accent)">&lt;dialog open&gt;</text>

          {/* Document — the stacking contexts that would normally trap or cover the dialog. */}
          <text x={PLANE_LEFT} y={DOCUMENT_Y - 10} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">Document</text>
          <rect x={PLANE_LEFT} y={DOCUMENT_Y} width={planeWidth} height={DOCUMENT_H} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />

          <rect x={PLANE_LEFT + 12} y={DOCUMENT_Y + 12} width={planeWidth - 24} height={26} rx={4} fill="var(--color-bg-default)" stroke="var(--color-border-muted)" />
          <text x={PLANE_LEFT + 22} y={DOCUMENT_Y + 29} fontSize={10} fill="var(--color-fg-muted)">header — z-index: 9999</text>

          <rect x={PLANE_LEFT + 60} y={DOCUMENT_Y + 50} width={planeWidth - 120} height={88} rx={6} fill="none" stroke="var(--color-border-default)" strokeDasharray="5 3" />
          <text x={PLANE_LEFT + 70} y={DOCUMENT_Y + 64} fontSize={10} fill="var(--color-fg-muted)">.card — overflow: hidden</text>
          <rect x={PLANE_LEFT + 80} y={DOCUMENT_Y + 72} width={planeWidth - 160} height={58} rx={4} fill="none" stroke="var(--color-border-muted)" />
          <text x={PLANE_LEFT + 90} y={DOCUMENT_Y + 86} fontSize={10} fill="var(--color-fg-muted)">.wrapper — transform</text>

          <rect x={DIALOG_DOM.x} y={DIALOG_DOM.y} width={DIALOG_DOM.w} height={DIALOG_DOM.h - 12} rx={4} fill="none" stroke="var(--color-border-accent-emphasis)" strokeDasharray="3 3" />
          <text x={DIALOG_DOM.x + DIALOG_DOM.w / 2} y={DIALOG_DOM.y + 15} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-accent)">&lt;dialog&gt;</text>

          {/* Promotion — the DOM position stays where it is; only rendering moves up. */}
          <line
            x1={DIALOG_DOM.x + DIALOG_DOM.w / 2} y1={DIALOG_DOM.y - 2}
            x2={DIALOG_TOP.x + DIALOG_TOP.w / 2 + 14} y2={DIALOG_TOP.y + DIALOG_TOP.h + 6}
            stroke="var(--color-fg-accent)" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#top-layer-arrow)"
          />
          <text x={DIALOG_TOP.x + DIALOG_TOP.w / 2 + 30} y={TOP_LAYER_Y + TOP_LAYER_H + 26} fontSize={10} fill="var(--color-fg-accent)">showModal() promotes it</text>

          <text x={210} y={344} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">Clipping, transforms and z-index down here cannot reach it up there.</text>
        </Svg>
      </Wrapper>
    </>
  );
}

TopLayerDiagram.displayName = "TopLayerDiagram";
