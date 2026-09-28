import { styled } from "@linaria/react";

import { Svg as CommonSvg, Wrapper } from "@/components/mdx/common.styles";

export { Wrapper };

// Responsive SVG canvas, capped at the diagram's natural width — wide enough for the dimension labels around the region.
export const Svg = styled(CommonSvg)`
  max-inline-size: 660px;
  font-family: 'Alan Sans', 'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
`;
