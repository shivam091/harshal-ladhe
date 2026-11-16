import "./shared/playground.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);

const article = $("article");
const query = $("query");
const caseToggle = $("case-toggle");
const editToggle = $("edit-toggle");
const prevBtn = $("prev-btn");
const nextBtn = $("next-btn");
const matchCount = $("match-count");
const readout = $("readout");

// Each block is searched as one string, so a match can span inline elements (<strong>, <em>, <a>) but never two paragraphs.
const BLOCKS = "h2, p, li";

const supported = typeof CSS !== "undefined" && "highlights" in CSS && typeof Highlight === "function";

// RegExp.escape() is ES2025; the fallback escapes the same syntax characters for older browsers.
// Plain check instead of `??`: Sandpack's bundler doesn't parse nullish coalescing.
const escapeRegExp = typeof RegExp.escape === "function"
  ? RegExp.escape
  : (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let matches = [];
let current = -1;

// Every text node inside an element, in document order.
function textNodesIn(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}

// Turns an offset in the block's joined text back into a (text node, offset) boundary point.
function locate(nodes, starts, index, isEnd) {
  for (let i = nodes.length - 1; i >= 0; i--) {
    // An end offset that falls exactly between two nodes belongs to the earlier one, a start offset to the later one.
    if (isEnd ? starts[i] < index : starts[i] <= index) {
      return { node: nodes[i], offset: index - starts[i] };
    }
  }
  return { node: nodes[0], offset: 0 };
}

function findMatches(text, caseSensitive) {
  const found = [];
  if (!text) return found;

  const pattern = new RegExp(escapeRegExp(text), caseSensitive ? "g" : "gi");

  for (const block of article.querySelectorAll(BLOCKS)) {
    const nodes = textNodesIn(block);
    const starts = [];
    let joined = "";

    for (const node of nodes) {
      starts.push(joined.length);
      joined += node.data;
    }

    for (const match of joined.matchAll(pattern)) {
      const start = locate(nodes, starts, match.index, false);
      const end = locate(nodes, starts, match.index + match[0].length, true);

      // StaticRange is cheap: the browser doesn't track it through DOM changes. We rebuild them on every edit instead.
      found.push(new StaticRange({
        startContainer: start.node,
        startOffset: start.offset,
        endContainer: end.node,
        endOffset: end.offset
      }));
    }
  }

  return found;
}

// A live Range over the same text, used only to measure where the current match is on screen.
function toLiveRange(staticRange) {
  const range = document.createRange();
  range.setStart(staticRange.startContainer, staticRange.startOffset);
  range.setEnd(staticRange.endContainer, staticRange.endOffset);
  return range;
}

function scrollIntoArticle(staticRange) {
  const rect = toLiveRange(staticRange).getBoundingClientRect();
  const box = article.getBoundingClientRect();

  if (rect.top < box.top || rect.bottom > box.bottom) {
    article.scrollTop += rect.top - box.top - box.height / 2 + rect.height / 2;
  }
}

function render(results, currentHighlight) {
  const hasMatches = matches.length > 0;
  prevBtn.disabled = !hasMatches;
  nextBtn.disabled = !hasMatches;

  if (!query.value) {
    matchCount.textContent = "";
    readout.textContent = "Type something to search.";
    return;
  }

  matchCount.textContent = hasMatches
    ? `Match ${current + 1} of ${matches.length}`
    : "No matches";

  readout.textContent = [
    `search: "${query.value}" (${caseToggle.checked ? "case-sensitive" : "case-insensitive"})`,
    `CSS.highlights.get("search-results"): ${results.size} range(s), priority ${results.priority}`,
    `CSS.highlights.get("search-current"): ${currentHighlight.size} range(s), priority ${currentHighlight.priority}`,
    `<mark> elements added to the article: ${article.querySelectorAll("mark").length}`
  ].join("\n");
}

if (!supported) {
  $("support-tip").hidden = false;
  for (const control of [query, caseToggle, editToggle, prevBtn, nextBtn]) control.disabled = true;
  readout.textContent = "CSS.highlights is not available in this browser.";
} else {
  // Register both highlights once; after that, adding and removing ranges is enough to repaint.
  const results = new Highlight();
  const currentHighlight = new Highlight();
  currentHighlight.priority = 1; // paints above search-results where they overlap

  CSS.highlights.set("search-results", results);
  CSS.highlights.set("search-current", currentHighlight);

  const showCurrent = (scroll) => {
    currentHighlight.clear();
    if (current >= 0) {
      currentHighlight.add(matches[current]);
      if (scroll) scrollIntoArticle(matches[current]);
    }
    render(results, currentHighlight);
  };

  const search = ({ keepPosition = false } = {}) => {
    matches = findMatches(query.value, caseToggle.checked);

    results.clear();
    for (const range of matches) results.add(range);

    if (!matches.length) current = -1;
    else if (!keepPosition || current < 0) current = 0;
    else current = Math.min(current, matches.length - 1);

    // Don't scroll the article out from under the caret while someone is editing it.
    showCurrent(!keepPosition);
  };

  const step = (direction) => {
    if (!matches.length) return;
    current = (current + direction + matches.length) % matches.length;
    showCurrent(true);
  };

  query.addEventListener("input", () => search());
  caseToggle.addEventListener("change", () => search());
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));

  query.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    step(event.shiftKey ? -1 : 1);
  });

  editToggle.addEventListener("change", () => {
    article.contentEditable = editToggle.checked ? "true" : "false";
    if (editToggle.checked) article.focus();
  });

  // Editing can split, merge or remove text nodes, which leaves StaticRanges pointing at stale offsets: recompute them.
  article.addEventListener("input", () => search({ keepPosition: true }));

  search();
}
