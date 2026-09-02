import "./styles.css";

const triggers = document.querySelectorAll(".trigger");

for (const trigger of triggers) {
  trigger.addEventListener("click", () => {
    const panel = document.getElementById(trigger.dataset.target);
    const isOpen = panel.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(isOpen));

    // That's the entire script. No height measurement, no manual max-height calculation — the
    // `open` class just flips `height` between 0 and auto; styles.css's `interpolate-size` does
    // the rest.
  });
}
