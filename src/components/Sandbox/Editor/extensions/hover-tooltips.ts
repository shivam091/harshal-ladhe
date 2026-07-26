import { hoverTooltip } from "@codemirror/view";
import type { Extension } from "@codemirror/state";
import { contentClass } from "@/components/Tooltip/Tooltip.styles";

/*
  Static one-line docs rather than a real language service, since no type checker is installed —
  just enough to explain common tokens without leaving the sandbox.
*/
const HOVER_DOCS: Record<string, string> = {
  // JS/TS keywords
  const: "Declares a block-scoped variable that can't be reassigned (the binding, not the value).",
  let: "Declares a block-scoped, reassignable variable.",
  var: "Declares a function-scoped (not block-scoped) variable — prefer const/let instead.",
  function: "Declares a named or anonymous function.",
  async: "Marks a function as asynchronous — it implicitly returns a Promise and can use await inside.",
  await: "Pauses an async function until the awaited Promise settles, then unwraps its value.",
  return: "Exits the current function, optionally with a value.",
  yield: "Pauses a generator function and produces a value to its caller.",
  class: "Declares a class — syntax sugar over JavaScript's prototype-based inheritance.",
  extends: "Sets up inheritance — a class/interface builds on another's members.",
  implements: "TypeScript — declares that a class satisfies an interface's shape.",
  interface: "TypeScript — declares a named object shape used only for type checking (erased at runtime).",
  type: "TypeScript — declares a type alias for any type, including unions and primitives.",
  enum: "TypeScript — a named set of constant values.",
  import: "Brings bindings from another module into scope.",
  export: "Makes a binding available for other modules to import.",
  default: "Marks a module's default export, or the fallback branch of a switch.",
  try: "Runs a block and lets a matching catch handle any thrown error.",
  catch: "Handles an error thrown from the preceding try block (or a rejected Promise, as .catch()).",
  finally: "Runs after try/catch regardless of whether an error was thrown.",
  throw: "Raises an exception, unwinding the call stack to the nearest catch.",
  new: "Constructs an instance of a class or constructor function.",
  this: "References the current execution context — an instance, or undefined in strict-mode functions.",
  super: "Calls the parent class's constructor or accesses its methods from a subclass.",
  static: "Declares a class member that belongs to the class itself, not its instances.",
  readonly: "TypeScript — marks a property that can be assigned once (in a constructor) and never after.",
  public: "TypeScript — the default visibility; accessible from anywhere.",
  private: "TypeScript — restricts access to within the declaring class.",
  protected: "TypeScript — restricts access to the declaring class and its subclasses.",
  void: "TypeScript — the type of a function that returns no usable value.",
  never: "TypeScript — the type of a value that can never occur (e.g. a function that always throws).",
  unknown: "TypeScript — a type-safe counterpart to any; must be narrowed before use.",
  any: "TypeScript — opts a value out of type checking entirely.",
  null: "Represents the intentional absence of any object value.",
  undefined: "The default value of an uninitialized variable or missing property.",
  typeof: "Returns a string naming a value's runtime type (or, in TS types, extracts a value's type).",
  instanceof: "Tests whether an object's prototype chain includes a given constructor.",
  in: "Tests whether a property exists on an object, or iterates an object's keys in a for...in loop.",
  of: "Iterates the values of an iterable (array, Map, Set, string) in a for...of loop.",
  switch: "Branches on a single value across multiple case labels.",
  case: "A single branch label inside a switch statement.",
  break: "Exits the nearest loop or switch statement early.",
  continue: "Skips to the next iteration of the nearest loop.",
  delete: "Removes a property from an object.",

  // Built-in globals / types
  fetch: "Starts an HTTP request; returns a Promise resolving to a Response.",
  console: "Browser console API — log/warn/error/table/etc, shown in this sandbox's Console tab.",
  Promise: "Represents an eventually-available value from an async operation.",
  Array: "Built-in list type — map/filter/reduce/forEach/etc.",
  Object: "Built-in key-value type — keys/values/entries/assign/etc.",
  JSON: "Built-in serializer — JSON.stringify()/JSON.parse().",
  Math: "Built-in numeric utilities — Math.min/max/round/random/etc.",
  Date: "Built-in date/time type.",
  Map: "Built-in key-value collection that preserves insertion order and allows any key type.",
  Set: "Built-in collection of unique values.",
  WeakMap: "Like Map, but keys must be objects and are garbage-collected once unreferenced elsewhere.",
  RegExp: "Built-in pattern-matching type for strings — /pattern/flags.",
  Error: "Base type for thrown exceptions — message/stack/name.",
  Symbol: "Built-in primitive for creating unique, collision-free property keys.",
  NaN: "\"Not a Number\" — the result of an invalid numeric operation; NaN !== NaN.",
  Infinity: "A numeric value larger than any finite number.",
  window: "The global object in a browser — holds document, location, global functions, etc.",
  document: "The DOM entry point for the current page — querySelector, createElement, etc.",
  localStorage: "Browser key-value storage that persists across page reloads (per origin).",
  setTimeout: "Schedules a callback to run once after a delay (in ms).",
  setInterval: "Schedules a callback to run repeatedly on a fixed interval (in ms).",

  // Array / Object / String methods
  map: "Array method — returns a new array built by transforming each element.",
  filter: "Array method — returns a new array keeping only elements that pass a test.",
  reduce: "Array method — folds an array down to a single accumulated value.",
  forEach: "Array method — runs a function for each element; returns undefined.",
  find: "Array method — returns the first element that passes a test, or undefined.",
  findIndex: "Array method — returns the index of the first element that passes a test, or -1.",
  some: "Array method — true if at least one element passes a test.",
  every: "Array method — true if all elements pass a test.",
  includes: "Array/string method — true if the value/substring is present.",
  indexOf: "Array/string method — returns the first matching index, or -1 if not found.",
  slice: "Array/string method — returns a shallow copy of a range without mutating the original.",
  splice: "Array method — mutates the array in place, removing/inserting elements.",
  push: "Array method — appends elements to the end, mutating the array; returns the new length.",
  pop: "Array method — removes and returns the last element, mutating the array.",
  concat: "Array/string method — merges into a new array/string without mutating the originals.",
  sort: "Array method — sorts in place; without a comparator, sorts lexicographically.",
  join: "Array method — concatenates elements into a string with a given separator.",
  split: "String method — splits a string into an array using a separator.",
  replace: "String method — returns a new string with the first (or all, with /g) match replaced.",
  trim: "String method — returns a new string with leading/trailing whitespace removed.",
  keys: "Object/Map/Set method — returns an iterator/array of keys.",
  values: "Object/Map/Set method — returns an iterator/array of values.",
  entries: "Object/Map/Array method — returns an iterator of [key, value] pairs.",
  assign: "Object.assign — copies own enumerable properties from source objects onto a target.",
  freeze: "Object.freeze — prevents further changes to an object's properties.",
  then: "Promise method — registers a callback for when the promise resolves.",
  bind: "Function method — returns a new function with `this` (and optionally args) locked in.",
  call: "Function method — invokes the function immediately with a given `this` and args.",
  apply: "Function method — like call, but arguments are passed as an array.",

  // React
  useState: "React hook — returns a [value, setValue] pair and re-renders on every setValue call.",
  useEffect: "React hook — runs a side effect after render, and again whenever its dependencies change.",
  useLayoutEffect: "React hook — like useEffect, but fires synchronously after DOM mutations, before paint.",
  useMemo: "React hook — recomputes a value only when its dependencies change.",
  useCallback: "React hook — returns a stable function reference across renders unless its dependencies change.",
  useRef: "React hook — a mutable box that persists across renders without triggering one on write.",
  useContext: "React hook — reads the nearest matching Context.Provider's value.",
  useReducer: "React hook — state driven by a (state, action) => state reducer, for more complex updates.",
  useId: "React hook — generates a stable unique id, consistent between server and client render.",
  useTransition: "React hook — marks a state update as non-urgent so urgent updates can interrupt it.",
  createContext: "React — creates a Context object with a Provider/Consumer pair for passing data down the tree.",
  forwardRef: "React — lets a component receive a ref from its parent and attach it to a child element.",
  memo: "React — wraps a component so it skips re-rendering when its props are shallow-equal.",
  Fragment: "React — groups children without adding an extra DOM node (<>...</>).",
  props: "The read-only object of values a component receives from its parent.",
  children: "The special prop holding whatever was nested between a component's opening/closing tags.",
  key: "React's special prop for list items — helps it match elements across re-renders efficiently.",
  ref: "React's special prop for getting a direct reference to a DOM node or component instance.",

  // CSS properties / values
  display: "CSS property — sets an element's layout mode (block, inline, flex, grid, none, etc).",
  flex: "CSS display value — lays out children along a single row or column.",
  grid: "CSS display value — lays out children into a two-dimensional track grid.",
  "flex-direction": "CSS property — sets the main axis of a flex container (row/column).",
  "justify-content": "CSS property — aligns flex/grid items along the main axis.",
  "align-items": "CSS property — aligns flex/grid items along the cross axis.",
  gap: "CSS property — sets spacing between flex/grid children without needing margins.",
  "grid-template-columns": "CSS property — defines the sizes of a grid's columns.",
  "grid-template-rows": "CSS property — defines the sizes of a grid's rows.",
  position: "CSS property — sets how an element is positioned (static, relative, absolute, fixed, sticky).",
  absolute: "CSS position value — positioned relative to the nearest positioned ancestor, out of normal flow.",
  relative: "CSS position value — positioned relative to its own normal-flow position.",
  fixed: "CSS position value — positioned relative to the viewport; stays put when scrolling.",
  sticky: "CSS position value — relative until a scroll threshold, then behaves like fixed.",
  margin: "CSS property — space outside an element's border.",
  padding: "CSS property — space between an element's border and its content.",
  width: "CSS property — sets an element's content-box or border-box width.",
  height: "CSS property — sets an element's content-box or border-box height.",
  color: "CSS property — sets the foreground (text) color.",
  background: "CSS shorthand property — sets color, image, position, repeat, etc in one declaration.",
  "background-color": "CSS property — sets an element's background color.",
  border: "CSS shorthand property — sets border width, style, and color in one declaration.",
  "border-radius": "CSS property — rounds an element's corners.",
  "box-shadow": "CSS property — adds one or more drop shadows around an element's box.",
  opacity: "CSS property — sets an element's transparency, from 0 (invisible) to 1 (opaque).",
  overflow: "CSS property — controls what happens to content that exceeds its container's bounds.",
  "font-size": "CSS property — sets the size of text.",
  "font-weight": "CSS property — sets the boldness of text.",
  "line-height": "CSS property — sets the height of a line box, affecting vertical spacing of text.",
  "text-align": "CSS property — sets horizontal alignment of inline content.",
  cursor: "CSS property — sets the mouse cursor shown when hovering an element.",
  transform: "CSS property — applies 2D/3D transformations like translate, rotate, and scale.",
  animation: "CSS shorthand property — applies a @keyframes animation with timing/duration/etc.",
  transition: "CSS property — animates a property's change over a duration/easing.",
  "z-index": "CSS property — stacking order along the axis toward the viewer; only applies to positioned elements.",
  "@media": "CSS at-rule — applies a block of styles only when a given condition (like viewport width) matches.",
  "@keyframes": "CSS at-rule — defines the steps of an animation referenced by the animation property.",
  "@font-face": "CSS at-rule — registers a custom font to use via font-family.",

  // SCSS
  "@mixin": "SCSS at-rule — defines a reusable block of styles, optionally parameterized.",
  "@include": "SCSS at-rule — inserts a @mixin's styles at the current location.",
  "@extend": "SCSS at-rule — lets a selector inherit another selector's styles.",
  "@if": "SCSS at-rule — conditionally applies styles based on an expression.",
  "@else": "SCSS at-rule — the fallback branch of an @if.",
  "@each": "SCSS at-rule — loops over a list or map, applying styles per item.",
  "@for": "SCSS at-rule — loops a fixed number of times, applying styles per iteration.",
  "@while": "SCSS at-rule — loops while a condition holds true.",
  "@use": "SCSS at-rule — imports another stylesheet's variables/mixins/functions into a namespace.",
  "@function": "SCSS at-rule — defines a reusable function that returns a value.",

  // HTML
  div: "HTML — a generic block-level container with no semantic meaning of its own.",
  span: "HTML — a generic inline container with no semantic meaning of its own.",
  a: "HTML — a hyperlink; href sets the destination.",
  img: "HTML — embeds an image; src sets the source, alt provides fallback/accessible text.",
  button: "HTML — a clickable control, typically used to submit forms or trigger scripts.",
  input: "HTML — a form control whose behavior (text, checkbox, radio, etc) is set by its type attribute.",
  form: "HTML — a container for interactive controls that submits their values together.",
  label: "HTML — a caption for a form control; clicking it focuses the associated input.",
  table: "HTML — defines tabular data laid out in rows and columns.",
  ul: "HTML — an unordered (bulleted) list.",
  ol: "HTML — an ordered (numbered) list.",
  li: "HTML — a single item within a ul or ol.",
  header: "HTML — introductory content for a page or section, like a title or nav.",
  footer: "HTML — closing content for a page or section, like copyright or links.",
  nav: "HTML — a section containing primary navigation links.",
  section: "HTML — a thematic grouping of content, typically with its own heading.",
  article: "HTML — self-contained content that could be distributed/reused independently.",
  canvas: "HTML — a drawable surface for 2D/WebGL graphics via JavaScript.",
  iframe: "HTML — embeds another HTML document within the current page.",
  svg: "HTML/SVG — a container for vector graphics drawn with SVG elements like path and circle."
};

