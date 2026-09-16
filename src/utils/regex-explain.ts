import type { ExplainNode } from "@/interfaces/regex-tester";

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

    const parts: string[] = [];
    let iteration = 0;
    // A ']' as the very first member (right after '[' or '[^') is a literal, not the closing bracket — a well-known regex quirk (e.g. `[]a]` matches ']' or 'a').
    while (!this.eof()) {
      if (this.peek() === "]" && iteration > 0) break;

      if (this.peek() === "\\") {
        const escStart = this.pos;
        this.advance();
        this.advance();
        parts.push(this.describeClassAtom(this.slice(escStart)));
      } else {
        const c1 = this.advance();
        if (this.peek() === "-" && this.peek(1) !== "]" && this.peek(1) !== undefined) {
          this.advance(); // '-'
          const c2 = this.advance();
          parts.push(`"${c1}" to "${c2}"`);
        } else {
          parts.push(`"${c1}"`);
        }
      }
      iteration++;
    }
    if (this.peek() === "]") this.advance();

    const token = this.slice(start);
    const description = `${negated ? "any character NOT" : "any character"} in the set: ${parts.join(", ")}`;
    return { id: this.nextId(), token, description };
  }

  private describeClassAtom(token: string): string {
    return SHORTHAND_CLASS[token] ?? `"${token.slice(1)}"`;
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
