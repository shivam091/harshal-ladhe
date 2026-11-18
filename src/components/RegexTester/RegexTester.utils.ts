import type { ExplainNode, HighlightSegment, RegexMatch, RegexResult, RegexTesterEditorState } from "@/components/RegexTester/RegexTester.types";

// Compiling a pattern never backtracks, so this is safe to call on every keystroke on the main thread — only matching needs the worker.
export function validateRegex(pattern: string, flags: string): string | null {
  try {
    new RegExp(pattern, flags);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Invalid regular expression";
  }
}

// Hard cap on rendered matches — a pathological pattern/input pair can still match thousands of times; capping keeps the match list and highlighted view from choking the DOM.
const MAX_MATCHES = 500;

/*
  Runs `pattern`/`flags` against `testString` and returns every match plus its capture groups —
  or, without the 'g' flag, only the first one, exactly as String.prototype.match/RegExp.exec would.
  The global case uses String.prototype.matchAll, which (unlike a hand-rolled exec()/lastIndex loop)
  advances past zero-length matches on its own, so there's no risk of an infinite loop. Sticky ('y')
  needs no special handling: without 'g' exec only tries position 0, and with it matchAll stops at
  the first gap.
*/
export function runRegex(pattern: string, flags: string, testString: string): RegexResult {
  try {
    const regex = new RegExp(pattern, flags);
    // An empty pattern matches at every position, which only buries the preview in empty-match markers — treat it as "nothing typed yet".
    if (pattern === "") return { valid: true, error: null, matches: [], truncated: false };
    const found = regex.global ? testString.matchAll(regex) : [regex.exec(testString)].filter((m): m is RegExpExecArray => m !== null);
    const matches: RegexMatch[] = [];
    let truncated = false;

    for (const m of found) {
      if (matches.length >= MAX_MATCHES) {
        truncated = true;
        break;
      }
      const numberedGroups = Array.from(m).slice(1);
      const namedGroups = m.groups ? Object.entries(m.groups).map(([name, value]) => ({ name, value })) : [];
      matches.push({ index: m.index ?? 0, match: m[0], numberedGroups, namedGroups });
    }

    return { valid: true, error: null, matches, truncated };
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : "Invalid regular expression", matches: [], truncated: false };
  }
}

// Splits `testString` into matched/unmatched runs for the highlighted preview — a single pass over the already-sorted match list (matchAll yields matches in order). A zero-length match (`\b`, `x*` between letters) becomes an empty matched run, so the preview can still mark where it landed.
export function buildHighlightSegments(testString: string, matches: RegexMatch[]): HighlightSegment[] {
  const segments: HighlightSegment[] = [];
  let cursor = 0;

  matches.forEach((m, matchIndex) => {
    if (m.index > cursor) segments.push({ text: testString.slice(cursor, m.index), matched: false });
    segments.push({ text: m.match, matched: true, matchIndex });
    cursor = Math.max(cursor, m.index + m.match.length);
  });

  if (cursor < testString.length) segments.push({ text: testString.slice(cursor), matched: false });
  return segments;
}

// Shorthand-class descriptions shared between a bare `\d`-style escape and the same escape appearing inside a `[...]` character class.
const SHORTHAND_CLASS: Record<string, string> = {
  "\\d": "any digit",
  "\\D": "any non-digit",
  "\\w": "any word character",
  "\\W": "any non-word character",
  "\\s": "any whitespace character",
  "\\S": "any non-whitespace character",
  "\\n": "newline",
  "\\t": "tab",
  "\\r": "carriage return"
};

// Plain-English readout for every single-letter escape this parser recognizes outside a character class (`\d`, `\b`, `\n`, ...); anything not listed here falls back to "the literal character".
const ESCAPE_DESCRIPTIONS: Record<string, string> = {
  d: "any digit (0-9)",
  D: "any character that is not a digit",
  w: "any word character (letter, digit, underscore)",
  W: "any character that is not a word character",
  s: "any whitespace character",
  S: "any character that is not whitespace",
  b: "a word boundary",
  B: "a position that is not a word boundary",
  n: "a newline character",
  t: "a tab character",
  r: "a carriage return character",
  "0": "a NUL character"
};

