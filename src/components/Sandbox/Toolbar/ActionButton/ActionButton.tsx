"use client";

import { Root } from "@/components/Sandbox/Toolbar/ActionButton/ActionButton.styles";

// A real component (not just a css class) so it supports the "as" prop for polymorphic swapping, e.g. rendering as Sandpack's UnstyledOpenInCodeSandboxButton.
const ActionButton = Root;

ActionButton.displayName = "ActionButton";

export default ActionButton;
