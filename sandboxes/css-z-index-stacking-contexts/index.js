import "./shared/playground.css";
import "./shared/tabs.css";
import "./shared/range-slider.css";
import "./styles.css";
import { initTabs } from "./shared/tabs.js";
import { updateRangeSlider } from "./shared/range-slider.js";

const $ = (id) => document.getElementById(id);

// Each option's literal declaration, so the readout prints exactly what styles.css applies for it.
const TRIGGER_CSS = {
  none: "",
  opacity: "opacity: 0.99",
  transform: "transform: translateZ(0)",
  filter: "filter: blur(0)",
  "will-change": "will-change: transform",
  isolation: "isolation: isolate"
};

// Same idea for the parent in the negative z-index demo.
const PARENT_CSS = {
  auto: "z-index: auto",
  zero: "z-index: 0",
  isolate: "isolation: isolate"
};

// Prints a verdict as a bold headline plus its reasoning, so the readout teaches the rule rather than just naming a winner.
function showVerdict(output, good, headline, explanation) {
  const strong = document.createElement("strong");
  strong.textContent = headline;
  output.replaceChildren(strong, ` ${explanation}`);
  output.dataset.outcome = good ? "good" : "bad";
}

/* ---------- Stacking contexts ---------- */

// `auto` and `0` paint on the same layer, so collapsing them to one number is all the comparisons need.
function zLevel(value) {
  return value === "auto" ? 0 : Number(value);
}

// Card B follows the tooltip in the source, so it wins every tie — the readout says so explicitly.
function describeComparison(contender, cardB, winText) {
  if (contender > cardB) return winText;
  if (contender === cardB) return "they share the same level, so the element that comes later in the source — Card B — paints on top and covers the tooltip.";
  return "Card B is higher, so it paints over the tooltip.";
}

// Re-derives the outcome from the same rules the browser applies, so the explanation always matches the preview.
function renderStacking() {
  const cardAZ = $("card-a-z").value;
  const trigger = $("card-a-trigger").value;
  const tooltipZ = Number($("tooltip-z").value);
  const cardBZ = $("card-b-z").value;

  $("card-a").style.setProperty("--card-a-z", cardAZ);
  $("card-a").dataset.trigger = trigger;
  $("tooltip").style.setProperty("--tooltip-z", tooltipZ);
  $("card-b").style.setProperty("--card-b-z", cardBZ);

  $("card-a-code").textContent = `z-index: ${cardAZ}`;
  $("tooltip-code").textContent = `z-index: ${tooltipZ}`;
  $("card-b-code").textContent = `z-index: ${cardBZ}`;
  updateRangeSlider($("tooltip-z"), $("tooltip-z-value"));

  const bLevel = zLevel(cardBZ);
  const formsContext = cardAZ !== "auto" || trigger !== "none";
  let tooltipOnTop;
  let explanation;

  if (formsContext) {
    const aLevel = zLevel(cardAZ);
    const reason = cardAZ !== "auto" ? `z-index: ${cardAZ}` : TRIGGER_CSS[trigger];
    const aLabel = cardAZ !== "auto" ? `z-index: ${cardAZ}` : "level 0, the same as z-index: 0";
    tooltipOnTop = aLevel > bLevel;
    explanation =
      `Card A forms a stacking context (${reason}), so the tooltip's z-index: ${tooltipZ} only ranks it inside Card A. ` +
      `At the root, Card A (${aLabel}) is compared with Card B (z-index: ${cardBZ}): ` +
      describeComparison(aLevel, bLevel, "Card A is higher, so the tooltip travels with it and paints above Card B.");
  } else {
    tooltipOnTop = tooltipZ > bLevel;
    explanation =
      `Card A doesn't form a stacking context, so the tooltip competes at the root directly: z-index: ${tooltipZ} ` +
      `against Card B's z-index: ${cardBZ} — ` +
      describeComparison(tooltipZ, bLevel, "the tooltip is higher, so it paints above Card B.");
  }

  showVerdict($("stacking-verdict"), tooltipOnTop, tooltipOnTop ? "Tooltip on top." : "Tooltip hidden.", explanation);

  const triggerLine = trigger === "none" ? "" : `\n  ${TRIGGER_CSS[trigger]};`;
  $("stacking-css").textContent =
    `.card-a {\n  position: relative;\n  z-index: ${cardAZ};${triggerLine}\n}\n\n` +
    `.card-a .tooltip {\n  position: absolute;\n  z-index: ${tooltipZ};\n}\n\n` +
    `.card-b {\n  position: relative;\n  z-index: ${cardBZ};\n}`;
}

/* ---------- Negative z-index ---------- */

// Written out per option rather than generated, because each case teaches a different rule.
function renderNegative() {
  const context = $("parent-context").value;
  $("parent").dataset.context = context;

  if (context === "auto") {
    showVerdict(
      $("negative-verdict"),
      false,
      "Escaped behind the parent.",
      "The parent is positioned but has z-index: auto, so it doesn't form a stacking context. The child's z-index: -1 " +
        "is ranked against the stage instead, which paints it below every positioned and in-flow box in the stage — " +
        "including the parent's background. Only the corner that pokes out past the parent stays visible."
    );
  } else {
    const reason = context === "zero" ? "z-index: 0 on a positioned element" : "isolation: isolate";
    showVerdict(
      $("negative-verdict"),
      true,
      "Contained by the parent.",
      `The parent forms a stacking context (${reason}), so z-index: -1 now means "the bottom of the parent's own stack". ` +
        "The child paints above the parent's background but still below the parent's text — exactly the layer decorative " +
        "shapes and pseudo-elements usually need."
    );
  }

  $("negative-css").textContent =
    `.parent {\n  position: relative;\n  ${PARENT_CSS[context]};\n  background: var(--surface);\n}\n\n` +
    `.parent .decoration {\n  position: absolute;\n  z-index: -1;\n}`;
}

/* ---------- Isolation and blending ---------- */

// The blend mode only changes the colours, not which layers are blended — so isolation alone decides the verdict.
function renderBlend() {
  const isolation = $("group-isolation").value;
  const blendMode = $("blend-mode").value;
  $("group").style.setProperty("--group-isolation", isolation);
  $("group").style.setProperty("--blend", blendMode);

  if (isolation === "isolate") {
    showVerdict(
      $("blend-verdict"),
      true,
      "Blending stays inside the group.",
      `The group is its own stacking context, so mix-blend-mode: ${blendMode} only mixes the circles with each other. ` +
        "The finished group is then laid over the stripes like any normal element — same colours on every stripe."
    );
  } else {
    showVerdict(
      $("blend-verdict"),
      false,
      "Blending leaks into the stripes.",
      `The group isn't a stacking context, so each circle's mix-blend-mode: ${blendMode} reaches past the group to ` +
        "everything painted beneath it in the stage — including the stripes. Watch the colours shift from stripe to stripe."
    );
  }

  $("blend-css").textContent = `.group {\n  isolation: ${isolation};\n}\n\n.group .circle {\n  mix-blend-mode: ${blendMode};\n}`;
}

initTabs("#demo-switch .tab");

["card-a-z", "card-a-trigger", "card-b-z"].forEach((id) => $(id).addEventListener("change", renderStacking));
$("tooltip-z").addEventListener("input", renderStacking);
$("parent-context").addEventListener("change", renderNegative);
$("group-isolation").addEventListener("change", renderBlend);
$("blend-mode").addEventListener("change", renderBlend);

renderStacking();
renderNegative();
renderBlend();
