import "./styles.css";

const card = document.getElementById("card");
const badge = document.getElementById("badge");
const buttons = document.querySelectorAll("[data-priority]");

for (const button of buttons) {
  button.addEventListener("click", () => {
    const priority = button.dataset.priority;

    // The only thing JS ever touches: one custom property. Which color that produces is entirely
    // the stylesheet's decision, via `if(style(--priority: ...))` — see styles.css.
    card.style.setProperty("--priority", priority);
    badge.textContent = `Priority: ${priority}`;

    for (const b of buttons) b.setAttribute("aria-pressed", String(b === button));
  });
}
