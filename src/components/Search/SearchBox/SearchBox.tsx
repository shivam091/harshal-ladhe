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

// Keeps a dismiss button beside the input on mobile, where the panel's own close button is hidden.
export default function SearchBox({ query, setQuery, isPending, handleDismiss }: SearchBoxProps): JSX.Element {
  // Needed to focus the input without scrolling the page.
  const inputRef = useRef<HTMLInputElement>(null);
  // Sampled once per mount so the placeholder doesn't shuffle mid-session.
  const [placeholder] = useState<string>(() => sampleOne(PLACEHOLDERS));

  // Boop trigger for the clear ("trash") button's icon, fired on release (not press-down) so the lid pop plays after the click completes.
  const [isClearButtonBooped, triggerClearBoop] = useBoop();
  // Melts the text away character by character so clearing feels deliberate rather than abrupt.
  const { clearButtonRef, isClearingValue, setIsClearingValue } = useClearSearch({
    inputValue: query,
    setInputValue: setQuery,
    inputRef
  });

  /*
    Not native `autoFocus`: it can't take preventScroll, so it yanked scrolled pages back towards
    the header even though the fixed panel is already fully visible.
  */
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    /*
      With text in the box, the first Escape should just clear it rather than close the dialog;
      a second Escape then closes it. A native listener because onKeyDown alone doesn't reliably
      catch this in every browser.
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

        {/* Mobile only; larger screens use the panel's own close button. */}
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
