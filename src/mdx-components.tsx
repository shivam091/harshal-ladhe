import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { PublishedAt, LastModifiedAt, ContentDates } from "@/components/ContentDates";
import MDXHeadingAnchor from "@/components/MDXHeadingAnchor";
import CoreStack from "@/app/(site)/(internal)/how-did-i-build-my-blog/CoreStack";
import SocialLinks from "@/components/SocialLinks";
import PostSignOff from "@/components/SignOff/PostSignOff";
import CodeBlock from "@/components/CodeBlock";
import SnippetMeta from "@/components/SnippetMeta";
import Details from "@/components/Details";
import { AsideInfo, AsideSuccess, AsideWarning, AsideQuote } from "@/components/Aside";

function MDXLink({ href = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) return <Link href={href} {...props} />;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    PublishedAt,
    LastModifiedAt,
    ContentDates,
    CoreStack,
    SocialLinks,
    PostSignOff,
    CodeBlock,
    SnippetMeta,
    Details,
    Info: AsideInfo,
    Success: AsideSuccess,
    Warning: AsideWarning,
    Quote: AsideQuote,
    a: MDXLink,
    h1: (props) => <MDXHeadingAnchor as="h1" {...props} />,
    h2: (props) => <MDXHeadingAnchor as="h2" {...props} />,
    h3: (props) => <MDXHeadingAnchor as="h3" {...props} />,
    h4: (props) => <MDXHeadingAnchor as="h4" {...props} />,
  };
}
