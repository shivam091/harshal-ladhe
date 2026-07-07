// The trickle never promises more than this — the last stretch to 100% only happens on real completion.
export const TRICKLE_CEILING = 85;

/*
  Increments shrink toward the ceiling so progress feels like a real operation slowing near the
  end; module-scoped so its Math.random() calls sit clearly outside the render path for React's
  purity check.
*/
export function computeNextTrickle(current: number): { next: number; delay: number } {
  const increment = (TRICKLE_CEILING - current) * 0.12 + Math.random() * 3;
  const next = Math.min(current + increment, TRICKLE_CEILING);
  const delay = 120 + Math.random() * 180;

  return { next, delay };
}

/*
  App Router leaves focus on the previous page, so keyboard and screen-reader users would
  otherwise sit on a stale or removed node (WAI-ARIA APG SPA navigation pattern).
*/
export function moveFocusToMain(): void {
  const main = document.getElementById("main-content");
  if (!main) return;

  if (!main.hasAttribute("tabindex")) {
    main.setAttribute("tabindex", "-1");
  }
  main.focus({ preventScroll: true });
}
