/*
  Undoes an overflow rule @replit/codemirror-minimap's own theme adds to `.cm-editor`, which fixes
  broken touch-scroll on mobile caused by nesting it around CodeMirror's own scroll container.
*/
export const minimapCss = `
  .cm-editor {
    overflow-y: visible !important;
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
