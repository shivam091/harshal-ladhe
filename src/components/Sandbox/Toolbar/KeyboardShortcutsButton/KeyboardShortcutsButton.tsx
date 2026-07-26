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
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/Toolbar/ActionButton";
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
} from "@/components/Sandbox/Toolbar/KeyboardShortcutsButton/KeyboardShortcutsButton.styles";

/*
  Toolbar button that opens a modal listing every keyboard shortcut available in the Sandbox
  editor — CodeMirror's own bindings (search, folding, multi-cursor, autocomplete, diagnostics)
  plus this app's own sandbox-level shortcuts (format, reset, file explorer, line numbers,
  console, tabs, split layout, copy file, open in CodeSandbox). The list itself lives in
  data/sandbox-keyboard-shortcuts.ts so it has one source of truth; this component only renders
  it inside a Radix Dialog.

  Each key combo renders as a bare <kbd> — the site already styles that tag globally with a
  pressed-key look (see styles/base/typography/_code.scss), so no bespoke chip styling is
  needed here.
*/
export default function KeyboardShortcutsButton({ size = 14 }: KeyboardShortcutsButtonProps): JSX.Element {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <ActionButton
            type="button"
            aria-label="Show keyboard shortcuts"
            title="Show keyboard shortcuts"
          >
            <Icon name="keyboard" size={size} />
            <VisuallyHidden>Show keyboard shortcuts</VisuallyHidden>
          </ActionButton>
        </DialogTrigger>

        <DialogContent size="large">
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
