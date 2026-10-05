import { createElement } from "react";
import type { ReactNode } from "react";
import { toJsxAttributeName, toStyleObject } from "@/utils/svg-to-react-jsx";
import type { RenderSvgOptions, SvgElementNode, SvgNode } from "@/components/SvgToReactConverter/SvgToReactConverter.types";

/*
  Allow-list of renderable SVG elements — a second line of defence behind sanitiseTree, so an
  element the blocklist didn't anticipate simply isn't rendered into this page. <style> is absent
  on purpose (a sheet would restyle the whole page), as are <script>/<foreignObject>.
*/
const RENDERABLE_ELEMENTS = new Set([
  "svg", "g", "path", "circle", "ellipse", "line", "polyline", "polygon", "rect", "text", "tspan", "textPath",
  "defs", "use", "symbol", "linearGradient", "radialGradient", "stop", "clipPath", "mask", "pattern", "marker",
  "image", "title", "desc", "filter", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite",
  "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood",
  "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode",
  "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence",
  "animate", "animateMotion", "animateTransform", "set", "mpath", "switch", "view", "a"
]);

// Rewrites every same-document id reference to the prefixed id, so url(#grad) and href="#shape" keep pointing at this preview's own copy.
function prefixReferences(value: string, prefix: string): string {
  return value.replace(/url\(\s*(['"]?)#/g, `url($1#${prefix}`);
}

// Maps one raw attribute to a React prop for the preview — namespaced editor attributes and xmlns declarations are skipped (they don't affect rendering), and xlink:href becomes plain href.
function toPreviewProp(name: string, value: string, prefix: string): [string, unknown] | null {
  if (/^on/i.test(name) || name === "xmlns" || name.startsWith("xmlns:")) return null;
  if (name === "xlink:href" || name === "href") return ["href", value.startsWith("#") ? `#${prefix}${value.slice(1)}` : value];
  if (name.includes(":") && !name.startsWith("xml:")) return null;
  if (name === "id") return ["id", `${prefix}${value}`];
  if (name === "aria-labelledby" || name === "aria-describedby") return [name, value.split(/\s+/).map((id) => `${prefix}${id}`).join(" ")];
  if (name === "style") return ["style", toStyleObject(prefixReferences(value, prefix))];
  return [toJsxAttributeName(name), prefixReferences(value, prefix)];
}

// Recursively turns one tree node into a React node — comments and non-renderable elements simply vanish rather than becoming DOM.
function renderNode(node: SvgNode, options: RenderSvgOptions, key: string, isRoot: boolean): ReactNode {
  if (node.kind === "comment") return null;
  if (node.kind === "text") return node.value;
  if (!RENDERABLE_ELEMENTS.has(node.name)) return null;

  const props: Record<string, unknown> = { key };
  for (const [name, value] of node.attributes) {
    const prop = toPreviewProp(name, value, options.idPrefix);
    if (prop) props[prop[0]] = prop[1];
  }
  if (isRoot && options.rootProps) Object.assign(props, options.rootProps);

  const children = node.children.map((child, index) => renderNode(child, options, `${key}-${index}`, false));
  return createElement(node.name, props, ...children);
}

// Renders a sanitised tree as real React elements (never innerHTML), so the preview is the same tree the code was emitted from, run through React's own attribute handling.
export function renderSvgTree(root: SvgElementNode, options: RenderSvgOptions): ReactNode {
  return renderNode(root, options, "root", true);
}
