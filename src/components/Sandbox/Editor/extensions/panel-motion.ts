// Class that triggers a panel's closing animation.
const CLOSING_CLASS = "sandbox-panel-closing";

// Still closes the panel if animationend never fires, so it can't get stuck open.
const FALLBACK_MS = 250;

// Lets CodeMirror panels animate out before they're removed, instead of vanishing abruptly.
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
