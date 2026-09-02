import "./styles.css";

const input = document.getElementById("input");
const button = document.getElementById("encode");
const btoaResult = document.getElementById("btoa-result");
const nativeResult = document.getElementById("native-result");

function encodeWithBtoa(text) {
  try {
    // btoa() treats the string as one byte per character — any code point past 0xFF (which
    // includes é and ☕) throws, rather than encoding the text's actual UTF-8 bytes.
    return { ok: true, value: btoa(text) };
  } catch (error) {
    return { ok: false, value: error.message };
  }
}

function encodeWithUint8Array(text) {
  // Encode to real UTF-8 bytes first, THEN base64 those bytes — works for any text, always.
  const bytes = new TextEncoder().encode(text);
  const base64 = bytes.toBase64();
  const roundTrip = new TextDecoder().decode(Uint8Array.fromBase64(base64));
  return { base64, roundTrip, matches: roundTrip === text };
}

button.addEventListener("click", () => {
  const text = input.value;

  const btoaOutcome = encodeWithBtoa(text);
  console.log("btoa():", btoaOutcome);
  btoaResult.className = `result ${btoaOutcome.ok ? "success" : "error"}`;
  btoaResult.textContent = btoaOutcome.ok ? `btoa() → ${btoaOutcome.value}` : `btoa() threw: ${btoaOutcome.value}`;

  const nativeOutcome = encodeWithUint8Array(text);
  console.log("Uint8Array base64:", nativeOutcome);
  nativeResult.className = "result success";
  nativeResult.textContent = `toBase64() → ${nativeOutcome.base64}  (round-trip ${nativeOutcome.matches ? "✓ matches" : "✗ MISMATCH"})`;
});

button.click();
