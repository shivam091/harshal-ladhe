import "./shared/playground.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);
const demo = $("demo");
const autoTextarea = $("auto-textarea");
const fixedTextarea = $("fixed-textarea");

// Content height in lines: the box's inner height minus its padding, divided by its line height.
function linesTall(textarea) {
  const style = getComputedStyle(textarea);
  const content = textarea.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  return (content / parseFloat(style.lineHeight)).toFixed(1);
}

// Dragging the resize handle writes an inline height, which overrides the content-based size from then on.
function describe(textarea, name) {
  const dragged = textarea.style.height ? `, dragged to ${textarea.style.height}: no longer grows` : "";
  const scrolls = textarea.scrollHeight > textarea.clientHeight ? ", scrolling" : "";
  return `${name}: ${linesTall(textarea)} lines tall${dragged}${scrolls}`;
}

/*
  No JavaScript is needed for the sizing itself; it's all in styles.css. This script only applies the
  checkboxes and reports the sizes the browser has worked out.
*/
function update() {
  demo.classList.toggle("has-min", $("min-toggle").checked);
  demo.classList.toggle("has-max", $("max-toggle").checked);
  demo.classList.toggle("is-resizable", $("resize-toggle").checked);

  $("readout").textContent = `${describe(autoTextarea, "field-sizing: content")}\n${describe(fixedTextarea, "Default")}`;
}

// Turning resize off also clears any dragged size, so the textarea goes back to following its content.
$("resize-toggle").addEventListener("change", () => {
  if (!$("resize-toggle").checked) {
    autoTextarea.style.removeProperty("height");
    fixedTextarea.style.removeProperty("height");
  }
  update();
});

$("min-toggle").addEventListener("change", update);
$("max-toggle").addEventListener("change", update);
demo.addEventListener("input", update);
// Fires for typing, drags on the resize handle and the preview pane changing width alike.
const observer = new ResizeObserver(update);
[autoTextarea, fixedTextarea].forEach((textarea) => observer.observe(textarea));
update();
