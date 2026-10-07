import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";

// The enlarger's baseboard — a matt dark board the print sits on, centred so a small print reads as small.
export const Baseboard = styled.div`
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  background:
    repeating-linear-gradient(90deg, color-mix(in srgb, black 6%, transparent) 0 0.0625rem, transparent 0.0625rem 0.5rem),
    color-mix(in srgb, var(--safelight) 6%, color-mix(in srgb, var(--color-bg-muted) 55%, black));
  border-radius: 0.375rem;
  box-shadow: inset 0 0 1.5rem color-mix(in srgb, black 40%, transparent);
  overflow: hidden;
`;

/*
  Shown at its true pixel size where the column allows (and scaled down where it doesn't), so
  changing the print size visibly changes the paper. Pointer events stay off — nothing here is
  interactive.
*/
export const StageSvg = styled.svg`
  display: block;
  max-inline-size: 100%;
  block-size: auto;
  overflow: hidden;

  & text {
    font-family: ${MONO_FONT};
  }
`;

// The paper itself — brighter than the board, with a soft drop shadow so it lifts off it.
export const Paper = styled.rect`
  fill: color-mix(in srgb, var(--color-bg-default) 88%, white);
  filter: drop-shadow(0 2px 4px color-mix(in srgb, black 45%, transparent));
`;

/*
  The real print: an actual nested <svg> carrying the chosen viewBox and preserveAspectRatio, so
  the browser does the maths for the drawing while the overlays use this tool's own — if they ever
  disagreed it would show. overflow is forced back to hidden because the site's svg reset sets it
  visible, and a viewport that doesn't clip isn't a viewport.
*/
export const PrintSvg = styled.svg`
  overflow: hidden;
`;

// The projected image spilling past the paper onto the board — faint, because no paper is there to catch it.
export const Spill = styled.g`
  opacity: 0.22;
`;

// User-space grid printed on the paper — scales with the viewBox, which is the whole point of drawing it here.
export const PrintGridLine = styled.line`
  stroke: color-mix(in srgb, var(--color-fg-muted) 35%, transparent);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;

  &[data-axis="true"] {
    stroke: color-mix(in srgb, var(--color-fg-muted) 80%, transparent);
  }
`;

// Letterbox borders or the overhang that gets cropped — both hatched in safelight, filled from a pattern.
export const ShadeBand = styled.path`
  fill-rule: evenodd;
`;

// Where the viewBox lands on the paper, by this tool's own maths — dashed so the real print shows through.
export const MappedOutline = styled.rect`
  fill: none;
  stroke: var(--safelight);
  stroke-width: 2;
  stroke-dasharray: 7 4;
`;

// The paper's edge drawn on top, so it stays crisp over the drawing and the overlays.
export const PaperEdge = styled.rect`
  fill: none;
  stroke: color-mix(in srgb, var(--color-fg-default) 45%, transparent);
  stroke-width: 1;
`;

// Measurements and band labels — haloed so they read over hatching and spill alike.
export const StageLabel = styled.text`
  fill: var(--color-fg-default);
  font-size: 11px;
  paint-order: stroke;
  stroke: color-mix(in srgb, var(--color-bg-muted) 55%, black);
  stroke-width: 3px;
  stroke-linejoin: round;

  &[data-tone="safelight"] {
    fill: var(--safelight-ink);
    font-weight: 700;
  }
`;

// Legend under the board — what each overlay colour means, in the room's monospace.
export const Legend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  color: var(--color-fg-muted);

  & li {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }
`;

// A small key swatch for the legend, painted per item via data-kind.
export const LegendSwatch = styled.span`
  inline-size: 0.875rem;
  block-size: 0.625rem;
  border-radius: 0.125rem;

  &[data-kind="outline"] {
    border: 0.125rem dashed var(--safelight);
  }

  &[data-kind="borders"] {
    background: repeating-linear-gradient(45deg, var(--safelight) 0 0.125rem, color-mix(in srgb, var(--safelight) 15%, transparent) 0.125rem 0.3125rem);
  }

  &[data-kind="spill"] {
    background: color-mix(in srgb, var(--color-fg-muted) 40%, transparent);
  }
`;
