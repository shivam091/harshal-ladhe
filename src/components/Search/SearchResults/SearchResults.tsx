import { JSX } from "react";
import Link from "next/link";
import SearchResult from "@/components/Search/SearchResult";
import { Wrapper, Message } from "@/components/Search/SearchResults/SearchResults.styles";
import { SearchResultsProps } from "@/interfaces/search";

// Renders the ranked hit list, or an initial prompt / "no results" message depending on query state.
export default function SearchResults({ query, hits, isPending, handleDismiss }: SearchResultsProps): JSX.Element {
  // Mirrors useSearchIndex's own 2-character minimum, so the panel's "prompt" vs "no results" state agrees with what actually ran.
  const hasQuery = query.trim().length >= 2;

  if (!hasQuery) {
    return (
      <>
        <Wrapper>
          <Message>
            Search through all of the blog posts and snippets on my
            site. <strong><em>This&nbsp;feature is in beta.</em></strong> If you
            run into any bugs, please{" "}
            <Link href="/contact" onClick={handleDismiss}>
              let me know
            </Link>
            !
          </Message>
        </Wrapper>
      </>
    );
  }

  if (hits.length === 0) {
    return (
      <>
        <Wrapper>
          <Message>
            <strong>No results. </strong>Sorry, this doesn&apos;t appear to be something I&apos;ve written about!
          </Message>
        </Wrapper>
      </>
    );
  }

  return (
    <>
      <Wrapper>
        {hits.map((hit) => (
          <SearchResult key={hit.item.id} hit={hit} isPending={isPending} handleDismiss={handleDismiss} />
        ))}
      </Wrapper>
    </>
  );
}

SearchResults.displayName = "SearchResults";
