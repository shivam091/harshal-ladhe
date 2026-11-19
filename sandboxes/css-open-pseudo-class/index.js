import "./shared/playground.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);
const dialog = $("demo-dialog");
const select = $("size-select");

const supportsOpen = CSS.supports("selector(:open)");
const supportsBaseSelect = CSS.supports("appearance", "base-select");

$("support-tip").hidden = supportsOpen;

// The select's arrow only exists as ::picker-icon in a customisable select, so the class opts in only where that works.
if (supportsBaseSelect) {
  select.classList.add("is-custom");
  $("select-hint").innerHTML = "Drop the list down: <code>select:open</code> changes the border and <code>select:open::picker-icon</code> turns the arrow.";
}

const WATCHED = [
  { label: '<details> "Shipping"', element: $("details-shipping") },
  { label: '<details> "Returns"', element: $("details-returns") },
  { label: '<details> "Warranty"', element: $("details-warranty") },
  { label: "<dialog>", element: dialog },
  { label: "<select>", element: select }
];

// matches() throws a SyntaxError for a selector the browser doesn't know, so an unsupported :open returns null.
function safeMatches(element, selector) {
  try {
    return element.matches(selector);
  } catch (error) {
    // Named binding instead of a bare `catch {`: Sandpack's bundler may not parse optional catch binding.
    return null;
  }
}

function describe() {
  const selector = supportsOpen ? ":open" : "[open]";
  const open = WATCHED.filter(({ element }) => safeMatches(element, selector));
  const lines = [`Elements matching ${selector}:`];

  if (open.length === 0) {
    lines.push("  (none)");
  } else {
    for (const { label, element } of open) {
      const extra = element === dialog && safeMatches(dialog, ":modal") ? "  (also :modal)" : "";
      lines.push(`  ${label}${extra}`);
    }
  }

  if (!supportsOpen) {
    lines.push("", "Without :open, there's no selector that tells whether the select's list is open.");
  }

  return lines.join("\n");
}

function describeDialog() {
  const open = safeMatches(dialog, ":open");
  const modal = safeMatches(dialog, ":modal");
  const show = (value) => (value === null ? "unsupported" : String(value));
  return `dialog.matches(":open")  → ${show(open)}\ndialog.matches(":modal") → ${show(modal)}`;
}

/*
  A select doesn't fire an event when its list opens or closes, so the readout checks every 150ms and only
  writes when something changed, which keeps the live region quiet in between.
*/
let last = "";
function refresh() {
  const text = describe();
  if (text !== last) {
    last = text;
    $("readout").textContent = text;
    $("dialog-state").textContent = describeDialog();
  }
}

// showModal() throws on a dialog that's already open, so a non-modal one is closed first.
$("open-modal").addEventListener("click", () => {
  if (dialog.open) dialog.close();
  dialog.showModal();
  refresh();
});

$("open-dialog").addEventListener("click", () => {
  if (!dialog.open) dialog.show();
  refresh();
});

dialog.addEventListener("close", refresh);
document.querySelectorAll("details").forEach((details) => details.addEventListener("toggle", refresh));
setInterval(refresh, 150);
refresh();
