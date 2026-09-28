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
import FilterPipelineDiagram from "@/components/mdx/FilterPipelineDiagram";
import ClipUnitsDiagram from "@/components/mdx/ClipUnitsDiagram";
import ClipVsMaskDiagram from "@/components/mdx/ClipVsMaskDiagram";
import ColorMatrixDiagram from "@/components/mdx/ColorMatrixDiagram";
import DisplacementMapDiagram from "@/components/mdx/DisplacementMapDiagram";
import FeCompositeOperatorsDiagram from "@/components/mdx/FeCompositeOperatorsDiagram";
import FillRuleRayDiagram from "@/components/mdx/FillRuleRayDiagram";
import FilterRegionDiagram from "@/components/mdx/FilterRegionDiagram";
import GradientTransformDiagram from "@/components/mdx/GradientTransformDiagram";
import GradientUnitsDiagram from "@/components/mdx/GradientUnitsDiagram";
import GroupTransformDiagram from "@/components/mdx/GroupTransformDiagram";
import LightingDiagram from "@/components/mdx/LightingDiagram";
import LuminanceAlphaDiagram from "@/components/mdx/LuminanceAlphaDiagram";
import MarkerAnatomyDiagram from "@/components/mdx/MarkerAnatomyDiagram";
import MarkerOrientDiagram from "@/components/mdx/MarkerOrientDiagram";
import MarkerVertexDiagram from "@/components/mdx/MarkerVertexDiagram";
import MaskRegionDiagram from "@/components/mdx/MaskRegionDiagram";
import MiterLimitDiagram from "@/components/mdx/MiterLimitDiagram";
import PatternTileGridDiagram from "@/components/mdx/PatternTileGridDiagram";
import PatternTransformDiagram from "@/components/mdx/PatternTransformDiagram";
import PatternUnitsDiagram from "@/components/mdx/PatternUnitsDiagram";
import PolyClosingDiagram from "@/components/mdx/PolyClosingDiagram";
import RadialFocalDiagram from "@/components/mdx/RadialFocalDiagram";
import SeamlessTileDiagram from "@/components/mdx/SeamlessTileDiagram";
import SpreadMethodDiagram from "@/components/mdx/SpreadMethodDiagram";
import SvgGradientVectorDiagram from "@/components/mdx/SvgGradientVectorDiagram";
import SymbolViewBoxDiagram from "@/components/mdx/SymbolViewBoxDiagram";
import TextAnchorDiagram from "@/components/mdx/TextAnchorDiagram";
import TextBaselineDiagram from "@/components/mdx/TextBaselineDiagram";
import TextPathAnatomyDiagram from "@/components/mdx/TextPathAnatomyDiagram";
import UseShadowTreeDiagram from "@/components/mdx/UseShadowTreeDiagram";

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
    FilterPipelineDiagram,
    ClipUnitsDiagram,
    ClipVsMaskDiagram,
    ColorMatrixDiagram,
    DisplacementMapDiagram,
    FeCompositeOperatorsDiagram,
    FillRuleRayDiagram,
    FilterRegionDiagram,
    GradientTransformDiagram,
    GradientUnitsDiagram,
    GroupTransformDiagram,
    LightingDiagram,
    LuminanceAlphaDiagram,
    MarkerAnatomyDiagram,
    MarkerOrientDiagram,
    MarkerVertexDiagram,
    MaskRegionDiagram,
    MiterLimitDiagram,
    PatternTileGridDiagram,
    PatternTransformDiagram,
    PatternUnitsDiagram,
    PolyClosingDiagram,
    RadialFocalDiagram,
    SeamlessTileDiagram,
    SpreadMethodDiagram,
    SvgGradientVectorDiagram,
    SymbolViewBoxDiagram,
    TextAnchorDiagram,
    TextBaselineDiagram,
    TextPathAnatomyDiagram,
    UseShadowTreeDiagram,
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
