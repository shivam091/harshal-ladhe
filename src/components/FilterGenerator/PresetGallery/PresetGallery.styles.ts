import { styled } from "@linaria/react";

// Grid of preset slide mounts.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

/*
  One preset rendered as a photo slide mount — a thick cardboard-style border framing a small
  transparency window, evoking a labeled slide pulled from a carousel tray rather than a plain
  swatch button. Distinct from FunctionList's circular lens tokens and PanelControls' film-strip
  frames, so all three "optics bench" thumbnails read as related but different physical objects.
*/
export const Mount = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.4375rem;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: border-color 150ms ease, transform 150ms ease;

  &:hover {
    border-color: var(--color-fg-accent);
    transform: translateY(-0.0625rem);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: border-color 150ms ease;

    &:hover {
      transform: none;
    }
  }
`;

// The slide's own transparency window — the preset's reference-gradient swatch rendered with the exact filter/backdrop-filter it would produce, a thumbnail that IS the output rather than a hand-drawn icon standing in for it.
export const Window = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border-radius: 0.125rem;
  overflow: hidden;
  background-image: linear-gradient(135deg, #f97316 0%, #ec4899 33%, #8b5cf6 66%, #06b6d4 100%);
  background-size: cover;
`;

// backdropFilter presets show their translucent panel sitting in the window; plain filter presets have no panel, so this is only ever rendered for the former.
export const WindowPanel = styled.div`
  inline-size: 65%;
  block-size: 55%;
  border-radius: 0.125rem;
`;

// The preset's name, printed along the bottom of the mount like a slide's own grease-pencil label.
export const MountLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  text-align: center;
`;
