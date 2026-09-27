import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import MDXImage from "@/components/MDXImage";
import { siteConfig } from "@/config/site";
import NewsletterCallout from "@/components/NewsletterCallout";
import ConsentSettingsButton from "@/components/ConsentSettingsButton";
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
import IconStretchyGuy from "@/icons/IconStretchyGuy";
import StepsEasingGraph from "@/components/StepsEasingGraph";
import StepsEasingRace from "@/components/StepsEasingRace";
import SvgSnippet from "@/components/SvgSnippet";
import InteractiveSvgPanel from "@/components/InteractiveSvgPanel";
import ViewboxViewportDiagram from "@/components/mdx/ViewboxViewportDiagram";
import AxisDiagram from "@/components/mdx/AxisDiagram";
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
import TransitionTimingDiagram from "@/components/mdx/TransitionTimingDiagram";
import GitMergeDiagram from "@/components/mdx/GitMergeDiagram";
import GitRebaseDiagram from "@/components/mdx/GitRebaseDiagram";
import GitCoreModelDiagram from "@/components/mdx/GitCoreModelDiagram";
import GitResetDiagram from "@/components/mdx/GitResetDiagram";
import GitBisectDiagram from "@/components/mdx/GitBisectDiagram";
import GitObjectGraphDiagram from "@/components/mdx/GitObjectGraphDiagram";
import GitWorkflowDiagram from "@/components/mdx/GitWorkflowDiagram";
import GradientAxisDiagram from "@/components/mdx/GradientAxisDiagram";
import RadialGradientDiagram from "@/components/mdx/RadialGradientDiagram";
import ConicGradientDiagram from "@/components/mdx/ConicGradientDiagram";
import RepeatingGradientDiagram from "@/components/mdx/RepeatingGradientDiagram";
import GradientLayeringDiagram from "@/components/mdx/GradientLayeringDiagram";
import ObserverPatternDiagram from "@/components/mdx/ObserverPatternDiagram";
import ResizeBoxModelDiagram from "@/components/mdx/ResizeBoxModelDiagram";
import IntersectionGeometryDiagram from "@/components/mdx/IntersectionGeometryDiagram";
import EventLoopDiagram from "@/components/mdx/EventLoopDiagram";
import MicrotaskMacrotaskTimelineDiagram from "@/components/mdx/MicrotaskMacrotaskTimelineDiagram";
import AnimationRangeDiagram from "@/components/mdx/AnimationRangeDiagram";
import KeyframeStopsDiagram from "@/components/mdx/KeyframeStopsDiagram";
import AnimationShorthandBuilder from "@/components/mdx/AnimationShorthandBuilder";
import BackgroundClipTextDiagram from "@/components/mdx/BackgroundClipTextDiagram";
import BoxDecorationBreakDiagram from "@/components/mdx/BoxDecorationBreakDiagram";
import GradientStrokeDiagram from "@/components/mdx/GradientStrokeDiagram";
import AnimatedStripDiagram from "@/components/mdx/AnimatedStripDiagram";
import FixedAttachmentDiagram from "@/components/mdx/FixedAttachmentDiagram";
import GlyphOverflowDiagram from "@/components/mdx/GlyphOverflowDiagram";

function MDXLink({ href = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) return <Link href={href} {...linkAnalytics(href)} {...props} />;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...linkAnalytics(href)} {...props} />;
}

const SITE_HOST = new URL(siteConfig.url).hostname;

// Worked out at render, so the shared click listener can send article_link_click without parsing URLs itself.
function linkAnalytics(href: string): Record<string, string> {
  let domain = SITE_HOST;
  let outbound = false;
  try {
    const url = new URL(href, siteConfig.url);
    domain = url.hostname || url.protocol.replace(/:$/, "");
    outbound = domain !== SITE_HOST;
  } catch {
    // An unparseable href is left attributed to this site rather than dropped from the stats.
  }

  return {
    "data-analytics-event": "article_link_click",
    "data-analytics-label": href,
    "data-analytics-link-url": href,
    "data-analytics-link-domain": domain,
    "data-analytics-outbound": String(outbound)
  };
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
    NewsletterSignup: NewsletterCallout,
    ConsentSettingsButton,
    Sandbox,
    LikeButtonDemo,
    RainbowDivider,
    IconStretchyGuy,
    StepsEasingGraph,
    StepsEasingRace,
    SvgSnippet,
    InteractiveSvgPanel,
    ViewboxViewportDiagram,
    AxisDiagram,
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
    TransitionTimingDiagram,
    GitMergeDiagram,
    GitRebaseDiagram,
    GitCoreModelDiagram,
    GitResetDiagram,
    GitBisectDiagram,
    GitObjectGraphDiagram,
    GitWorkflowDiagram,
    GradientAxisDiagram,
    RadialGradientDiagram,
    ConicGradientDiagram,
    RepeatingGradientDiagram,
    GradientLayeringDiagram,
    ObserverPatternDiagram,
    ResizeBoxModelDiagram,
    IntersectionGeometryDiagram,
    EventLoopDiagram,
    MicrotaskMacrotaskTimelineDiagram,
    AnimationRangeDiagram,
    KeyframeStopsDiagram,
    AnimationShorthandBuilder,
    BackgroundClipTextDiagram,
    BoxDecorationBreakDiagram,
    GradientStrokeDiagram,
    AnimatedStripDiagram,
    FixedAttachmentDiagram,
    GlyphOverflowDiagram,
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
