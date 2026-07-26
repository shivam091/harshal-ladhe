/*
  Undoes an overflow rule @replit/codemirror-minimap's own theme adds to `.cm-editor`, which fixes
  broken touch-scroll on mobile caused by nesting it around CodeMirror's own scroll container.
*/
export const minimapCss = `
  .cm-editor {
    overflow-y: visible !important;
  }

  /*
    The minimap is sticky over the scroller, so long lines run underneath it. A slightly see-through
    background (instead of the solid one it inherits as a .cm-gutters element) lets that code show
    faintly behind it, the way VS Code's minimap does.
  */
  .cm-gutters.cm-minimap-gutter {
    background-color: color-mix(in srgb, var(--color-bg-default) 85%, transparent);
  }

  .cm-minimap-overlay {
    cursor: grab;
  }

  /*
    cm-minimap-overlay-active is the class the library itself adds to the overlay's container for the
    duration of a drag — more specific than the plain grab rule
    above so it wins while dragging.
  */
  .cm-minimap-overlay-container.cm-minimap-overlay-active .cm-minimap-overlay {
    cursor: grabbing;
  }
`;
