import "./styles.css";

// No JS at all is required for the auto-growing behavior itself — see styles.css's
// `field-sizing: content` rule. This just logs support so the demo is honest about it.
const supportsFieldSizing = CSS.supports("field-sizing", "content");
console.log(`field-sizing: content supported → ${supportsFieldSizing}`);
if (!supportsFieldSizing) {
  console.log("Falling back to the browser's native fixed-rows textarea behavior.");
}
