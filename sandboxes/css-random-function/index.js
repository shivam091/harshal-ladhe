import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);
const stage = $("stage");
const supported = CSS.supports("width", "random(0px, 10px)");

// Without support the fallback below takes over, so the note says the confetti isn't the real feature.
$("support-note").hidden = supported;

const RULES = {
  auto: [
    "inline-size: random(0.5rem, 1.75rem);",
    "block-size: random(0.5rem, 1.75rem);"
  ],
  named: [
    "inline-size: random(--size, 0.5rem, 1.75rem);",
    "block-size: random(--size, 0.5rem, 1.75rem);"
  ],
  fixed: [
    "inline-size: random(fixed 0.5, 0.5rem, 1.75rem);",
    "block-size: random(fixed 0.5, 0.5rem, 1.75rem);"
  ]
};

/*
  The fallback pattern: one Math.random() per custom property, written once when the piece is
  created, so each piece keeps its values just as it would with random(). Skipped entirely when
  random() works, because then the stylesheet never reads these properties.
*/
function addPieces(count) {
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("span");
    piece.className = "piece";
    if (!supported) {
      ["--r-x", "--r-y", "--r-w", "--r-h", "--r-turn", "--r-hue"].forEach((name) => {
        piece.style.setProperty(name, Math.random().toFixed(4));
      });
    }
    stage.append(piece);
  }
  update();
}

/*
  Measured rather than assumed, so the tip reports what this browser actually shares. offsetWidth
  ignores the rotation, which would otherwise inflate every piece's bounding box.
*/
function describeSizes() {
  const sizes = [...stage.children].map((piece) => ({ width: piece.offsetWidth, height: piece.offsetHeight }));
  const squares = sizes.every((size) => size.width === size.height);
  const widths = new Set(sizes.map((size) => size.width));
  const sameSize = widths.size === 1;
  if (squares && sameSize) return "every piece is the same square";
  if (squares) return "every piece is a square, in different sizes";
  return "each piece has its own width and height";
}

function update() {
  const mode = document.querySelector("input[name='mode']:checked").value;
  const step = $("step-toggle").checked;

  // The only things JS changes for the demo itself: two attributes on the stage.
  stage.dataset.mode = mode;
  stage.dataset.step = step ? "on" : "off";

  const result = describeSizes();
  $("tip").textContent = {
    auto: `With no key, every random() is independent — per piece and per property — so ${result}.`,
    named: `Both sizes use the --size key, so width and height share one value: ${result}.`,
    fixed: `fixed 0.5 always picks the middle of the range, so ${result}. It's meant for testing and screenshots.`
  }[mode];

  const position = step
    ? ["inset-inline-start: random(0%, 90%, 10%);", "inset-block-start: random(0%, 90%, 10%);"]
    : ["inset-inline-start: random(0%, 95%);", "inset-block-start: random(0%, 90%);"];

  $("readout").textContent = [
    ".piece {",
    ...[...position, ...RULES[mode], "rotate: random(0deg, 90deg);", "background: oklch(0.78 0.15 random(0, 360));"]
      .map((rule) => `  ${rule}`),
    "}",
    "",
    `${stage.children.length} pieces${supported ? "" : " — fallback values from JavaScript"}`
  ].join("\n");
}

$("add-button").addEventListener("click", () => addPieces(10));
$("reset-button").addEventListener("click", () => {
  stage.replaceChildren();
  addPieces(30);
});
document.querySelectorAll("input").forEach((input) => input.addEventListener("input", update));
addPieces(30);
