import { styled } from "@linaria/react";

// One monospace stack for every measurement — tape numbers, ratios and property tags all read as printed figures.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// A shop-sign serif for headings, so the haberdashery's labels feel printed rather than UI chrome.
export const SERIF_FONT = "Georgia, 'Iowan Old Style', 'Palatino Linotype', 'Times New Roman', serif";

/*
  "Haberdashery" shell — a polished wooden shop counter with a brass yard-rule let into its front
  edge, where notions are laid out on cream card stock, distinct from every other goodie's shell
  (including the Tailor's Bench's woven cloth and yellow tape). Strokes are thread here: the stage
  is a pinked-edge cutting cloth, dashes are stitches, caps are spools and joins are button cards.
  Every colour is a color-mix of theme tokens — wood from attention over the muted background,
  thread from danger, brass from attention over the foreground — so the counter re-stains itself
  for light, dark and soft-dark without a single hex.
*/
export const Haberdashery = styled.div`
  --haber-wood: color-mix(in srgb, var(--color-fg-attention) 20%, var(--color-bg-muted));
  --haber-wood-dark: color-mix(in srgb, var(--color-fg-attention) 30%, color-mix(in srgb, var(--color-fg-default) 18%, var(--color-bg-muted)));
  --haber-grain: color-mix(in srgb, var(--color-fg-attention) 14%, transparent);
  --haber-card: color-mix(in srgb, var(--color-fg-attention) 7%, var(--color-bg-default));
  --haber-card-edge: color-mix(in srgb, var(--color-fg-attention) 28%, var(--color-border-muted));
  --haber-thread: color-mix(in srgb, var(--color-fg-danger) 82%, var(--color-fg-default));
  --haber-thread-soft: color-mix(in srgb, var(--color-fg-danger) 40%, transparent);
  --haber-brass: color-mix(in srgb, var(--color-fg-attention) 70%, var(--color-fg-default));
  --haber-chalk: color-mix(in srgb, var(--color-fg-default) 72%, transparent);
  --haber-pass: var(--color-fg-success);
  --haber-fail: var(--color-fg-danger);

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  padding-block-end: clamp(2.25rem, 5vw, 2.75rem);
  background:
    repeating-linear-gradient(93deg, transparent 0 0.6rem, var(--haber-grain) 0.6rem 0.65rem, transparent 0.65rem 1.7rem),
    repeating-linear-gradient(88deg, transparent 0 2.3rem, var(--haber-grain) 2.3rem 2.45rem, transparent 2.45rem 4.1rem),
    linear-gradient(to bottom, var(--haber-wood), var(--haber-wood-dark));
  border: 0.0625rem solid color-mix(in srgb, var(--haber-wood-dark) 70%, var(--color-fg-default));
  border-radius: 0.75rem;
  box-shadow:
    inset 0 0.0625rem 0 color-mix(in srgb, white 18%, transparent),
    0 0.75rem 1.5rem -0.75rem color-mix(in srgb, black 40%, transparent);
  overflow: hidden;

  /* The brass yard-rule let into the counter's front edge — inch ticks over eighth ticks. */
  &::after {
    content: "";
    position: absolute;
    inset-inline: 0;
    inset-block-end: 0.5rem;
    block-size: 0.875rem;
    background:
      repeating-linear-gradient(to right, color-mix(in srgb, var(--color-fg-default) 70%, transparent) 0 0.0625rem, transparent 0.0625rem 2rem) 0 0 / 100% 0.875rem no-repeat,
      repeating-linear-gradient(to right, color-mix(in srgb, var(--color-fg-default) 45%, transparent) 0 0.0625rem, transparent 0.0625rem 0.25rem) 0 0 / 100% 0.375rem no-repeat,
      linear-gradient(to bottom, color-mix(in srgb, var(--haber-brass) 65%, white), var(--haber-brass));
    border-block: 0.0625rem solid color-mix(in srgb, var(--haber-brass) 60%, black);
    opacity: 0.85;
    pointer-events: none;
  }
`;

