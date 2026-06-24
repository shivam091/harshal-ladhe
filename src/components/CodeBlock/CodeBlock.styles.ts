import { styled } from "@linaria/react";

/*
  Outermost block: clips overflow at border-radius while keeping the copy button sticky via `isolation + overflow: clip`.
  z-index is explicit (rather than left at auto) so other floating widgets — e.g. LikeButton's like
  count — can be deliberately layered below it via a lower z-index of their own.
*/
export const CodeBlockWrapper = styled.div`
  position: relative;
  isolation: isolate;
  z-index: 2;
  border-radius: 0.5rem;
  /*
    clip instead of hidden: visually clips at border-radius but does NOT
    create a scroll container, so position:sticky on the copy button works.
  */
  overflow: clip;
  background: var(--color-bg-muted);
  border: 1px solid var(--color-border-muted);
  margin-block: var(--fluid-space-md);

  &:hover .copy-btn,
  &:focus-within .copy-btn {
    opacity: var(--opacity-full);
    transition-delay: 0ms;
  }
`;

// Scrollable code area: negative block-start margin absorbs the sticky button's space so code starts flush at the top.
export const Pre = styled.div`
  /*
    Absorb the vertical space the sticky button occupies (36px height + 8px top + 8px bottom margin)
    so the code content starts flush at the top of the block.
  */
  margin-block-start: -52px;
  overflow-inline: auto;
  scrollbar-width: thin;

  // No button occupying flow space above, so there's nothing to compensate for.
  &[data-has-copy-button="false"] {
    margin-block-start: 0;
  }

  pre.shiki {
    margin: 0;
    border-radius: 0;
    border: none;
    background: transparent !important;
    tab-size: 2;
  }

  code {
    font-family: var(--font-stack-monospace);
    font-feature-settings: "kern" 0, "liga" 0;
  }
`;
