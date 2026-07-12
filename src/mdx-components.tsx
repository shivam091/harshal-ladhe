import type { MDXComponents } from "mdx/types";
import { PublishedAt, LastModifiedAt, ContentDates } from "@/components/ContentDates";
import MDXHeadingAnchor from "@/components/MDXHeadingAnchor";
import SocialLinks from "@/components/SocialLinks";
import PageSignOff from "@/components/SignOff/PageSignOff";
import PostSignOff from "@/components/SignOff/PostSignOff";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    PublishedAt,
    LastModifiedAt,
    ContentDates,
    SocialLinks,
    PageSignOff,
    PostSignOff,
    h1: (props) => <MDXHeadingAnchor as="h1" {...props} />,
    h2: (props) => <MDXHeadingAnchor as="h2" {...props} />,
    h3: (props) => <MDXHeadingAnchor as="h3" {...props} />,
    h4: (props) => <MDXHeadingAnchor as="h4" {...props} />,
  };
}
