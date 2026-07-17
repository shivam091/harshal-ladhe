"use client";

import { JSX, useEffect, useRef, useState, useTransition } from "react";
import { motion } from "motion/react";
import { useSearchIndex } from "@/hooks/use-search-index";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { usePressToClose } from "@/hooks/use-press-to-close";
import { useBoop } from "@/hooks/use-boop";
import IconDismiss from "@/icons/IconDismiss";
import VisuallyHidden from "@/components/VisuallyHidden";
import SearchBox from "@/components/Search/SearchBox";
import SearchResults from "@/components/Search/SearchResults";
import { SearchProps } from "@/interfaces/search";
import {
  overlayClass,
  panelClass,
  Content,
  headerActionClass,
  desktopCloseButtonClass,
  StyledCloud
} from "@/components/Search/Search.styles";

/*
  Site search dialog — full-width panel pinned to the top of the viewport, portaled and
  mounted/unmounted by SiteHeaderClient via AnimatePresence (same pattern as the mobile
  Drawer). Owns its own query state and searches posts + snippets locally via Fuse.js.
*/
export default function Search({ id, onClose }: SearchProps): JSX.Element {
  // Ref to the dialog panel — used only for the focus-trap boundary checks below.
  const dialogRef = useRef<HTMLDivElement>(null);
  /*
    `inputValue` is what's literally in the box — updates every keystroke so typing never
    feels laggy. `query` is the same value applied via startTransition, so React can mark it
    low-priority; `isPending` is true for however long that update (and the Fuse search it
    triggers) actually takes. For this dataset's size that's normally sub-frame, so the
    spinner mostly won't show — same as the reference implementation's Algolia spinner, which
    only appears once a search is actually slow, not on every keystroke.
  */
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Updates the input immediately, then applies the query itself as a low-priority transition.
  const handleQueryChange = (value: string) => {
    setInputValue(value);
    startTransition(() => {
      setQuery(value);
    });
  };

  // Ranked hits for the deferred `query`, recomputed only once React applies the low-priority update above.
  const hits = useSearchIndex(query);
  // Selects which of the two panelMotionProps variants below renders.
  const prefersReducedMotion = usePrefersReducedMotion();
  // Press-state handlers driving the desktop close button's pressed look, mirroring the header's own buttons.
  const closePress = usePressToClose(onClose);
  // Boop trigger for the desktop close button's icon, fired on pointer enter.
  const [isCloseBooped, triggerCloseBoop] = useBoop();

  /*
    A springy entrance is allowed to overshoot slightly past its resting position before
    settling — reduced-motion users get a plain fade instead, with no transform at all.

    Closing deliberately does NOT reuse the entrance spring — the reference implementation
    uses a bouncy spring only going in, then a slower, steady `transform 500ms
    cubic-bezier(0.56, 0.1, 0.85, 0.87)` ease-out coming out. Nesting `transition` inside
    `exit` overrides just that state's timing, independent of the top-level (entrance) one.

    `exit` also flips pointerEvents to "none" (applied instantly, not animated — Motion just
    sets non-animatable properties directly). Without it, the overlay/panel stay clickable
    for the whole exit transition after a real close has already fired: a click landing on
    the still-mounted, still-fading overlay during that window would call `onClose` a second
    time, doubling the close sound.
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
    No mount-time focus call on the dialog container itself — SearchBox's own input already
    focuses on mount (with preventScroll) and lands focus inside the dialog, which is all
    "land inside the modal for keyboard/AT users" actually requires. dialogRef stays only for
    the focus-trap boundary checks below.
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

        <button
          type="button"
          className={`${headerActionClass} ${desktopCloseButtonClass}`}
          aria-label="Dismiss"
          onPointerEnter={triggerCloseBoop}
          onPointerDown={closePress.onPointerDown}
          onClick={closePress.onClick}
          onPointerLeave={closePress.onPointerLeave}
        >
          <IconDismiss size={16} isPressed={closePress.isPressed} isBooped={isCloseBooped} />
          <VisuallyHidden>Dismiss</VisuallyHidden>
        </button>

        <StyledCloud />
      </motion.div>
    </>
  );
}

Search.displayName = "Search";
