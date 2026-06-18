import { ComponentPropsWithoutRef } from "react";
import type { HeadingTag } from "@/types/mdx-heading";

// Extends the native heading element props with an `as` discriminator for the rendered tag.
export interface MDXHeadingAnchorProps extends ComponentPropsWithoutRef<HeadingTag> {
  as: HeadingTag;
}
