import "./styles.css";

const box = document.getElementById("box");
const label = document.getElementById("label");
const COMPACT_BREAKPOINT = 260;

/*
  Reacts purely to this one element's own box size — resizing the browser window itself never
  fires this callback, only dragging the element's own resize handle does.
*/
const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { inlineSize: width, blockSize: height } = entry.borderBoxSize[0];
    const mode = width < COMPACT_BREAKPOINT ? "compact" : "wide";
    label.textContent = `${Math.round(width)}×${Math.round(height)} — ${mode} layout`;
    label.className = `label ${mode}`;
  }
});

observer.observe(box);
