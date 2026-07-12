import { css } from "@linaria/core";

// Clip-based technique: element stays in the accessibility tree but takes no visual space.
export const srOnly = css`
  inline-size: 1px !important;
  block-size: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: none !important;

  &:not(caption) {
    position: absolute !important;
  }

  * {
    overflow: hidden !important;
  }
`;
