import type { EmitContext, JsxAttribute, PropsPlan, SvgElementNode, SvgNode, SvgToReactOptions } from "@/components/SvgToReactConverter/SvgToReactConverter.types";

// Lines longer than this break their attributes one per line — roughly Prettier's own default print width, so the output looks hand-formatted without bundling Prettier.
const PRINT_WIDTH = 100;

// Attribute names React spells differently for reasons other than plain hyphen → camelCase (reserved words, namespace prefixes, legacy casing).
const SPECIAL_ATTRIBUTE_NAMES: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  "xlink:href": "xlinkHref",
  "xlink:title": "xlinkTitle",
  "xlink:show": "xlinkShow",
  "xlink:actuate": "xlinkActuate",
  "xlink:arcrole": "xlinkArcrole",
  "xlink:role": "xlinkRole",
  "xlink:type": "xlinkType",
  "xml:space": "xmlSpace",
  "xml:lang": "xmlLang",
  "xml:base": "xmlBase",
  "xmlns:xlink": "xmlnsXlink"
};

// react-native-svg's component for each SVG element it supports — anything missing (title, desc, style, metadata) has no native counterpart and is dropped from native output.
const NATIVE_COMPONENTS: Record<string, string> = {
  svg: "Svg",
  g: "G",
  path: "Path",
  circle: "Circle",
  ellipse: "Ellipse",
  line: "Line",
  polyline: "Polyline",
  polygon: "Polygon",
  rect: "Rect",
  text: "Text",
  tspan: "TSpan",
  textPath: "TextPath",
  defs: "Defs",
  use: "Use",
  symbol: "Symbol",
  linearGradient: "LinearGradient",
  radialGradient: "RadialGradient",
  stop: "Stop",
  clipPath: "ClipPath",
  mask: "Mask",
  pattern: "Pattern",
  image: "Image",
  marker: "Marker",
  foreignObject: "ForeignObject"
};

// Hyphenated words → camelCase, the rule React applies to every SVG presentation attribute (stroke-width → strokeWidth).
function camelCase(name: string): string {
  return name.replace(/-([a-z0-9])/gi, (_, letter: string) => letter.toUpperCase());
}

// Maps one SVG attribute name to the prop name React expects — aria-* and data-* stay hyphenated, since React (unlike for presentation attributes) passes those through as-is.
export function toJsxAttributeName(name: string): string {
  if (SPECIAL_ATTRIBUTE_NAMES[name]) return SPECIAL_ATTRIBUTE_NAMES[name];
  if (name.startsWith("aria-") || name.startsWith("data-")) return name;
  if (name.includes(":")) {
    const [prefix, local] = name.split(":");
    return `${prefix}${local.charAt(0).toUpperCase()}${camelCase(local.slice(1))}`;
  }
  return camelCase(name);
}

