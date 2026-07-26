/*
  Wires up a `.tabs[role="tablist"]` of `.tab[data-mode]` buttons: clicking one activates it
  (toggling `tab--active` + `aria-selected`) and shows the matching `.tab-panel`
  (`<div id="${mode}-demo">`), hiding the rest. Mirrors segmented-control.js's
  initSegmentedControl, split into its own module since a tab strip (swaps the whole view) and a
  segmented control (picks one option within a view) are now visually distinct components.
*/

/*
  Sets up a tab strip's click-to-switch behavior. `tabsSelector` should scope to just this strip's
  tabs (not just ".tab") if the page has more than one, so this doesn't also toggle an unrelated
  one's tabs. `onSwitch`, if given, runs after each switch with the newly active mode — for side
  effects a plain panel show/hide can't cover, like resizing a canvas that was hidden (and
  therefore zero-sized) until its panel just appeared. Returns the underlying `switchMode(mode)`
  function for any caller that needs to trigger it directly.
*/
export function initTabs(tabsSelector, onSwitch) {
  const tabs = document.querySelectorAll(tabsSelector);
  const panels = document.querySelectorAll(".tab-panel");

  function switchMode(mode) {
    tabs.forEach((tab) => {
      const active = tab.dataset.mode === mode;
      tab.classList.toggle("tab--active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    panels.forEach((panel) => {
      panel.classList.toggle("tab-panel--active", panel.id === `${mode}-demo`);
    });

    if (onSwitch) onSwitch(mode);
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => switchMode(tab.dataset.mode)));

  return switchMode;
}
