import { EditorView, runScopeHandlers, type Panel, type ViewUpdate } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";
import {
  SearchQuery,
  getSearchQuery,
  setSearchQuery,
  findNext,
  findPrevious,
  replaceNext,
  replaceAll,
  selectMatches,
  closeSearchPanel
} from "@codemirror/search";
import { toolbarIconButtonCx } from "@/components/Sandbox/Sandbox.styles";
import {
  createChevronIcon,
  createChevronDownIcon,
  createChevronRightIcon,
  createCloseIcon,
  createFindInSelectionIcon,
  createMatchCaseIcon,
  createMatchWholeWordIcon,
  createReplaceIcon,
  createReplaceAllIcon,
  createSelectAllIcon,
  createUseRegexpIcon
} from "@/components/Sandbox/Editor/extensions/search-icons";
import { closePanelAnimated } from "@/components/Sandbox/Editor/extensions/panel-motion";

// A search-cursor match with its optional regexp capture groups.
interface BoundedMatch {
  from: number;
  to: number;
  match?: RegExpMatchArray;
}

// Finds the next match within a range.
function boundedNext(view: EditorView, range: { from: number; to: number }): boolean {
  const query = getSearchQuery(view.state);
  if (!query.valid) return false;
  const after = Math.max(range.from, Math.min(range.to, view.state.selection.main.to));
  let result = query.getCursor(view.state, after, range.to).next();
  if (result.done) result = query.getCursor(view.state, range.from, range.to).next();
  if (result.done) return false;
  const { from, to } = result.value;
  view.dispatch({
    selection: EditorSelection.single(from, to),
    effects: EditorView.scrollIntoView(from, { y: "nearest" }),
    userEvent: "select.search"
  });
  return true;
}

// Finds the previous match within a range.
function boundedPrevious(view: EditorView, range: { from: number; to: number }): boolean {
  const query = getSearchQuery(view.state);
  if (!query.valid) return false;
  const before = Math.max(range.from, Math.min(range.to, view.state.selection.main.from));
  let last: { from: number; to: number } | null = null;
  for (const cursor = query.getCursor(view.state, range.from, before); ; ) {
    const r = cursor.next();
    if (r.done) break;
    last = r.value;
  }
  if (!last) {
    for (const cursor = query.getCursor(view.state, range.from, range.to); ; ) {
      const r = cursor.next();
      if (r.done) break;
      last = r.value;
    }
  }
  if (!last) return false;
  view.dispatch({
    selection: EditorSelection.single(last.from, last.to),
    effects: EditorView.scrollIntoView(last.from, { y: "nearest" }),
    userEvent: "select.search"
  });
  return true;
}

// Selects every match within a range.
function boundedSelectAll(view: EditorView, range: { from: number; to: number }): boolean {
  const query = getSearchQuery(view.state);
  if (!query.valid) return false;
  const ranges: ReturnType<typeof EditorSelection.range>[] = [];
  for (const cursor = query.getCursor(view.state, range.from, range.to); ; ) {
    const r = cursor.next();
    if (r.done) break;
    if (ranges.length > 1000) break;
    ranges.push(EditorSelection.range(r.value.from, r.value.to));
  }
  if (!ranges.length) return false;
  view.dispatch({ selection: EditorSelection.create(ranges), userEvent: "select.search.matches" });
  return true;
}

// Computes the replacement text for a match.
function computeReplacement(query: SearchQuery, match: RegExpMatchArray | undefined): string {
  const unquoted = query.literal
    ? query.replace
    : query.replace.replace(/\\([nrt\\])/g, (_, ch: string) => (ch === "n" ? "\n" : ch === "r" ? "\r" : ch === "t" ? "\t" : "\\"));
  if (!query.regexp || !match) return unquoted;
  return unquoted.replace(/\$([$&]|\d+)/g, (whole, group: string) => {
    if (group === "&") return match[0];
    if (group === "$") return "$";
    for (let l = group.length; l > 0; l--) {
      const n = Number(group.slice(0, l));
      if (n > 0 && n < match.length) return (match[n] ?? "") + group.slice(l);
    }
    return whole;
  });
}

