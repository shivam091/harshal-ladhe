import "./styles.css";

const typed = document.getElementById("typed");
const untyped = document.getElementById("untyped");
const button = document.getElementById("spin");

let spun = false;

button.addEventListener("click", () => {
  spun = !spun;
  const angle = spun ? "300deg" : "0deg";

  // The only difference between these two elements is whether the custom property they set was
  // registered with `@property` (see styles.css) — --typed-angle was, --untyped-angle wasn't. The
  // typed one tweens smoothly through every intermediate angle; the untyped one has no
  // interpolatable value to tween through and jumps straight to the end state.
  typed.style.setProperty("--typed-angle", angle);
  untyped.style.setProperty("--untyped-angle", angle);

  button.textContent = spun ? "Spin both back to 0deg" : "Spin both to 300deg";
});
