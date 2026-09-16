import { styled } from "@linaria/react";

// The lens rack itself — a vertical sequence of slots, positioned so the sprocket Rail below can be absolutely placed behind them at a fixed x-offset.
export const Rack = styled.ul`
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
`;

/*
  The film-strip spine connecting every slot in sequence — a dashed vertical rule standing in for
  sprocket perforations, running behind every LensToggle from the first slot to the last. One
  absolutely positioned element rather than a per-slot connector: it resolves its own height against
  Rack's content-derived height (a well-defined percentage-height case for absolutely positioned
  children — see this component's own render for why no JS measurement is needed), so it always
  spans exactly the rack's full length regardless of how many sliders are currently expanded.
*/
export const Rail = styled.div`
  position: absolute;
  inset-block: 0.9375rem;
  inset-inline-start: 1.125rem;
  inline-size: 0.125rem;
  transform: translateX(-50%);
  background: repeating-linear-gradient(
    to bottom,
    var(--color-border-default) 0,
    var(--color-border-default) 0.25rem,
    transparent 0.25rem,
    transparent 0.5rem
  );
  pointer-events: none;
`;

// One lens slot's row — sits above the Rail via z-index, with a hairline separating it from the next slot (the last slot's own hairline is dropped since nothing follows it).
export const Slot = styled.li`
  position: relative;
  z-index: 1;
  padding-block: 0.625rem;
  border-block-end: 0.0625rem solid var(--color-border-muted);

  &:last-child {
    border-block-end: none;
  }
`;

// Toggle + label row for one slot.
export const SlotRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

/*
  The slot's own lens element, rendered as a physical aperture: concentric rings (nested box-shadows
  standing in for glass/coating layers) around a small engraved index number. Disabled slots read as
  an inert, uncoated lens; enabling one tints the glass with an accent "coating" sheen and switches
  the engraved number to read against it — the rack's whole point is making "what's in the light path,
  and in what order" legible at a glance without opening any slot.
*/
export const LensToggle = styled.button`
  position: relative;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border-radius: 50%;
  border: 0.0625rem solid var(--color-border-default);
  background: var(--color-bg-muted);
  box-shadow:
    inset 0 0 0 0.1875rem var(--color-bg-default),
    inset 0 0 0 0.25rem var(--color-border-muted);
  color: var(--color-fg-muted);
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.6875rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease, background 150ms ease, color 150ms ease;

  &[data-enabled="true"] {
    color: var(--color-fg-on-emphasis);
    background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--color-fg-accent) 55%, white 25%), var(--color-fg-accent) 70%);
    box-shadow:
      inset 0 0 0 0.1875rem color-mix(in srgb, var(--color-fg-accent) 40%, var(--color-bg-default)),
      inset 0 0 0 0.25rem var(--color-fg-accent),
      0 0 0 0.1875rem color-mix(in srgb, var(--color-fg-accent) 25%, transparent);
  }

  /* The "click into place" latch — a quick squeeze on press, like an iris ring seating home. */
  &:active {
    transform: scale(0.88);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 150ms ease, background 150ms ease, color 150ms ease;

    &:active {
      transform: none;
    }
  }
`;

// The function's own name, sitting beside its lens — bold when enabled so an active slot reads slightly heavier in the rack than an idle one.
export const SlotLabel = styled.span`
  flex: 1 1 auto;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
`;

// Small monospace value readout shown beside the label once a slot is enabled — the rack's own "what's this lens currently set to" readout, visible even before expanding the slider.
export const SlotReadout = styled.span`
  flex: 0 0 auto;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-accent);
`;

/*
  The slider revealed once a slot is enabled — indented to sit clear of the rail/lens column above,
  and given a small drop-into-place entrance (a short fade + upward settle) each time it mounts,
  echoing the same "just clicked into the rack" read as the toggle's own press animation.
*/
export const SlotDetail = styled.div`
  margin-block-start: 0.5rem;
  padding-inline-start: 3rem;
  animation: filter-generator-slot-seat 180ms ease;

  @keyframes filter-generator-slot-seat {
    from {
      opacity: 0;
      transform: translateY(-0.25rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// Vertical stack of the drop-shadow slot's own offset/blur/opacity/color fields, sharing SlotDetail's indent.
export const DropShadowFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;
