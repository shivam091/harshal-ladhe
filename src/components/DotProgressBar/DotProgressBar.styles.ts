import { styled } from "@linaria/react";

// Flex row hosting the individual progress dots, evenly spaced.
export const DotsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xxxs);
`;

/*
  A single progress dot. Size/color/fill are set inline per-dot by DotProgressBar since each
  dot's fill fraction differs; only the shape lives here.
*/
export const Dot = styled.span`
  display: inline-block;
  border-radius: 50%;
  flex-shrink: 0;
`;
