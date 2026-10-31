import { styled } from "@linaria/react";

import { Svg as CommonSvg, Wrapper } from "@/components/mdx/common.styles";

export { Wrapper };

// Capped at the diagram's natural width so its small labels never scale up past their design size in a wide column.
export const Svg = styled(CommonSvg)`
  max-inline-size: 560px;
  font-family: 'Alan Sans', 'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
`;
