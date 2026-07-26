import { Compartment, type Extension } from "@codemirror/state";
import { ViewPlugin, type EditorView } from "@codemirror/view";
import { showMinimap } from "@replit/codemirror-minimap";

/*
  Samples the theme's syntax colours straight off the rendered DOM, so there's no separate palette
  to keep in sync.
*/
const sandboxMinimapCoreFacetExtension: Extension = showMinimap.compute(["doc"], () => ({
  create: () => ({ dom: document.createElement("div") }),
  // Matches VS Code's own defaults: faux-text rendering, viewport overlay always visible (not just on hover).
  displayText: "characters",
  showOverlay: "always"
}));

/*
  Gives the minimap click-to-jump and drag-to-scroll on touch devices — @replit/codemirror-minimap
  only wires those through mouse events, so a touch press-and-drag is otherwise inert. Forwards
  each touch as the equivalent synthetic MouseEvent so the library's own drag/jump logic drives it,
  rather than reimplementing the scroll math independently.
*/
const sandboxMinimapTouchExtension: Extension = ViewPlugin.define((view: EditorView) => {
  function gutterFromEvent(event: TouchEvent): HTMLElement | null {
    return event.target instanceof Element ? event.target.closest<HTMLElement>(".cm-minimap-gutter") : null;
  }

  /*
    Dispatched right on the touched element (not the gutter) so a bubbled listener's own event.target
    still resolves to whatever the touch actually landed on — same as a real click.
  */
  function forwardAsMouseEvent(type: string, target: EventTarget, touch: Touch) {
    target.dispatchEvent(
      new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX: touch.clientX, clientY: touch.clientY })
    );
  }

  /*
    preventDefault on start/move — otherwise the browser also tries to natively pan the page/editor
    underneath while the forwarded mouse event drives scrollTop itself, fighting our own update.
  */
  function onTouchStart(event: TouchEvent) {
    if (!gutterFromEvent(event)) return;
    event.preventDefault();
    forwardAsMouseEvent("mousedown", event.target as EventTarget, event.touches[0]);
  }

  function onTouchMove(event: TouchEvent) {
    if (!gutterFromEvent(event)) return;
    event.preventDefault();
    // mousemove is handled on window regardless of target, so window is where a drag in progress needs it forwarded.
    forwardAsMouseEvent("mousemove", window, event.touches[0]);
  }

  /*
    Ends the drag the same way a real mouseup would — without this, lifting a finger mid-drag would leave
    the library's own _isDragging flag stuck true, freezing the overlay in place through any later scroll.
  */
  function onTouchEnd(event: TouchEvent) {
    if (!gutterFromEvent(event)) return;
    forwardAsMouseEvent("mouseup", window, event.changedTouches[0]);
  }

  /*
    { passive: false } is required for preventDefault() to actually take effect on touchstart/touchmove —
    browsers otherwise assume touch listeners never call it and ignore the request.
  */
  view.scrollDOM.addEventListener("touchstart", onTouchStart, { passive: false });
  view.scrollDOM.addEventListener("touchmove", onTouchMove, { passive: false });
  view.scrollDOM.addEventListener("touchend", onTouchEnd);
  view.scrollDOM.addEventListener("touchcancel", onTouchEnd);

  return {
    destroy() {
      view.scrollDOM.removeEventListener("touchstart", onTouchStart);
      view.scrollDOM.removeEventListener("touchmove", onTouchMove);
      view.scrollDOM.removeEventListener("touchend", onTouchEnd);
      view.scrollDOM.removeEventListener("touchcancel", onTouchEnd);
    }
  };
});

/*
  Combined so toggling the minimap brings touch support along with it, rather than leaving touch
  listeners on a gutter that no longer exists.
*/
export const sandboxMinimapCoreExtension: Extension = [sandboxMinimapCoreFacetExtension, sandboxMinimapTouchExtension];

export const minimapCompartment = new Compartment();

// On by default, matching VS Code's own default.
export const sandboxMinimapExtensions: Extension[] = [
  minimapCompartment.of(sandboxMinimapCoreExtension)
];