// Replaces every match within a range.
function boundedReplaceAll(view: EditorView, range: { from: number; to: number }): boolean {
  if (view.state.readOnly) return false;
  const query = getSearchQuery(view.state);
  if (!query.valid) return false;
  const changes: { from: number; to: number; insert: string }[] = [];
  for (const cursor = query.getCursor(view.state, range.from, range.to); ; ) {
    const r = cursor.next();
    if (r.done) break;
    const value = r.value as BoundedMatch;
    changes.push({ from: value.from, to: value.to, insert: computeReplacement(query, value.match) });
  }
  if (!changes.length) return false;
  view.dispatch({ changes, userEvent: "input.replace.all" });
  return true;
}

// Closes the search panel with its exit animation.
export function closeSandboxSearchPanel(view: EditorView): boolean {
  const panel = view.dom.querySelector<HTMLElement>(".sandbox-search-panel");
  if (!panel) {
    return closeSearchPanel(view);
  }
  closePanelAnimated(panel, () => closeSearchPanel(view));
  return true;
}

// The SearchQuery flags the panel exposes as toggle buttons.
type ToggleKey = "caseSensitive" | "wholeWord" | "regexp";

// Data-driven, so the three toggle buttons are built and kept in sync identically.
const TOGGLES: { key: ToggleKey; icon: () => SVGSVGElement; title: string }[] = [
  { key: "caseSensitive", icon: createMatchCaseIcon, title: "Match Case" },
  { key: "wholeWord", icon: createMatchWholeWordIcon, title: "Match Whole Word" },
  { key: "regexp", icon: createUseRegexpIcon, title: "Use Regular Expression" }
];

// The search/replace panel.
export class SandboxSearchPanel implements Panel {
  dom: HTMLElement;
  // False here (the default) makes CM read .cm-panels' zero rect (display: contents) as a huge bottom scroll margin, breaking scrollIntoView.
  readonly top = true;

  private view: EditorView;
  private query: SearchQuery;
  private searchField: HTMLInputElement;
  private replaceField: HTMLInputElement;
  private countLabel: HTMLSpanElement;
  private toggleButtons: { key: ToggleKey; button: HTMLButtonElement }[] = [];
  private replaceRow: HTMLDivElement;
  private expandButton: HTMLButtonElement;
  private replaceExpanded = false;
  private findInSelectionButton: HTMLButtonElement;
  // The range to search within, or null for the whole document.
  private findInSelectionRange: { from: number; to: number } | null = null;

  constructor(view: EditorView) {
    this.view = view;
    this.query = getSearchQuery(view.state);

    this.searchField = this.createTextField("search", "Find");
    this.replaceField = this.createTextField("replace", "Replace");
    this.countLabel = document.createElement("span");
    this.countLabel.className = "sandbox-search-count";

    const findFieldWrap = document.createElement("div");
    findFieldWrap.className = "sandbox-search-field-wrap sandbox-search-field-wrap--find";
    findFieldWrap.append(this.searchField, this.countLabel);

    this.expandButton = this.createIconButton(createChevronRightIcon(), "Toggle Replace");
    this.expandButton.classList.add("sandbox-search-expand-btn");
    this.expandButton.setAttribute("aria-expanded", "false");
    this.expandButton.onclick = () => this.toggleReplaceRow();

    const toggleGroup = document.createElement("div");
    toggleGroup.className = "sandbox-search-toggles";
    for (const { key, icon, title } of TOGGLES) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sandbox-search-toggle";
      button.title = title;
      button.setAttribute("aria-label", title);
      button.setAttribute("aria-pressed", "false");
      button.append(icon());
      button.onclick = () => this.toggle(key);
      this.toggleButtons.push({ key, button });
      toggleGroup.append(button);
    }

    this.findInSelectionButton = this.createIconButton(createFindInSelectionIcon(), "Find in Selection");
    this.findInSelectionButton.classList.add("sandbox-search-toggle");
    this.findInSelectionButton.setAttribute("aria-pressed", "false");
    this.findInSelectionButton.onclick = () => this.toggleFindInSelection();
    toggleGroup.append(this.findInSelectionButton);

    const prevButton = this.createIconButton(createChevronIcon("up"), "Previous match (Shift+Enter)");
    const nextButton = this.createIconButton(createChevronIcon("down"), "Next match (Enter)");
    const allButton = this.createIconButton(createSelectAllIcon(), "Select all matches");
    prevButton.onclick = () => this.runKeepingFocus((view) => this.findPrevious(view), this.searchField);
    nextButton.onclick = () => this.runKeepingFocus((view) => this.findNext(view), this.searchField);
    allButton.onclick = () => this.runKeepingFocus((view) => this.selectAll(view), this.searchField);

