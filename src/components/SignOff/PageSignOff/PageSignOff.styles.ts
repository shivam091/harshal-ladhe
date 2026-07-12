import { styled } from "@linaria/react";

// Fluid top spacing separates the closing note from the post body at every viewport width.
export const PageSignOffRoot = styled.div`
  margin-block-start: clamp(2rem, 3vw, 3rem);

  p {
    line-height: 1.625;
  }
`;

/*
  Must center in both block and flex parents: margin-inline: auto covers block flow, and
  align-self: center stops a stretching flex parent from widening it past its fixed size.
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
