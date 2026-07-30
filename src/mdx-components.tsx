import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import MDXImage from "@/components/MDXImage";
import { PublishedAt, LastModifiedAt, ContentDates } from "@/components/ContentDates";
import MDXHeadingAnchor from "@/components/MDXHeadingAnchor";
import CoreStack from "@/app/(site)/(internal)/how-did-i-build-my-blog/CoreStack";
import SocialLinks from "@/components/SocialLinks";
import PageSignOff from "@/components/SignOff/PageSignOff";
import CodeBlock from "@/components/CodeBlock";
import ContentMeta from "@/components/ContentMeta";
import PostMeta from "@/components/PostMeta";
import Details from "@/components/Details";
import { AsideInfo, AsideSuccess, AsideWarning, AsideQuote } from "@/components/Aside";
import Sandbox from "@/components/Sandbox";
import LikeButtonDemo from "@/components/LikeButtonDemo";
import RainbowDivider from "@/components/RainbowDivider";
import GridAnatomyDiagram from "@/components/mdx/GridAnatomyDiagram";
import GridAreasDiagram from "@/components/mdx/GridAreasDiagram";
import GridSpanDiagram from "@/components/mdx/GridSpanDiagram";
import GridContainerAlignmentDiagram from "@/components/mdx/GridContainerAlignmentDiagram";
import GridContentDistributionDiagram from "@/components/mdx/GridContentDistributionDiagram";
import GridItemAlignmentDiagram from "@/components/mdx/GridItemAlignmentDiagram";
import GridExplicitDiagram from "@/components/mdx/GridExplicitDiagram";
import GridImplicitDiagram from "@/components/mdx/GridImplicitDiagram";
import GridNamedLinesDiagram from "@/components/mdx/GridNamedLinesDiagram";
import GridSizingDiagram from "@/components/mdx/GridSizingDiagram";
import GridSubgridDiagram from "@/components/mdx/GridSubgridDiagram";
import GridVisualOrderDiagram from "@/components/mdx/GridVisualOrderDiagram";

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
    PageSignOff,
    CodeBlock,
    ContentMeta,
    PostMeta,
    Details,
    Info: AsideInfo,
    Success: AsideSuccess,
    Warning: AsideWarning,
    Quote: AsideQuote,
    a: MDXLink,
    Sandbox,
    LikeButtonDemo,
    RainbowDivider,
    GridAnatomyDiagram,
    GridAreasDiagram,
    GridSpanDiagram,
    GridContainerAlignmentDiagram,
    GridContentDistributionDiagram,
    GridItemAlignmentDiagram,
    GridExplicitDiagram,
    GridImplicitDiagram,
    GridNamedLinesDiagram,
    GridSizingDiagram,
    GridSubgridDiagram,
    GridVisualOrderDiagram,
    /*
      Demoted to h2 because page layouts already render their own <h1>; mapping h1
      straight through would duplicate it the moment an .mdx file starts with `# `.
    */
    h1: (props) => <MDXHeadingAnchor as="h2" {...props} />,
    h2: (props) => <MDXHeadingAnchor as="h2" {...props} />,
    h3: (props) => <MDXHeadingAnchor as="h3" {...props} />,
    h4: (props) => <MDXHeadingAnchor as="h4" {...props} />,
    img: MDXImage
  };
}
