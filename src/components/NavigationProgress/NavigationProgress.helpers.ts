// The trickle never promises more than this — the last stretch to 100% only happens on real completion.
export const TRICKLE_CEILING = 85;

/*
  One step of the eased trickle — increments shrink as progress approaches the ceiling,
  mimicking a real async operation that slows toward the end. Module-scoped (rather than a
  function nested in the component) so its `Math.random()` calls are unambiguously outside
  the render path for React's purity check.
*/
export function computeNextTrickle(current: number): { next: number; delay: number } {
  const increment = (TRICKLE_CEILING - current) * 0.12 + Math.random() * 3;
  const next = Math.min(current + increment, TRICKLE_CEILING);
  const delay = 120 + Math.random() * 180;

  return { next, delay };
}

/*
  App Router's default behaviour leaves focus wherever it was on the previous page. Move it to
  the new page's <main id="main-content"> so keyboard/screen-reader users land on the new
  content instead of a stale or removed node, per the WAI-ARIA APG SPA navigation pattern.
  Takes no closure over component state, so it lives here rather than as a function nested in
  NavigationProgress — one less thing for that component's hooks to depend on.
*/
export function moveFocusToMain(): void {
  const main = document.getElementById("main-content");
  if (!main) return;

  if (!main.hasAttribute("tabindex")) {
    main.setAttribute("tabindex", "-1");
  }
  main.focus({ preventScroll: true });
}
