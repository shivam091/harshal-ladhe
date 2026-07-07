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

/* 
  Which loader renders when the `loader` prop is omitted — change this (or pass the prop
  at the call site in layout.tsx) to switch the whole site's navigation loader.
*/
const DEFAULT_LOADER: LoaderKind = "dots";

/*
  Two-part navigation indicator:

  1. A thin gradient progress bar fixed to the top of the viewport.
  2. A centred loader overlay — off by default (`overlay`, default false); when
    enabled, which visual renders is picked by the `loader` prop (see
    `@/components/NavigationProgress/loaders`: rings, logo, dots, blob, wave,
    typewriter, bounce, burst) — only appears after a 400 ms delay so fast
    navigations never flash it. `backdrop` (default true) toggles the frosted
    pill behind it.

  Works with Next.js App Router + `output: "export"`.
  No external dependencies.
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

  /*
    Schedules the next eased-trickle step (see computeNextTrickle) until it reaches the
    ceiling. Named as a function expression (`step`) rather than referencing the outer
    `scheduleTrickle` const recursively — self-referencing the outer binding from inside its
    own useCallback initializer reads as a temporal-dead-zone access to some lint rules, even
    though it only ever runs later; a named function expression's own name has no such issue.
  */
  const scheduleTrickle = useCallback(function step(current: number) {
    if (current >= TRICKLE_CEILING) return;
    const { next, delay } = computeNextTrickle(current);

    trickleRef.current = setTimeout(() => {
      setProgress(next);
      step(next);
    }, delay);
  }, []);

  // Kicks off a new navigation: resets progress, begins the trickle, and schedules the delayed spinner reveal.
  const start = useCallback(() => {
    clearTimers();
    setShowSpinner(false);
    setState("loading");
    setProgress(8);
    scheduleTrickle(8);

    // Reveal spinner only if navigation takes longer than 400 ms.
    spinnerRef.current = setTimeout(() => setShowSpinner(true), 400);
  }, [clearTimers, scheduleTrickle]);

  // Snaps progress to 100%, hides the spinner, then returns to idle once the fade-out finishes.
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

  // Detect internal-link clicks → start
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

      // Skip: external, protocol-relative, hash-only, mailto, tel
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

      // Skip: same page
      const target = raw.split("?")[0].split("#")[0] || "/";
      if (target === pathname) return;

      start();
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname, start]);

  // Detect navigation complete → finish
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      complete();
    }
  }, [pathname, complete]);

  // Cleanup
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

          {/* Centred loader — off by default (`overlay`); visual chosen by the `loader` prop, see @/components/NavigationProgress/loaders */}
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