// Splits on semicolons that sit outside parentheses — a `url(data:…;base64,…)` value contains its own semicolon that mustn't end the declaration early.
function splitDeclarations(style: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of style) {
    if (char === "(") depth++;
    if (char === ")") depth = Math.max(0, depth - 1);
    if (char === ";" && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  parts.push(current);
  return parts.map((part) => part.trim()).filter(Boolean);
}

// Parses an inline style string into ordered [property, value] pairs with the property names still in CSS spelling — shared by the JSX emitter, the preview renderer and the cruft/colour transforms.
export function parseStyleDeclarations(style: string): Array<[string, string]> {
  return splitDeclarations(style).flatMap((declaration) => {
    const colon = declaration.indexOf(":");
    if (colon <= 0) return [];
    return [[declaration.slice(0, colon).trim().toLowerCase(), declaration.slice(colon + 1).trim()] as [string, string]];
  });
}

// Joins declarations back into a style string — the inverse of parseStyleDeclarations, for transforms that edit an inline style without changing its format.
export function serialiseStyleDeclarations(declarations: Array<[string, string]>): string {
  return declarations.map(([property, value]) => `${property}:${value}`).join(";");
}

// CSS property → React style key: custom properties keep their exact spelling, vendor prefixes follow React's capitalisation quirk (-webkit- → Webkit, but -ms- → ms).
export function toStyleKey(property: string): string {
  if (property.startsWith("--")) return property;
  if (property.startsWith("-ms-")) return camelCase(property.slice(1));
  if (property.startsWith("-")) {
    const key = camelCase(property.slice(1));
    return key.charAt(0).toUpperCase() + key.slice(1);
  }
  return camelCase(property);
}

// React style objects take a record, so the preview renderer needs the same conversion the emitter prints.
export function toStyleObject(style: string): Record<string, string> {
  return Object.fromEntries(parseStyleDeclarations(style).map(([property, value]) => [toStyleKey(property), value]));
}

// Prints a style object literal — keys that aren't plain identifiers (custom properties) get quoted so the output always compiles.
function printStyleObject(style: string): string {
  const entries = parseStyleDeclarations(style).map(([property, value]) => {
    const key = toStyleKey(property);
    const printedKey = /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
    return `${printedKey}: ${JSON.stringify(value)}`;
  });
  return entries.length > 0 ? `{ ${entries.join(", ")} }` : "{}";
}

// Prints one attribute — a value containing a double quote can't sit in a JSX string literal (JSX has no escape sequences), so it falls back to a braced JS string.
function printAttribute(attribute: JsxAttribute): string {
  if ("spread" in attribute) return `{...${attribute.spread}}`;
  if (attribute.expression) return `${attribute.name}={${attribute.value}}`;
  if (attribute.value.includes('"')) return `${attribute.name}={${JSON.stringify(attribute.value)}}`;
  return `${attribute.name}="${attribute.value}"`;
}

// JSX text can't contain raw braces or angle brackets, and a stray `&` would be read as an entity — anything risky prints as a braced string literal instead.
function printText(value: string): string {
  return /[{}<>&]/.test(value) ? `{${JSON.stringify(value)}}` : value;
}

// Converts an element's static attributes for output — camelCasing (and style objects) only when that toggle is on, so switching it off shows exactly what React would otherwise receive.
function toJsxAttributes(node: SvgElementNode, context: EmitContext): JsxAttribute[] {
  return node.attributes.flatMap<JsxAttribute>(([name, value]) => {
    if (context.options.reactNative && (name === "class" || name === "xmlns" || name.startsWith("xmlns:"))) return [];
    if (!context.options.camelCaseProps) return [{ name, value, expression: false }];
    if (name === "style") return [{ name: "style", value: printStyleObject(value), expression: true }];
    return [{ name: toJsxAttributeName(name), value, expression: false }];
  });
}

// Prints a <style> element's sheet as a template literal so its braces and newlines survive JSX intact.
function printStyleSheet(value: string): string {
  return `{\`${value.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")}\`}`;
}

// Recursively prints one node at the given indent, collapsing short elements onto one line and breaking long attribute lists one per line, as a formatter would.
function emitNode(node: SvgNode, indent: number, context: EmitContext, isRoot: boolean, parentName: string): string[] {
  const pad = " ".repeat(indent);

  if (node.kind === "comment") return context.options.reactNative ? [] : [`${pad}{/* ${node.value.replace(/\*\//g, "* /")} */}`];
  if (node.kind === "text") return [`${pad}${parentName === "style" ? printStyleSheet(node.value) : printText(node.value)}`];

  let tag = node.name;
  if (context.options.reactNative) {
    const component = NATIVE_COMPONENTS[node.name];
    if (!component) return [];
    tag = component;
    context.nativeComponents.add(component);
  }

  const attributes = [...toJsxAttributes(node, context), ...(isRoot ? context.rootExtras : [])];
  const printedAttributes = attributes.map(printAttribute);
  const childLines = [
    ...(isRoot ? context.rootPrefixChildren.map((line) => `${pad}  ${line}`) : []),
    ...node.children.flatMap((child) => emitNode(child, indent + 2, context, false, node.name))
  ];

  const opening = `<${tag}${printedAttributes.map((attribute) => ` ${attribute}`).join("")}`;
  const fitsOnOneLine = indent + opening.length + 3 <= PRINT_WIDTH || printedAttributes.length <= 1;

  if (childLines.length === 0) {
    if (fitsOnOneLine) return [`${pad}${opening} />`];
    return [`${pad}<${tag}`, ...printedAttributes.map((attribute) => `${pad}  ${attribute}`), `${pad}/>`];
  }

  // A lone short text child (a <title>, a <tspan> label) reads better inline than as a three-line block.
  const onlyChild = node.children.length === 1 && childLines.length === 1 ? node.children[0] : null;
  if (onlyChild?.kind === "text" && fitsOnOneLine) {
    const inline = `${pad}${opening}>${childLines[0].trim()}</${tag}>`;
    if (inline.length <= PRINT_WIDTH) return [inline];
  }

  const openingLines = fitsOnOneLine
    ? [`${pad}${opening}>`]
    : [`${pad}<${tag}`, ...printedAttributes.map((attribute) => `${pad}  ${attribute}`), `${pad}>`];
  return [...openingLines, ...childLines, `${pad}</${tag}>`];
}

// Decides which props the component destructures — size gets a default drawn from the artwork's own width so an unsized usage renders at its designed size.
function planProps(options: SvgToReactOptions, defaultSize: number): PropsPlan {
  const usesTitle = options.titleProp && !options.reactNative;
  const destructured: string[] = [];
  if (usesTitle) destructured.push("title");
  if (options.sizeProp) destructured.push(`size = ${defaultSize}`);
  if (options.forwardRef) destructured.push("ref");
  if (options.spreadProps) destructured.push("...props");
  return { destructured, hasProps: destructured.length > 0, usesTitle };
}

// Builds the props interface — extending the platform's own SVG props when spreading, so every native attribute stays typed, or a minimal standalone interface otherwise.
function printPropsInterface(name: string, options: SvgToReactOptions, plan: PropsPlan): string[] {
  const baseType = options.reactNative ? "SvgProps" : "SVGProps<SVGSVGElement>";
  const fields: string[] = [];
  if (plan.usesTitle) fields.push("  title?: string;");
  if (options.sizeProp) fields.push("  size?: number | string;");
  if (options.forwardRef && !options.spreadProps) fields.push(`  ref?: Ref<${options.reactNative ? "Svg" : "SVGSVGElement"}>;`);

  const heading = options.spreadProps ? `interface ${name}Props extends ${baseType}` : `interface ${name}Props`;
  if (fields.length === 0) return options.spreadProps ? [`type ${name}Props = ${baseType};`, ""] : [];
  return [`${heading} {`, ...fields, "}", ""];
}

// Collects the import lines in a stable order — value imports first, then a separate `import type` line, matching how this codebase itself writes its imports.
function printImports(options: SvgToReactOptions, plan: PropsPlan, nativeComponents: Set<string>): string[] {
  const lines: string[] = [];
  const reactValues = [options.memo ? "memo" : null, plan.usesTitle ? "useId" : null].filter(Boolean);
  if (reactValues.length > 0) lines.push(`import { ${reactValues.join(", ")} } from "react";`);

  if (options.reactNative) {
    const named = Array.from(nativeComponents).filter((component) => component !== "Svg").sort();
    lines.push(named.length > 0 ? `import Svg, { ${named.join(", ")} } from "react-native-svg";` : `import Svg from "react-native-svg";`);
  }

  if (options.typescript && plan.hasProps) {
    if (options.reactNative) {
      const nativeTypes = [options.spreadProps ? "SvgProps" : null].filter(Boolean);
      if (nativeTypes.length > 0) lines.push(`import type { ${nativeTypes.join(", ")} } from "react-native-svg";`);
      if (options.forwardRef && !options.spreadProps) lines.push(`import type { Ref } from "react";`);
    } else {
      const reactTypes = [options.forwardRef && !options.spreadProps ? "Ref" : null, options.spreadProps ? "SVGProps" : null].filter(Boolean);
      if (reactTypes.length > 0) lines.push(`import type { ${reactTypes.join(", ")} } from "react";`);
    }
  }

  return lines.length > 0 ? [...lines, ""] : [];
}

/*
  Emits the finished component source. Dynamic wiring (size → width/height, the title's aria
  attributes, ref, the props spread) is appended after the artwork's own attributes so a consumer's
  props always win over the baked-in values — the same ordering SVGR uses. Hand-formatted rather
  than run through Prettier so the converter stays synchronous and adds nothing to the page bundle.
*/
export function emitComponent(root: SvgElementNode, componentName: string, options: SvgToReactOptions, defaultSize: number): string {
  const plan = planProps(options, defaultSize);
  const rootExtras: JsxAttribute[] = [];
  const staticRoot: SvgElementNode = options.sizeProp
    ? { ...root, attributes: root.attributes.filter(([name]) => name !== "width" && name !== "height") }
    : root;

  if (options.sizeProp) {
    rootExtras.push({ name: "width", value: "size", expression: true }, { name: "height", value: "size", expression: true });
  }
  if (plan.usesTitle) {
    rootExtras.push(
      { name: "aria-labelledby", value: "title ? titleId : undefined", expression: true },
      { name: "aria-hidden", value: "title ? undefined : true", expression: true }
    );
  }
  if (options.forwardRef) rootExtras.push({ name: "ref", value: "ref", expression: true });
  if (options.spreadProps) rootExtras.push({ spread: "props" });

  const context: EmitContext = {
    options,
    rootExtras,
    rootPrefixChildren: plan.usesTitle ? ["{title ? <title id={titleId}>{title}</title> : null}"] : [],
    nativeComponents: new Set<string>()
  };
  const markup = emitNode(staticRoot, 4, context, true, "");

  // A lone spread reads better as a plain `props` parameter than as `{ ...props }` destructuring that picks nothing out.
  const pattern = plan.destructured.length === 1 && plan.destructured[0] === "...props" ? "props" : `{ ${plan.destructured.join(", ")} }`;
  const parameter = plan.hasProps ? `${pattern}${options.typescript ? `: ${componentName}Props` : ""}` : "";
  const body = [
    ...(plan.usesTitle ? ["  const titleId = useId();", ""] : []),
    "  return (",
    ...markup,
    "  );"
  ];

  const isDefault = options.exportStyle === "default";
  const declaration = options.memo
    ? [
        `${isDefault ? "export default memo(" : `export const ${componentName} = memo(`}function ${componentName}(${parameter}) {`,
        ...body,
        "});"
      ]
    : [`export ${isDefault ? "default " : ""}function ${componentName}(${parameter}) {`, ...body, "}"];

  return [
    ...printImports(options, plan, context.nativeComponents),
    ...(options.typescript && plan.hasProps ? printPropsInterface(componentName, options, plan) : []),
    ...declaration,
    ""
  ].join("\n");
}