// The top of the counter — the woven shop label on one side, the sewn-on toolbar buttons on the other.
export const ShopSign = styled.header`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

/*
  Woven name-tape label, the kind sewn into a collar: notched (swallow-tailed) ends, a stitched
  border just inside the edge, and a faint twill to the weave.
*/
export const WovenLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.5rem 1.75rem 0.5625rem;
  background:
    repeating-linear-gradient(45deg, color-mix(in srgb, var(--color-fg-default) 4%, transparent) 0 0.0625rem, transparent 0.0625rem 0.1875rem),
    var(--haber-card);
  outline: 0.0625rem dashed var(--haber-thread);
  outline-offset: -0.3125rem;
  clip-path: polygon(0 0, 100% 0, calc(100% - 0.75rem) 50%, 100% 100%, 0 100%, 0.75rem 50%);
  box-shadow: 0 0.125rem 0 color-mix(in srgb, black 20%, transparent);
`;

// The label's woven name — small caps in the shop serif, tracked out like embroidered lettering.
export const LabelTitle = styled.span`
  font-family: ${SERIF_FONT};
  font-size: clamp(1.0625rem, 2.4vw, 1.3125rem);
  font-weight: 700;
  font-variant: small-caps;
  letter-spacing: 0.12em;
  color: var(--haber-thread);
`;

// The line under the name, like "est." on a shop tape.
export const LabelSub = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.625rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
`;

// Undo/redo/reset cluster; wraps under the label on phones rather than squeezing it.
export const ToolbarRow = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`;

/*
  A sewn-on coat button: round, domed, with a stitched ring inside its rim. Used for every discrete
  toolbar action so the controls read as part of the shop rather than generic chrome.
*/
export const SewingButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-inline-size: 2.5rem;
  min-block-size: 2.5rem;
  padding-inline: 0.625rem;
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-fg-default);
  background: radial-gradient(circle at 35% 30%, color-mix(in srgb, white 30%, var(--haber-card)), var(--haber-card) 60%, color-mix(in srgb, var(--haber-card-edge) 60%, var(--haber-card)));
  border: 0.0625rem solid var(--haber-card-edge);
  border-radius: 999rem;
  box-shadow: 0 0.125rem 0 color-mix(in srgb, black 25%, transparent);
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0.25rem;
    border: 0.0625rem dashed var(--haber-thread-soft);
    border-radius: inherit;
    pointer-events: none;
  }

  &:hover:not(:disabled)::before {
    border-color: var(--haber-thread);
  }

  &:active:not(:disabled) {
    transform: translateY(0.0625rem);
    box-shadow: 0 0.0625rem 0 color-mix(in srgb, black 25%, transparent);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

// Stage beside the notions on wide viewports, stacked on narrow ones with the stage first.
export const LabGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 62rem) {
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
    align-items: start;
  }
`;

// The stage column stays in view while the longer column of notions scrolls past it.
export const StageColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;

  @media (min-width: 62rem) {
    position: sticky;
    inset-block-start: 1rem;
  }
`;

// The column of notion cards.
export const ControlsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// Presets and sharing share the last shelf of the counter.
export const TrayRow = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 48rem) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    align-items: start;
  }
`;

/*
  A notion card — cream card stock with a running stitch just inside its edge, the way buttons and
  hooks are sold. Every control panel sits on one so the counter reads as a laid-out display.
*/
export const NotionCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-inline-size: 0;
  padding: 1rem;
  background: var(--haber-card);
  border: 0.0625rem solid var(--haber-card-edge);
  border-radius: 0.375rem;
  outline: 0.0625rem dashed var(--haber-thread-soft);
  outline-offset: -0.4375rem;
  box-shadow: 0 0.1875rem 0.375rem -0.1875rem color-mix(in srgb, black 35%, transparent);
`;

