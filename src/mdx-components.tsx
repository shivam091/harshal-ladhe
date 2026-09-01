import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { PublishedAt, LastModifiedAt, ContentDates } from "@/components/ContentDates";
import MDXHeadingAnchor from "@/components/MDXHeadingAnchor";
import CoreStack from "@/app/(site)/(internal)/how-did-i-build-my-blog/CoreStack";
import SocialLinks from "@/components/SocialLinks";
import PageSignOff from "@/components/SignOff/PageSignOff";
import CodeBlock from "@/components/CodeBlock";
import SnippetMeta from "@/components/SnippetMeta";
import PostMeta from "@/components/PostMeta";
import Details from "@/components/Details";
import { AsideInfo, AsideSuccess, AsideWarning, AsideQuote } from "@/components/Aside";
import Sandbox from "@/components/Sandbox";
import LikeButtonDemo from "@/components/LikeButtonDemo";
import RainbowDivider from "@/components/RainbowDivider";
import IconStretchyGuy from "@/icons/IconStretchyGuy";
import SvgSnippet from "@/components/SvgSnippet";
import InteractiveSvgPanel from "@/components/InteractiveSvgPanel";
import ViewboxViewportDiagram from "@/components/mdx/ViewboxViewportDiagram";
import AxisDiagram from "@/components/mdx/AxisDiagram";
import GridAnatomyDiagram from "@/components/mdx/GridAnatomyDiagram";
import GridAreasDiagram from "@/components/mdx/GridAreasDiagram";
import GridSpanDiagram from "@/components/mdx/GridSpanDiagram";
import GridContainerAlignmentDiagram from "@/components/mdx/GridContainerAlignmentDiagram";
import GridItemAlignmentDiagram from "@/components/mdx/GridItemAlignmentDiagram";
import GridExplicitDiagram from "@/components/mdx/GridExplicitDiagram";
import GridImplicitDiagram from "@/components/mdx/GridImplicitDiagram";
import GridNamedLinesDiagram from "@/components/mdx/GridNamedLinesDiagram";
import GridSizingDiagram from "@/components/mdx/GridSizingDiagram";
import GridSubgridDiagram from "@/components/mdx/GridSubgridDiagram";
import GridVisualOrderDiagram from "@/components/mdx/GridVisualOrderDiagram";
import TransitionTimingDiagram from "@/components/mdx/TransitionTimingDiagram";
import GitMergeDiagram from "@/components/mdx/GitMergeDiagram";
import GitCoreModelDiagram from "@/components/mdx/GitCoreModelDiagram";
import GitResetDiagram from "@/components/mdx/GitResetDiagram";

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
    SnippetMeta,
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
    IconStretchyGuy,
    SvgSnippet,
    InteractiveSvgPanel,
    ViewboxViewportDiagram,
    AxisDiagram,
    GridAnatomyDiagram,
    GridAreasDiagram,
    GridSpanDiagram,
    GridContainerAlignmentDiagram,
    GridItemAlignmentDiagram,
    GridExplicitDiagram,
    GridImplicitDiagram,
    GridNamedLinesDiagram,
    GridSizingDiagram,
    GridSubgridDiagram,
    GridVisualOrderDiagram,
    TransitionTimingDiagram,
    GitMergeDiagram,
    GitCoreModelDiagram,
    GitResetDiagram,
    /*
      Demoted to h2, not h1: every post/snippet/series/tag/category layout already
      renders its own page <h1> via PageHeading. No current .mdx content starts with
      `# `, but mapping h1 straight through would produce a duplicate page <h1> the
      moment one did.
    */
    h1: (props) => <MDXHeadingAnchor as="h2" {...props} />,
    h2: (props) => <MDXHeadingAnchor as="h2" {...props} />,
    h3: (props) => <MDXHeadingAnchor as="h3" {...props} />,
    h4: (props) => <MDXHeadingAnchor as="h4" {...props} />
  };
}
