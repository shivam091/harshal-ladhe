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

// A search-cursor match, widened to admit the regexp cursor's own capture-group array — present at
// runtime (@codemirror/search's RegExpQuery.getReplacement reads the same field) but left out of
// SearchQuery.getCursor's public Iterator<{from,to}> return type.
interface BoundedMatch {
  from: number;
  to: number;
  match?: RegExpMatchArray;
}

/*
  "Find in Selection" restricts find-next/previous, select-all, and replace/replace-all to a range
  captured from the selection at the moment the toggle is turned on — @codemirror/search has no
  built-in notion of this, but SearchQuery.getCursor(state, from, to) already accepts bounds, so
  every one of these is just that cursor walked/wrapped within `range` instead of the whole doc.
*/
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

function boundedPrevious(view: EditorView, range: { from: number; to: number }): boolean {
  const query = getSearchQuery(view.state);
  if (!query.valid) return false;
  const before = Math.max(range.from, Math.min(range.to, view.state.selection.main.from));
  // @codemirror/search's own SearchCursor has no reverse iteration — walking forward and keeping
  // the last match seen (same trick its internal prevMatchInRange uses, just unchunked since this
  // range is already bounded to a selection) finds the one just before `before`.
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

// Re-derives the same \n/\r/\t-unescaping @codemirror/search's own (internal, unexported)
// SearchQuery.unquote applies, plus $1/$&/$$ capture-group substitution for regexp mode — both
// only ever act on the public `query.replace`/`query.literal`/`query.regexp` fields.
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

/*
  Swaps in for @codemirror/search's own closeSearchPanel wherever it'd normally run (the panel's
  close button, and the Escape binding search.ts overrides in its keymap) — plays the panel's
  slide-up/fade-out (see search-panel.styles.ts) before actually closing it, instead of the panel
  vanishing instantly.
*/
export function closeSandboxSearchPanel(view: EditorView): boolean {
  const panel = view.dom.querySelector<HTMLElement>(".sandbox-search-panel");
  if (!panel) {
    return closeSearchPanel(view);
  }
  closePanelAnimated(panel, () => closeSearchPanel(view));
  return true;
}

type ToggleKey = "caseSensitive" | "wholeWord" | "regexp";

const TOGGLES: { key: ToggleKey; icon: () => SVGSVGElement; title: string }[] = [
  { key: "caseSensitive", icon: createMatchCaseIcon, title: "Match Case" },
  { key: "wholeWord", icon: createMatchWholeWordIcon, title: "Match Whole Word" },
  { key: "regexp", icon: createUseRegexpIcon, title: "Use Regular Expression" }
];

/*
  Replaces @codemirror/search's built-in SearchPanel (via search({ createPanel })) with a card
  docked to the editor's top-right corner — VS Code's find-widget treatment — instead of the
  default docked top/bottom panel. `dom` is still a real Panel per CodeMirror's contract — just
  styled as an absolutely-positioned element rather than an in-flow bar — so mount/update/keydown
  wiring and the searchKeymap bindings (Mod-f, Mod-g, F3, Escape, ...) all keep working unchanged.
*/
export class SandboxSearchPanel implements Panel {
  dom: HTMLElement;

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
  // Captured from the selection at the moment the toggle turns on (not live-tracked afterward,
  // matching VS Code) — null means "search the whole document."
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
    // Spans both grid rows (see .sandbox-search-expand-btn) so it sits vertically centered between
    // the find and replace rows once expanded, VS Code's own toggle placement, instead of only
    // centering within the find row's own height.
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
    // Reuses the Aa/ab/.* toggles' pressed-state styling (border/background/color on aria-pressed).
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

    /*
      Order mirrors VS Code's find widget: an expand/collapse toggle for the replace row, the
      field with its inline match count, the case/word/regex toggles, a separator, prev/next/
      select-all, another separator, then close pinned to the far edge. The three groups after
      the toggle (leading control, field, everything else) become the find and replace rows'
      shared grid columns below — each row's trailing group is wrapped as one cell (see
      .sandbox-search-trailing) so both rows' field cells stay the same width, whichever row's
      trailing content happens to be wider.
    */
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

    // Sits beside the replace field, same grid cell shape as findTrailing above — any width
    // findTrailing doesn't use (it's normally wider, having five items to these two) is left blank.
    const replaceTrailing = document.createElement("div");
    replaceTrailing.className = "sandbox-search-trailing";
    replaceTrailing.append(replaceButton, replaceAllButton);

    this.replaceRow = document.createElement("div");
    this.replaceRow.className = "sandbox-search-row sandbox-search-replace-row";
    this.replaceRow.hidden = true;
    // No leading cell of its own — expandButton's row-span (see .sandbox-search-expand-btn) already
    // occupies this row's first grid column.
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

  // Find Next/Previous/Select All/Replace All all route through these, bounded to
  // findInSelectionRange when the toggle is on, otherwise the plain @codemirror/search commands.
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

  /*
    Captures the current selection as the search range on the way in (VS Code does the same — the
    range doesn't keep tracking the selection afterward, so editing the selection while this is on
    doesn't move it). Requires a non-empty selection: nothing to scope to otherwise.
  */
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
    // Clicking this button (like any button) moves DOM focus to it — pull focus back to the search
    // field so Enter/Shift+Enter (routed by keydown() via event.target) keep working right after.
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
    // Checked first: Ctrl+Alt+Enter is "Replace All" from either field, same as VS Code's find widget.
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

  /*
    findNext/findPrevious/replaceNext/etc. dispatch a transaction that moves the editor's own
    selection — which, after settling, ends up handing DOM focus back to the code editor itself
    (CodeMirror/Sandpack's own reaction to that selection change) even though focus was on this
    field just before the call. Reasserting focus here (immediately, and again next frame in case
    that handoff happens asynchronously) keeps the field focused across repeated Enter presses or
    button clicks, matching VS Code's find widget instead of leaking keystrokes into the document.
  */
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
