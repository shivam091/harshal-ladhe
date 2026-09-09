"use client";

import { useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import { compileStylesheet, POPOVER_ID, TRIGGER_LABEL } from "@/utils/popover-anchor-builder";
import type { PopoverContent, PreviewPaneProps } from "@/interfaces/popover-anchor-builder";
import { PreviewStage, SupportNotice, TriggerButton, PopoverSurface } from "@/components/PopoverAnchorBuilder/PreviewPane/PreviewPane.styles";

// Real content for each variant — mirrors popoverBodyHtml/popoverBodyJsx in utils/popover-anchor-builder-export.ts, but as actual React elements (not source text) since this is what the browser renders, not what a user copies. Every close control uses the genuine Popover API (popoverTarget + "hide") rather than a React click handler, so the demo's dismiss behavior is the real thing, not a simulation of it.
function PopoverBody({ content }: { content: PopoverContent }): JSX.Element {
  switch (content) {
    case "text":
      return <p>A tethered popover, positioned with real CSS anchor positioning.</p>;
    case "menu":
      return (
        <ul role="menu">
          <li role="menuitem">
            <button type="button" popoverTarget={POPOVER_ID} popoverTargetAction="hide">
              Edit
            </button>
          </li>
          <li role="menuitem">
            <button type="button" popoverTarget={POPOVER_ID} popoverTargetAction="hide">
              Duplicate
            </button>
          </li>
          <li role="menuitem">
            <button type="button" popoverTarget={POPOVER_ID} popoverTargetAction="hide">
              Delete
            </button>
          </li>
        </ul>
      );
    case "dialog":
      return (
        <>
          <h2>Delete this item?</h2>
          <p>This action can&apos;t be undone.</p>
          <div>
            <button type="button" popoverTarget={POPOVER_ID} popoverTargetAction="hide">
              Cancel
            </button>
            <button type="button" popoverTarget={POPOVER_ID} popoverTargetAction="hide">
              Delete
            </button>
          </div>
        </>
      );
  }
}

/*
  Live trigger+popover using the REAL `popover` attribute and REAL CSS anchor positioning — every
  control's effect is expressed by recompiling and re-injecting an actual <style> tag (via
  compileStylesheet, the same function every export tab reads from) rather than by simulating the
  result with inline styles or React state, since :popover-open/::backdrop/@starting-style can't be
  expressed through a style prop at all.

  Anchor positioning itself (as opposed to the Popover API, which is broadly supported) is
  Chrome/Edge-only as of this writing, so browser support is feature-detected once on mount via
  `CSS.supports("anchor-name", "--a")` and the compiled stylesheet switches to a plain
  absolute-positioning approximation when it's unavailable, alongside an explicit notice — rather
  than silently rendering a popover that lands in the wrong place.
*/
export default function PreviewPane({ state }: PreviewPaneProps): JSX.Element {
  const [supportsAnchorPositioning, setSupportsAnchorPositioning] = useState<boolean | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Deliberately deferred to an effect rather than a lazy useState initializer: `CSS` doesn't exist during SSR, so computing this at render time would make the very first client render disagree with the server-rendered markup. Rendering the `null` ("still checking") branch identically on server and initial client render, then flipping once after mount, avoids a hydration mismatch entirely.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above; this is a one-time browser-capability check with no external subscription to model as useSyncExternalStore instead.
    setSupportsAnchorPositioning(typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("anchor-name", "--pab-anchor"));
  }, []);

  // Keeps the popover open across every control change so edits are visible without re-clicking the trigger each time — hide-then-show (both wrapped, since hiding an already-closed or showing an already-open popover throws) picks up the freshly-committed `popover` attribute value and re-applies the just-recompiled stylesheet.
  useEffect(() => {
    if (supportsAnchorPositioning === null) return;
    const popover = popoverRef.current;
    if (!popover) return;
    try {
      popover.hidePopover();
    } catch {
      // Wasn't open yet — nothing to hide.
    }
    try {
      popover.showPopover();
    } catch {
      // Rare engine-level rejection of an immediate re-show; the trigger button below still opens it manually.
    }
  }, [state.anchorSide, state.offset, state.mode, state.backdrop, state.entranceAnimation, state.fallback, state.content, supportsAnchorPositioning]);

  if (supportsAnchorPositioning === null) return <PreviewStage />;

  const stylesheet = compileStylesheet(state, { positionMode: supportsAnchorPositioning ? "anchor" : "static" });

  return (
    <>
      {!supportsAnchorPositioning && (
        <SupportNotice role="status">
          Your browser doesn&apos;t support CSS anchor positioning (Chrome/Edge 125+, as of this writing) — showing a static-position
          approximation instead of the real tethered placement below.
        </SupportNotice>
      )}
      <PreviewStage>
        {/* compileStylesheet only ever emits CSS this tool itself generated from typed state, never user-supplied markup, so injecting it raw is safe. */}
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <TriggerButton type="button" popoverTarget={POPOVER_ID} popoverTargetAction="toggle" data-pab-trigger>
          {TRIGGER_LABEL}
        </TriggerButton>
        <PopoverSurface ref={popoverRef} id={POPOVER_ID} popover={state.mode} data-pab-popover>
          <PopoverBody content={state.content} />
        </PopoverSurface>
      </PreviewStage>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
