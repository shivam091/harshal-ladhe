"use client";

import type { JSX} from "react";
import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import type { CollapseProps } from "@/components/Collapse/Collapse.types";
import {
  collapsePanelClass,
  CollapseContent,
  CollapseRoot,
  CollapseToggle
} from "@/components/Collapse/Collapse.styles";

/*
  Animated accordion panel — expands/collapses with a height + fade + slide transition.
  Radix Collapsible manages open state and ARIA (aria-expanded, aria-controls);
  isPressed is tracked manually so the trigger render-prop can drive icon appearance.
*/
export default function Collapse({ trigger, children, id }: CollapseProps): JSX.Element {
  const [open, setOpen]      = useState(false);
  // Tracks pointer/keyboard press so callers can show a "flat" pressed state on the trigger icon.
  const [isPressed, setIsPressed] = useState(false);

  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;

  return (
    <Collapsible.Root asChild open={open} onOpenChange={setOpen}>
      <CollapseRoot>
        <Collapsible.Trigger asChild>
          <CollapseToggle
            id={triggerId}
            onPointerDown={() => setIsPressed(true)}
            onPointerUp={() => setIsPressed(false)}
            onPointerLeave={() => setIsPressed(false)}
            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") setIsPressed(true); }}
            onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") setIsPressed(false); }}
            onBlur={() => setIsPressed(false)}
          >
            {trigger(open, isPressed)}
          </CollapseToggle>
        </Collapsible.Trigger>

        <Collapsible.Content
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className={collapsePanelClass}
        >
          <CollapseContent>
            {children}
          </CollapseContent>
        </Collapsible.Content>
      </CollapseRoot>
    </Collapsible.Root>
  );
}

Collapse.displayName = "Collapse";
