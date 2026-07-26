"use client";

import { JSX } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogHeading,
  DialogBody
} from "@/components/Dialog";
import { Icon } from "@/components/Icon";
import IconKeyboard from "@/icons/IconKeyboard";
import { useBoop } from "@/hooks/use-boop";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import { sandboxKeyboardShortcuts } from "@/data/sandbox-keyboard-shortcuts";
import type { KeyboardShortcutsButtonProps } from "@/interfaces/sandbox";
import {
  Grid,
  Group,
  GroupTitle,
  Row,
  Description,
  Keys,
  KeySeparator,
  Note
} from "@/components/Sandbox/SandboxToolbar/KeyboardShortcutsButton/KeyboardShortcutsButton.styles";

/*
  Toolbar button that opens a modal listing every keyboard shortcut available in the Sandbox
  editor — CodeMirror's own bindings (search, folding, multi-cursor, autocomplete, diagnostics)
  plus this app's own sandbox-level shortcuts (format, reset, file explorer, line numbers,
  indent guides, console, tabs, split layout, copy file, open in CodeSandbox). The list itself lives in
  data/sandbox-keyboard-shortcuts.ts so it has one source of truth; this component only renders
  it inside a Radix Dialog.
*/
export default function KeyboardShortcutsButton({ size = 14 }: KeyboardShortcutsButtonProps): JSX.Element {
  // Boop trigger for the keyboard icon's key-press wave, fired on pointer enter.
  const [isBooped, triggerBoop] = useBoop();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();
  const { wrapperEl, showFullscreen } = useSandboxUIContext();

  function handlePointerEnter() {
    onPointerEnter();
    triggerBoop();
  }

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <ActionButton
            type="button"
            aria-label="Show keyboard shortcuts"
            title="Show keyboard Shortcuts"
            onPointerEnter={handlePointerEnter}
            onPointerLeave={onPointerLeave}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <IconKeyboard size={size} isBooped={isBooped} status={status} />
            <VisuallyHidden>Show keyboard shortcuts</VisuallyHidden>
          </ActionButton>
        </DialogTrigger>

        <DialogContent size="large" container={showFullscreen ? wrapperEl : undefined}>
          <DialogHeader>
            <DialogTitle>
              <DialogHeading>Keyboard shortcuts</DialogHeading>
            </DialogTitle>
            <DialogClose>
              <ActionButton type="button" aria-label="Close">
                <Icon name="close" size={16} />
              </ActionButton>
            </DialogClose>
          </DialogHeader>

          <DialogDescription>
            <VisuallyHidden>
              Full list of keyboard shortcuts available in the code editor, grouped by category.
            </VisuallyHidden>
          </DialogDescription>

          <DialogBody>
            <Grid>
              {sandboxKeyboardShortcuts.map((group) => (
                <Group key={group.title}>
                  <GroupTitle>{group.title}</GroupTitle>
                  {group.shortcuts.map((shortcut) => (
                    <Row key={shortcut.description}>
                      <Description>{shortcut.description}</Description>
                      <Keys>
                        {shortcut.keys.map((combo, index) => (
                          <span key={combo}>
                            {index > 0 && (
                              <KeySeparator aria-hidden>/</KeySeparator>
                            )}
                            <kbd>{combo}</kbd>
                          </span>
                        ))}
                        {shortcut.note && <Note>({shortcut.note})</Note>}
                      </Keys>
                    </Row>
                  ))}
                </Group>
              ))}
            </Grid>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}

KeyboardShortcutsButton.displayName = "KeyboardShortcutsButton";
