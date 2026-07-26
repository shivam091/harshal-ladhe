import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import type { Extension } from "@codemirror/state";

/*
  Sandpack's bundled highlighting uses coarser tags that disagree with the site's Shiki colours, so
  this maps tags to classes reusing Shiki's CSS vars. Colours live in the stylesheet rather than
  here, to avoid a class-union race between two highlight styles.
*/

// Exported, not just its extension, so pinned sticky rows can highlight with the same rules.
export const sandboxSyntaxHighlightStyle = HighlightStyle.define([
  { tag: t.comment, class: "cm-sbx-comment" },

  /*
    Covers controlKeyword/operatorKeyword/definitionKeyword/moduleKeyword/modifier/self (this)
    automatically — all subtags of tags.keyword, per @lezer/highlight's own tag hierarchy.
  */
  { tag: t.keyword, class: "cm-sbx-keyword" },

  { tag: t.string, class: "cm-sbx-string" },

  // CSS url(...) arguments — a subtag of `literal`, not `string`, so the rule above misses it.
  { tag: t.url, class: "cm-sbx-string" },

  { tag: t.number, class: "cm-sbx-number" },

  // Generic punctuation falls through to plain foreground, matching --sp-syntax-color-plain's own treatment of untagged text.
  { tag: t.punctuation, class: "cm-sbx-punctuation" },

  /*
    CSS hex colours are their own literal subtag, not `number` — grouped with numbers here to
    match SHIKI_THEME's "Numeric literals" scope, which does the same.
  */
  { tag: t.color, class: "cm-sbx-number" },

  // Function calls/definitions/tagged templates — SHIKI_THEME's "Functions" group (bold).
  {
    tag: [
      t.function(t.variableName),
      t.function(t.propertyName),
      t.function(t.definition(t.variableName))
    ],
    class: "cm-sbx-function"
  },

  // HTML/JSX tags (native + custom/component) and their angle brackets share one colour here.
  {
    tag: [t.tagName, t.standard(t.tagName), t.angleBracket],
    class: "cm-sbx-tag"
  },

  /*
    Generic identifier fallback — more specific rules below win for the tags they cover, since
    HighlightStyle prefers the most specific matching tag.
  */
  { tag: t.name, class: "cm-sbx-name" },

  // Built-in-ish constants, types, and classes/interfaces — unstyled in Sandpack's own mapping today.
  {
    tag: [
      t.typeName,
      t.definition(t.typeName),
      t.className,
      t.definition(t.className),
      t.atom,
      t.bool,
      t.null
    ],
    class: "cm-sbx-builtin"
  },

  /*
    CSS pseudo-classes (:hover) get their own modifier tag distinct from a bare className, so this
    can target them without touching the JS-class-name/CSS-class-selector ambiguity above.
  */
  { tag: t.constant(t.className), class: "cm-sbx-entity" },

  // HTML/JSX attribute names + HTML character entities (&amp; etc).
  { tag: [t.attributeName, t.character], class: "cm-sbx-entity" },
  /*
    Bare property names (CSS `color:` / object-literal `foo:`) get their own class, distinct from
    generic identifiers — t.function(t.propertyName) above already wins for the function-call
    case (`foo.bar()`), so this only catches the rest.
  */
  { tag: t.propertyName, class: "cm-sbx-property" },

  { tag: t.namespace, class: "cm-sbx-namespace" },

  /*
    Operators (+, =, =>, ===, &&, …) — a top-level tag distinct from punctuation, so the
    punctuation rule above doesn't catch it. Not part of SHIKI_THEME (TextMate themes generally
    leave bare operators at the plain foreground too), so this uses the dedicated "subtle" token
    instead of any of the syntax-* colours above.
  */
  { tag: t.operator, class: "cm-sbx-operator" },

  // The "@" decorator sigil — the only supported language that uses tags.meta.
  { tag: t.meta, class: "cm-sbx-decorator" },

  // HTML doctype / processing instructions override the meta rule above with a distinct colour.
  { tag: [t.documentMeta, t.processingInstruction], class: "cm-sbx-meta" },

  // Regex, escape sequences, CSS units, and template-literal ${ } delimiters — SHIKI_THEME's "Symbols" group.
  { tag: [t.regexp, t.escape, t.unit, t.special(t.brace)], class: "cm-sbx-symbol" },

  /*
    CSS ID selectors (#myid) and keyframe names share this tag in @lezer/css's highlight.js —
    SHIKI_THEME colours CSS IDs as "entity" (entity.other.attribute-name.id.css), same group as
    attribute names above.
  */
  { tag: t.labelName, class: "cm-sbx-entity" },

  // Markdown headings (# … through ######) — SHIKI_THEME's "Headings" group.
  {
    tag: [t.heading, t.heading1, t.heading2, t.heading3, t.heading4, t.heading5, t.heading6],
    class: "cm-sbx-heading"
  },

  // Markdown bold — grouped with the existing function class to match SHIKI_THEME's shared "Functions & bold markdown" scope.
  { tag: t.strong, class: "cm-sbx-function" },

  // Markdown italic — grouped with the existing entity class to match SHIKI_THEME's italic→entity colour reuse.
  { tag: t.emphasis, class: "cm-sbx-entity" },

  { tag: t.strikethrough, class: "cm-sbx-deleted" },

  // Markdown link text — the entity class already covers link URLs (tags.url, above) and attribute-like names.
  { tag: t.link, class: "cm-sbx-entity" },

  // Markdown blockquotes and inline/fenced code spans — SHIKI_THEME's "Meta, Markdown blockquote & raw" group.
  { tag: [t.quote, t.monospace], class: "cm-sbx-meta" },

  // Markdown list bullets/numbers and horizontal rules (---, ***, ___).
  { tag: [t.list, t.contentSeparator], class: "cm-sbx-punctuation" },

  { tag: t.invalid, class: "cm-sbx-error" }
]);

// Installed alongside Sandpack's own highlighting rather than replacing it.
export const sandboxSyntaxColorExtension: Extension = syntaxHighlighting(
  sandboxSyntaxHighlightStyle
);