    const navGroup = document.createElement("div");
    navGroup.className = "sandbox-search-nav";
    navGroup.append(prevButton, nextButton, allButton);

    const closeButton = this.createIconButton(createCloseIcon(), "Close (Escape)");
    closeButton.onclick = () => closeSandboxSearchPanel(this.view);

    const findTrailing = document.createElement("div");
    findTrailing.className = "sandbox-search-trailing";
    findTrailing.append(toggleGroup, this.createSeparator(), navGroup, this.createSeparator(), closeButton);

    const findRow = document.createElement("div");
    findRow.className = "sandbox-search-row sandbox-search-find-row";
    findRow.append(this.expandButton, findFieldWrap, findTrailing);

    const replaceFieldWrap = document.createElement("div");
    replaceFieldWrap.className = "sandbox-search-field-wrap";
    replaceFieldWrap.append(this.replaceField);

    const replaceButton = this.createIconButton(createReplaceIcon(), "Replace (Enter)");
    const replaceAllButton = this.createIconButton(createReplaceAllIcon(), "Replace All (Ctrl+Alt+Enter)");
    replaceButton.onclick = () => this.runKeepingFocus(replaceNext, this.replaceField);
    replaceAllButton.onclick = () => this.runKeepingFocus((view) => this.replaceAllMatches(view), this.replaceField);

    const replaceTrailing = document.createElement("div");
    replaceTrailing.className = "sandbox-search-trailing";
    replaceTrailing.append(replaceButton, replaceAllButton);

    this.replaceRow = document.createElement("div");
    this.replaceRow.className = "sandbox-search-row sandbox-search-replace-row";
    this.replaceRow.hidden = true;
    this.replaceRow.append(replaceFieldWrap, replaceTrailing);

    this.dom = document.createElement("div");
    this.dom.className = "sandbox-search-panel";
    this.dom.onkeydown = (event) => this.keydown(event);
    this.dom.append(findRow, this.replaceRow);

