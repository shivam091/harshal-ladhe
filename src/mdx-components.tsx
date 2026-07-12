import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { PublishedAt, LastModifiedAt, ContentDates } from "@/components/ContentDates";
import MDXHeadingAnchor from "@/components/MDXHeadingAnchor";
import SocialLinks from "@/components/SocialLinks";
import PageSignOff from "@/components/SignOff/PageSignOff";
import RainbowDivider from "@/components/RainbowDivider";

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
    SocialLinks,
    PageSignOff,
    a: MDXLink,
    RainbowDivider,
    /*
      Demoted to h2 because page layouts already render their own <h1>; mapping h1
      straight through would duplicate it the moment an .mdx file starts with `# `.
    */
    h1: (props) => <MDXHeadingAnchor as="h2" {...props} />,
    h2: (props) => <MDXHeadingAnchor as="h2" {...props} />,
    h3: (props) => <MDXHeadingAnchor as="h3" {...props} />,
    h4: (props) => <MDXHeadingAnchor as="h4" {...props} />
  };
}
