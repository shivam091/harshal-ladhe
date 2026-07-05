"use client";

import type { JSX, ReactElement} from "react";
import { useState, useId, isValidElement, Children } from "react";
import { Icon } from "@/components/Icon";
import { useBoop } from "@/hooks/use-boop";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import { useTitleId } from "@/hooks/use-title-id";
import { SPRINGS } from "@/constants/springs";
import type { AsideBaseProps } from "@/interfaces/aside";
import { CircularEdge } from "@/components/Aside/CircularEdge";
import { TriangularEdge } from "@/components/Aside/TriangularEdge";
import {
  IconWrapper,
  Title,
  Content,
  LeftEdgeDesktop,
  LeftEdgeFiller
} from "@/components/Aside/Aside.styles";
import {
  DropIn,
  ShowMore,
  ShowMoreChevron
} from "@/components/Aside/AsideShowMore.styles";

/*
  Shared aside base: accent-edged aside with optional corner icon, deep-linkable
  title, and optional "Show more" progressive disclosure. Not used directly in MDX —
  the AsideInfo/Success/Warning/Quote variants configure and re-export it.
*/
export default function Aside({
  wrapper: Wrapper,
  icon,
  leftEdgeVariant,
  title,
  children
}: AsideBaseProps): JSX.Element {
  const titleId = useTitleId(title);
  const expandedContentId = useId();

  // Boop animation for the "Show more" chevron — nudges it 4px down on hover.
  const [isChevronBooped, triggerChevronBoop] = useBoop();
  const chevronStyle = useTransformBoop(isChevronBooped, { transformY: 4 });

  // Flattened children so the <expanded> section can be located and split out below.
  const childArray = Children.toArray(children);

  // Wrap content in a raw <expanded> tag (left unmapped in mdx-components.tsx, so
  // MDX renders it as a plain string-typed host element) to hide it behind a
  // "Show more" toggle. A component reference wouldn't survive identity checks
  // once MDX (a Server Component) hands it across the client boundary to Aside.
  const expandedElem = childArray.find((child) => {
    return isValidElement(child) && child.type === "expanded";
  }) as ReactElement<{ children: React.ReactNode }> | undefined;

  // Starts expanded when there's no <expanded> section (nothing to disclose).
  const [isExpanded, setIsExpanded] = useState(!expandedElem);

  // Spring-driven slide-in for the expanded content, reusing useTransformBoop instead of
  // a CSS keyframe — sits at transformY(-20) while collapsed and springs to 0 on expand.
  const dropInStyle = useTransformBoop(!isExpanded, {
    transformY: -20,
    springConfig: SPRINGS.default
  });

  // Everything outside <expanded> — always visible, subject to data-hide-on-expand below.
  const previewChildren = childArray.filter((child) => {
    // Sometimes we want to *omit* a preview child once expanded — e.g. a
    // "click below to expand" hint that's redundant once the content is open.
    if (
      isExpanded &&
      isValidElement(child) &&
      (child.props as Record<string, unknown>)?.["data-hide-on-expand"]
    ) {
      return false;
    }

    return child !== expandedElem;
  });

  // The disclosed content itself — rendered inside <DropIn> once "Show more" is clicked.
  const expandedChildren = expandedElem?.props.children;

  return (
    <>
      <Wrapper>
        <LeftEdgeDesktop>
          {leftEdgeVariant === "circular" ? <CircularEdge /> : <TriangularEdge />}
          <LeftEdgeFiller />
        </LeftEdgeDesktop>

        {icon && <IconWrapper>{icon}</IconWrapper>}
        {title && <Title id={titleId}>{title}</Title>}

        <Content>
          {previewChildren}
          {expandedElem && (
            <>
              {/*
                Rendered whether or not it's expanded — hidden via the `hidden`/`inert`
                attributes rather than left unmounted — so ShowMore's aria-controls
                always resolves to a real element instead of a dangling id.
              */}
              {!isExpanded && (
                <ShowMore
                  onClick={() => setIsExpanded(true)}
                  onPointerEnter={triggerChevronBoop}
                  aria-expanded={isExpanded}
                  aria-controls={expandedContentId}
                >
                  Show more{" "}
                  <ShowMoreChevron style={chevronStyle}>
                    <Icon name="chevronDown" size={20} />
                  </ShowMoreChevron>
                </ShowMore>
              )}

              <DropIn
                id={expandedContentId}
                hidden={!isExpanded}
                inert={!isExpanded}
                style={dropInStyle}
              >
                {expandedChildren}
              </DropIn>
            </>
          )}
        </Content>
      </Wrapper>
    </>
  );
}

Aside.displayName = "Aside";
