import "./shared/playground.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);

const TEXT =
  "Version 1.5 shipped on 15 May. It fixes (c) notices in c++ and C++ files, matches *.js and *.ts globs, " +
  "and drops the price to $5.00 (was $15). Release 105 follows; see notes/1.5.md for details.";

const PRESETS = ["1.5", "c++", "(c)", "*.js", "$5.00", "(was"];

/*
  Patterns using the newer syntax are built with new RegExp() from strings, never written as regex literals. A
  literal with (?i:...) or a repeated group name is a syntax error in an engine that doesn't know it, and that would
  stop the whole script from running, including the feature detection below.
*/
const PATTERNS = [
  {
    label: "(?i:hello) World",
    source: "(?i:hello) World",
    flags: "",
    sample: "HELLO World",
    hint: "Only “hello” ignores case. Try “HELLO world”: the lowercase “w” doesn't match the capital W."
  },
  {
    label: "(?-i:Hello) world, with the i flag",
    source: "(?-i:Hello) world",
    flags: "i",
    sample: "Hello WORLD",
    hint: "The i flag makes the whole pattern case-insensitive, and (?-i:...) switches it off for “Hello”. Try “HELLO world”."
  },
  {
    label: "^(?m:total$)",
    source: "^(?m:total$)",
    flags: "",
    sample: "total\nsubtotal",
    hint: "Inside the group, $ is in multiline mode, so it matches at the end of the first line. Type \\n for a line break."
  },
  {
    label: "(?s:<b>.+</b>)",
    source: "(?s:<b>.+</b>)",
    flags: "",
    sample: "<b>bold\ntext</b>",
    hint: "With s (dotAll) on inside the group, . matches the line break too. Type \\n for a line break."
  },
  {
    label: "Dates as YYYY-MM or MM/YYYY (duplicate named groups)",
    source: "^(?:(?<year>\\d{4})-(?<month>\\d{2})|(?<month>\\d{2})/(?<year>\\d{4}))$",
    flags: "",
    sample: "06/2025",
    hint: "Both alternatives name their groups year and month, so match.groups has the same shape for either format. Try “2025-06”."
  }
];

const support = {
  escape: typeof RegExp.escape === "function",
  modifiers: canCompile("(?i:a)"),
  duplicateGroups: canCompile("(?<a>x)|(?<a>y)")
};

function canCompile(source) {
  try {
    new RegExp(source);
    return true;
  } catch {
    return false;
  }
}

// Splits the text around each match and wraps the matches in <mark>, using text nodes so nothing is parsed as HTML.
function highlight(regex) {
  const nodes = [];
  let last = 0;
  let count = 0;

  for (const match of TEXT.matchAll(regex)) {
    if (match[0] === "") continue; // an empty match has nothing to highlight
    nodes.push(document.createTextNode(TEXT.slice(last, match.index)));
    const mark = document.createElement("mark");
    mark.textContent = match[0];
    nodes.push(mark);
    last = match.index + match[0].length;
    count += 1;
  }

  nodes.push(document.createTextNode(TEXT.slice(last)));
  $("haystack").replaceChildren(...nodes);
  return count;
}

function runSearch() {
  const term = $("term").value;
  const escape = $("escape-toggle").checked && support.escape;
  const flags = $("case-toggle").checked ? "gi" : "g";

  if (term === "") {
    $("haystack").textContent = TEXT;
    $("search-readout").textContent = "Type a search term.";
    return;
  }

  const source = escape ? RegExp.escape(term) : term;
  const call = escape ? `new RegExp(RegExp.escape(${JSON.stringify(term)}), "${flags}")` : `new RegExp(${JSON.stringify(term)}, "${flags}")`;

  try {
    const regex = new RegExp(source, flags);
    const count = highlight(regex);
    $("search-readout").textContent = `${call}\npattern: /${regex.source}/${regex.flags}\n${count} match${count === 1 ? "" : "es"}`;
  } catch (error) {
    $("haystack").textContent = TEXT;
    $("search-readout").textContent = `${call}\nSyntaxError: ${error.message}`;
  }
}

// Lets "\n" typed into the one-line input stand for a real line break, so the multiline examples can be tried.
const decodeSubject = (value) => value.replaceAll("\\n", "\n");

function runPattern() {
  const pattern = PATTERNS[$("pattern-select").value];
  $("pattern-hint").textContent = pattern.hint;

  let regex;
  try {
    regex = new RegExp(pattern.source, pattern.flags);
  } catch (error) {
    $("pattern-readout").textContent = `SyntaxError: ${error.message}`;
    return;
  }

  const subject = decodeSubject($("subject").value);
  const match = regex.exec(subject);
  const lines = [`/${regex.source}/${regex.flags}`, `test string: ${JSON.stringify(subject)}`];

  if (!match) {
    lines.push("no match");
  } else {
    lines.push(`match: ${JSON.stringify(match[0])}`);
    if (match.groups) {
      lines.push(`groups: ${JSON.stringify({ ...match.groups })}`);
      const captures = match.slice(1).map((value) => (value === undefined ? "undefined" : JSON.stringify(value)));
      lines.push(`numbered captures: [${captures.join(", ")}]`);
    }
  }

  $("pattern-readout").textContent = lines.join("\n");
}

function selectPattern() {
  const pattern = PATTERNS[$("pattern-select").value];
  $("subject").value = pattern.sample.replaceAll("\n", "\\n");
  runPattern();
}

$("presets").replaceChildren(
  ...PRESETS.map((preset) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary-btn";
    button.textContent = preset;
    button.addEventListener("click", () => {
      $("term").value = preset;
      runSearch();
    });
    return button;
  })
);

$("pattern-select").replaceChildren(
  ...PATTERNS.map((pattern, index) => new Option(pattern.label, String(index)))
);

$("term").addEventListener("input", runSearch);
$("escape-toggle").addEventListener("change", runSearch);
$("case-toggle").addEventListener("change", runSearch);
$("pattern-select").addEventListener("change", selectPattern);
$("subject").addEventListener("input", runPattern);

// Missing features get the tip and disabled controls rather than a demo that quietly does something else.
if (!support.escape || !support.modifiers || !support.duplicateGroups) {
  $("support-tip").hidden = false;
}

if (!support.escape) {
  $("escape-toggle").checked = false;
  $("escape-toggle").disabled = true;
}

if (!support.modifiers || !support.duplicateGroups) {
  $("pattern-select").disabled = true;
  $("subject").disabled = true;
}

runSearch();
selectPattern();
