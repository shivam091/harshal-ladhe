import type { JSX } from "react";
import type { GridSubgridCardProps } from "@/components/mdx/GridSubgridDiagram/GridSubgridCard/GridSubgridCard.types";
import { CARD_W, CARD_TOP, DESC_H, BUTTON_H } from "@/components/mdx/GridSubgridDiagram/GridSubgridDiagram.constants";

// Renders one card's title/description/button bands stacked vertically, with the button drawn as a small pill.
export default function GridSubgridCard({ x, titleLabel, titleH }: GridSubgridCardProps): JSX.Element {
  const descTop = CARD_TOP + titleH;
  const buttonTop = descTop + DESC_H;
  const cardHeight = titleH + DESC_H + BUTTON_H;

  return (
    <>
      <g>
        {/* Card outline, spanning all three bands. */}
        <rect
          x={x} y={CARD_TOP} width={CARD_W} height={cardHeight} rx={8}
          fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5}
        />

        {/* Title band */}
        <text x={x + CARD_W / 2} y={CARD_TOP + titleH / 2 + 4} textAnchor="middle" fontSize={10} fill="var(--color-fg-default)">{titleLabel}</text>
        <line x1={x} y1={descTop} x2={x + CARD_W} y2={descTop} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="3 3" />

        {/* Description band */}
        <text x={x + CARD_W / 2} y={descTop + DESC_H / 2 + 4} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">Description</text>
        <line x1={x} y1={buttonTop} x2={x + CARD_W} y2={buttonTop} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="3 3" />

        {/* Button band, rendered as a small filled pill so it reads clearly as a button. */}
        <rect
          x={x + CARD_W / 2 - 26} y={buttonTop + BUTTON_H / 2 - 10} width={52} height={20} rx={10}
          fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1}
        />
        <text x={x + CARD_W / 2} y={buttonTop + BUTTON_H / 2 + 4} textAnchor="middle" fontSize={9} fill="var(--color-fg-default)">Button</text>
      </g>
    </>
  );
}

GridSubgridCard.displayName = "GridSubgridCard";
