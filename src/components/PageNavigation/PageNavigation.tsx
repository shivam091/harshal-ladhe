import type { JSX } from "react";
import Link from "next/link";
import type { PageNavigationProps } from "@/components/PageNavigation/PageNavigation.types";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import {
  Navigation,
  NavigationLink,
  Label,
  Title
} from "@/components/PageNavigation/PageNavigation.styles";

// A missing neighbour becomes a disabled placeholder so the layout stays balanced at either end.
export default function PageNavigation({
  previous,
  next,
  ariaLabel,
  previousLabel = "Older",
  nextLabel = "Newer"
}: PageNavigationProps): JSX.Element | null {
  if (!previous && !next) return null;

  return (
    <>
      <Navigation aria-label={ariaLabel}>
        {previous ? (
          <NavigationLink as={Link} href={previous.href} rel="prev">
            <Label>{previousLabel}</Label>
            <Title dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(previous.title) }} />
          </NavigationLink>
        ) : (
          <NavigationLink as="div" data-disabled="true" role="link" aria-disabled="true" tabIndex={-1}>
            <Label>{previousLabel}</Label>
            <Title>—</Title>
          </NavigationLink>
        )}

        {next ? (
          <NavigationLink as={Link} href={next.href} rel="next">
            <Label>{nextLabel}</Label>
            <Title dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(next.title) }} />
          </NavigationLink>
        ) : (
          <NavigationLink as="div" data-disabled="true" role="link" aria-disabled="true" tabIndex={-1}>
            <Label>{nextLabel}</Label>
            <Title>—</Title>
          </NavigationLink>
        )}
      </Navigation>
    </>
  );
}

PageNavigation.displayName = "PageNavigation";
