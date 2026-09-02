import "./styles.css";

const list = document.getElementById("list");
const replay = document.getElementById("replay");

replay.addEventListener("click", () => {
  // Re-trigger the CSS animation by removing and re-adding the class on the next frame — the
  // stagger timing itself is entirely CSS (sibling-index()), this is only restarting it.
  list.classList.remove("run");
  requestAnimationFrame(() => requestAnimationFrame(() => list.classList.add("run")));
});

requestAnimationFrame(() => list.classList.add("run"));
