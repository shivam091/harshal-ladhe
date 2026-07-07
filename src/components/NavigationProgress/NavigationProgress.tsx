"use client";

import type { JSX} from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { State, LoaderKind, NavigationProgressProps } from "@/components/NavigationProgress/NavigationProgress.types";
import VisuallyHidden from "@/components/VisuallyHidden";
import { LOADERS } from "@/components/NavigationProgress/loaders";
import { TRICKLE_CEILING, computeNextTrickle, moveFocusToMain } from "@/components/NavigationProgress/NavigationProgress.helpers";
import {
  Track,
  Bar,
  Orb,
  Overlay
} from "@/components/NavigationProgress/NavigationProgress.styles";

// One default so the whole site's navigation loader can be switched in a single place.
const DEFAULT_LOADER: LoaderKind = "dots";

/*
  Client-side navigations otherwise give no loading feedback; the optional centred loader waits
  400 ms so fast navigations never flash it.
*/
export default function NavigationProgress({
  loader = DEFAULT_LOADER,
  overlay = true,
  backdrop = false
}: NavigationProgressProps): JSX.Element | null {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  const [state, setState]           = useState<State>("idle");
  const [progress, setProgress]     = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const trickleRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spinnerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancels any in-flight trickle, completion, or spinner-reveal timers so a new navigation starts clean.
  const clearTimers = useCallback(() => {
    if (trickleRef.current)  clearTimeout(trickleRef.current);
    if (doneRef.current)     clearTimeout(doneRef.current);
    if (spinnerRef.current)  clearTimeout(spinnerRef.current);
  }, []);

  // A named function expression so the recursion doesn't read as a temporal-dead-zone access to lint rules.
  const scheduleTrickle = useCallback(function step(current: number) {
    if (current >= TRICKLE_CEILING) return;
    const { next, delay } = computeNextTrickle(current);

    trickleRef.current = setTimeout(() => {
      setProgress(next);
      step(next);
    }, delay);
  }, []);

  // Starts from zero on every navigation so a previous run's progress never carries over.
  const start = useCallback(() => {
    clearTimers();
    setShowSpinner(false);
    setState("loading");
    setProgress(8);
    scheduleTrickle(8);

    // Delayed so fast navigations never flash the spinner.
    spinnerRef.current = setTimeout(() => setShowSpinner(true), 400);
  }, [clearTimers, scheduleTrickle]);

  // Waits for the fade-out before going idle so the bar never vanishes mid-transition.
  const complete = useCallback(() => {
    clearTimers();
    setShowSpinner(false);
    setProgress(100);
    setState("done");
    moveFocusToMain();
    setAnnouncement(`Navigated to ${document.title}`);

    // Allow the bar CSS transition (220 ms) + fade delay (150 ms) to finish.
    doneRef.current = setTimeout(() => {
      setState("idle");
      setProgress(0);
    }, 600);
  }, [clearTimers]);

  // Starts on link clicks because App Router exposes no navigation-start event.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      /* 
        Skip: modifier-click (Ctrl/Cmd/Shift/Alt) or middle-click — the browser opens/saves these
        itself (new tab, new window, or a "Save Link As" dialog on some platforms) regardless of
        `target`, so the current document never navigates.
      */
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;

      // Skip: triggers a file download rather than a navigation.
      if (anchor.hasAttribute("download")) return;

      const raw = anchor.getAttribute("href") ?? "";

      // Skip: these never trigger an in-app navigation.
      if (
        raw.startsWith("http")    ||
        raw.startsWith("//")      ||
        raw.startsWith("#")       ||
        raw.startsWith("mailto:") ||
        raw.startsWith("tel:")
      ) return;

      /* 
        Skip: opens in a new tab/window (e.g. target="_blank") — the current
        document never navigates, so there's nothing to show progress for.
      */
      const anchorTarget = anchor.getAttribute("target");
      if (anchorTarget && anchorTarget !== "_self") return;

      // Skip: same page, where no navigation happens.
      const target = raw.split("?")[0].split("#")[0] || "/";
      if (target === pathname) return;

      start();
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname, start]);

  // A pathname change is the reliable signal that navigation finished.
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      complete();
    }
  }, [pathname, complete]);

  // Clears timers on unmount so none fire against a component that's gone.
  useEffect(() => () => clearTimers(), [clearTimers]);

  const Loader = LOADERS[loader];

  return (
    <>
      {/* Announces each completed navigation to screen readers — the visual bar/spinner below are aria-hidden. Kept mounted (not gated on `state`) so it's never torn down mid-announcement. */}
      <VisuallyHidden as="p" role="status" aria-live="polite">
        {announcement}
      </VisuallyHidden>

      {state !== "idle" && (
        <>
          {/* Top progress bar */}
          <Track data-state={state === "done" ? "done" : undefined} aria-hidden="true" role="presentation">
            <Bar style={{ inlineSize: `${progress}%` }}>
              <Orb />
            </Bar>
          </Track>

          {/* Opt-in, since a centred overlay is heavier than the bar alone */}
          {overlay && (
            <Overlay data-visible={showSpinner ? "true" : undefined} aria-hidden="true" role="presentation">
              <Loader state={state} progress={progress} backdrop={backdrop} />
            </Overlay>
          )}
        </>
      )}
    </>
  );
}