/*
  A minimal recursive-descent parser over a regex source string, built specifically to explain (not
  execute) a pattern — grammar roughly: Alternation := Sequence ('|' Sequence)*, Sequence :=
  Quantified*, Quantified := Atom Quantifier?, Atom := Group | CharClass | Anchor | Escape | Literal.
  Every parse method records its own start position and slices the exact consumed substring for
  `token`, rather than reconstructing strings by hand, so a node's token can never drift from what
  it actually covers. Assumes the caller has already validated `pattern` with `new RegExp(...)` —
  this parser does not need to defend against malformed input (unmatched parens, dangling
  quantifiers) since the native constructor already rejects those before this ever runs.
*/
class RegexParser {
  private pos = 0;
  private groupCount = 0;
  private idCounter = 0;

  constructor(
    private readonly source: string,
    private readonly flags: string
  ) {}

  private hasFlag(flag: string): boolean {
    return this.flags.includes(flag);
  }

  private peek(offset = 0): string | undefined {
    return this.source[this.pos + offset];
  }

  private advance(): string {
    return this.source[this.pos++];
  }

  private eof(): boolean {
    return this.pos >= this.source.length;
  }

  private slice(start: number): string {
    return this.source.slice(start, this.pos);
  }

  private nextId(): string {
    return `regex-node-${this.idCounter++}`;
  }

  parse(): ExplainNode[] {
    return this.parseAlternation();
  }

  private parseAlternation(): ExplainNode[] {
    const branches: ExplainNode[][] = [this.parseSequence()];
    while (this.peek() === "|") {
      this.advance();
      branches.push(this.parseSequence());
    }
    if (branches.length === 1) return branches[0];

    const options = branches.map((branch, i) => ({ id: this.nextId(), token: "", description: `Option ${i + 1}`, children: branch }));
    return [{ id: this.nextId(), token: "", description: `matches one of ${branches.length} alternatives`, children: options }];
  }

  private parseSequence(): ExplainNode[] {
    const nodes: ExplainNode[] = [];
    while (!this.eof() && this.peek() !== "|" && this.peek() !== ")") {
      nodes.push(this.parseQuantified());
    }
    return nodes;
  }

  private parseQuantified(): ExplainNode {
    const atom = this.parseAtom();
    const quantifier = this.tryParseQuantifier();
    if (!quantifier) return atom;
    return { id: this.nextId(), token: atom.token + quantifier.token, description: quantifier.description, children: [atom] };
  }

  private parseAtom(): ExplainNode {
    const c = this.peek();
    if (c === "(") return this.parseGroup();
    if (c === "[") return this.parseCharClass();

    const start = this.pos;
    if (c === ".") {
      this.advance();
      return { id: this.nextId(), token: this.slice(start), description: this.hasFlag("s") ? "any character, including line terminators (dotAll mode)" : "any character except line terminators" };
    }
    if (c === "^") {
      this.advance();
      return { id: this.nextId(), token: this.slice(start), description: this.hasFlag("m") ? "start of a line (multiline mode)" : "start of the string" };
    }
    if (c === "$") {
      this.advance();
      return { id: this.nextId(), token: this.slice(start), description: this.hasFlag("m") ? "end of a line (multiline mode)" : "end of the string" };
    }
    if (c === "\\") return this.parseEscape();

    this.advance();
    return { id: this.nextId(), token: this.slice(start), description: `the character "${c}"` };
  }

