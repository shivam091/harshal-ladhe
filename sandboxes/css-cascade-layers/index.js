import "./shared/playground.css";
import "./styles.css";

/*
  Fixed catalogue of the 4 competing rules, in a fixed textual/stylesheet order (a, b, c, d) that never
  changes — this is what "source order" tiebreaks against later. Only `layer` and `important` are
  mutable state; `specificity` is the real specificity of the selector below it, computed by hand once
  and never touched again, since these selectors never change.
*/
const RULES = [
  { id: "a", selector: ".util-text", specificity: [0, 1, 0], color: "#14b8a6", layer: "utilities", important: false },
  { id: "b", selector: ".card .body-text", specificity: [0, 2, 0], color: "#7c3aed", layer: "base", important: false },
  { id: "c", selector: "#panel .body-text", specificity: [1, 1, 0], color: "#f97316", layer: "components", important: false },
  { id: "d", selector: "#panel .body-text.featured", specificity: [1, 2, 0], color: "#ec4899", layer: "reset", important: false }
];

// The 4 layer names that always exist — this array's OWN order never changes, so dropdown option order stays stable.
const CANONICAL_LAYERS = ["reset", "base", "components", "utilities"];

// Declared order right now (lowest priority first) — this is the ONE thing "Declared Layer Order" reorders.
// Deliberately starts identical to CANONICAL_LAYERS; a real stylesheet's `@layer a, b, c, d;` statement is
// exactly this array joined with commas, rebuilt from scratch below on every change.
let layerOrder = [...CANONICAL_LAYERS];

const DEFAULT_LAYER_ORDER = [...CANONICAL_LAYERS];
const DEFAULT_RULE_STATE = RULES.map((rule) => ({ id: rule.id, layer: rule.layer, important: rule.important }));

const output = document.getElementById("war-output");
const layerOrderList = document.getElementById("layer-order-list");
const resetBtn = document.getElementById("reset-btn");

// A single live <style> element holding the ENTIRE generated stylesheet — rewritten (not appended to)
// on every change, so the browser is always parsing one fresh, self-consistent stylesheet, exactly the
// way editing a real .css file and reloading the page would work.
const styleTag = document.createElement("style");
document.head.appendChild(styleTag);

/*
  Rank used ONLY to explain the result in English — a plain-language mirror of the same rule the browser
  itself applies, kept as two separate, deliberately readable branches instead of one clever formula:
   - Normal rules: unlayered is highest priority; among layers, the one declared LAST wins.
   - !important rules: priority is the REVERSE — unlayered is LOWEST priority; among layers, the one
     declared FIRST wins.
  Higher returned number always means higher priority, in both branches.
*/
function layerRank(rule) {
  if (rule.layer === "none") {
    return rule.important ? -1 : layerOrder.length;
  }
  const declaredIndex = layerOrder.indexOf(rule.layer);
  return rule.important ? layerOrder.length - declaredIndex : declaredIndex;
}

// Compares two rules for final priority: importance first, then layer rank, then specificity, then source order (array position = stylesheet position).
function compareRules(a, b, indexA, indexB) {
  if (a.important !== b.important) return a.important ? 1 : -1;

  const rankA = layerRank(a);
  const rankB = layerRank(b);
  if (rankA !== rankB) return rankA - rankB;

  for (let i = 0; i < 3; i += 1) {
    if (a.specificity[i] !== b.specificity[i]) return a.specificity[i] - b.specificity[i];
  }

  return indexA - indexB;
}

// Finds the winning rule (highest final priority) among RULES, using each rule's fixed array index as its source-order position.
function findWinner() {
  return RULES.reduce((best, rule, index) => {
    if (!best) return { rule, index };
    return compareRules(rule, best.rule, index, best.index) > 0 ? { rule, index } : best;
  }, null);
}

