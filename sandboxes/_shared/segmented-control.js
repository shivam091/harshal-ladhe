/*
  Wires up the button-variant segmented control from segmented-control.css: clicking a
  `.segment[data-mode]` element activates it (toggling `segment--active` + `aria-selected`) and
  shows the matching `.segment-panel` (`<div id="${mode}-demo">`), hiding the rest. Pairs with
  markup where the initial active segment/panel are already marked up in HTML, since this only
  reacts to clicks — it doesn't activate a mode on its own.
*/

/*
  Sets up a segmented control's click-to-switch behavior. `segmentsSelector` should scope to just
  this control's segments (not just ".segment") if the page has more than one segmented control,
  so this doesn't also toggle an unrelated one's segments. `onSwitch`, if given, runs after each
  switch with the newly active mode — for side effects a plain panel show/hide can't cover, like
  resizing a canvas that was hidden (and therefore zero-sized) until its panel just appeared.
  Returns the underlying `switchMode(mode)` function for any caller that needs to trigger it directly.
*/
export function initSegmentedControl(segmentsSelector, onSwitch) {
  const segments = document.querySelectorAll(segmentsSelector);
  const panels = document.querySelectorAll(".segment-panel");

  function switchMode(mode) {
    segments.forEach((segment) => {
      const active = segment.dataset.mode === mode;
      segment.classList.toggle("segment--active", active);
      segment.setAttribute("aria-selected", String(active));
    });

    panels.forEach((panel) => {
      panel.classList.toggle("segment-panel--active", panel.id === `${mode}-demo`);
    });

    if (onSwitch) onSwitch(mode);
  }

  segments.forEach((segment) => segment.addEventListener("click", () => switchMode(segment.dataset.mode)));

  return switchMode;
}
