// Class that triggers a panel's closing animation.
const CLOSING_CLASS = "sandbox-panel-closing";

// Fallback timeout for the closing animation.
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