// Finds the runner-up (2nd-highest priority) — whichever remaining rule would win if the actual winner didn't exist.
function findRunnerUp(winnerId) {
  return RULES.filter((rule) => rule.id !== winnerId).reduce((best, rule, index) => {
    if (!best) return { rule, index };
    return compareRules(rule, best.rule, index, best.index) > 0 ? { rule, index } : best;
  }, null).rule;
}

// Builds a one-line, plain-language "why" for the winner vs. the runner-up — the whole point of the sandbox.
function explainWinner(winner, runnerUp) {
  if (winner.important !== runnerUp.important) {
    return `${winner.selector} wins because it's the only rule marked !important — importance always outranks layer order and specificity.`;
  }

  const rankWinner = layerRank(winner);
  const rankRunnerUp = layerRank(runnerUp);

  if (rankWinner !== rankRunnerUp) {
    const unlayeredRule = winner.layer === "none" ? winner : runnerUp.layer === "none" ? runnerUp : null;
    if (unlayeredRule) {
      return winner.important
        ? `${winner.selector} wins because, for !important rules, even the lowest-priority layer beats an unlayered declaration.`
        : `${winner.selector} wins because unlayered rules always beat layered rules, when neither is !important.`;
    }
    return winner.important
      ? `${winner.selector} wins because, for !important rules, layer priority is reversed — its layer ("${winner.layer}") was declared before ("${runnerUp.layer}").`
      : `${winner.selector} wins because its layer ("${winner.layer}") was declared after ("${runnerUp.layer}") — later-declared layers win for normal rules.`;
  }

  if (winner.specificity.join() !== runnerUp.specificity.join()) {
    return `${winner.selector} wins on specificity (${winner.specificity.join("-")} vs. ${runnerUp.specificity.join("-")}) — same layer and importance, so specificity is the tiebreaker here.`;
  }

  return `${winner.selector} wins by source order — identical layer, importance, and specificity, so whichever rule comes later in the stylesheet wins.`;
}

// Renders one CSS declaration block for a rule — wrapped in `@layer <name> { }` if it has one, bare otherwise.
function renderRuleBlock(rule) {
  const important = rule.important ? " !important" : "";
  const declaration = `  ${rule.selector} { color: ${rule.color}${important}; }`;
  if (rule.layer === "none") return declaration;
  return `  @layer ${rule.layer} {\n  ${declaration}\n  }`;
}

// Rebuilds the entire live stylesheet from current state and writes it into the page's <style> tag — this is what actually decides the rendered color, via the real cascade.
function buildAndApplyStylesheet() {
  const lines = [
    `@layer ${layerOrder.join(", ")};`,
    "",
    ...RULES.map(renderRuleBlock)
  ];
  const css = lines.join("\n");
  styleTag.textContent = css;
  return css;
}

const ORDINALS = ["1st", "2nd", "3rd", "4th"];

// Rebuilds every rule's <select> options so each layer's label always shows its CURRENT declared position — the option order itself stays fixed (CANONICAL_LAYERS), only the labels change.
function renderRuleSelects() {
  RULES.forEach((rule) => {
    const select = document.getElementById(`layer-select-${rule.id}`);
    const previousValue = select.value || rule.layer;

    select.innerHTML = "";

    const noneOption = document.createElement("option");
    noneOption.value = "none";
    noneOption.textContent = "No layer (unlayered)";
    select.appendChild(noneOption);

    CANONICAL_LAYERS.forEach((layerName) => {
      const option = document.createElement("option");
      option.value = layerName;
      const position = layerOrder.indexOf(layerName);
      option.textContent = `${layerName} (${ORDINALS[position]} declared)`;
      select.appendChild(option);
    });

    select.value = previousValue;
  });
}

