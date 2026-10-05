"use client";

import { useRef } from "react";
import type { JSX, KeyboardEvent } from "react";
import { TabRow, Tab } from "@/components/OpenGraphPreview/TabList/TabList.styles";
import type { TabListProps } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

/*
  WAI-ARIA tabs with a roving tabindex: only the selected tab is in the Tab order, and arrow keys,
  Home and End move between tabs (selecting as they go), so a keyboard user crosses the whole row in
  one Tab press instead of seven. Panels are expected at `${idPrefix}-panel-${id}`.
*/
export default function TabList<T extends string>({ label, idPrefix, tabs, selected, onSelect }: TabListProps<T>): JSX.Element {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  // Moves focus along with the selection so the focused tab and the shown panel never disagree.
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
        : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
          : event.key === "Home" ? 0
            : event.key === "End" ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    onSelect(tabs[next].id);
    refs.current[next]?.focus();
  }

  return (
    <>
      <TabRow role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <Tab
            key={tab.id}
            ref={(element) => {
              refs.current[index] = element;
            }}
            id={`${idPrefix}-tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={tab.id === selected}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            tabIndex={tab.id === selected ? 0 : -1}
            data-selected={tab.id === selected ? "true" : undefined}
            onClick={() => onSelect(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabRow>
    </>
  );
}

TabList.displayName = "TabList";
