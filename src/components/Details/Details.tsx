"use client";

import type { JSX} from "react";
import { useState, useId } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { AnimatePresence, motion } from "motion/react";
import IconFlat from "@/icons/IconFlat";
import type { DetailsProps } from "@/components/Details/Details.types";
import {
  DetailsRoot,
  DetailsTrigger,
  DetailsPanel
} from "@/components/Details/Details.styles";

/*
  Motion states for the reveal: the panel grows from zero height while fading
  and sliding down into place, and reverses the same way on collapse.
*/
const PANEL_VARIANTS = {
  initial: { height: 0, opacity: 0, y: -10 },
  animate: { height: "auto", opacity: 1, y: 0 },
  exit:    { height: 0, opacity: 0, y: -10 }
};

/*
  Per-property timing — height runs slightly longer than opacity/y so the
  content settles before the box finishes expanding. All use the same
  ease-out-expo curve for a fast start with a soft landing.
*/
const PANEL_TRANSITION = {
  height:  { duration: 0.3,  ease: [0.16, 1, 0.3, 1] as const },
  opacity: { duration: 0.24, ease: [0.16, 1, 0.3, 1] as const },
  y:       { duration: 0.24, ease: [0.16, 1, 0.3, 1] as const }
};

/*
  MDX disclosure widget — Radix Collapsible for semantics and aria wiring,
  motion/react AnimatePresence for the height + fade + slide reveal, and the
  spring-animated IconFlat (react-spring) for the icon morph on toggle,
  matching the existing icon morph pattern used across the site.
*/
export default function Details({ summary, children }: DetailsProps): JSX.Element {
  // Disclosure state — starts collapsed; Radix reports changes via onOpenChange.
  const [open, setOpen] = useState(false);

  // Stable ids linking trigger and panel for aria-controls / aria-labelledby.
  const triggerId = useId();
  const panelId   = useId();

  return (
    <>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <DetailsRoot>
          {/*
            aria-controls is only set while the panel is actually mounted — AnimatePresence
            unmounts it on collapse, and a stale reference to a since-removed id is worse
            than omitting the attribute when there's nothing (yet) to control.
          */}
          <Collapsible.Trigger asChild>
            <DetailsTrigger id={triggerId} aria-controls={open ? panelId : undefined}>
              <IconFlat open={open} />
              {summary}
            </DetailsTrigger>
          </Collapsible.Trigger>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                key="panel"
                variants={PANEL_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={PANEL_TRANSITION}
                style={{ overflow: "hidden" }}
              >
                <DetailsPanel>{children}</DetailsPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </DetailsRoot>
      </Collapsible.Root>
    </>
  );
}

Details.displayName = "Details";
