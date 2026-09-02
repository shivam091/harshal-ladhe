import type { ConversionResult, GeneratedInterface, TsProperty, TsType } from "@/interfaces/json-to-ts";

function isValidIdentifier(name: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name);
}

// A JSON key can be any string (spaces, hyphens, a leading digit, …) — quoted whenever it isn't already a valid bare TS identifier.
function renderPropertyName(name: string): string {
  return isValidIdentifier(name) ? name : JSON.stringify(name);
}

function toPascalCase(input: string): string {
  const words = input.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (words.length === 0) return "Value";
  return words.map((word) => word[0].toUpperCase() + word.slice(1)).join("");
}

// Naive English pluralization reversal for naming an array's element interface from its own property name ("users" -> "User") — good enough for the common cases (trailing s/es/ies), not a general-purpose inflector.
function singularize(word: string): string {
  const pascal = toPascalCase(word);
  if (/ies$/i.test(pascal)) return `${pascal.slice(0, -3)}y`;
  if (/(ses|xes|ches|shes)$/i.test(pascal)) return pascal.slice(0, -2);
  if (/s$/i.test(pascal) && !/ss$/i.test(pascal)) return pascal.slice(0, -1);
  return pascal;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function renderType(type: TsType): string {
  switch (type.kind) {
    case "primitive":
      return type.name;
    case "array":
      return type.element.kind === "union" ? `(${renderType(type.element)})[]` : `${renderType(type.element)}[]`;
    case "union":
      return type.members.map(renderType).join(" | ");
    case "ref":
      return type.name;
  }
}

// Flattens nested unions and de-duplicates by rendered signature — an array like [1, "two", 3] should produce `(number | string)[]`, not `(number | string | number)[]`, and an array of all-same-type elements should collapse back to a single type rather than a redundant 1-member union.
function mergeTypes(types: TsType[]): TsType {
  const flat: TsType[] = [];
  for (const type of types) {
    if (type.kind === "union") flat.push(...type.members);
    else flat.push(type);
  }
  const seen = new Map<string, TsType>();
  for (const type of flat) seen.set(renderType(type), type);
  const unique = Array.from(seen.values());
  return unique.length === 1 ? unique[0] : { kind: "union", members: unique };
}

/*
  Walks a parsed JSON value and generates one or more named interfaces, de-duplicating structurally
  identical shapes (two differently-named object properties with the exact same fields reuse one
  interface) and disambiguating name collisions between structurally DIFFERENT shapes that happen to
  want the same name.
*/
class JsonToTsGenerator {
  readonly interfaces: GeneratedInterface[] = [];
  private readonly usedNames = new Set<string>();
  private readonly shapeCache = new Map<string, string>();

  private uniqueName(base: string): string {
    let candidate = base || "Value";
    let i = 2;
    while (this.usedNames.has(candidate)) {
      candidate = `${base}${i}`;
      i++;
    }
    this.usedNames.add(candidate);
    return candidate;
  }

  private registerInterface(nameHint: string, properties: TsProperty[]): TsType {
    const signature = properties
      .map((p) => `${p.name}${p.optional ? "?" : ""}:${renderType(p.type)}`)
      .sort()
      .join(";");
    const cached = this.shapeCache.get(signature);
    if (cached) return { kind: "ref", name: cached };

    const name = this.uniqueName(toPascalCase(nameHint));
    this.shapeCache.set(signature, name);
    this.interfaces.push({ name, properties });
    return { kind: "ref", name };
  }

  // Merges an array of object elements into ONE interface: the union of every key seen across all elements, marking a key optional whenever at least one element was missing it, and merging that key's own type across every element that did have it.
  private inferObjectArrayElement(items: Array<Record<string, unknown>>, nameHint: string): TsType {
    const allKeys = new Set<string>();
    for (const item of items) for (const key of Object.keys(item)) allKeys.add(key);

    const properties: TsProperty[] = Array.from(allKeys).map((key) => {
      const valuesForKey = items.filter((item) => Object.prototype.hasOwnProperty.call(item, key)).map((item) => item[key]);
      const optional = valuesForKey.length < items.length;
      const type = mergeTypes(valuesForKey.map((v) => this.inferType(v, key)));
      return { name: key, optional, type };
    });

    return this.registerInterface(nameHint, properties);
  }

  inferType(value: unknown, nameHint: string): TsType {
    if (value === null) return { kind: "primitive", name: "null" };

    if (Array.isArray(value)) {
      if (value.length === 0) return { kind: "array", element: { kind: "primitive", name: "unknown" } };
      const elementName = singularize(nameHint);
      if (value.every(isPlainObject)) return { kind: "array", element: this.inferObjectArrayElement(value as Array<Record<string, unknown>>, elementName) };
      return { kind: "array", element: mergeTypes(value.map((item) => this.inferType(item, elementName))) };
    }

    if (isPlainObject(value)) {
      const properties = Object.entries(value).map(([key, v]) => ({ name: key, optional: false, type: this.inferType(v, key) }));
      return this.registerInterface(nameHint, properties);
    }

    switch (typeof value) {
      case "string":
        return { kind: "primitive", name: "string" };
      case "number":
        return { kind: "primitive", name: "number" };
      case "boolean":
        return { kind: "primitive", name: "boolean" };
      default:
        return { kind: "primitive", name: "unknown" };
    }
  }
}

/*
  Renders every generated interface as `export interface Name { ... }` blocks, root first — the
  generator's own discovery order pushes NESTED interfaces before the root (recursion into a
  property's own object value completes, and registers that nested interface, before the root's own
  registerInterface call returns), so the root is moved to the front here for readability rather
  than printed last.
*/
function renderInterfaces(interfaces: GeneratedInterface[], rootType: TsType, rootName: string): string {
  const blocks: string[] = [];
  let ordered = interfaces;

  if (rootType.kind === "ref") {
    const rootIndex = interfaces.findIndex((i) => i.name === rootType.name);
    if (rootIndex !== -1) ordered = [interfaces[rootIndex], ...interfaces.slice(0, rootIndex), ...interfaces.slice(rootIndex + 1)];
  } else {
    blocks.push(`export type ${rootName} = ${renderType(rootType)};`);
  }

  for (const iface of ordered) {
    const lines = iface.properties.map((p) => `  ${renderPropertyName(p.name)}${p.optional ? "?" : ""}: ${renderType(p.type)};`);
    blocks.push(`export interface ${iface.name} {\n${lines.join("\n")}\n}`);
  }

  return blocks.join("\n\n");
}

export function jsonToTs(jsonText: string, rootName: string): ConversionResult {
  if (jsonText.trim().length === 0) return { code: "", error: null };

  let value: unknown;
  try {
    value = JSON.parse(jsonText);
  } catch (error) {
    return { code: "", error: error instanceof Error ? error.message : "Invalid JSON" };
  }

  const generator = new JsonToTsGenerator();
  const safeName = rootName.trim() || "Root";
  const rootType = generator.inferType(value, safeName);

  return { code: renderInterfaces(generator.interfaces, rootType, safeName), error: null };
}
