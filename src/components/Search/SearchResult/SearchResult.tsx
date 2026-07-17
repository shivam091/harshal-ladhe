import type { JSX, ReactNode } from "react";
import { Fragment } from "react";
import type { SearchContentType } from "@/hooks/use-search-index";
import type { SearchResultProps } from "@/components/Search/SearchResult/SearchResult.types";
import Badge from "@/components/Badge";
import { PageMetaItemBadges } from "@/components/PageMeta/PageMeta.styles";
import {
  Wrapper,
  Category,
  ResultLink,
  Title,
  Excerpt
} from "@/components/Search/SearchResult/SearchResult.styles";

// Wraps the character ranges Fuse matched within `text` in <mark>, leaving the rest as plain text.
function highlightMatches(text: string, ranges: [number, number][]): ReactNode {
  if (ranges.length === 0) return text;

  // Alternating plain-text and <mark> chunks, built up in source order.
  const segments: ReactNode[] = [];
  // Tracks how much of `text` has been consumed so far, so the next plain-text chunk can pick up where the last match left off.
  let cursor = 0;

  ranges.forEach(([start, end], index) => {
    if (start > cursor) segments.push(<Fragment key={`text-${index}`}>{text.slice(cursor, start)}</Fragment>);
    segments.push(<mark key={`mark-${index}`}>{text.slice(start, end + 1)}</mark>);
    cursor = end + 1;
  });

  if (cursor < text.length) segments.push(<Fragment key="text-end">{text.slice(cursor)}</Fragment>);

  return segments;
}

// Posts render with no prefix; every other content type is flagged in the title since it'd otherwise look just like a post.
const TITLE_PREFIXES: Record<SearchContentType, string> = {
  post: "",
  snippet: "Snippet: ",
  series: "Series: "
};

// One search result row — category label, highlighted title, and a trimmed excerpt.
export default function SearchResult({ hit, isPending, handleDismiss }: SearchResultProps): JSX.Element {
  const { item, titleMatches, excerptMatches, matchedTags, isExactMatch } = hit;
  // "Snippet: " / "Series: " label prepended to the title, empty for posts.
  const prefix = TITLE_PREFIXES[item.contentType];

  return (
    <>
      <Wrapper data-highlighted={String(isExactMatch)} style={{ opacity: isPending ? 0.5 : 1 }}>
        <ResultLink
          href={item.pathname}
          onClick={(event) => {
            // Command/Ctrl-click opens the result in a new tab — the dialog should stay open, not dismiss.
            if (event.metaKey || event.ctrlKey) return;
            handleDismiss();
          }}
        >
          {item.category && <Category>{item.category}</Category>}
          <Title>
            {prefix}
            {highlightMatches(item.title, titleMatches)}
          </Title>
          <Excerpt>{highlightMatches(item.excerpt, excerptMatches)}</Excerpt>
          {matchedTags.length > 0 && (
            <PageMetaItemBadges role="list" aria-label="Matched tags">
              {matchedTags.map((tag) => (
                <Badge key={tag} role="listitem">
                  {tag}
                </Badge>
              ))}
            </PageMetaItemBadges>
          )}
        </ResultLink>
      </Wrapper>
    </>
  );
}

SearchResult.displayName = "SearchResult";
