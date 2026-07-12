import { styled } from "@linaria/react";

// Sign-off block with text — adds fluid top spacing above the closing paragraph.
export const PageSignOffRoot = styled.div`
  margin-block-start: var(--fluid-space-xl);

  p {
    line-height: var(--line-height-relaxed);
  }
`;

/*
  Centered SVG divider, fixed at 100px wide. margin-inline: auto centers it in a plain block-flow
  parent (e.g. PageSignOffRoot); align-self: center centers it when the parent is a flex container
  (e.g. PageWrapper, display:flex + default align-items:stretch) — without it, a stretch parent
  would stretch this to its own full width instead of respecting the fixed inline-size.
*/
export const DividerRoot = styled.div`
  inline-size: 100px;
  margin-inline: auto;
  align-self: center;

  svg {
    display: block;
    inline-size: 100%;
    block-size: auto;
  }
`;
