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
  Built on Radix Collapsible for the ARIA wiring; press state is tracked separately because
  Radix only exposes open/closed, and the trigger icon needs a pressed look too.
*/
export default function Collapse({ trigger, children, id }: CollapseProps): JSX.Element {
  const [open, setOpen]      = useState(false);
  // Covers keyboard as well as pointer so the pressed feedback isn't mouse-only.
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