// Rebuilds the reorderable "Declared Layer Order" list from `layerOrder`, lowest priority (index 0) first.
function renderLayerOrderList() {
  layerOrderList.innerHTML = "";

  layerOrder.forEach((layerName, index) => {
    const item = document.createElement("li");
    item.className = "layer-order-item";
    item.dataset.layer = layerName;

    const position = document.createElement("span");
    position.className = "layer-position";
    position.textContent = ORDINALS[index];

    const name = document.createElement("span");
    name.className = "layer-name";
    name.textContent = layerName;

    const buttons = document.createElement("div");
    buttons.className = "layer-order-buttons";

    const upBtn = document.createElement("button");
    upBtn.type = "button";
    upBtn.className = "order-btn";
    upBtn.dataset.action = "up";
    upBtn.dataset.layer = layerName;
    upBtn.setAttribute("aria-label", `Move ${layerName} earlier (lower priority)`);
    upBtn.textContent = "↑";
    upBtn.disabled = index === 0;

    const downBtn = document.createElement("button");
    downBtn.type = "button";
    downBtn.className = "order-btn";
    downBtn.dataset.action = "down";
    downBtn.dataset.layer = layerName;
    downBtn.setAttribute("aria-label", `Move ${layerName} later (higher priority)`);
    downBtn.textContent = "↓";
    downBtn.disabled = index === layerOrder.length - 1;

    buttons.append(upBtn, downBtn);
    item.append(position, name, buttons);
    layerOrderList.appendChild(item);
  });
}

// Formats the live readout: the generated stylesheet's header, every rule's current assignment, then the winner and why.
function renderOutput(winner, runnerUp) {
  const ruleLines = RULES.map((rule) => {
    const layerLabel = rule.layer === "none" ? "unlayered" : rule.layer;
    const importantLabel = rule.important ? "!important" : "normal";
    return `  ${rule.selector.padEnd(28, " ")} → ${layerLabel.padEnd(11, " ")} ${importantLabel}`;
  });

  output.textContent = [
    `@layer ${layerOrder.join(", ")};`,
    "",
    "Rules (in stylesheet order):",
    ...ruleLines,
    "",
    `WINNER: ${winner.selector}`,
    `Why: ${explainWinner(winner, runnerUp)}`
  ].join("\n");
}

// Re-derives everything from current state: rebuilds the live stylesheet (real cascade decides the color), then explains the result.
function update() {
  buildAndApplyStylesheet();

  const { rule: winner } = findWinner();
  const runnerUp = findRunnerUp(winner.id);

  renderOutput(winner, runnerUp);
}

function attachRuleListeners() {
  RULES.forEach((rule) => {
    const select = document.getElementById(`layer-select-${rule.id}`);
    select.addEventListener("change", () => {
      rule.layer = select.value;
      update();
    });

    const importantToggle = document.getElementById(`important-${rule.id}`);
    importantToggle.checked = rule.important;
    importantToggle.addEventListener("change", () => {
      rule.important = importantToggle.checked;
      update();
    });

    const swatch = document.querySelector(`.rule-swatch[data-rule="${rule.id}"]`);
    swatch.style.setProperty("--swatch-color", rule.color);
  });
}

layerOrderList.addEventListener("click", (event) => {
  const button = event.target.closest(".order-btn");
  if (!button || button.disabled) return;

  const { action, layer } = button.dataset;
  const index = layerOrder.indexOf(layer);
  const swapWith = action === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= layerOrder.length) return;

  [layerOrder[index], layerOrder[swapWith]] = [layerOrder[swapWith], layerOrder[index]];

  renderLayerOrderList();
  renderRuleSelects();
  update();
});

resetBtn.addEventListener("click", () => {
  layerOrder = [...DEFAULT_LAYER_ORDER];
  DEFAULT_RULE_STATE.forEach((defaults, index) => {
    RULES[index].layer = defaults.layer;
    RULES[index].important = defaults.important;
    document.getElementById(`layer-select-${defaults.id}`).value = defaults.layer;
    document.getElementById(`important-${defaults.id}`).checked = defaults.important;
  });
  renderLayerOrderList();
  renderRuleSelects();
  update();
});

attachRuleListeners();
renderLayerOrderList();
renderRuleSelects();
update();
