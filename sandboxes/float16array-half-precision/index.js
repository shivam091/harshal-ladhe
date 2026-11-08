import "./shared/playground.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);

const PRESETS = [
  { label: "Decimals", value: "0.1, 0.2, 0.3, 3.14159" },
  { label: "Integers past 2048", value: "2047, 2048, 2049, 2050, 2051, 4099" },
  { label: "Largest values", value: "65504, 65519, 65520, -70000" },
  { label: "Tiny values", value: "0.0001, 0.00006103515625, 0.00000006, 0.00000002" },
  { label: "Colour channels", value: "0, 0.25, 0.5, 0.7333, 1" }
];

const supported =
  typeof Float16Array === "function" &&
  typeof Math.f16round === "function" &&
  typeof DataView.prototype.getFloat16 === "function";

// One 2-byte view, reused to read a float16's raw bits and to step to its neighbour.
const view = new DataView(new ArrayBuffer(2));

function float16Bits(value) {
  view.setFloat16(0, value);
  return view.getUint16(0);
}

function float16FromBits(bits) {
  view.setUint16(0, bits);
  return view.getFloat16(0);
}

function parseNumbers(text) {
  return text
    .split(",")
    .map((token) => token.trim())
    .filter((token) => token !== "")
    .map(Number)
    .filter((value) => !Number.isNaN(value));
}

function formatError(input, stored) {
  if (!Number.isFinite(stored) && Number.isFinite(input)) return "overflow to ±Infinity";
  if (stored === 0 && input !== 0) return "underflow to 0";
  const error = Math.abs(stored - input);
  if (error === 0) return "exact";
  const relative = input === 0 ? "" : ` (${((error / Math.abs(input)) * 100).toPrecision(2)}%)`;
  return `${error.toPrecision(3)}${relative}`;
}

function cell(text, className) {
  const td = document.createElement("td");
  td.textContent = text;
  if (className) td.className = className;
  return td;
}

function render() {
  const values = parseNumbers($("numbers").value);

  // Writing into each array and reading back is the whole demo: the array rounds on the way in.
  const f64 = Float64Array.from(values);
  const f32 = Float32Array.from(values);
  const f16 = Float16Array.from(values);

  $("rows").replaceChildren(
    ...values.map((value, index) => {
      const tr = document.createElement("tr");
      const changed = (stored) => (Object.is(stored, value) ? "" : "changed");
      tr.append(
        cell(String(value)),
        cell(String(f64[index]), changed(f64[index])),
        cell(String(f32[index]), changed(f32[index])),
        cell(String(f16[index]), changed(f16[index])),
        cell(formatError(value, f16[index]))
      );
      return tr;
    })
  );

  $("bytes-64").textContent = `${f64.byteLength} B`;
  $("bytes-32").textContent = `${f32.byteLength} B`;
  $("bytes-16").textContent = `${f16.byteLength} B`;

  const previous = $("bits-select").value;
  $("bits-select").replaceChildren(
    ...values.map((value, index) => new Option(`${value} → ${f16[index]}`, String(index)))
  );
  if (previous && Number(previous) < values.length) $("bits-select").value = previous;

  renderBits(values);
}

function renderBits(values) {
  const index = Number($("bits-select").value);
  const value = values[index];

  if (value === undefined) {
    $("bits").replaceChildren();
    $("readout").textContent = "Enter at least one number.";
    return;
  }

  const bits = float16Bits(value);
  const binary = bits.toString(2).padStart(16, "0");

  $("bits").replaceChildren(
    ...[...binary].map((bit, position) => {
      const span = document.createElement("span");
      span.textContent = bit;
      span.className = position === 0 ? "bit bit--sign" : position < 6 ? "bit bit--exponent" : "bit bit--mantissa";
      return span;
    })
  );

  const sign = bits >> 15;
  const exponent = (bits >> 10) & 0b11111;
  const mantissa = bits & 0x3ff;
  const stored = float16FromBits(bits);
  const lines = [
    `Math.f16round(${value}) = ${stored}`,
    `bits: 0x${bits.toString(16).padStart(4, "0")}  sign ${sign}  exponent ${exponent.toString(2).padStart(5, "0")}  mantissa ${mantissa.toString(2).padStart(10, "0")}`
  ];

  if (exponent === 0b11111) {
    lines.push(mantissa === 0 ? "exponent all ones, mantissa 0: Infinity" : "exponent all ones, mantissa not 0: NaN");
  } else if (exponent === 0) {
    lines.push(`subnormal: (-1)^${sign} × 2^-14 × (${mantissa} / 1024)`);
  } else {
    lines.push(`normal: (-1)^${sign} × 2^(${exponent} - 15) × (1 + ${mantissa} / 1024)`);
  }

  if (Number.isFinite(stored)) {
    // The next float16 away from zero is one more in the raw bits (except at 65504, where it's Infinity).
    const next = float16FromBits((bits & 0x7fff) + 1);
    lines.push(
      Number.isFinite(next)
        ? `gap to the next float16: ${next - Math.abs(stored)}`
        : "this is the largest float16: the next step up is Infinity"
    );
  }

  $("readout").textContent = lines.join("\n");
}

$("presets").replaceChildren(
  ...PRESETS.map((preset) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary-btn";
    button.textContent = preset.label;
    button.addEventListener("click", () => {
      $("numbers").value = preset.value;
      $("bits-select").value = "";
      render();
    });
    return button;
  })
);

// Without Float16Array there's nothing to compare, so the controls are disabled and the reason is shown instead.
if (supported) {
  $("numbers").addEventListener("input", render);
  $("bits-select").addEventListener("change", () => renderBits(parseNumbers($("numbers").value)));
  render();
} else {
  $("support-tip").hidden = false;
  $("numbers").disabled = true;
  $("bits-select").disabled = true;
  $("presets").querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  $("readout").textContent = "Float16Array isn't available in this browser.";
}
