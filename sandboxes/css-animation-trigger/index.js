import "./styles.css";

const list = document.getElementById("list");
const select = document.getElementById("actions");
const readout = document.getElementById("readout");

document.getElementById("support").hidden = CSS.supports("animation-trigger", "--t play-once");

select.addEventListener("change", () => {
  // styles.css reads the actions from this custom property: animation-trigger: --reveal var(--actions).
  list.style.setProperty("--actions", select.value);
  readout.textContent = `animation-trigger: --reveal ${select.value};`;

  // Swap the list for a copy, so every card starts again from its initial state with the new actions.
  list.replaceChildren(...[...list.children].map((card) => card.cloneNode(true)));
  list.scrollTop = 0;
});
