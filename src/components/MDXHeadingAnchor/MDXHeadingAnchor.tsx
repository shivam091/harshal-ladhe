import type { JSX} from "react";
import { slugify, extractText } from "@/utils/string";
import { HashIcon } from "@/components/Icon";
import { AnchorLink, HeadingWrapper } from "@/components/MDXHeadingAnchor/MDXHeadingAnchor.styles";
import type { MDXHeadingAnchorProps } from "@/components/MDXHeadingAnchor/MDXHeadingAnchor.types";

// Gives every MDX heading a stable, shareable deep link without authors adding ids by hand.
export default function MDXHeadingAnchor({ as: Tag, children, ...props }: MDXHeadingAnchorProps): JSX.Element {
  const text = extractText(children);
  const slug = slugify(text);

  return (
    <>
      <Tag id={slug} {...props}>
        <HeadingWrapper>
          {children}
          <AnchorLink href={`#${slug}`} aria-label={`Link to ${text}`}>
            <HashIcon size={16} />
          </AnchorLink>
        </HeadingWrapper>
      </Tag>
    </>
  );
}

MDXHeadingAnchor.displayName = "MDXHeadingAnchor";
