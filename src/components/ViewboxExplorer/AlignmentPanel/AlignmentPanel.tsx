import type { CSSProperties, JSX } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from "@/components/Icon";
import { ALIGN_GRID, TOUR_STEPS, formatPreserveAspectRatio, parseAlign } from "@/components/ViewboxExplorer/ViewboxExplorer.utils";
import { SectionCard, PanelTitle, PanelHint, TimerButton } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";
import { AlignLayout, AlignGrid, AlignCell, ModeColumn, AttributeValue, TourRow, TourCounter } from "@/components/ViewboxExplorer/AlignmentPanel/AlignmentPanel.styles";
import type { AlignPosition, AlignmentPanelProps } from "@/components/ViewboxExplorer/ViewboxExplorer.types";

// Where each position puts the cell's dot, as a fraction of the cell — min at the start, max at the end.
const DOT_OFFSET: Record<AlignPosition, number> = { min: 0, mid: 0.5, max: 1 };

// Spoken positions for each half, so a screen reader hears "left, top" alongside the bare keyword.
const POSITION_WORDS: Record<"x" | "y", Record<AlignPosition, string>> = {
  x: { min: "left", mid: "centre", max: "right" },
  y: { min: "top", mid: "middle", max: "bottom" }
};

/*
  Every preserveAspectRatio combination in one tray: none, a 3 × 3 pad for the nine alignments and
  a two-key switch for meet ("fit with borders") versus slice ("crop to fill"). The auto-tour walks
  all nineteen; under reduced motion it never plays by itself and the same keys step through it by
  hand instead.
*/
export default function AlignmentPanel({ state, actions, tourIndex, isTouring, prefersReducedMotion, onToggleTour, onStepTour }: AlignmentPanelProps): JSX.Element {
  const isNone = state.align === "none";

  return (
    <>
      <SectionCard>
        <PanelTitle>Fit or crop</PanelTitle>
        <AlignLayout>
          <AlignGrid role="group" aria-label="Alignment">
            {ALIGN_GRID.map((align) => {
              const position = parseAlign(align);
              const x = position?.x ?? "mid";
              const y = position?.y ?? "mid";
              const style = { "--dot-x": DOT_OFFSET[x], "--dot-y": DOT_OFFSET[y] } as CSSProperties;
              return (
                <AlignCell key={align} type="button" aria-pressed={state.align === align} aria-label={`${align}, ${POSITION_WORDS.x[x]} ${POSITION_WORDS.y[y]}`} title={align} style={style} onClick={() => actions.setAlign(align)} />
              );
            })}
          </AlignGrid>

          <ModeColumn role="group" aria-label="Scaling mode">
            <TimerButton type="button" data-led="" aria-pressed={!isNone && state.meetOrSlice === "meet"} onClick={() => actions.setMeetOrSlice("meet")}>
              Fit with borders · meet
            </TimerButton>
            <TimerButton type="button" data-led="" aria-pressed={!isNone && state.meetOrSlice === "slice"} onClick={() => actions.setMeetOrSlice("slice")}>
              Crop to fill · slice
            </TimerButton>
            <TimerButton type="button" data-led="" aria-pressed={isNone} onClick={() => actions.setAlign("none")}>
              Stretch · none
            </TimerButton>
          </ModeColumn>
        </AlignLayout>

        <AttributeValue aria-live="off">preserveAspectRatio=&quot;{formatPreserveAspectRatio(state.align, state.meetOrSlice)}&quot;</AttributeValue>

        <TourRow role="group" aria-label="Auto-tour">
          <TimerButton type="button" aria-label="Previous combination" onClick={() => onStepTour(-1)}>
            <ChevronLeftIcon size={14} />
          </TimerButton>
          {!prefersReducedMotion && (
            <TimerButton type="button" data-led="" aria-pressed={isTouring} onClick={onToggleTour}>
              <PlayIcon size={12} />
              {isTouring ? "Stop tour" : "Auto-tour"}
            </TimerButton>
          )}
          <TimerButton type="button" aria-label="Next combination" onClick={() => onStepTour(1)}>
            <ChevronRightIcon size={14} />
          </TimerButton>
          <TourCounter>{tourIndex === null ? `${TOUR_STEPS.length} combinations` : `${tourIndex + 1} / ${TOUR_STEPS.length}`}</TourCounter>
        </TourRow>
        {prefersReducedMotion && <PanelHint>Your system asks for reduced motion, so the tour won&apos;t play by itself — step through all nineteen with the arrows.</PanelHint>}
      </SectionCard>
    </>
  );
}

AlignmentPanel.displayName = "AlignmentPanel";
