import "./styles.css";

const scrollArea = document.getElementById("scroll-area");
const boxes = document.querySelectorAll(".reveal-box");

/*
  One observer watches every box — far cheaper than a scroll event listener recomputing every
  element's bounding box on every scroll tick. `root` scopes intersection to the scrollable
  container itself, not the browser viewport, since that's what actually scrolls here.
*/
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Reveal once, then stop watching — no reason to keep paying for intersection checks on an already-revealed card.
        observer.unobserve(entry.target);
      }
    }
  },
  { root: scrollArea, threshold: 0.4 }
);

boxes.forEach((box) => observer.observe(box));
