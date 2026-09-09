import { styled } from "@linaria/react";

// Positioned (not static) so the unsupported-browser fallback's absolutely-positioned popover has something to measure percentages against — the real anchor-positioning path doesn't need this (anchor() ties to the trigger, not this wrapper) but it's harmless either way.
export const PreviewStage = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-block-size: 16rem;
  padding: 1.5rem;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

// Callout shown only when `CSS.supports("anchor-name: --a")` is false — explains why the preview below it is an approximation, rather than letting an unsupported browser just render something that looks broken.
export const SupportNotice = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 0;
  padding: 0.625rem 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--color-fg-muted);
  background: var(--color-bg-neutral-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
`;

export const TriggerButton = styled.button`
  padding: 0.5rem 0.875rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-fg-on-emphasis);
  background: var(--color-bg-accent-emphasis);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
`;

// Base look for the popover element itself — anything placement/animation/backdrop-related is injected separately via the live <style> tag (see PreviewPane.tsx) since those need real selectors/pseudo-classes an inline style prop can't express.
export const PopoverSurface = styled.div`
  max-inline-size: 14rem;
  padding: 0.75rem 0.875rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 12%);

  h2 {
    margin: 0 0 0.25rem;
    font-size: 0.875rem;
  }

  p {
    margin: 0;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li button {
    inline-size: 100%;
    padding: 0.375rem 0.5rem;
    text-align: start;
    color: inherit;
    background: transparent;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;

    &:hover {
      background: var(--color-bg-neutral-muted);
    }
  }

  div {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-block-start: 0.625rem;
  }

  div button {
    padding: 0.375rem 0.625rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-fg-default);
    background: var(--color-bg-muted);
    border: 0.0625rem solid var(--color-border-default);
    border-radius: 0.25rem;
    cursor: pointer;
  }
`;
