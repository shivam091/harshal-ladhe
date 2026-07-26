import type { EditorView} from "@codemirror/view";
import { runScopeHandlers, type Panel, type ViewUpdate } from "@codemirror/view";
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
import { createChevronIcon, createCloseIcon } from "@/components/Sandbox/Editor/extensions/search-icons";

type ToggleKey = "caseSensitive" | "wholeWord" | "regexp";

const TOGGLES: { key: ToggleKey; label: string; title: string }[] = [
  { key: "caseSensitive", label: "Aa", title: "Match Case" },
  { key: "wholeWord", label: "ab", title: "Match Whole Word" },
  { key: "regexp", label: ".*", title: "Use Regular Expression" }
];

/*
  Replaces @codemirror/search's built-in SearchPanel (via search({ createPanel })) with one themed
  to this app's design system: icon toggle buttons instead of native checkboxes, chevron icon
  buttons for next/prev, and a live "n of m" match counter. Mirrors the built-in panel's own
  commit/update/keydown wiring (see @codemirror/search's SearchPanel) since that's what keeps
  Mod-g/F3/Escape working while focus sits inside the panel's inputs.
*/
export class SandboxSearchPanel implements Panel {
  dom: HTMLElement;

  private view: EditorView;
  private query: SearchQuery;
  private searchField: HTMLInputElement;
  private replaceField: HTMLInputElement;
  private countLabel: HTMLSpanElement;
  private toggleButtons: { key: ToggleKey; button: HTMLButtonElement }[] = [];

  constructor(view: EditorView) {
    this.view = view;
    this.query = getSearchQuery(view.state);

    this.searchField = this.createTextField("search", "Find");
    this.replaceField = this.createTextField("replace", "Replace");
    this.countLabel = document.createElement("span");
    this.countLabel.className = "sandbox-search-count";

    const fieldWrap = document.createElement("div");
    fieldWrap.className = "sandbox-search-field-wrap";
    fieldWrap.append(this.searchField, this.countLabel);

    const toggleGroup = document.createElement("div");
    toggleGroup.className = "sandbox-search-toggles";
    for (const { key, label, title } of TOGGLES) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sandbox-search-toggle";
      button.title = title;
      button.setAttribute("aria-label", title);
      button.setAttribute("aria-pressed", "false");
      button.textContent = label;
      button.onclick = () => this.toggle(key);
      this.toggleButtons.push({ key, button });
      toggleGroup.append(button);
    }

    const prevButton = this.createIconButton(createChevronIcon("up"), "Previous match (Shift+Enter)");
    const nextButton = this.createIconButton(createChevronIcon("down"), "Next match (Enter)");
    const allButton = this.createTextButton("All", "Select all matches");
    prevButton.onclick = () => findPrevious(this.view);
    nextButton.onclick = () => findNext(this.view);
    allButton.onclick = () => selectMatches(this.view);

    const navGroup = document.createElement("div");
    navGroup.className = "sandbox-search-nav";
    navGroup.append(prevButton, nextButton, allButton);

    // Find row's buttons sit directly beside the field, same as the replace row below — no
    // trailing group pushed to the row's far edge.
    const findRow = document.createElement("div");
    findRow.className = "sandbox-search-row";
    findRow.append(fieldWrap, toggleGroup, navGroup);

    const replaceButton = this.createTextButton("Replace", "Replace current match");
    const replaceAllButton = this.createTextButton("Replace All", "Replace all matches");
    replaceButton.onclick = () => replaceNext(this.view);
    replaceAllButton.onclick = () => replaceAll(this.view);

    const replaceRow = document.createElement("div");
    replaceRow.className = "sandbox-search-row sandbox-search-replace-row";
    replaceRow.append(this.replaceField, replaceButton, replaceAllButton);

    // Plain corner close button, same look as the goto-line card's and the file tabs' close
    // icons — pinned to the panel's own top-right corner since, unlike those, this panel has no
    // dedicated header row to anchor it in-flow.
    const closeButton = this.createIconButton(createCloseIcon(), "Close (Escape)");
    closeButton.classList.add("sandbox-search-close");
    closeButton.onclick = () => closeSearchPanel(this.view);

    this.dom = document.createElement("div");
    this.dom.className = "sandbox-search-panel";
    this.dom.onkeydown = (event) => this.keydown(event);
    this.dom.append(findRow, replaceRow, closeButton);

    this.syncToggleState();
    this.updateCount();
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

  private createTextButton(label: string, title: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cm-button";
    button.title = title;
    button.textContent = label;
    return button;
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
    const cursor = this.query.getCursor(this.view.state);
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
    if (event.key === "Enter" && event.target === this.searchField) {
      event.preventDefault();
      (event.shiftKey ? findPrevious : findNext)(this.view);
    } else if (event.key === "Enter" && event.target === this.replaceField) {
      event.preventDefault();
      replaceNext(this.view);
    }
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
