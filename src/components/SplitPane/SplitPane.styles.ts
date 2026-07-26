import { styled } from "@linaria/react";

// Shared with the drag logic so pointer position converts to a ratio correctly.
export const DIVIDER_WIDTH = 16;

/*
  block-size/min-block-size/align-self are explicit (not just flex:1) so this doesn't silently collapse
  to auto-height inside a caller flex container and clip its contents.
*/
export const Wrapper = styled.div`
  max-inline-size: 100%;
  overflow: hidden;
  flex: 1;
  block-size: 100%;
  min-block-size: 0;
  align-self: stretch;
`;

// Flex row (horizontal) or column (vertical) holding the two panes and the divider between them.
export const Container = styled.div`
  block-size: 100%;
  min-block-size: 0;
  display: flex;
  align-items: stretch;

  &[data-direction="horizontal"] {
    flex-direction: row;
  }

  &[data-direction="vertical"] {
    flex-direction: column;
  }
`;

// Min width in horizontal mode so a pane can't shrink to nothing.
const Pane = styled.div`
  flex: var(--pane-flex);
  overflow: hidden;

  &[data-direction="horizontal"] {
    min-inline-size: 200px;
  }
`;

/*
  The pane before the divider — pulled 8px past it so the divider's hover/hit area overlaps both panes instead of
  sitting in a gap.
*/
export const FirstPane = styled(Pane)`
  &[data-direction="horizontal"] {
    margin-inline-end: calc(-1 * 0.5rem);
  }

  &[data-direction="vertical"] {
    margin-block-end: calc(-1 * 0.5rem);
  }
`;

// The pane after the divider — mirrors FirstPane's overlap on the divider's other side.
export const SecondPane = styled(Pane)`
  &[data-direction="horizontal"] {
    margin-inline-start: calc(-1 * 0.5rem);
  }

  &[data-direction="vertical"] {
    margin-block-start: calc(-1 * 0.5rem);
  }
`;

/*
  Draggable/keyboard-resizable handle — a thin static line (::before) plus a wider hover-only
  highlight (::after) so the hit area is bigger than the visible line.
*/
export const Divider = styled.button`
  position: relative;
  /* Must beat CodeMirror's default panel stacking so an in-flow panel doesn't paint over this handle. */
  z-index: 301;
  pointer-events: auto;
  padding: 0;
  background: transparent;
  border: none;
  flex-shrink: 0;
  /* Without this, touch browsers treat a drag as page-pan and scroll instead of resizing. */
  touch-action: none;

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
  }

  /* Horizontal (col-resize) */
  &[data-direction="horizontal"] {
    inline-size: ${DIVIDER_WIDTH}px;
    block-size: 100%;
    cursor: col-resize;
  }

  &[data-direction="horizontal"]::before {
    inline-size: 1px;
    block-size: 100%;
    background-color: var(--color-border-muted);
  }

  &[data-direction="horizontal"]::after {
    inline-size: 11px;
    block-size: 100%;
    background-color: hsl(210deg 15% 20% / 0.5);
    opacity: 0;
    transform: scaleX(0);
    transition: opacity 500ms, transform 500ms;
  }

  &[data-direction="horizontal"]:hover::after {
    opacity: 1;
    transform: scaleX(1);
    transition: opacity 250ms, transform 500ms cubic-bezier(0.17, 0.67, 0.44, 1);
  }

  /* Vertical (row-resize) */
  &[data-direction="vertical"] {
    block-size: ${DIVIDER_WIDTH}px;
    inline-size: 100%;
    cursor: row-resize;
  }

  &[data-direction="vertical"]::before {
    inline-size: 100%;
    block-size: 0.0625rem;
    background-color: var(--color-border-muted);
  }

  &[data-direction="vertical"]::after {
    inline-size: 100%;
    block-size: 11px;
    background-color: hsl(210deg 15% 20% / 0.5);
    opacity: 0;
    transform: scaleY(0);
    transition: opacity 500ms, transform 500ms;
  }

  &[data-direction="vertical"]:hover::after {
    opacity: 1;
    transform: scaleY(1);
    transition: opacity 250ms, transform 500ms cubic-bezier(0.17, 0.67, 0.44, 1);
  }
`;
