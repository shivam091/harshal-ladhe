import "./shared/playground.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);
const supported = typeof Map.prototype.getOrInsertComputed === "function";

/*
  A Map that counts calls to its has/get/set methods. getOrInsert() and getOrInsertComputed() look the key up
  internally rather than calling these methods, so they're counted separately, as one call each.
*/
class CountingMap extends Map {
  constructor() {
    super();
    this.calls = 0;
  }

  has(key) {
    this.calls += 1;
    return super.has(key);
  }

  get(key) {
    this.calls += 1;
    return super.get(key);
  }

  set(key, value) {
    this.calls += 1;
    return super.set(key, value);
  }

  getOrInsert(key, value) {
    this.calls += 1;
    return super.getOrInsert(key, value);
  }

  getOrInsertComputed(key, callback) {
    this.calls += 1;
    return super.getOrInsertComputed(key, callback);
  }
}

const words = () => $("text-select").value.split(" ");
const groupKey = (word) => ($("group-select").value === "letter" ? word[0] : `${word.length} letters`);

// The three ways to build the same map of groups. Each receives a newArray() that counts how many arrays it creates.
const strategies = {
  classic(map, word, newArray) {
    const key = groupKey(word);
    if (!map.has(key)) {
      map.set(key, newArray());
    }
    map.get(key).push(word);
  },
  eager(map, word, newArray) {
    // The [] argument is evaluated on every call, whether the key exists or not.
    map.getOrInsert(groupKey(word), newArray()).push(word);
  },
  computed(map, word, newArray) {
    // The callback only runs when the key is missing.
    map.getOrInsertComputed(groupKey(word), () => newArray()).push(word);
  }
};

const labels = {
  classic: "has / set / get",
  eager: "getOrInsert(key, [])",
  computed: "getOrInsertComputed(key, () => [])"
};

function showMap(map) {
  const items = [...map].map(([key, value]) => {
    const li = document.createElement("li");
    const keyEl = document.createElement("span");
    keyEl.className = "key";
    keyEl.textContent = typeof key === "string" ? JSON.stringify(key) : String(key);
    li.append(keyEl, ` => ${Array.isArray(value) ? `[${value.join(", ")}]` : value}`);
    return li;
  });
  $("entries").replaceChildren(...items);
  $("empty").hidden = items.length > 0;
}

function runGrouping(name) {
  const map = new CountingMap();
  const list = words();
  let arrays = 0;
  const newArray = () => {
    arrays += 1;
    return [];
  };

  for (const word of list) strategies[name](map, word, newArray);

  showMap(map);
  $("readout").textContent = [
    labels[name],
    `words:            ${list.length}`,
    `groups:           ${map.size}`,
    `map method calls: ${map.calls}`,
    `arrays created:   ${arrays}${arrays > map.size ? `  (${arrays - map.size} thrown away)` : ""}`
  ].join("\n");
}

function runCount() {
  const map = new CountingMap();
  const list = words();

  for (const word of list) {
    map.set(word, map.getOrInsert(word, 0) + 1);
  }

  // Most frequent first, so the repeated words are easy to spot.
  showMap(new Map([...map].sort((a, b) => b[1] - a[1])));
  $("readout").textContent = [
    "map.set(word, map.getOrInsert(word, 0) + 1)",
    `words:            ${list.length}`,
    `distinct words:   ${map.size}`,
    `map method calls: ${map.calls}  (one getOrInsert and one set per word)`
  ].join("\n");
}

$("classic-btn").addEventListener("click", () => runGrouping("classic"));
$("eager-btn").addEventListener("click", () => runGrouping("eager"));
$("computed-btn").addEventListener("click", () => runGrouping("computed"));
$("count-btn").addEventListener("click", runCount);

// Without the upsert methods, only the classic version can run, so the other buttons are disabled.
if (!supported) {
  $("support-tip").hidden = false;
  for (const button of document.querySelectorAll(".native")) button.disabled = true;
}
