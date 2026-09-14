// Shared by the search panel and the goto-line panel (see each's *.styles.ts for the actual
// slide-up/fade-out keyframes this class name triggers) — both need to play an exit animation
// before the element is actually detached/closed, rather than vanishing instantly.
const CLOSING_CLASS = "sandbox-panel-closing";

// Falls back to a timeout in case animationend never fires (e.g. the animation was interrupted
// by the element being detached some other way), so onDone always eventually runs.
const FALLBACK_MS = 250;

export function closePanelAnimated(panel: HTMLElement, onDone: () => void): void {
  if (panel.classList.contains(CLOSING_CLASS)) {
    return;
  }

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    panel.removeEventListener("animationend", finish);
    clearTimeout(timer);
    onDone();
  };

  const timer = setTimeout(finish, FALLBACK_MS);
  panel.addEventListener("animationend", finish);
  panel.classList.add(CLOSING_CLASS);
}
