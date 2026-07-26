import { styled } from "@linaria/react";

// Tight, even spacing so the dots read as one bar rather than separate markers.
export const DotsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.125rem;
`;

// Size, colour and fill are set inline because each dot's fill fraction differs; only the shape lives here.
export const Dot = styled.span`
  display: inline-block;
  border-radius: 50%;
  flex-shrink: 0;
`;
