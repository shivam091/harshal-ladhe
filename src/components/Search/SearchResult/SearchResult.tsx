import type { JSX } from "react";
import { useRef } from "react";
import type { SearchContentType } from "@/hooks/use-search-index";
import {
  useSearchHighlights,
  SEARCH_HIT_HIGHLIGHT,
  SEARCH_BODY_HIT_HIGHLIGHT
} from "@/hooks/use-search-highlights";
import type { SearchResultProps } from "@/components/Search/SearchResult/SearchResult.types";
import Badge from "@/components/Badge";
import VisuallyHidden from "@/components/VisuallyHidden";
import { BookIcon, CodeBlockIcon, BulbIcon, ListIcon } from "@/components/Icon";
import { PageMetaItemBadges } from "@/components/PageMeta/PageMeta.styles";
import {
  Wrapper,
  Category,
  ResultLink,
  Title,
  Excerpt,
  BodySnippet
} from "@/components/Search/SearchResult/SearchResult.styles";

// Icon + accessible label flagging the result's content type, shown before the title.
const TITLE_ICONS: Record<SearchContentType, { Icon: typeof ListIcon; label: string }> = {
  post: { Icon: ListIcon, label: "Post" },
  snippet: { Icon: CodeBlockIcon, label: "Snippet" },
  tutorial: { Icon: BulbIcon, label: "Tutorial" },
  series: { Icon: BookIcon, label: "Series" }
};

// One search result row — category label, highlighted title, and a trimmed excerpt.
export default function SearchResult({ hit, isPending, handleDismiss, searchTerm, position }: SearchResultProps): JSX.Element {
  const { item, titleMatches, excerptMatches, matchedTags, isExactMatch, bodySnippet } = hit;
  const { Icon: TitleIcon, label } = TITLE_ICONS[item.contentType];

  const titleRef = useRef<HTMLSpanElement>(null);
  const excerptRef = useRef<HTMLParagraphElement>(null);
  const snippetRef = useRef<HTMLParagraphElement>(null);

  /*
    Fuzzy matches stay unpainted, as before: only near-exact hits highlight title and excerpt,
    while body-snippet words always do.
  */
  const hitName = isExactMatch ? SEARCH_HIT_HIGHLIGHT : null;
  useSearchHighlights(
    [
      ...(hitName
        ? [
            { ref: titleRef, ranges: titleMatches, highlightName: hitName },
            { ref: excerptRef, ranges: excerptMatches, highlightName: hitName }
          ]
        : []),
      ...(bodySnippet
        ? [{ ref: snippetRef, ranges: bodySnippet.matches, highlightName: SEARCH_BODY_HIT_HIGHLIGHT }]
        : [])
    ],
    hit
  );

  return (
    <>
      <Wrapper data-highlighted={String(isExactMatch)} style={{ opacity: isPending ? 0.5 : 1 }}>
        <ResultLink
          href={item.pathname}
          data-analytics-event="search_result_click"
          data-analytics-label={item.pathname}
          data-analytics-search-term={searchTerm}
          data-analytics-result-position={position}
          onClick={(event) => {
            // Command/Ctrl-click opens the result in a new tab — the dialog should stay open, not dismiss.
            if (event.metaKey || event.ctrlKey) return;
            handleDismiss();
          }}
        >
          {item.category && <Category>{item.category}</Category>}
          <Title>
            <TitleIcon />
            <VisuallyHidden>{label}: </VisuallyHidden>
            <span ref={titleRef}>{item.title}</span>
          </Title>
          <Excerpt ref={excerptRef}>{item.excerpt}</Excerpt>
          {bodySnippet && <BodySnippet ref={snippetRef}>{bodySnippet.text}</BodySnippet>}
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
