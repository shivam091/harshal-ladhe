import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const slot = document.getElementById("slot");
const plan = document.getElementById("plan");
const readout = document.getElementById("readout");
const variantRadios = document.querySelectorAll("input[name='variant']");
const compact = document.getElementById("compact");
const onCard = document.getElementById("on-card");
const supportTip = document.getElementById("support-tip");

// CSS.supports() and @supports can't test a container query, so probe one: set a custom property on
// a parent, query it from a child, and check whether the child's style changed.
function supportsStyleQueries() {
  const style = document.createElement("style");
  style.textContent = "@container style(--sq-probe: 1) { .sq-probe-child { order: 7; } }";

  const parent = document.createElement("div");
  parent.style.setProperty("--sq-probe", "1");
  const child = document.createElement("div");
  child.className = "sq-probe-child";
  parent.append(child);

  document.head.append(style);
  document.body.append(parent);
  const supported = getComputedStyle(child).order === "7";
  style.remove();
  parent.remove();
  return supported;
}

const supported = supportsStyleQueries();

function currentVariant() {
  return document.querySelector("input[name='variant']:checked").value;
}

function update() {
  const variant = currentVariant();
  const target = onCard.checked ? plan : slot;

  // Clear both elements, then set the properties only on the chosen one. That's all the JS does.
  for (const element of [slot, plan]) {
    element.style.removeProperty("--variant");
    element.style.removeProperty("--density");
  }
  if (variant !== "none") target.style.setProperty("--variant", variant);
  if (compact.checked) target.style.setProperty("--density", "compact");

  const declarations = [];
  if (variant !== "none") declarations.push(`--variant: ${variant};`);
  if (compact.checked) declarations.push("--density: compact;");
  const selector = onCard.checked ? ".plan" : ".slot";
  const css = declarations.length
    ? `${selector} { ${declarations.join(" ")} }`
    : `/* No custom properties set */`;

  let note;
  if (!supported) {
    note = "Container style queries: not supported, so the default card is the fallback.";
  } else if (onCard.checked && declarations.length) {
    note =
      "The card's own border, background and padding don't change: .plan queries its parent (.slot),\n" +
      "where nothing is set. Elements inside the card (badge, price, note, button) do change,\n" +
      "because their containers are .plan and .plan-header.";
  } else if (declarations.length) {
    note = "Set on the parent, so the card and everything inside it match the queries.";
  } else {
    note = "No query matches, so the card shows its default styles.";
  }

  readout.textContent = `${css}\n\n${note}`;
}

if (!supported) {
  supportTip.hidden = false;
}

for (const radio of variantRadios) radio.addEventListener("change", update);
compact.addEventListener("change", update);
onCard.addEventListener("change", update);

update();
