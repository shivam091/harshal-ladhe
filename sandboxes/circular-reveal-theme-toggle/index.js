import "./shared/playground.css";
import "./styles.css";

const root = document.documentElement;
const toggles = document.querySelectorAll(".theme-toggle");
const shrinkToggle = document.getElementById("shrink-toggle");
const slowToggle = document.getElementById("slow-toggle");
const readout = document.getElementById("readout");

// Without support the theme still changes, just instantly, so say so rather than let the demo look broken.
const supportsViewTransitions = typeof document.startViewTransition === "function";

// Keeps every toggle's pressed state in step with the theme, whichever one was pressed.
function syncToggles() {
  const isDark = root.dataset.theme === "dark";
  for (const toggle of toggles) toggle.setAttribute("aria-pressed", String(isDark));
}

// The circle has to reach the farthest viewport corner from the origin, or a sliver of the old theme survives.
function getEndRadius(x, y) {
  return Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
}

// Switches the theme inside a view transition, then clips the snapshots into a circle centred on the button.
async function toggleTheme(button) {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  const apply = () => {
    root.dataset.theme = next;
    syncToggles();
  };

  if (!supportsViewTransitions || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply();
    describe(next, null);
    return;
  }

  // The button's centre rather than the click point, so keyboard presses reveal from the right place too.
  const { left, top, width, height } = button.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const radius = getEndRadius(x, y);
  const shrink = shrinkToggle.checked && next === "light";

  root.dataset.reveal = shrink ? "shrink" : "grow";
  const transition = document.startViewTransition(apply);
  await transition.ready;

  const circles = [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`];
  root.animate(
    { clipPath: shrink ? circles.reverse() : circles },
    {
      duration: slowToggle.checked ? 1500 : 500,
      easing: "ease-in-out",
      pseudoElement: shrink ? "::view-transition-old(root)" : "::view-transition-new(root)"
    }
  );

  transition.finished.finally(() => delete root.dataset.reveal);
  describe(next, { x, y, radius, shrink });
}

// Shows the values the animation was actually given, so the maths is visible rather than implied.
function describe(theme, reveal) {
  if (!reveal) {
    readout.textContent = `Theme: ${theme}\nView transitions supported: ${supportsViewTransitions ? "yes, but reduced motion is on, so the swap was instant." : "no, so the swap was instant."}`;
    return;
  }
  const { x, y, radius, shrink } = reveal;
  readout.textContent = `Theme: ${theme}\nOrigin: ${Math.round(x)}px ${Math.round(y)}px\nEnd radius: ${Math.round(radius)}px\nAnimated: ${shrink ? "::view-transition-old(root), shrinking" : "::view-transition-new(root), growing"}`;
}

for (const toggle of toggles) {
  toggle.addEventListener("click", () => toggleTheme(toggle));
}

syncToggles();
readout.textContent = `Theme: ${root.dataset.theme}\nView transitions supported: ${supportsViewTransitions ? "yes" : "no, so the theme will swap instantly"}`;
