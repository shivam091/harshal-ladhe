import type { ShaderCompileError } from "@/components/ShaderPlayground/ShaderPlayground.types";

// ANGLE, Mesa, Apple and Firefox all report `ERROR: <source>:<line>: <message>` — by far the most common shape a browser hands back.
const COLON_FORMAT = /^\s*ERROR:\s*\d+:(\d+):\s*(.*)$/i;

// NVIDIA's native drivers (reachable when a browser skips ANGLE) use `<source>(<line>) : error C1234: <message>` instead.
const PAREN_FORMAT = /^\s*\d+\((\d+)\)\s*:\s*error\s*(?:[A-Z]\d+\s*:)?\s*(.*)$/i;

// An `ERROR:` with no line number at all — link failures and resource limits, which belong to the whole shader rather than any one line.
const LINELESS_FORMAT = /^\s*ERROR:\s*(.*)$/i;

// The summary line most drivers append ("2 compilation errors. No code generated.") repeats what the real entries already say, so it's dropped rather than shown as a third error.
const SUMMARY_LINE = /compilation errors?\.?\s*no code generated/i;

/*
  Turns a raw GL info log into line-numbered errors against the user's OWN source — every line
  number the driver reports counts the generated header too, so it's shifted back by that header's
  length. Anything landing outside the user's lines (a typo that only surfaces in the generated
  main() wrapper, say a missing mainImage) is kept but unanchored, so it still shows up in the
  error list rather than pointing a gutter marker at a line that doesn't exist. Kept free of any
  runtime imports so it can be exercised by a plain Node script without a bundler.
*/
export function parseShaderInfoLog(log: string, headerLineCount: number, userLineCount: number): ShaderCompileError[] {
  const errors: ShaderCompileError[] = [];
  const seen = new Set<string>();

  for (const rawLine of log.split(/\r?\n/)) {
    const text = rawLine.replace(/\0/g, "").trim();
    if (!text || SUMMARY_LINE.test(text) || /warning/i.test(text.slice(0, 24))) continue;

    let line: number | null = null;
    let message: string;
    const match = COLON_FORMAT.exec(text) ?? PAREN_FORMAT.exec(text);
    if (match) {
      const userLine = Number(match[1]) - headerLineCount;
      line = userLine >= 1 && userLine <= userLineCount ? userLine : null;
      message = match[2].trim();
    } else {
      const lineless = LINELESS_FORMAT.exec(text);
      message = (lineless ? lineless[1] : text).trim();
    }
    if (!message) continue;

    const key = `${line}:${message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    errors.push({ line, message });
  }

  return errors;
}
