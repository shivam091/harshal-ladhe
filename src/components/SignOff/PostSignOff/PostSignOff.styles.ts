import { styled } from "@linaria/react";

// Post sign-off block — adds fluid top spacing above the closing paragraph text.
export const PostSignOffRoot = styled.div`
  margin-block-start: var(--fluid-space-xl);

  p {
    line-height: var(--line-height-relaxed);
  }
`;
