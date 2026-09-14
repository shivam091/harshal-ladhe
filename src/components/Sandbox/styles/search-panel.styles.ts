// Find/replace popup (custom Panel via search({ createPanel }), see Editor/extensions/search-panel.ts),
// docked to the editor's top-right corner as a compact card — VS Code's find-widget treatment —
// rather than CodeMirror's default docked top/bottom panel or a centered modal.
export const searchPanelCss = `
  /*
    CodeMirror inserts the panel's dom inside its own .cm-panels wrapper — a docked, sticky bar
    that only takes up space via in-flow content. Since our dom is itself an absolutely positioned
    element, that wrapper would collapse to zero height (nothing left in-flow to size it) and our
    panel would then position against that zero-height box instead of the editor. display:contents
    removes the wrapper from layout entirely, so .sandbox-search-panel below sizes against
    .cm-editor (the next real ancestor, already position:relative) instead — the same positioned
    ancestor goto-line.ts's card uses.
  */
  .cm-panels {
    display: contents !important;
  }

  /*
    Docked top-right and flush with the editor's top edge (no top border/radius, so it reads as a
    tab hanging off the frame, same as VS Code's find widget), instead of a dimmed centered modal.

    Grid, not flex-column-of-flex-rows: find and replace each need their own trailing content
    (toggles/nav/close vs. the replace/replace-all buttons), but the two rows' *fields* still need
    to land at the same width regardless. Sharing one grid-template-columns across both rows (each
    row set to display:contents below, so its cells become direct grid items) makes that automatic
    — the field column is a single shared track, and the trailing column sizes to whichever row's
    trailing content is wider (find's, having five items to replace's two), leaving the shorter
    row's trailing cell blank past its own content instead of stretched apart to match.
  */
  .sandbox-search-panel {
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 1.125rem;
    z-index: 600;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    column-gap: 0.25rem;
    /*
      Half of .cm-editor's width (this panel's containing block, see the comment above) — the
      find/replace fields (the grid's 1fr column) grow with it. Floored at 30rem: on a typical
      code pane, half its width lands close to the old fixed 21rem, which read as barely wider at
      all once the trailing icon groups (~10rem, fixed regardless of panel width) are subtracted
      out of it — the fields need the floor to actually look bigger, not just compute to a bigger
      number. Still capped by max-inline-size below so it doesn't overflow a narrow pane.
    */
    inline-size: max(50%, 30rem);
    max-inline-size: calc(100% - 1.5rem);
    background: var(--color-bg-overlay);
    border: 0.0625rem solid var(--color-border-default);
    border-block-start: none;
    border-end-start-radius: 0.375rem;
    border-end-end-radius: 0.375rem;
    box-shadow: var(--box-shadow-md);
    padding: 0.25rem;
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
    font-size: 0.75rem !important;
    animation: sandbox-search-slide-down 160ms ease-out both;
  }

  /*
    Applied by closeSandboxSearchPanel (see Editor/extensions/panel-motion.ts) before the panel is
    actually removed — takes over from the slide-down animation above via the extra class's higher
    specificity, picking up smoothly from wherever that animation left off.
  */
  .sandbox-search-panel.sandbox-panel-closing {
    animation: sandbox-search-slide-up 140ms ease-in both;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .sandbox-search-panel,
    .sandbox-search-panel.sandbox-panel-closing {
      animation-duration: 1ms;
    }
  }

  @keyframes sandbox-search-slide-down {
    from {
      transform: translateY(-0.5rem);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes sandbox-search-slide-up {
    from {
      transform: translateY(0);
      opacity: 1;
    }

    to {
      transform: translateY(-0.5rem);
      opacity: 0;
    }
  }

  /* Unwraps each row so its cells (leading control, field, trailing group) become direct grid items. */
  .sandbox-search-row {
    display: contents;
  }

  .sandbox-search-row[hidden] {
    display: none;
  }

  /*
    Spans both the find and replace rows' leading column — with .sandbox-search-panel's
    align-items: center, that centers the toggle vertically across both rows once expanded (VS
    Code's own placement) instead of only within the find row's height. Collapsed, the replace
    row contributes no second track (display: none), so the span has nothing to grow into and this
    is a no-op.
  */
  .sandbox-search-expand-btn {
    grid-row: span 2;
    align-items: center;
    block-size: 100% !important;    
  }

  /*
    The trailing grid cell for either row — find's toggles/separator/nav/separator/close, or
    replace's replace/replace-all buttons. Left-aligned content (flex's own default) plus this
    cell's own shared-column width (see .sandbox-search-panel above) is what leaves blank space
    after replace's shorter pair instead of it stretching apart to fill the row.
  */
  .sandbox-search-trailing {
    display: flex;
    align-items: center;
    gap: 0.1875rem;
    flex-shrink: 0;
  }

  /* justify-self: stretch fills the shared field column (see .sandbox-search-panel above); min-inline-size: 0 lets it shrink below the input's intrinsic width instead of overflowing the column. */
  .sandbox-search-field-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-self: stretch;
    min-inline-size: 0;
  }

  .sandbox-search-replace-row {
    .sandbox-search-field-wrap,
    .sandbox-search-trailing {
      margin-block-start: 0.5rem;
    }
  }

  .sandbox-search-field-wrap .sandbox-search-input {
    inline-size: 100% !important;
  }

  .sandbox-search-field-wrap--find .sandbox-search-input {
    padding-inline-end: 3.25rem !important;
  }

  .sandbox-search-input[aria-invalid="true"] {
    border-color: var(--color-border-danger-emphasis) !important;
  }

  .sandbox-search-count {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: 0.25rem;
    max-inline-size: 3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    transform: translateY(-50%);
    font-size: 0.6875rem;
    color: var(--color-fg-muted);
    white-space: nowrap;
    pointer-events: none;
  }

  .sandbox-search-count[data-empty] {
    color: var(--color-fg-danger);
  }

  .sandbox-search-toggles {
    display: inline-flex;
    align-items: center;
    gap: 0.0625rem;
    flex-shrink: 0;
  }

  .sandbox-search-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 1.5rem;
    block-size: 1.5rem;
    padding-inline: 0.1875rem;
    color: var(--color-fg-muted);
    background: transparent;
    border: 0.0625rem solid transparent;
    border-radius: 0.25rem;
    cursor: pointer;
    transition:
      background 150ms ease,
      color 150ms ease,
      border-color 150ms ease;
  }

  .sandbox-search-toggle:hover {
    background: var(--color-bg-neutral-muted);
    color: var(--color-fg-default);
  }

  .sandbox-search-toggle[aria-pressed="true"] {
    background: var(--color-bg-accent-muted);
    border-color: var(--color-border-accent-muted);
    color: var(--color-fg-accent);
  }

  .sandbox-search-nav {
    display: inline-flex;
    align-items: center;
    gap: 0.0625rem;
    flex-shrink: 0;
  }

  .sandbox-search-separator {
    inline-size: 0.0625rem;
    block-size: 1.125rem;
    flex-shrink: 0;
    background: var(--color-border-muted);
  }

  /*
    The search panel's own icon buttons run smaller than toolbarIconButtonCx's shared 1.75rem
    (used by the real toolbar and the goto-line card) — VS Code's find widget runs noticeably
    tighter than the app's toolbar, so this overrides size only inside the panel.
  */
  .sandbox-search-panel .sandbox-search-icon-btn {
    inline-size: 1.5rem;
    block-size: 1.5rem;
    border-radius: 0.25rem;
    flex-shrink: 0;
  }

  .sandbox-search-panel .sandbox-search-icon-btn svg {
    inline-size: 1.125rem;
    block-size: 1.125rem;
  }

  /*
    Same border/radius/background/font/focus formula as the app's real form controls (see
    ContactForm.styles.ts's shared input styles), scaled down to VS Code's ~28px find-field
    height instead of the app's usual 2rem control height. Scoped to the panel so goto-line's
    own input (styled independently in goto-line.styles.ts) is unaffected.
  */
  .sandbox-search-panel .cm-textfield {
    inline-size: auto;
    block-size: 1.75rem !important;
    padding-inline: 0.375rem !important;
    border: 0.0625rem solid var(--color-border-default) !important;
    border-radius: 0.25rem !important;
    background: transparent !important;
    color: var(--color-fg-default) !important;
    font-size: 0.75rem;
    font-weight: 400;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }

  .sandbox-search-panel .cm-textfield:focus-visible {
    outline: none !important;
    border-color: var(--color-border-accent-emphasis) !important;
    box-shadow: 0 0 0 0.1875rem hsl(from var(--color-bg-accent-emphasis) h s l / 0.25);
  }

  /* Active search-match highlights in the editor body. */
  .cm-searchMatch {
    background: var(--color-bg-accent-muted) !important;
  }

  .cm-searchMatch-selected {
    background: var(--color-bg-accent-emphasis) !important;
  }

  /*
    Same reasoning as goto-line.styles.ts's cursor-visibility override — this panel's fields keep
    DOM focus while it's open (see runKeepingFocus, used by find next/prev, select-all, and
    replace/replace all), so @codemirror/view's own baseTheme (which only reveals .cm-cursor while
    .cm-editor carries "cm-focused") would otherwise hide the caret for as long as the panel stays
    open — leaving the current match's position with no visible cursor to anchor it. Plain
    :has(.sandbox-search-panel), not goto-line's ":has(> ...)", because this panel's dom sits one
    level deeper, inside CodeMirror's own .cm-panels wrapper.
  */
  .cm-editor:has(.sandbox-search-panel) > .cm-scroller > .cm-cursorLayer {
    animation: steps(1) cm-blink 1.2s infinite;
  }

  .cm-editor:has(.sandbox-search-panel) > .cm-scroller > .cm-cursorLayer .cm-cursor {
    display: block !important;
  }
`;
