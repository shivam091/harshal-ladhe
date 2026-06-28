// Linking is opt-in because tag pages only list posts, so other content types shouldn't link there.
export interface TagsProps {
  tags: string[];
  // Off by default so tags stay plain text where the tag page wouldn't show this content.
  link?: boolean;
}
