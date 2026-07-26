/*
  Kept apart from the segmented control because a tab strip (swaps the whole view) and a
  segmented control (picks one option within a view) are visually distinct components.
*/

/*
  `tabsSelector` should scope to just this strip when a page has several, so unrelated tabs aren't
  toggled. `onSwitch` covers side effects a panel show/hide can't, like resizing a canvas that was
  hidden (and zero-sized) until its panel appeared.
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
