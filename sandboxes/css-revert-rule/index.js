import "./shared/playground.css";
import "./styles.css";

// Shorthand for looking an element up by id.
const $ = (id) => document.getElementById(id);
// Without this check, an unsupported browser would show 500 for "revert-rule" and look as though the keyword had worked.
const supported = CSS.supports("font-weight", "revert-rule");

// Spelled out beside the number, since a bare weight doesn't say which rule it came from.
const EXPLANATION = {
  unset: "unset: font-weight is inherited, so it takes the parent's 600.",
  initial: "initial: the property's initial value, normal (400).",
  revert: "revert: leaves the author origin altogether, so the browser's own heading style gives bold (700).",
  "revert-layer": "revert-layer: leaves the theme layer, so the base layer's 300 applies.",
  "revert-rule": "revert-rule: drops only this one rule, so the earlier theme rule's 500 applies."
};

// Derived from EXPLANATION so the comparison can never list a keyword that has no description.
const KEYWORDS = Object.keys(EXPLANATION);

// Mirrors styles.css so the reader sees the same rules the browser is resolving, in the order that makes the outcomes follow.
const STACK = [
  "Browser style: h4 { font-weight: bold }",
  "Layer base: .sample { font-weight: 300 }",
  "Layer theme: .sample { font-weight: 500 }",
  "Layer theme: [data-keyword] { font-weight: KEYWORD }"
];

$("support-tip").hidden = supported;

// The computed value, not the declared one, because the whole point is where the cascade ended up.
function weightOf(element) {
  return getComputedStyle(element).fontWeight;
}

// Only the last rule changes between choices, so the reader can see that the keyword alone moves the result.
function renderStack(keyword) {
  const items = STACK.map((line) => {
    const item = document.createElement("li");
    item.textContent = line.replace("KEYWORD", keyword);
    return item;
  });
  $("stack").replaceChildren(...items);
}

// The stack, the sample and the readout are updated together so the explanation never lags behind the number.
function update(keyword) {
  renderStack(keyword);
  $("sample").dataset.keyword = keyword;

  const lines = [
    `font-weight: ${keyword}`,
    `computed font-weight: ${weightOf($("sample"))}`,
    "",
    EXPLANATION[keyword]
  ];

  if (keyword === "revert-rule" && !supported) {
    lines.push("", "Not supported here: the declaration was dropped, so 500 is simply the earlier rule.");
  }

  $("readout").textContent = lines.join("\n");
}

// One row per keyword shows all five outcomes from a single stack, so the differences are visible without toggling.
function buildComparison() {
  const rows = KEYWORDS.map((keyword) => {
    const row = document.createElement("li");
    row.className = "compare-row";
    row.innerHTML = `<code class="compare-name"></code><h4 class="probe" data-keyword="${keyword}" aria-hidden="true">Aa</h4><span class="compare-weight"></span>`;
    row.querySelector(".compare-name").textContent = keyword;
    return row;
  });

  $("compare").replaceChildren(...rows);

  // The weight comes from CSS, so it can only be read once the rows are in the document.
  rows.forEach((row) => {
    row.querySelector(".compare-weight").textContent = weightOf(row.querySelector(".probe"));
  });
}

$("keyword").addEventListener("change", (event) => update(event.target.value));

buildComparison();
update($("keyword").value);
