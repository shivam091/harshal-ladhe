import type { ConversionResult, ParsedTsInterface } from "@/interfaces/json-to-ts";

// From an opening '{' at `openIndex`, finds the index of its matching '}' by depth-counting — a plain non-greedy regex can't do this correctly once an interface body contains its own inline `{ ... }` object type.
function findMatchingBrace(source: string, openIndex: number): number {
  let depth = 0;
  for (let i = openIndex; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/*
  Splits `text` on `delimiter` at depth 0 only — depth increases inside {}/[]/()/<>, so a property
  separator `;` inside an inline object type's own body, or a `|` inside a nested union, never gets
  mistaken for the separator one level up. `<`/`>` are included as depth markers purely to keep a
  generic like `Record<K, V>` intact through a `;`-split; this tool never needs to split on `<`/`>`
  themselves, so treating a stray comparison operator as a depth change (which can't occur inside a
  type position anyway) is a safe simplification.
*/
function splitTopLevel(text: string, delimiter: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of text) {
    if ("{[(<".includes(char)) depth++;
    else if ("}])>".includes(char)) depth--;
    if (char === delimiter && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) parts.push(current);
  return parts;
}

function parsePropertyLine(line: string): { name: string; optional: boolean; typeText: string } | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^([A-Za-z_$][A-Za-z0-9_$]*)(\?)?\s*:\s*([\s\S]+)$/);
  if (!match) return null;
  return { name: match[1], optional: Boolean(match[2]), typeText: match[3].trim().replace(/,$/, "") };
}

// Finds every top-level `interface Name { ... }` block in `source` — a deliberately scoped subset of TS (no `extends`, no generics on the interface itself, no type aliases) that covers the common case of a handful of plain interfaces referencing each other.
export function parseTsInterfaces(source: string): ParsedTsInterface[] {
  const results: ParsedTsInterface[] = [];
  const pattern = /interface\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\{/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source))) {
    const bodyStart = match.index + match[0].length;
    const bodyEnd = findMatchingBrace(source, bodyStart - 1);
    if (bodyEnd === -1) continue;

    const body = source.slice(bodyStart, bodyEnd);
    const properties = splitTopLevel(body, ";")
      .map(parsePropertyLine)
      .filter((p): p is NonNullable<typeof p> => p !== null);
    results.push({ name: match[1], properties });
    pattern.lastIndex = bodyEnd + 1;
  }

  return results;
}

const MAX_DEPTH = 6;

/*
  Produces one plausible sample value for a raw type-text fragment (e.g. "string[]", "Address",
  "{ a: string }", '"admin" | "member"') — a union picks its first member (a sample only needs to be
  valid, not exhaustive), a reference resolves against the full interface map for mutual-reference
  support, and `depth` caps recursion so a self-referential interface (`interface Node { children:
  Node[] }`) terminates with `null` instead of a stack overflow.
*/
function sampleForType(typeText: string, interfaces: Map<string, ParsedTsInterface>, depth: number): unknown {
  const t = typeText.trim();
  if (depth > MAX_DEPTH) return null;

  const arraySuffix = t.match(/^([\s\S]+)\[\]$/);
  if (arraySuffix) return [sampleForType(arraySuffix[1], interfaces, depth + 1)];

  const arrayGeneric = t.match(/^Array<([\s\S]+)>$/);
  if (arrayGeneric) return [sampleForType(arrayGeneric[1], interfaces, depth + 1)];

  const recordGeneric = t.match(/^Record<[^,]+,\s*([\s\S]+)>$/);
  if (recordGeneric) return { sampleKey: sampleForType(recordGeneric[1], interfaces, depth + 1) };

  if (t.startsWith("{") && t.endsWith("}")) {
    const body = t.slice(1, -1);
    const properties = splitTopLevel(body, ";")
      .map(parsePropertyLine)
      .filter((p): p is NonNullable<typeof p> => p !== null);
    const obj: Record<string, unknown> = {};
    for (const property of properties) obj[property.name] = sampleForType(property.typeText, interfaces, depth + 1);
    return obj;
  }

  const unionParts = splitTopLevel(t, "|")
    .map((part) => part.trim())
    .filter(Boolean);
  if (unionParts.length > 1) return sampleForType(unionParts[0], interfaces, depth + 1);

  const stringLiteral = t.match(/^["'](.*)["']$/);
  if (stringLiteral) return stringLiteral[1];

  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);

  switch (t) {
    case "string":
      return "string";
    case "number":
      return 0;
    case "boolean":
      return true;
    case "null":
    case "undefined":
    case "any":
    case "unknown":
    case "object":
      return null;
    case "Date":
      return "1970-01-01T00:00:00.000Z";
  }

  const referenced = interfaces.get(t);
  if (referenced) return sampleForInterface(referenced, interfaces, depth + 1);

  return null;
}

function sampleForInterface(iface: ParsedTsInterface, interfaces: Map<string, ParsedTsInterface>, depth: number): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const property of iface.properties) obj[property.name] = sampleForType(property.typeText, interfaces, depth);
  return obj;
}

export function tsToJson(tsText: string, rootName: string): ConversionResult {
  if (tsText.trim().length === 0) return { code: "", error: null };

  const list = parseTsInterfaces(tsText);
  if (list.length === 0) return { code: "", error: "No `interface Name { ... }` declarations found." };

  const interfaces = new Map(list.map((i) => [i.name, i]));
  const root = interfaces.get(rootName.trim()) ?? list[0];
  const sample = sampleForInterface(root, interfaces, 0);

  return { code: JSON.stringify(sample, null, 2), error: null };
}
