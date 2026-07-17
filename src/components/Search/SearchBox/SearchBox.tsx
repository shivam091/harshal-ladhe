"use client";

import type { JSX} from "react";
import { useEffect, useRef, useState } from "react";
import { sampleOne } from "@/utils/random";
import { useBoop } from "@/hooks/use-boop";
import { SearchIcon } from "@/components/Icon";
import IconTrash from "@/icons/IconTrash";
import DismissButton from "@/components/DismissButton";
import VisuallyHidden from "@/components/VisuallyHidden";
import Spinner from "@/components/Spinner";
import type { SearchBoxProps } from "@/components/Search/SearchBox/SearchBox.types";
import { useClearSearch } from "@/hooks/use-clear-search";
import {
  Wrapper,
  Form,
  IconSearchWrapper,
  Input,
  ClearButton,
  headerActionClass,
  mobileCloseButtonClass
} from "@/components/Search/SearchBox/SearchBox.styles";

// Rotates through a handful of site-relevant example queries so the input never sits empty and generic.
const PLACEHOLDERS = [
  "CSS Grid",
  "closures",
  "encapsulation",
  "immutability",
  "private fields",
  "deep freeze",
  "flexbox",
  "z-index",
  "React hooks",
  "Next.js"
];

// Search input with a "melt away" clear button, plus a mobile-only dismiss button (desktop dismiss lives in SearchModal itself).
export default function SearchBox({ query, setQuery, isPending, handleDismiss }: SearchBoxProps): JSX.Element {
  // Ref to the text input — focused on mount below, and refocused by useClearSearch once clearing finishes.
  const inputRef = useRef<HTMLInputElement>(null);
  // Sampled once per mount so the placeholder doesn't shuffle mid-session.
  const [placeholder] = useState<string>(() => sampleOne(PLACEHOLDERS));

  // Boop trigger for the clear ("trash") button's icon, fired on release (not press-down) so the lid pop plays after the click completes.
  const [isClearButtonBooped, triggerClearBoop] = useBoop();
  // Drives the clear button's melt-away animation — see SearchBox.helpers.ts.
  const { clearButtonRef, isClearingValue, setIsClearingValue } = useClearSearch({
    inputValue: query,
    setInputValue: setQuery,
    inputRef
  });

  /*
    Focuses the input on mount so typing can start immediately — deliberately NOT the native
    `autoFocus` attribute, which doesn't accept a preventScroll option and was yanking the
    page back toward the header on scrolled-down pages (autoFocus's scroll-into-view doesn't
    account for the input sitting inside a position:fixed panel that's already fully visible
    regardless of scroll position).
  */
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    /*
      The search dialog closes on Escape (see SiteHeaderClient), but if there's text in the
      box, the first Escape should just clear it — stopPropagation keeps that keypress from
      also dismissing the whole dialog. A second Escape (now with an empty input) falls through
      to the dialog-level handler as normal. onKeyDown alone doesn't reliably catch this in every
      browser, so it's wired up as a native listener instead.
    */
    function handleKeydown(event: KeyboardEvent) {
      const target = event.target as HTMLInputElement;
      if (event.key === "Escape" && target?.value?.length > 0) {
        event.stopPropagation();
        setQuery("");
      }
    }

    input.addEventListener("keydown", handleKeydown);
    return () => input.removeEventListener("keydown", handleKeydown);
  }, [setQuery]);

  return (
    <>
      <Wrapper>
        <Form
          role="search"
          action=""
          onSubmit={(event) => {
            event.preventDefault();
            inputRef.current?.blur();
          }}
          onReset={(event) => {
            event.preventDefault();
            setIsClearingValue(true);
          }}
        >
          <IconSearchWrapper>
            {isPending ? <Spinner aria-hidden="true" size={20} /> : <SearchIcon size={20} />}
          </IconSearchWrapper>
          <Input
            ref={inputRef}
            name="search-query"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={150}
            type="search"
            placeholder={placeholder}
            value={query}
            disabled={isClearingValue}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
          <ClearButton
            ref={clearButtonRef}
            type="reset"
            onPointerUp={triggerClearBoop}
            tabIndex={query.length === 0 ? -1 : undefined}
            style={{
              opacity: query.length === 0 ? 0 : 1,
              pointerEvents: query.length === 0 ? "none" : "auto"
            }}
          >
            <IconTrash isAjar={isClearButtonBooped} />
            <VisuallyHidden>Clear search input</VisuallyHidden>
          </ClearButton>
        </Form>

        {/* On larger screens, the close button lives in SearchModal itself — data-mobile-only is the same attribute the header's own hamburger uses to show only under 48rem. */}
        <DismissButton
          onClose={handleDismiss}
          className={`${headerActionClass} ${mobileCloseButtonClass}`}
          data-mobile-only
        />
      </Wrapper>
    </>
  );
}

SearchBox.displayName = "SearchBox";