  private parseGroup(): ExplainNode {
    const start = this.pos;
    this.advance(); // '('

    let kind: "capturing" | "named-capturing" | "non-capturing" | "lookahead" | "negative-lookahead" | "lookbehind" | "negative-lookbehind" = "capturing";
    let name: string | null = null;

    if (this.peek() === "?") {
      if (this.peek(1) === ":") {
        this.advance();
        this.advance();
        kind = "non-capturing";
      } else if (this.peek(1) === "=") {
        this.advance();
        this.advance();
        kind = "lookahead";
      } else if (this.peek(1) === "!") {
        this.advance();
        this.advance();
        kind = "negative-lookahead";
      } else if (this.peek(1) === "<" && this.peek(2) === "=") {
        this.advance();
        this.advance();
        this.advance();
        kind = "lookbehind";
      } else if (this.peek(1) === "<" && this.peek(2) === "!") {
        this.advance();
        this.advance();
        this.advance();
        kind = "negative-lookbehind";
      } else if (this.peek(1) === "<") {
        this.advance();
        this.advance();
        let n = "";
        while (this.peek() !== ">" && !this.eof()) n += this.advance();
        this.advance(); // '>'
        kind = "named-capturing";
        name = n;
      }
    }

    const groupNumber = kind === "capturing" || kind === "named-capturing" ? ++this.groupCount : null;
    const children = this.parseAlternation();
    if (this.peek() === ")") this.advance();
    const token = this.slice(start);

    const description = (() => {
      switch (kind) {
        case "capturing":
          return `capturing group #${groupNumber}`;
        case "named-capturing":
          return `capturing group #${groupNumber}, named "${name}"`;
        case "non-capturing":
          return "a non-capturing group";
        case "lookahead":
          return "positive lookahead — must be followed by";
        case "negative-lookahead":
          return "negative lookahead — must NOT be followed by";
        case "lookbehind":
          return "positive lookbehind — must be preceded by";
        case "negative-lookbehind":
          return "negative lookbehind — must NOT be preceded by";
      }
    })();

    return { id: this.nextId(), token, description, children };
  }

  private parseCharClass(): ExplainNode {
    const start = this.pos;
    this.advance(); // '['
    let negated = false;
    if (this.peek() === "^") {
      negated = true;
      this.advance();
    }

    // JavaScript has no "leading ] is literal" rule (that's PCRE): `[]` matches nothing and `[^]` matches any character at all.
    const parts: string[] = [];
    while (!this.eof() && this.peek() !== "]") {
      const first = this.readClassMember();
      if (this.peek() === "-" && this.peek(1) !== "]" && this.peek(1) !== undefined) {
        this.advance(); // '-'
        const last = this.readClassMember();
        parts.push(`${first.label} to ${last.label}`);
      } else {
        parts.push(first.label);
      }
    }
    if (this.peek() === "]") this.advance();

    const token = this.slice(start);
    if (parts.length === 0) return { id: this.nextId(), token, description: negated ? "any single character, including line terminators" : "nothing — an empty set can never match" };
    const description = `${negated ? "any character NOT" : "any character"} in the set: ${parts.join(", ")}`;
    return { id: this.nextId(), token, description };
  }

