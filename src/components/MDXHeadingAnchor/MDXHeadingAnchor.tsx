import type { JSX} from "react";
import { ComponentPropsWithoutRef } from "react";
import { slugify, extractText } from "@/utils/string";
import { HashIcon } from "@/components/Icon";
import type { MDXHeadingAnchorProps } from "@/interfaces/mdx-heading";
import { AnchorLink, HeadingWrapper } from "@/components/MDXHeadingAnchor/MDXHeadingAnchor.styles";

// Renders any heading tag with an auto-generated id and a hover-reveal hash anchor for deep linking.
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
