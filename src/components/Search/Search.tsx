"use client";

import type { JSX} from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useSearchIndex } from "@/hooks/use-search-index";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import DismissButton from "@/components/DismissButton";
import SearchBox from "@/components/Search/SearchBox";
import SearchResults from "@/components/Search/SearchResults";
import type { SearchProps } from "@/components/Search/Search.types";
import {
  overlayClass,
  panelClass,
  Content,
  headerActionClass,
  desktopCloseButtonClass,
  StyledCloud
} from "@/components/Search/Search.styles";

// Searches locally with Fuse.js so results appear instantly without a search service.
export default function Search({ id, onClose }: SearchProps): JSX.Element {
  // Ref to the dialog panel — used only for the focus-trap boundary checks below.
  const dialogRef = useRef<HTMLDivElement>(null);
  /*
    Two values so typing never lags: the input updates every keystroke while the search runs a task
    later, and the spinner shows while it catches up. Not startTransition: any React transition starts a
    document view transition for the page-content boundary, flashing the sticky header over the panel.
  */
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const isPending = inputValue !== query;
  // Holds the queued search so a newer keystroke replaces it instead of running every stale query.
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Keeps typing responsive by deferring only the search.
  const handleQueryChange = (value: string) => {
    setInputValue(value);
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => setQuery(value), 0);
  };

  // Drops a queued search if the panel closes before it runs.
  useEffect(() => () => clearTimeout(searchTimeoutRef.current), []);

  // Ranked hits for the deferred `query`, recomputed once the queued search above runs.
  const hits = useSearchIndex(query);
  // Reduced-motion users get a plain fade instead of the spring.
  const prefersReducedMotion = usePrefersReducedMotion();

  /*
    The entrance springs and may overshoot, but closing uses a slower, steady ease so the exit
    feels deliberate. `exit` also disables pointer events so a click on the still-fading overlay
    can't call `onClose` a second time and double the close sound.
  */
  const panelMotionProps = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0, pointerEvents: "none" as const },
        transition: { duration: 0.3 }
      }
    : {
        initial: { opacity: 0, y: "-15%" },
        animate: { opacity: 1, y: "0%" },
        exit: {
          opacity: 0,
          y: "-100%",
          pointerEvents: "none" as const,
          transition: { duration: 0.5, ease: [0.56, 0.1, 0.85, 0.87] as const }
        },
        transition: { type: "spring" as const, stiffness: 300, damping: 22 }
      };

  /*
    No mount-time focus call here — the search input focuses itself on mount, which already
    lands keyboard and screen-reader users inside the dialog.
  */

  // Focus trap — keeps Tab and Shift+Tab cycling within the open dialog.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    // Collects every currently focusable element inside the dialog, in DOM order.
    const getFocusable = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex=\"-1\"])"
        )
      );

    // Cycles focus between the first/last focusable element when Tab/Shift+Tab would exit the dialog.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first || document.activeElement === el) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <motion.div
        className={overlayClass}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, pointerEvents: "none", transition: { duration: 0.5 } }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        ref={dialogRef}
        id={id}
        className={panelClass}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        tabIndex={-1}
        {...panelMotionProps}
      >
        <Content>
          <SearchBox
            query={inputValue}
            setQuery={handleQueryChange}
            isPending={isPending}
            handleDismiss={onClose}
          />
          <SearchResults query={query} hits={hits} isPending={isPending} handleDismiss={onClose} />
        </Content>

        <DismissButton
          onClose={onClose}
          className={`${headerActionClass} ${desktopCloseButtonClass}`}
        />

        <StyledCloud />
      </motion.div>
    </>
  );
}

Search.displayName = "Search";