  // One member of a character class — a plain character, or a whole escape such as `\u0041`, `\x41`, `\p{L}` or `\cJ`, which must be consumed as a unit so it can also be either end of a range.
  private readClassMember(): { label: string } {
    if (this.peek() !== "\\") return { label: `"${this.advance()}"` };
    const start = this.pos;
    this.advance(); // backslash
    const c = this.advance();
    if (c === "u" && this.peek() === "{") {
      while (!this.eof() && this.advance() !== "}");
    } else if (c === "u") {
      for (let i = 0; i < 4 && /[0-9a-fA-F]/.test(this.peek() ?? ""); i++) this.advance();
    } else if (c === "x") {
      for (let i = 0; i < 2 && /[0-9a-fA-F]/.test(this.peek() ?? ""); i++) this.advance();
    } else if ((c === "p" || c === "P") && this.peek() === "{") {
      while (!this.eof() && this.advance() !== "}");
    } else if (c === "c" && /[a-zA-Z]/.test(this.peek() ?? "")) {
      this.advance();
    }
    const escape = this.slice(start);
    if (escape === "\\b") return { label: "backspace" };
    if (SHORTHAND_CLASS[escape]) return { label: SHORTHAND_CLASS[escape] };
    if (/^\\u\{?[0-9a-fA-F]+\}?$/.test(escape)) return { label: `U+${escape.replace(/[^0-9a-fA-F]/g, "").replace(/^u/, "").toUpperCase()}` };
    if (/^\\x[0-9a-fA-F]{2}$/.test(escape)) return { label: `hex 0x${escape.slice(2).toUpperCase()}` };
    if (/^\\[pP]\{/.test(escape)) return { label: `${escape[1] === "P" ? "not " : ""}Unicode property "${escape.slice(3, -1)}"` };
    if (/^\\c[a-zA-Z]$/.test(escape)) return { label: `Ctrl+${escape[2].toUpperCase()}` };
    return { label: `"${escape.slice(1)}"` };
  }

  private parseEscape(): ExplainNode {
    const start = this.pos;
    this.advance(); // backslash
    const c = this.advance();

    if (/[1-9]/.test(c)) {
      let numStr = c;
      while (/[0-9]/.test(this.peek() ?? "")) numStr += this.advance();
      return { id: this.nextId(), token: this.slice(start), description: `a backreference to capturing group #${numStr}` };
    }

    if (c === "k" && this.peek() === "<") {
      this.advance();
      let name = "";
      while (this.peek() !== ">" && !this.eof()) name += this.advance();
      this.advance();
      return { id: this.nextId(), token: this.slice(start), description: `a backreference to the named group "${name}"` };
    }

    if ((c === "p" || c === "P") && this.peek() === "{") {
      this.advance();
      let name = "";
      while (this.peek() !== "}" && !this.eof()) name += this.advance();
      this.advance();
      return { id: this.nextId(), token: this.slice(start), description: `${c === "P" ? "any character NOT" : "any character"} matching the Unicode property "${name}"` };
    }

    if (c === "u") {
      let hex = "";
      if (this.peek() === "{") {
        this.advance();
        while (this.peek() !== "}" && !this.eof()) hex += this.advance();
        this.advance();
      } else {
        for (let i = 0; i < 4 && /[0-9a-fA-F]/.test(this.peek() ?? ""); i++) hex += this.advance();
      }
      return { id: this.nextId(), token: this.slice(start), description: `the unicode character U+${hex.toUpperCase()}` };
    }

    if (c === "x") {
      let hex = "";
      for (let i = 0; i < 2 && /[0-9a-fA-F]/.test(this.peek() ?? ""); i++) hex += this.advance();
      return { id: this.nextId(), token: this.slice(start), description: `the character with hex code 0x${hex.toUpperCase()}` };
    }

    if (c === "c" && /[a-zA-Z]/.test(this.peek() ?? "")) {
      const letter = this.advance();
      return { id: this.nextId(), token: this.slice(start), description: `the control character Ctrl+${letter.toUpperCase()}` };
    }

    if (c in ESCAPE_DESCRIPTIONS) return { id: this.nextId(), token: this.slice(start), description: ESCAPE_DESCRIPTIONS[c] };
    return { id: this.nextId(), token: this.slice(start), description: `the literal character "${c}"` };
  }

  private tryParseQuantifier(): { token: string; description: string } | null {
    const c = this.peek();
    const start = this.pos;

    const finish = (greedyDescription: string, lazyDescription: string) => {
      let lazy = false;
      if (this.peek() === "?") {
        this.advance();
        lazy = true;
      }
      return { token: this.slice(start), description: lazy ? lazyDescription : greedyDescription };
    };

    if (c === "*") {
      this.advance();
      return finish("zero or more of (greedy)", "zero or more of (lazy)");
    }
    if (c === "+") {
      this.advance();
      return finish("one or more of (greedy)", "one or more of (lazy)");
    }
    if (c === "?") {
      this.advance();
      return finish("zero or one of (optional, greedy)", "zero or one of (optional, lazy)");
    }
    if (c === "{") {
      const save = this.pos;
      this.advance();
      let a = "";
      while (/[0-9]/.test(this.peek() ?? "")) a += this.advance();
      let b: string | null = null;
      if (this.peek() === ",") {
        this.advance();
        b = "";
        while (/[0-9]/.test(this.peek() ?? "")) b += this.advance();
      }
      if (this.peek() === "}" && a !== "") {
        this.advance();
        const desc = b === null ? `exactly ${a} of` : b === "" ? `${a} or more of` : `between ${a} and ${b} of`;
        return finish(`${desc} (greedy)`, `${desc} (lazy)`);
      }
      // Not a valid `{...}` quantifier after all (e.g. a literal "{" with no matching form) — back off and let the caller treat it as a plain atom instead.
      this.pos = save;
      return null;
    }
    return null;
  }
}

// Assumes `pattern` already passed `new RegExp(pattern, flags)` — call sites validate first and fall back to an error message instead of calling this on malformed input.
export function explainRegex(pattern: string, flags: string): ExplainNode[] {
  return new RegexParser(pattern, flags).parse();
}

/*
  The browser's own `RegExp.prototype.source` is already escaped for a literal — every "/" that needs
  it, newlines as \n, and an empty pattern as "(?:)" — whereas hand-escaping missed "\\/" (an escaped
  backslash then a slash) and exported an empty pattern as "//", which is a comment, not a regex.
  Falls back to the raw text only for a pattern the browser rejects, which the UI already flags.
*/
function escapeForJsLiteral(pattern: string, flags: string): string {
  try {
    return new RegExp(pattern, flags).source;
  } catch {
    return pattern || "(?:)";
  }
}

// Renders the pattern as a native JS regex literal, e.g. `/foo/gi`.
export function toJavaScript(state: RegexTesterEditorState): string {
  return `/${escapeForJsLiteral(state.pattern, state.flags)}/${state.flags}`;
}

/*
  Ruby's ^ and $ always match at line breaks, so without JS's 'm' they'd match more than the tester
  showed — swapping them for \A and \z keeps a whole-string anchor whole-string. Escapes and
  character classes are skipped so `\^` and a negated `[^...]` keep their own meaning.
*/
function toRubyAnchors(source: string): string {
  let result = "";
  let inClass = false;
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (c === "\\") {
      result += c + (source[i + 1] ?? "");
      i++;
    } else if (inClass) {
      if (c === "]") inClass = false;
      result += c;
    } else if (c === "[") {
      inClass = true;
      result += c;
    } else if (c === "^") {
      result += "\\A";
    } else if (c === "$") {
      result += "\\z";
    } else {
      result += c;
    }
  }
  return result;
}

