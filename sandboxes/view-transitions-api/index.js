import "./styles.css";

const grid = document.getElementById("grid");
const detail = document.getElementById("detail");
const detailCard = document.getElementById("detail-card");
const closeBtn = document.getElementById("close-btn");

// Runs `update` inside a view transition when the browser supports it, falling back to an
// instant DOM update (no morph) otherwise — the feature degrades gracefully either way.
function withTransition(update) {
  if (document.startViewTransition) {
    document.startViewTransition(update);
  } else {
    update();
  }
}

grid.addEventListener("click", (event) => {
  const swatch = event.target.closest(".swatch");
  if (!swatch) return;

  const id = swatch.dataset.id;
  const color = getComputedStyle(swatch).backgroundColor;

  // Tag the OLD element with the shared name before the transition captures its "before" snapshot.
  swatch.style.viewTransitionName = `swatch-${id}`;

  withTransition(() => {
    swatch.style.viewTransitionName = "";
    grid.classList.add("hidden");
    detail.classList.remove("hidden");
    detailCard.style.background = color;
    detailCard.dataset.id = id;
    // Tag the NEW element with the same name so the browser morphs old → new automatically.
    detailCard.style.viewTransitionName = `swatch-${id}`;
  });
});

closeBtn.addEventListener("click", () => {
  const id = detailCard.dataset.id;
  const swatch = grid.querySelector(`[data-id="${id}"]`);

  detailCard.style.viewTransitionName = `swatch-${id}`;

  withTransition(() => {
    detailCard.style.viewTransitionName = "";
    detail.classList.add("hidden");
    grid.classList.remove("hidden");
    if (swatch) swatch.style.viewTransitionName = `swatch-${id}`;
  });
});
