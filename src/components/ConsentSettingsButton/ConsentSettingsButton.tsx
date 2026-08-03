"use client";

import type { JSX } from "react";
import Button from "@/components/Button";
import { CONSENT_OPEN_EVENT } from "@/lib/consent";

// Withdrawing consent has to be as easy as giving it, so the banner can be brought back from anywhere it's placed.
export default function ConsentSettingsButton(): JSX.Element {
  return (
    <Button variant="outlined" size="sm" onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}>
      Change cookie settings
    </Button>
  );
}

ConsentSettingsButton.displayName = "ConsentSettingsButton";
