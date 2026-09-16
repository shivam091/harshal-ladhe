import { styled } from "@linaria/react";

// Two-way subject switch — same recessed-housing language as TargetControls' own rocker, reused here at a smaller scale since this one only ever has two positions and no per-side caption.
export const SubjectRow = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 0.1875rem;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  box-shadow: inset 0 0.0625rem 0.25rem color-mix(in srgb, var(--color-fg-default) 16%, transparent);
`;

// One subject option inside SubjectRow.
export const SubjectButton = styled.button`
  flex: 1;
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, transform 150ms ease;

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
    border-color: var(--color-bg-accent-emphasis);
    transform: translateY(0.0625rem);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: color 150ms ease, background 150ms ease;
  }
`;

/*
  The photo picker rendered as a strip of film frames rather than plain thumbnails — a shared
  sprocket-perforated edge (the repeating-radial-gradient strip above each frame) ties it back to
  FunctionList's own lens-rack rail without repeating that component's exact visual, since this is a
  row of interchangeable subjects rather than a sequence of composited effects.
*/
export const FilmStrip = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-block-start: 0.375rem;
`;

// One frame in the film strip — its own sprocket holes along the top edge via a repeating-radial-gradient, and a bold accent border once selected, like a frame circled on a contact sheet.
export const Frame = styled.button`
  position: relative;
  flex: 1;
  padding: 0.4375rem 0.25rem 0.25rem;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: border-color 150ms ease, transform 150ms ease;

  &::before {
    content: "";
    position: absolute;
    inset-block-start: 0.125rem;
    inset-inline: 0.25rem;
    block-size: 0.125rem;
    background-image: repeating-linear-gradient(
      to right,
      var(--color-border-default) 0,
      var(--color-border-default) 0.125rem,
      transparent 0.125rem,
      transparent 0.3125rem
    );
  }

  &[data-selected="true"] {
    border-color: var(--color-fg-accent);
    transform: translateY(-0.0625rem);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: border-color 150ms ease;

    &[data-selected="true"] {
      transform: none;
    }
  }
`;

// The frame's own transparency window beneath its sprocket-hole edge — a positioned square so next/image can fill it with `object-fit: cover` regardless of the source photo's own aspect ratio.
export const Thumb = styled.div`
  position: relative;
  margin-block-start: 0.1875rem;
  inline-size: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 0.125rem;
  overflow: hidden;
`;

/*
  The translucent panel's own tint control, styled as a photographer's colored lighting gel slotted
  in front of the light — panelColor/panelOpacity only matter once the switch is thrown to Backdrop
  (a plain "filter" target has no separate panel to gel), so this whole block is conditionally
  rendered rather than just disabled.
*/
export const GelRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  padding-block-start: 0.75rem;
  margin-block-start: 0.75rem;
  border-block-start: 0.0625rem dashed var(--color-border-muted);
`;

// Small caption introducing the gel controls, set apart from the plain FieldLabel styling used for its two fields.
export const GelCaption = styled.p`
  margin: 0 0 0.375rem;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
