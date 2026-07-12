import { styled } from "@linaria/react";

// Centered SVG divider — constrains the decorative ornament to 100 px wide.
export const DividerRoot = styled.div`
  max-inline-size: 100px;
  margin-inline: auto;

  svg {
    display: block;
    inline-size: 100%;
    block-size: auto;
  }
`;
