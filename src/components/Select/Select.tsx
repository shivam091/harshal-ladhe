"use client";

import { useCallback, useEffect, useId, useRef, useState, type JSX, type KeyboardEvent } from "react";
import { CheckIcon } from "@/components/Icon";
import IconChevronDown from "@/icons/IconChevronDown";
import { useSound } from "@/hooks/use-sound";
import { findEnabledIndex, findTypeaheadIndex } from "@/components/Select/Select.helpers";
import type { SelectProps, SelectSide } from "@/components/Select/Select.types";
import {
  SelectWrapper,
  SelectTrigger,
  TriggerLabel,
  Chevron,
  Listbox,
  Option,
  OptionCheck
} from "@/components/Select/Select.styles";

// Matches the listbox's max-block-size, so the flip decision uses the height it can actually reach.
const LISTBOX_MAX_HEIGHT_PX = 256;

// How far PageUp/PageDown jump, matching what a native select does.
const PAGE_JUMP = 10;

// Long enough to type a word, short enough that a later keypress starts a fresh search.
const TYPEAHEAD_RESET_MS = 500;

/*
  A select-only combobox (WAI-ARIA APG pattern) instead of a native <select>, because the native
  popup can't be themed. Focus stays on the trigger the whole time and aria-activedescendant
  announces the highlighted option, so screen readers and keyboard users get the same behaviour
  a native select gives them.
*/
export default function Select<T extends string>({
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  size = "md",
  fullWidth = false,
  disabled = false,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy
}: SelectProps<T>): JSX.Element {
  const baseId = useId();
  const triggerId = id ?? `${baseId}-trigger`;
  const listboxId = `${baseId}-listbox`;
  const getOptionId = (index: number) => `${baseId}-option-${index}`;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [side, setSide] = useState<SelectSide>("bottom");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Read by close() so a blur straight after a pick doesn't replay the close sound.
  const isOpenRef = useRef(false);
  // Typed characters so far, plus the timer that clears them.
  const typeaheadRef = useRef<{ query: string; timer: ReturnType<typeof setTimeout> | null }>({ query: "", timer: null });

  const [playOpen] = useSound("/sounds/menu-open-softer.mp3");
  const [playClose] = useSound("/sounds/menu-close.mp3");

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  // Picks the side with room at open time, since the trigger's position changes as the page scrolls.
  const open = useCallback((index?: number) => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const spaceBelow = window.innerHeight - rect.bottom;
      setSide(spaceBelow < LISTBOX_MAX_HEIGHT_PX && rect.top > spaceBelow ? "top" : "bottom");
    }
    setHighlightedIndex(index ?? (selectedIndex >= 0 ? selectedIndex : findEnabledIndex(options, 0, 1)));
    isOpenRef.current = true;
    setIsOpen(true);
    playOpen();
  }, [options, selectedIndex, playOpen]);

  // Safe to call repeatedly (pick, then blur), since only a real open-to-closed change makes a sound.
  const close = useCallback(() => {
    if (!isOpenRef.current) return;
    isOpenRef.current = false;
    setIsOpen(false);
    playClose();
  }, [playClose]);

  // Ignores disabled rows and re-picks of the current value, so callers only hear about real changes.
  function commit(index: number) {
    const option = options[index];
    if (option && !option.disabled && option.value !== value) onValueChange(option.value);
    close();
  }

  // Accumulates keystrokes into one search so "sp" can reach "Spring" past "Smooth Step".
  function handleTypeahead(character: string): number {
    const state = typeaheadRef.current;
    if (state.timer) clearTimeout(state.timer);
    state.query += character;
    state.timer = setTimeout(() => {
      state.query = "";
    }, TYPEAHEAD_RESET_MS);

    const from = isOpen ? highlightedIndex : selectedIndex;
    return findTypeaheadIndex(options, state.query, from);
  }

  // Closes on any press outside, which blur alone misses in browsers that don't focus clicked buttons.
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) close();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, close]);

  // Keeps the keyboard-highlighted row visible inside a scrolling list.
  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) return;
    document.getElementById(`${baseId}-option-${highlightedIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [isOpen, highlightedIndex, baseId]);

  // A pending typeahead reset would otherwise fire after unmount.
  useEffect(() => () => {
    if (typeaheadRef.current.timer) clearTimeout(typeaheadRef.current.timer);
  }, []);

  /*
    Follows the APG select-only combobox keyboard model: arrows/Enter/Space open, arrows/Home/End/
    PageUp/PageDown move, Enter/Space/Alt+ArrowUp/Tab choose, Escape cancels, and printable keys
    jump by label. Space only chooses when it isn't part of a typed search like "smooth step".
  */
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const { key, altKey, ctrlKey, metaKey } = event;
    const isPrintable = key.length === 1 && !ctrlKey && !metaKey && !altKey;
    const isTyping = typeaheadRef.current.query !== "";

    if (!isOpen) {
      if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || (key === " " && !isTyping)) {
        event.preventDefault();
        open();
      } else if (key === "Home" || key === "End") {
        event.preventDefault();
        open(key === "Home" ? findEnabledIndex(options, 0, 1) : findEnabledIndex(options, options.length - 1, -1));
      } else if (isPrintable) {
        const match = handleTypeahead(key);
        if (match >= 0) open(match);
      }
      return;
    }

    switch (key) {
      case "ArrowDown": {
        event.preventDefault();
        const next = findEnabledIndex(options, highlightedIndex + 1, 1);
        if (next >= 0) setHighlightedIndex(next);
        return;
      }
      case "ArrowUp": {
        event.preventDefault();
        if (altKey) {
          commit(highlightedIndex);
          return;
        }
        const previous = findEnabledIndex(options, highlightedIndex - 1, -1);
        if (previous >= 0) setHighlightedIndex(previous);
        return;
      }
      case "Home":
      case "End":
        event.preventDefault();
        setHighlightedIndex(key === "Home" ? findEnabledIndex(options, 0, 1) : findEnabledIndex(options, options.length - 1, -1));
        return;
      case "PageDown":
      case "PageUp": {
        event.preventDefault();
        const step = key === "PageDown" ? 1 : -1;
        const target = Math.min(Math.max(highlightedIndex + step * PAGE_JUMP, 0), options.length - 1);
        const landing = findEnabledIndex(options, target, step);
        setHighlightedIndex(landing >= 0 ? landing : findEnabledIndex(options, target, step === 1 ? -1 : 1));
        return;
      }
      case "Enter":
        event.preventDefault();
        commit(highlightedIndex);
        return;
      case "Escape":
        event.preventDefault();
        close();
        return;
      case "Tab":
        commit(highlightedIndex);
        return;
      default:
        if (key === " " && !isTyping) {
          event.preventDefault();
          commit(highlightedIndex);
        } else if (isPrintable) {
          event.preventDefault();
          const match = handleTypeahead(key);
          if (match >= 0) setHighlightedIndex(match);
        }
    }
  }

  return (
    <>
      <SelectWrapper ref={wrapperRef} className={className} data-fullwidth={fullWidth || undefined}>
        <SelectTrigger
          ref={triggerRef}
          type="button"
          id={triggerId}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={isOpen && highlightedIndex >= 0 ? getOptionId(highlightedIndex) : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          disabled={disabled}
          data-size={size}
          onClick={() => {
            // Safari doesn't focus a clicked button, and the keyboard model needs focus here.
            triggerRef.current?.focus();
            if (isOpen) close(); else open();
          }}
          onKeyDown={handleKeyDown}
          onBlur={close}
        >
          <TriggerLabel data-placeholder={selectedOption ? undefined : true}>
            {selectedOption?.label ?? placeholder}
          </TriggerLabel>
          <Chevron aria-hidden="true">
            <IconChevronDown direction={isOpen ? "up" : "down"} size={14} />
          </Chevron>
        </SelectTrigger>

        {isOpen && (
          <Listbox
            id={listboxId}
            role="listbox"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            data-side={side}
            data-size={size}
            // Keeps focus on the trigger, so clicking an option doesn't blur-close the list first.
            onMouseDown={(event) => event.preventDefault()}
          >
            {options.map((option, index) => (
              <Option
                key={option.value}
                id={getOptionId(index)}
                role="option"
                aria-selected={index === selectedIndex}
                aria-disabled={option.disabled || undefined}
                data-highlighted={index === highlightedIndex || undefined}
                onPointerMove={() => {
                  if (!option.disabled && index !== highlightedIndex) setHighlightedIndex(index);
                }}
                onClick={() => commit(index)}
              >
                <OptionCheck aria-hidden="true">
                  {index === selectedIndex && <CheckIcon size={14} />}
                </OptionCheck>
                {option.label}
              </Option>
            ))}
          </Listbox>
        )}
      </SelectWrapper>
    </>
  );
}

Select.displayName = "Select";
