import type { JSX } from "react";
import type { AnchorSide, AnchorSideControlsProps } from "@/interfaces/popover-anchor-builder";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { CompassGrid, CompassButton, CompassSpacer } from "@/components/PopoverAnchorBuilder/AnchorSideControls/AnchorSideControls.styles";
import { FieldCaption } from "@/components/PopoverAnchorBuilder/PopoverAnchorBuilder.styles";
import Slider from "@/components/PopoverAnchorBuilder/Slider/Slider";

// Compass-point layout with an active center cell: up top-center, left/right on the middle row, center in the middle, down bottom-center — placed via explicit grid-column/row (not document order) so the 4 corners stay empty spacers.
const SIDES: Array<{ value: AnchorSide; glyph: string; label: string; column: number; row: number }> = [
  { value: "top", glyph: "▲", label: "top", column: 2, row: 1 },
  { value: "left", glyph: "◀", label: "left", column: 1, row: 2 },
  { value: "center", glyph: "●", label: "center", column: 2, row: 2 },
  { value: "right", glyph: "▶", label: "right", column: 3, row: 2 },
  { value: "bottom", glyph: "▼", label: "bottom", column: 2, row: 3 }
];

// Which anchor() side(s) drive the popover's placement, plus the gap between it and the trigger — the gap is disabled (not just hidden) when "center" is picked, since translate(-50%, -50%) puts the popover on the trigger regardless of offset.
export default function AnchorSideControls({ state, actions }: AnchorSideControlsProps): JSX.Element {
  const isCentered = state.anchorSide === "center";

  return (
    <>
      <FieldWrapper>
        <FieldLabel>Anchor side</FieldLabel>
        <CompassGrid>
          <CompassSpacer style={{ gridColumn: 1, gridRow: 1 }} />
          <CompassSpacer style={{ gridColumn: 3, gridRow: 1 }} />
          {SIDES.map((side) => (
            <CompassButton
              key={side.value}
              type="button"
              aria-label={side.label}
              aria-pressed={state.anchorSide === side.value}
              data-selected={state.anchorSide === side.value ? "true" : undefined}
              style={{ gridColumn: side.column, gridRow: side.row }}
              // setAnchorSide is itself commit-wired (one undo step per click) — no separate commitDrag call needed here.
              onClick={() => actions.setAnchorSide(side.value)}
            >
              {side.glyph}
            </CompassButton>
          ))}
          <CompassSpacer style={{ gridColumn: 1, gridRow: 3 }} />
          <CompassSpacer style={{ gridColumn: 3, gridRow: 3 }} />
        </CompassGrid>
      </FieldWrapper>

      <Slider
        label="Offset"
        min={0}
        max={64}
        value={state.offset}
        suffix="px"
        disabled={isCentered}
        onChange={(offset) => actions.setOffset(offset)}
        onCommit={actions.commitDrag}
      />
      {isCentered && <FieldCaption>Offset has no effect while the popover is centered on its trigger.</FieldCaption>}
    </>
  );
}

AnchorSideControls.displayName = "AnchorSideControls";
