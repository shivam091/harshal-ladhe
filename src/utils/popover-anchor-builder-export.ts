import { compileStylesheet, POPOVER_ID, TRIGGER_LABEL } from "@/utils/popover-anchor-builder";
import type { PopoverAnchorEditorState, PopoverContent } from "@/interfaces/popover-anchor-builder";

// Shifts every line of a block right by `spaces` — used to nest the compiled stylesheet inside the HTML export's own <style> tag and the React export's template literal.
function indentBy(block: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return block
    .split("\n")
    .map((line) => (line ? `${pad}${line}` : line))
    .join("\n");
}

/*
  What renders inside the popover, per content variant — kept HTML-flavored here and re-expressed
  with JSX's camelCased popover attributes in popoverBodyJsx below, rather than shared, since the two
  formats' attribute casing differs at every tag (same tolerance TriangleGenerator's own
  PreviewPane/PresetGallery already show for their own small formatting-only duplication).
*/
function popoverBodyHtml(content: PopoverContent): string {
  switch (content) {
    case "text":
      return `  <p>A tethered popover, positioned with real CSS anchor positioning.</p>`;
    case "menu":
      return [
        `  <ul role="menu">`,
        `    <li role="menuitem"><button type="button" popovertarget="${POPOVER_ID}" popovertargetaction="hide">Edit</button></li>`,
        `    <li role="menuitem"><button type="button" popovertarget="${POPOVER_ID}" popovertargetaction="hide">Duplicate</button></li>`,
        `    <li role="menuitem"><button type="button" popovertarget="${POPOVER_ID}" popovertargetaction="hide">Delete</button></li>`,
        `  </ul>`
      ].join("\n");
    case "dialog":
      return [
        `  <h2>Delete this item?</h2>`,
        `  <p>This action can't be undone.</p>`,
        `  <div>`,
        `    <button type="button" popovertarget="${POPOVER_ID}" popovertargetaction="hide">Cancel</button>`,
        `    <button type="button" popovertarget="${POPOVER_ID}" popovertargetaction="hide">Delete</button>`,
        `  </div>`
      ].join("\n");
  }
}

function popoverBodyJsx(content: PopoverContent): string {
  switch (content) {
    case "text":
      return `        <p>A tethered popover, positioned with real CSS anchor positioning.</p>`;
    case "menu":
      return [
        `        <ul role="menu">`,
        `          <li role="menuitem"><button type="button" popoverTarget="${POPOVER_ID}" popoverTargetAction="hide">Edit</button></li>`,
        `          <li role="menuitem"><button type="button" popoverTarget="${POPOVER_ID}" popoverTargetAction="hide">Duplicate</button></li>`,
        `          <li role="menuitem"><button type="button" popoverTarget="${POPOVER_ID}" popoverTargetAction="hide">Delete</button></li>`,
        `        </ul>`
      ].join("\n");
    case "dialog":
      return [
        `        <h2>Delete this item?</h2>`,
        `        <p>This action can't be undone.</p>`,
        `        <div>`,
        `          <button type="button" popoverTarget="${POPOVER_ID}" popoverTargetAction="hide">Cancel</button>`,
        `          <button type="button" popoverTarget="${POPOVER_ID}" popoverTargetAction="hide">Delete</button>`,
        `        </div>`
      ].join("\n");
  }
}

// The real, production CSS — anchor-name/position-anchor/anchor()/position-try-fallbacks plus ::backdrop and the @starting-style entrance, all compiled by the single source of truth in utils/popover-anchor-builder.ts.
export function toCss(state: PopoverAnchorEditorState): string {
  return compileStylesheet(state);
}

// The actual trigger+popover markup — real `popover`/`popovertarget`/`popovertargetaction` attributes, meant to be pasted alongside the CSS tab's output (matched by the shared data-pab-trigger/data-pab-popover attribute selectors).
export function toHtml(state: PopoverAnchorEditorState): string {
  return [
    `<button type="button" popovertarget="${POPOVER_ID}" popovertargetaction="toggle" data-pab-trigger>`,
    `  ${TRIGGER_LABEL}`,
    `</button>`,
    ``,
    `<div id="${POPOVER_ID}" popover="${state.mode}" data-pab-popover>`,
    popoverBodyHtml(state.content),
    `</div>`
  ].join("\n");
}

// A drop-in component: the compiled stylesheet inlined via a <style> tag (so the snippet has zero external CSS file dependency) plus the same markup as toHtml, re-expressed with React 19's typed popover/popoverTarget/popoverTargetAction props.
export function toReact(state: PopoverAnchorEditorState): string {
  const css = indentBy(compileStylesheet(state), 8);
  const styleOpen = "      <style>{`";
  const styleClose = "`}</style>";

  return [
    `function PopoverAnchorDemo() {`,
    `  return (`,
    `    <>`,
    styleOpen,
    css,
    `      ` + styleClose,
    `      <button type="button" popoverTarget="${POPOVER_ID}" popoverTargetAction="toggle" data-pab-trigger>`,
    `        ${TRIGGER_LABEL}`,
    `      </button>`,
    ``,
    `      <div id="${POPOVER_ID}" popover="${state.mode}" data-pab-popover>`,
    popoverBodyJsx(state.content),
    `      </div>`,
    `    </>`,
    `  );`,
    `}`
  ].join("\n");
}
