import type { RegexTesterEditorState } from "@/interfaces/regex-tester";

// Escapes only the delimiter a JS regex LITERAL would otherwise terminate on early — an unescaped '/' not already preceded by its own backslash.
function escapeForJsLiteral(pattern: string): string {
  let result = "";
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (c === "/" && pattern[i - 1] !== "\\") result += "\\/";
    else result += c;
  }
  return result;
}

// Renders the pattern as a native JS regex literal, e.g. `/foo/gi`.
export function toJavaScript(state: RegexTesterEditorState): string {
  return `/${escapeForJsLiteral(state.pattern)}/${state.flags}`;
}

/*
  Python's own `re` flags don't map 1:1 onto JS's — there's no equivalent to JS's 'g' (every re
  function already searches globally via findall/finditer) or 'y' (sticky), so only i/m/s translate;
  the rest are silently dropped rather than guessed at. Uses a raw string (r"...") specifically so
  the pattern's own backslashes (`\d`, `\s`, ...) don't need doubling.
*/
export function toPython(state: RegexTesterEditorState): string {
  const flagNames: string[] = [];
  if (state.flags.includes("i")) flagNames.push("re.IGNORECASE");
  if (state.flags.includes("m")) flagNames.push("re.MULTILINE");
  if (state.flags.includes("s")) flagNames.push("re.DOTALL");

  const escapedPattern = state.pattern.replace(/"/g, '\\"');
  const flagsArg = flagNames.length > 0 ? `, ${flagNames.join(" | ")}` : "";
  return `import re\n\npattern = re.compile(r"${escapedPattern}"${flagsArg})`;
}

/*
  Java string literals aren't raw — a pattern's own backslashes must be doubled before the literal's
  own quotes are escaped, otherwise a newly-inserted escaping backslash would itself need escaping.
*/
function escapeForJavaString(pattern: string): string {
  return pattern.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// Same best-effort flag translation as toPython — Java's Pattern flags cover i/m/s, nothing else.
export function toJava(state: RegexTesterEditorState): string {
  const flagNames: string[] = [];
  if (state.flags.includes("i")) flagNames.push("Pattern.CASE_INSENSITIVE");
  if (state.flags.includes("m")) flagNames.push("Pattern.MULTILINE");
  if (state.flags.includes("s")) flagNames.push("Pattern.DOTALL");

  const escapedPattern = escapeForJavaString(state.pattern);
  const flagsArg = flagNames.length > 0 ? `, ${flagNames.join(" | ")}` : "";
  return `Pattern pattern = Pattern.compile("${escapedPattern}"${flagsArg});`;
}
