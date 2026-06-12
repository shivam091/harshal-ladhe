
import { ComponentPropsWithoutRef } from "react";

// Limited to real heading tags so `as` can't render a non-heading element.
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// Accepts native heading props so MDX can pass its attributes straight through.
export interface MDXHeadingAnchorProps extends ComponentPropsWithoutRef<HeadingTag> {
  as: HeadingTag;
}
