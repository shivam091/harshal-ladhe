import { compileTriangleDeclarations } from "@/utils/triangle";
import type { TriangleEditorState } from "@/interfaces/triangle";

export function toCssDeclaration(state: TriangleEditorState): string {
  return compileTriangleDeclarations(state)
    .map(([property, value]) => `${property}: ${value};`)
    .join("\n");
}

// Every declaration goes through Tailwind's arbitrary-property escape hatch (`[property:value]`) — the border trick's per-side shorthand values and clip-path's polygon() call both fall outside Tailwind's own discrete border/width utilities.
export function toTailwindClass(state: TriangleEditorState): string {
  return compileTriangleDeclarations(state)
    .map(([property, value]) => `[${property}:${value.replace(/\s+/g, "_")}]`)
    .join(" ");
}

export function toReactStyleObject(state: TriangleEditorState): string {
  const entries = compileTriangleDeclarations(state).map(([property, value]) => {
    const camelProperty = property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
    return `  ${camelProperty}: "${value}"`;
  });
  return `{\n${entries.join(",\n")}\n}`;
}
