import { styled } from "@linaria/react";

// Vertical stack of layer cards. No gap of its own — each LayerRow supplies its own downward stagger via margin-block-start, so the spacing itself grows the further a layer sits from the viewer, like a loosening deck of cards.
export const Deck = styled.ul`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
`;

/*
  One layer's card in the physical stack. `--depth` (0 = first/topmost layer, matching CSS's own
  box-shadow stacking rule — see ShadowLayer's own comment) drives three things at once purely in
  CSS: z-index (closer layers sit visually above further ones when they overlap while lifted),
  margin-block-start (each successive card sits a little further down, so the list reads as a
  cross-section of the stack rather than a flat menu), and the card's own resting shadow (tighter
  and darker near the top of the stack, larger and softer the deeper a layer sits — exactly how a
  real stack of cards on a table would fall under ambient light). Hovering or selecting a card lifts
  it toward the viewer with a deeper shadow, inviting the same "pick this one up" interaction a real
  stack would.
*/
export const LayerRow = styled.li`
  --depth: 0;
  position: relative;
  z-index: calc(20 - var(--depth));
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-block-start: calc(var(--depth) * 0.3125rem);
  padding: 0.375rem 0.5rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  box-shadow: 0 calc(0.0625rem + var(--depth) * 0.125rem) calc(0.1875rem + var(--depth) * 0.3125rem)
    color-mix(in srgb, var(--color-fg-default) calc(10% + var(--depth) * 2.5%), transparent);
  transform: translateY(calc(var(--depth) * 0.0625rem));
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;

  &:hover,
  &[data-selected="true"] {
    transform: translateY(-0.125rem);
    border-color: var(--color-fg-accent);
    box-shadow: 0 0.5rem 1rem color-mix(in srgb, var(--color-fg-default) 20%, transparent);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: border-color 180ms ease;

    &:hover,
    &[data-selected="true"] {
      transform: none;
    }
  }
`;

// The layer's own selectable summary chip — a color swatch, its offset/blur/spread readout, and an inset badge, so the deck alone tells you what's stacked without opening each card.
export const LayerButton = styled.button`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 0.5rem;
  min-inline-size: 0;
  padding: 0;
  text-align: start;
  background: transparent;
  border: none;
  cursor: pointer;
`;

// Round color chip previewing the layer's cast color, sunk slightly with its own tiny inset ring so it reads as a physical token rather than a flat color square.
export const LayerSwatch = styled.span`
  flex: 0 0 auto;
  inline-size: 1.375rem;
  block-size: 1.375rem;
  border-radius: 50%;
  border: 0.0625rem solid var(--color-border-muted);
  box-shadow: inset 0 0 0 0.125rem var(--color-bg-default), 0 0 0 0.0625rem var(--color-border-muted);
`;

// Monospace offset/blur/spread readout for the layer.
export const LayerSummary = styled.span`
  flex: 1 1 auto;
  min-inline-size: 0;
  overflow: hidden;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// Small tag marking an inset layer — inset shadows recede INTO the surface rather than casting off it, the opposite of every other card's own "resting above the table" language, so it's called out explicitly.
export const InsetBadge = styled.span`
  flex: 0 0 auto;
  padding: 0.0625rem 0.3125rem;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-fg-on-emphasis);
  background: var(--color-fg-muted);
  border-radius: 0.1875rem;
`;

// Row of small icon buttons for reordering/duplicating/removing a layer.
export const LayerActions = styled.div`
  display: flex;
  flex: 0 0 auto;
  gap: 0.125rem;
`;

// One icon button inside LayerActions — pressing it "lifts" the button briefly, echoing the same pick-it-up motion as hovering a whole card.
export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-default);
    border-color: var(--color-fg-accent);
    transform: translateY(-0.0625rem);
    box-shadow: var(--box-shadow-sm);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: color 150ms ease, border-color 150ms ease;

    &:hover:not(:disabled) {
      transform: none;
    }
  }
`;

// Dashed-border "add another card to the stack" button, sitting below the deck.
export const AddLayerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-block-start: 0.5rem;
  padding: 0.5rem 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: var(--color-bg-muted);
  border: 0.0625rem dashed var(--color-border-default);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease, background 150ms ease;

  &:hover {
    color: var(--color-fg-default);
    border-color: var(--color-fg-accent);
    background: var(--color-bg-default);
  }
`;

// Shown in place of the deck when every layer has been removed — `box-shadow: none` is valid CSS, so this is a real (if unusual) state rather than an error.
export const EmptyState = styled.p`
  margin: 0;
  padding: 0.75rem;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
  background: var(--color-bg-muted);
  border: 0.0625rem dashed var(--color-border-muted);
  border-radius: 0.5rem;
`;