    this.syncToggleState();
    this.updateCount();
  }

  private createSeparator(): HTMLDivElement {
    const separator = document.createElement("div");
    separator.className = "sandbox-search-separator";
    return separator;
  }

  private createTextField(name: string, placeholder: string): HTMLInputElement {
    const field = document.createElement("input");
    field.className = "cm-textfield sandbox-search-input";
    field.name = name;
    field.placeholder = placeholder;
    field.setAttribute("aria-label", placeholder);
    field.autocomplete = "off";
    field.spellcheck = false;
    field.value = name === "replace" ? this.query.replace : this.query.search;
    field.oninput = () => this.commit();
    return field;
  }

  private createIconButton(icon: SVGSVGElement, title: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `sandbox-search-icon-btn ${toolbarIconButtonCx}`;
    button.title = title;
    button.setAttribute("aria-label", title);
    button.append(icon);
    return button;
  }

  private findNext(view: EditorView): boolean {
    return this.findInSelectionRange ? boundedNext(view, this.findInSelectionRange) : findNext(view);
  }

  private findPrevious(view: EditorView): boolean {
    return this.findInSelectionRange ? boundedPrevious(view, this.findInSelectionRange) : findPrevious(view);
  }

  private selectAll(view: EditorView): boolean {
    return this.findInSelectionRange ? boundedSelectAll(view, this.findInSelectionRange) : selectMatches(view);
  }

  private replaceAllMatches(view: EditorView): boolean {
    return this.findInSelectionRange ? boundedReplaceAll(view, this.findInSelectionRange) : replaceAll(view);
  }

  // Toggles the Find in Selection scope.
  private toggleFindInSelection() {
    if (this.findInSelectionRange) {
      this.findInSelectionRange = null;
    } else {
      const { from, to } = this.view.state.selection.main;
      if (from === to) return;
      this.findInSelectionRange = { from, to };
    }
    this.findInSelectionButton.setAttribute("aria-pressed", String(!!this.findInSelectionRange));
    this.updateCount();
    this.searchField.focus();
  }

  private toggleReplaceRow() {
    this.replaceExpanded = !this.replaceExpanded;
    this.replaceRow.hidden = !this.replaceExpanded;
    this.expandButton.setAttribute("aria-expanded", String(this.replaceExpanded));
    this.expandButton.replaceChildren(
      this.replaceExpanded ? createChevronDownIcon() : createChevronRightIcon()
    );
    if (this.replaceExpanded) {
      this.replaceField.focus();
    }
  }

  private toggle(key: ToggleKey) {
    this.query = new SearchQuery({
      search: this.query.search,
      replace: this.query.replace,
      caseSensitive: key === "caseSensitive" ? !this.query.caseSensitive : this.query.caseSensitive,
      wholeWord: key === "wholeWord" ? !this.query.wholeWord : this.query.wholeWord,
      regexp: key === "regexp" ? !this.query.regexp : this.query.regexp
    });
    this.view.dispatch({ effects: setSearchQuery.of(this.query) });
    this.syncToggleState();
    this.updateCount();
  }

  private commit() {
    const next = new SearchQuery({
      search: this.searchField.value,
      replace: this.replaceField.value,
      caseSensitive: this.query.caseSensitive,
      wholeWord: this.query.wholeWord,
      regexp: this.query.regexp
    });
    if (!next.eq(this.query)) {
      this.query = next;
      this.view.dispatch({ effects: setSearchQuery.of(next) });
    }
    this.updateCount();
  }

  private syncToggleState() {
    for (const { key, button } of this.toggleButtons) {
      button.setAttribute("aria-pressed", String(this.query[key]));
    }
  }

  // Total/current match counts aren't exposed directly — computed here from the query's own cursor.
  private updateCount() {
    const { search } = this.query;
    if (!search) {
      this.countLabel.textContent = "";
      this.searchField.removeAttribute("aria-invalid");
      return;
    }
    if (!this.query.valid) {
      this.countLabel.textContent = "";
      this.searchField.setAttribute("aria-invalid", "true");
      return;
    }
    this.searchField.removeAttribute("aria-invalid");

    const selection = this.view.state.selection.main;
    const cursor = this.findInSelectionRange
      ? this.query.getCursor(this.view.state, this.findInSelectionRange.from, this.findInSelectionRange.to)
      : this.query.getCursor(this.view.state);
    let total = 0;
    let current = 0;
    for (let next = cursor.next(); !next.done; next = cursor.next()) {
      total += 1;
      if (next.value.from <= selection.from && next.value.to >= selection.to) {
        current = total;
      }
    }
    this.countLabel.textContent = total === 0 ? "No results" : `${current || 1} of ${total}`;
    this.countLabel.toggleAttribute("data-empty", total === 0);
  }

  private keydown(event: KeyboardEvent) {
    if (runScopeHandlers(this.view, event, "search-panel")) {
      event.preventDefault();
      return;
    }
    if (event.key === "Enter" && event.altKey && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.runKeepingFocus((view) => this.replaceAllMatches(view), this.replaceField);
    } else if (event.key === "Enter" && event.target === this.searchField) {
      event.preventDefault();
      this.runKeepingFocus((view) => (event.shiftKey ? this.findPrevious(view) : this.findNext(view)), this.searchField);
    } else if (event.key === "Enter" && event.target === this.replaceField) {
      event.preventDefault();
      this.runKeepingFocus(replaceNext, this.replaceField);
    }
  }

  // Runs a command, keeping focus on the given field.
  private runKeepingFocus(command: (view: EditorView) => boolean, field: HTMLInputElement) {
    command(this.view);
    field.focus();
    requestAnimationFrame(() => {
      if (this.dom.isConnected) field.focus();
    });
  }

  mount() {
    this.searchField.select();
  }

  update(update: ViewUpdate) {
    let queryChanged = false;
    for (const tr of update.transactions) {
      for (const effect of tr.effects) {
        if (effect.is(setSearchQuery) && !effect.value.eq(this.query)) {
          this.setQuery(effect.value);
          queryChanged = true;
        }
      }
    }
    // The match count depends only on the doc content, the query, and which match the selection sits in.
    if (update.docChanged || update.selectionSet || queryChanged) {
      this.updateCount();
    }
  }

  private setQuery(query: SearchQuery) {
    this.query = query;
    this.searchField.value = query.search;
    this.replaceField.value = query.replace;
    this.syncToggleState();
  }
}
