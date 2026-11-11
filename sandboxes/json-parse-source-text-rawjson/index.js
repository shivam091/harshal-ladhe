import "./styles.css";

const input = document.getElementById("input");
const plainList = document.getElementById("plain");
const revivedList = document.getElementById("revived");
const output = document.getElementById("output");
const roundTrip = document.getElementById("round-trip");

const supported = typeof JSON.rawJSON === "function";
document.getElementById("support").hidden = supported;

// Large integers written as integers in the JSON become BigInt; everything else is left alone.
function reviveBigInts(key, value, context) {
  if (typeof value === "number" && !Number.isSafeInteger(value) && /^-?\d+$/.test(context?.source ?? "")) {
    return BigInt(context.source);
  }
  return value;
}

// Every BigInt is written back out as a plain JSON number, exactly.
function replaceBigInts(key, value) {
  return typeof value === "bigint" ? JSON.rawJSON(value.toString()) : value;
}

// Flattens a parsed value into [path, value] pairs, such as ["parentIds[0]", 18014398509481984].
function flatten(value, path = "") {
  if (value !== null && typeof value === "object" && !value.isSource) {
    return Object.entries(value).flatMap(([key, child]) =>
      flatten(child, Array.isArray(value) ? `${path}[${key}]` : path ? `${path}.${key}` : key)
    );
  }
  return [[path, value]];
}

// The source text of every number in the JSON, by path, read with the reviver's context.source.
function numberSources(json) {
  const tree = JSON.parse(json, (key, value, context) =>
    typeof value === "number" ? { isSource: true, text: context?.source } : value
  );
  return new Map(flatten(tree).filter(([, item]) => item?.isSource).map(([path, item]) => [path, item.text]));
}

function render(list, value, sources) {
  list.replaceChildren(
    ...flatten(value).map(([path, item]) => {
      const source = sources.get(path);
      const shown = typeof item === "bigint" ? `${item}n` : JSON.stringify(item);
      const lost = typeof item === "number" && /^-?\d+$/.test(source ?? "") && String(item) !== source;

      const li = document.createElement("li");
      li.className = lost ? "lost" : typeof item === "bigint" ? "exact" : "";
      li.append(
        Object.assign(document.createElement("span"), { className: "path", textContent: path }),
        Object.assign(document.createElement("span"), {
          className: "value",
          textContent: lost ? `${shown}   (sent ${source})` : shown
        })
      );
      return li;
    })
  );
}

function message(list, text, className = "") {
  list.replaceChildren(Object.assign(document.createElement("li"), { className, textContent: text }));
}

function parse() {
  const json = input.value;
  output.textContent = "";
  roundTrip.textContent = "";
  revivedList.replaceChildren();

  let plain;
  try {
    plain = JSON.parse(json);
  } catch (error) {
    message(plainList, error.message, "lost");
    return;
  }

  if (!supported) {
    render(plainList, plain, new Map());
    message(revivedList, "Not supported in this browser.");
    return;
  }

  const sourcesIn = numberSources(json);
  render(plainList, plain, sourcesIn);

  const revived = JSON.parse(json, reviveBigInts);
  console.log("Revived:", revived);
  render(revivedList, revived, sourcesIn);

  const text = JSON.stringify(revived, replaceBigInts);
  output.textContent = text;

  // Read the output's source text the same way, and compare every number with what was sent.
  const sourcesOut = numberSources(text);
  const changed = [...sourcesIn].filter(([path, source]) => sourcesOut.get(path) !== source);

  roundTrip.className = `status ${changed.length ? "lost" : "exact"}`;
  roundTrip.textContent = changed.length
    ? `Written differently: ${changed.map(([path, source]) => `${path} (${source} → ${sourcesOut.get(path)})`).join(", ")}`
    : "Every number was written back exactly as it was sent.";
}

document.getElementById("parse").addEventListener("click", parse);
parse();
