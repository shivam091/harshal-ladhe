import "./shared/playground.css";
import "./styles.css";

// Shorthand for looking an element up by id.
const $ = (id) => document.getElementById(id);
// Tested with two gradients rather than none, the newest part of the feature, so a browser that handles url() pairs isn't reported as unsupported.
const supported = CSS.supports("background-image", "light-dark(linear-gradient(red, red), linear-gradient(blue, blue))");
const stage = $("stage");
const readout = $("readout");
const dark = matchMedia("(prefers-color-scheme: dark)");

$("support-tip").hidden = supported;

// "System" is only a choice, so the readout needs the scheme the browser actually resolved from it.
function usedScheme() {
  const choice = stage.dataset.scheme;
  return choice === "system" ? (dark.matches ? "dark" : "light") : choice;
}

// Shows which code path painted the hero, since both paths look identical in a browser that supports the feature.
function render() {
  const mode = supported ? "light-dark()" : "media query fallback";
  readout.textContent = `Choice: ${stage.dataset.scheme} | Used scheme: ${usedScheme()} | Painted by: ${mode}`;
}

document.querySelectorAll('input[name="scheme"]').forEach((input) => {
  input.addEventListener("change", () => {
    stage.dataset.scheme = input.value;
    render();
  });
});

dark.addEventListener("change", render);
render();