/*
  Hover tooltip — looks up the word under the pointer against HOVER_DOCS and shows a one-line
  blurb if it matches. Silently returns null (no tooltip) for anything not in the dictionary,
  same as CodeMirror's own hoverTooltip does when a hover target has nothing to show.
*/
export const sandboxHoverTooltipExtension: Extension = hoverTooltip((view, pos, side) => {
  const { from, to, text } = view.state.doc.lineAt(pos);
  let start = pos;
  let end = pos;

  /*
    Includes `-`/`$`/`@` alongside \w so kebab-case CSS properties (z-index, border-radius),
    SCSS at-rules (@mixin), and CSS at-rules (@media) resolve to a single hoverable token instead
    of splitting on the first non-word character.
  */
  const isTokenChar = (ch: string): boolean => /[\w$@-]/.test(ch);

  while (start > from && isTokenChar(text[start - from - 1])) start--;
  while (end < to && isTokenChar(text[end - from])) end++;

  if ((start === pos && side < 0) || (end === pos && side > 0)) return null;

  const word = text.slice(start - from, end - from);
  const doc = HOVER_DOCS[word];
  if (!doc) return null;

  return {
    pos: start,
    end,
    above: true,
    create() {
      /*
        Reuses the app's shared Tooltip panel styling (colors/padding/radius/shadow/font) via its
        linaria class so this editor tooltip matches the rest of the app visually.
      */
      const dom = document.createElement("div");
      dom.textContent = doc;
      dom.className = contentClass;
      dom.style.maxWidth = "24rem";
      return { dom };
    }
  };
});
