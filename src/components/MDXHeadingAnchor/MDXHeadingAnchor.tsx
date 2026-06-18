import { JSX, ComponentPropsWithoutRef } from "react";
import { slugify, extractText } from "@/utils/string";
import { HashIcon } from "@/components/Icon";
import { MDXHeadingAnchorProps } from "@/interfaces/mdx-heading";
import { AnchorLink, HeadingWrapper } from "@/components/MDXHeadingAnchor/MDXHeadingAnchor.styles";

// Renders any heading tag with an auto-generated id and a hover-reveal hash anchor for deep linking.
export default function MDXHeadingAnchor({ as: Tag, children, ...props }: MDXHeadingAnchorProps): JSX.Element {
  const slug = slugify(extractText(children));

  return (
    <>
      <Tag id={slug} {...props}>
        <HeadingWrapper>
          {children}
          <AnchorLink href={`#${slug}`} aria-label={`Link to ${extractText(children)}`}>
            <HashIcon size={16} />
          </AnchorLink>
        </HeadingWrapper>
      </Tag>
    </>
  );
}

MDXHeadingAnchor.displayName = "MDXHeadingAnchor";
