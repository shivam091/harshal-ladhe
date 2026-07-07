"use client";

import { JSX, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { State } from "@/types/navigation-progress";
import VisuallyHidden from "@/components/VisuallyHidden";
import {
  Track,
  Bar,
  Orb,
  Overlay,
  Backdrop,
  SpinnerSvg,
  OuterRing,
  MiddleRing,
  InnerRing
} from "@/components/NavigationProgress/NavigationProgress.styles";

/*
  Two-part navigation indicator:

  1. A thin gradient progress bar fixed to the top of the viewport.
  2. A triple-ring SVG spinner centred in the viewport — only appears after
    a 400 ms delay so fast navigations never flash it.

  Works with Next.js App Router + `output: "export"`.
  No external dependencies.
*/
export default function NavigationProgress(): JSX.Element | null {
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
  function clearTimers() {
    if (trickleRef.current)  clearTimeout(trickleRef.current);
    if (doneRef.current)     clearTimeout(doneRef.current);
    if (spinnerRef.current)  clearTimeout(spinnerRef.current);
  }

  // Kicks off a new navigation: resets progress, begins the trickle, and schedules the delayed spinner reveal.
  function start() {
    clearTimers();
    setShowSpinner(false);
    setState("loading");
    setProgress(8);
    scheduleTrickle(8);

    // Reveal spinner only if navigation takes longer than 400 ms.
    spinnerRef.current = setTimeout(() => setShowSpinner(true), 400);
  }

  /*
    Eased trickle — increments shrink as progress approaches 85 %,
    mimicking a real async operation that slows toward the end.
  */
  function scheduleTrickle(current: number) {
    if (current >= 85) return;
    const increment = (85 - current) * 0.12 + Math.random() * 3;
    const next      = Math.min(current + increment, 85);
    const delay     = 120 + Math.random() * 180;

    trickleRef.current = setTimeout(() => {
      setProgress(next);
      scheduleTrickle(next);
    }, delay);
  }

  // Snaps progress to 100%, hides the spinner, then returns to idle once the fade-out finishes.
  function complete() {
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
  }

  /*
    App Router's default behaviour leaves focus wherever it was on the previous page.
    Move it to the new page's <main id="main-content"> so keyboard/screen-reader users
    land on the new content instead of a stale or removed node, per the WAI-ARIA APG
    SPA navigation pattern.
  */
  function moveFocusToMain() {
    const main = document.getElementById("main-content");
    if (!main) return;

    if (!main.hasAttribute("tabindex")) {
      main.setAttribute("tabindex", "-1");
    }
    main.focus({ preventScroll: true });
  }

  // Detect internal-link clicks → start
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      // Skip: modifier-click (Ctrl/Cmd/Shift/Alt) or middle-click — the browser opens/saves these
      // itself (new tab, new window, or a "Save Link As" dialog on some platforms) regardless of
      // `target`, so the current document never navigates.
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

      // Skip: opens in a new tab/window (e.g. target="_blank") — the current
      // document never navigates, so there's nothing to show progress for.
      const anchorTarget = anchor.getAttribute("target");
      if (anchorTarget && anchorTarget !== "_self") return;

      // Skip: same page
      const target = raw.split("?")[0].split("#")[0] || "/";
      if (target === pathname) return;

      start();
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  // Detect navigation complete → finish
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      complete();
    }
  }, [pathname]);

  // Cleanup
  useEffect(() => () => clearTimers(), []);

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

          {/* Centred SVG spinner */}
          <Overlay data-visible={showSpinner ? "true" : undefined} aria-hidden="true" role="presentation">
            {/* Frosted glass backdrop so rings are readable against any page bg */}
            <Backdrop />

            {/*
             * Triple-ring SVG spinner.
             *
             * Ring arc lengths are calculated from each circle's circumference:
             *   Outer  r=34 → C ≈ 213.6 → 3/4 arc: dasharray="160 54"
             *   Middle r=25 → C ≈ 157.1 → 2/3 arc: dasharray="105 52"
             *   Inner  r=16 → C ≈ 100.5 → 1/2 arc: dasharray=" 50 51"
             *
             * Rotation speeds/directions:
             *   Outer  → clockwise,          slow  (2.8 s)
             *   Middle → counter-clockwise,  medium (2.0 s)
             *   Inner  → clockwise,          fast  (1.2 s)
             */}
            <SpinnerSvg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
              {/* Outer ring — attention (orange) */}
              <OuterRing cx="40" cy="40" r="34" />

              {/* Middle ring — success (green) */}
              <MiddleRing cx="40" cy="40" r="25" />

              {/* Inner ring — accent (blue) */}
              <InnerRing cx="40" cy="40" r="16" />
            </SpinnerSvg>
          </Overlay>
        </>
      )}
    </>
  );
}
