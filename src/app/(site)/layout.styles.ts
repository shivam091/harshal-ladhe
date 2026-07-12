import { styled } from "@linaria/react";

export const Container = styled.div`
  inline-size: 100%;
  margin-inline: auto;
  max-inline-size: clamp(var(--min-width), 90%, var(--max-width)) !important;
`;

export const PageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-block-size: 100dvh;
`;
