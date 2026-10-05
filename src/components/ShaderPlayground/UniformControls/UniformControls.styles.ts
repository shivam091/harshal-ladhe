import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/ShaderPlayground/ShaderPlayground.styles";

// Two columns of generated controls when there's room, one on phones — most shaders declare a handful, so a single column would waste the card's width.
export const ControlGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: 0.75rem 1rem;
`;

// A colour uniform's row — the picker beside its name and live hex, since a bare swatch says nothing about which uniform it drives.
export const ColorField = styled.label`
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr);
  align-items: center;
  gap: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
`;

// The native colour input, squared off to sit like a lit button cap on the deck.
export const ColorSwatch = styled.input`
  grid-row: span 2;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  padding: 0.125rem;
  background: transparent;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  cursor: pointer;

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;

// The hex readout under a colour uniform's name — monospace so it can be read back into GLSL by eye.
export const ColorHex = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  color: var(--color-fg-default);
`;

// The uniform's GLSL name, kept in monospace so it matches what's written in the editor.
export const UniformName = styled.span`
  font-family: ${MONO_FONT};
`;

// The annotation syntax shown in the empty state, so the card teaches its own feature rather than just sitting blank.
export const AnnotationExample = styled.pre`
  margin: 0;
  padding: 0.5rem 0.625rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  line-height: 1.6;
  white-space: pre-wrap;
  color: var(--color-fg-default);
  background: color-mix(in srgb, black 25%, var(--color-bg-default));
  border-radius: 0.25rem;
`;

// Small text-only button for clearing every control back to its annotated default.
export const ResetLink = styled.button`
  align-self: flex-start;
  padding: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-accent);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 0.1875rem;

  &:disabled {
    color: var(--color-fg-muted);
    text-decoration: none;
    cursor: default;
  }
`;