/*
  A Ruby literal shares JS's `/.../` shape and its named-group, backreference, \p{...} and \u{...}
  syntax, so only the flags and anchors need translating. The flags don't line up by letter: Ruby's
  'm' is JS's 's' (dot matches newlines), while JS's 'm' is already Ruby's default anchor behaviour;
  'g'/'y'/'d'/'u'/'v' have no Ruby flag, the same best-effort drop as toPython. `#{`, `#@` and `#$`
  are escaped because a Ruby regex literal interpolates them like a double-quoted string.
*/
export function toRuby(state: RegexTesterEditorState): string {
  const source = escapeForJsLiteral(state.pattern, state.flags);
  const anchored = state.flags.includes("m") ? source : toRubyAnchors(source);
  const escaped = anchored.replace(/(?<=(?:^|[^\\])(?:\\\\)*)#(?=[{@$])/g, "\\#");
  const flags = `${state.flags.includes("i") ? "i" : ""}${state.flags.includes("s") ? "m" : ""}`;
  return `pattern = /${escaped}/${flags}`;
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

  // Python spells named groups (?P<name>...) and backreferences (?P=name) — JS's (?<name>...) and \k<name> don't compile in `re`. The lookbehind leaves an escaped literal paren (`\(?<`) alone.
  const pythonPattern = state.pattern
    .replace(/(?<=(?:^|[^\\])(?:\\\\)*)\(\?<(?![=!])/g, "(?P<")
    .replace(/(?<=(?:^|[^\\])(?:\\\\)*)\\k<([A-Za-z_][A-Za-z0-9_]*)>/g, "(?P=$1)");
  const escapedPattern = pythonPattern.replace(/"/g, '\\"');
  const flagsArg = flagNames.length > 0 ? `, ${flagNames.join(" | ")}` : "";
  const notes = pythonNotes(state.pattern);
  return `import re\n\n${notes}pattern = re.compile(r"${escapedPattern}"${flagsArg})`;
}

// JS-only syntax `re` can't compile — flagged in the export rather than silently producing code that throws.
function pythonNotes(pattern: string): string {
  const notes: string[] = [];
  if (/\\[pP]\{/.test(pattern)) notes.push("# Note: Python's re module has no \\p{...} Unicode property classes — use the third-party `regex` module instead.");
  if (/\\u\{/.test(pattern)) notes.push("# Note: rewrite \\u{...} as \\U00XXXXXX (eight hex digits) for Python.");
  return notes.length > 0 ? `${notes.join("\n")}\n` : "";
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

  // Java writes a code point above U+FFFF as \x{...}, not JS's \u{...}.
  const escapedPattern = escapeForJavaString(state.pattern.replace(/\\u\{([0-9a-fA-F]+)\}/g, "\\x{$1}"));
  const flagsArg = flagNames.length > 0 ? `, ${flagNames.join(" | ")}` : "";
  return `Pattern pattern = Pattern.compile("${escapedPattern}"${flagsArg});`;
}
