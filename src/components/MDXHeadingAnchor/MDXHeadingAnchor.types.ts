
import { ComponentPropsWithoutRef } from "react";

// Union of valid HTML heading tag names this component can render as.
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// Extends the native heading element props with an `as` discriminator for the rendered tag.
export interface MDXHeadingAnchorProps extends ComponentPropsWithoutRef<HeadingTag> {
  as: HeadingTag;
}