// A card's heading in the shop serif, with room for its property tag.
export const CardTitle = styled.h3`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-family: ${SERIF_FONT};
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;

// The CSS property a card controls, printed on a little swing tag (punched hole and all).
export const PropertyTag = styled.code`
  position: relative;
  padding: 0.0625rem 0.5rem 0.0625rem 1.125rem;
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--haber-thread);
  background: color-mix(in srgb, var(--haber-thread) 8%, var(--color-bg-default));
  border: 0.0625rem solid var(--haber-thread-soft);
  border-radius: 0.125rem 0.25rem 0.25rem 0.125rem;
  clip-path: polygon(0.375rem 0, 100% 0, 100% 100%, 0.375rem 100%, 0 50%);

  &::before {
    content: "";
    position: absolute;
    inset-inline-start: 0.5rem;
    inset-block-start: 50%;
    inline-size: 0.25rem;
    block-size: 0.25rem;
    border-radius: 50%;
    background: var(--haber-card-edge);
    transform: translateY(-50%);
  }
`;

// Small explanatory copy inside a card.
export const CardHint = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--color-fg-muted);

  & code {
    font-family: ${MONO_FONT};
    font-size: 0.75rem;
    color: var(--color-fg-default);
  }

  & strong {
    color: var(--color-fg-default);
  }
`;

// A row of controls that wraps — toggles, small inputs, buttons.
export const ControlRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
`;

/*
  A checkbox drawn as a press stud — a ring that snaps shut with a filled centre when on. Native
  input kept underneath for keyboard and screen readers.
*/
export const StudToggle = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
  cursor: pointer;

  & input {
    appearance: none;
    display: grid;
    place-items: center;
    flex: none;
    inline-size: 1.125rem;
    block-size: 1.125rem;
    margin: 0;
    border: 0.125rem solid var(--haber-brass);
    border-radius: 50%;
    background: var(--color-bg-default);
    cursor: pointer;
  }

  & input::after {
    content: "";
    inline-size: 0.375rem;
    block-size: 0.375rem;
    border-radius: 50%;
    background: var(--haber-thread);
    transform: scale(0);
    transition: transform 120ms ease;
  }

  & input:checked::after {
    transform: scale(1);
  }

  & input:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  & input:disabled,
  &:has(input:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    & input::after {
      transition: none;
    }
  }
`;

// A labelled field stack — label over input.
export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-inline-size: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
`;

// Text, number and select inputs in one card-stock style.
export const TextInput = styled.input`
  min-inline-size: 0;
  padding: 0.375rem 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--haber-card-edge);
  border-radius: 0.25rem;

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;

// The same field style for the multi-line custom path box.
export const TextArea = styled.textarea`
  min-inline-size: 0;
  min-block-size: 4.5rem;
  padding: 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--haber-card-edge);
  border-radius: 0.25rem;
  resize: vertical;

  &[aria-invalid="true"] {
    border-color: var(--haber-fail);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;

// Selects share the input look.
export const Select = styled.select`
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--haber-card-edge);
  border-radius: 0.25rem;

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;

// Native colour picker trimmed to a thread swatch.
export const ColourInput = styled.input`
  inline-size: 2.5rem;
  block-size: 2rem;
  padding: 0.125rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--haber-card-edge);
  border-radius: 0.25rem;
  cursor: pointer;
`;

// A plain text-ish button for secondary card actions (add, clear, replay).
export const NotionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--haber-card-edge);
  border-radius: 999rem;
  cursor: pointer;
  transition: border-color 150ms ease;

  &:hover:not(:disabled) {
    border-color: var(--haber-thread);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Visually hidden but still announced — for radio inputs whose label is the whole visual card.
export const VisuallyHiddenInput = styled.input`
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

// Inline status pill — pass/fail verdicts and support badges share it.
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.0625rem 0.4375rem;
  font-family: ${MONO_FONT};
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 999rem;
  color: var(--color-fg-muted);
  background: color-mix(in srgb, var(--color-fg-muted) 12%, transparent);

  &[data-tone="pass"] {
    color: var(--haber-pass);
    background: color-mix(in srgb, var(--haber-pass) 14%, transparent);
  }

  &[data-tone="fail"] {
    color: var(--haber-fail);
    background: color-mix(in srgb, var(--haber-fail) 14%, transparent);
  }

  &[data-tone="warn"] {
    color: var(--color-fg-attention);
    background: color-mix(in srgb, var(--color-fg-attention) 16%, transparent);
  }
`;
