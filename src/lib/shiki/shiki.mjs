/*
  One shared Shiki config so build-time MDX and runtime code blocks can never
  highlight differently. A new language needs its canonical ID in both
  SUPPORTED_LANGS and LANG_LOADERS (keys must match), plus any aliases.
*/

import { getSingletonHighlighter } from "shiki";

// ─── Supported languages ───────────────────────────────────────────────────

// Allow-list of highlightable languages — anything else renders as plaintext instead of failing.
export const SUPPORTED_LANGS = [
  "html",
  "xml",
  "css",
  "scss",
  "sass",
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "markdown",
  "mdx",
  "json",
  "yaml",
  "bash",
  "ssh-config",
  "bat",
  "diff",
];

// Lets authors use familiar short fence tags without each needing its own grammar entry.
export const LANG_ALIASES = {
  ts:    "typescript",
  js:    "javascript",
  mjs:   "javascript",
  cjs:   "javascript",
  es:    "javascript",
  md:    "markdown",
  yml:   "yaml",
  sh:    "bash",
  shell: "bash",
  zsh:   "bash",
  ssh:   "ssh-config",
  batch: "bat",
  cmd:   "bat",
};

// ─── Grammar loaders ───────────────────────────────────────────────────────
// Thunks so bundlers only include grammars that are actually called.

// @type {Record<string, () => Promise<unknown>>}
export const LANG_LOADERS = {
  html:         () => import("shiki/langs/html.mjs"),
  xml:          () => import("shiki/langs/xml.mjs"),
  css:          () => import("shiki/langs/css.mjs"),
  scss:         () => import("shiki/langs/scss.mjs"),
  sass:         () => import("shiki/langs/sass.mjs"),
  typescript:   () => import("shiki/langs/typescript.mjs"),
  tsx:          () => import("shiki/langs/tsx.mjs"),
  javascript:   () => import("shiki/langs/javascript.mjs"),
  jsx:          () => import("shiki/langs/jsx.mjs"),
  markdown:     () => import("shiki/langs/markdown.mjs"),
  mdx:          () => import("shiki/langs/mdx.mjs"),
  json:         () => import("shiki/langs/json.mjs"),
  yaml:         () => import("shiki/langs/yaml.mjs"),
  bash:         () => import("shiki/langs/bash.mjs"),
  "ssh-config": () => import("shiki/langs/ssh-config.mjs"),
  bat:          () => import("shiki/langs/bat.mjs"),
  diff:         () => import("shiki/langs/diff.mjs"),
};

// ─── Highlighter singleton ─────────────────────────────────────────────────


/*
  Storing the Promise (not the resolved value) means concurrent callers within
  the same process share one initialisation instead of racing to create duplicates.
*/

let highlighterPromise = null;

/*
  `html` is seeded at construction rather than lazy-loaded because its embedded css/javascript
  grammars only get theme colours resolved when present at construction time — loaded later,
  <style>/<script> content renders as one unstyled span. Every other language here is flat and
  lazy-loads safely.
*/
export function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = getSingletonHighlighter({
      themes: [SHIKI_THEME],
      langs:  [LANG_LOADERS.html],
    });
  }
  return highlighterPromise;
}

// ─── Language normalisation ────────────────────────────────────────────────

// Missing or unknown fence tags fall back to plaintext so a typo'd language never breaks highlighting.
export function normalizeLang(raw) {
  if (!raw) return "plaintext";

  const alias = LANG_ALIASES[raw];
  if (alias) return alias;

  if (SUPPORTED_LANGS.includes(raw)) return raw;

  return "plaintext"; // Shiki built-in — renders unstyled without throwing or loading a grammar
}


// ─── Theme ─────────────────────────────────────────────────────────────────

/*
  Foregrounds are CSS variable references so highlighted code follows theme
  changes through the cascade with no JavaScript re-render. The longest matching
  scope prefix wins, so a specific scope can safely sit in a different group than
  its generic parent.
*/
export const SHIKI_THEME = {
  name: "code-syntax-vars",
  type: "dark",
  colors: {
    "editor.foreground":              "var(--color-fg-default)",
    "editor.background":              "var(--color-bg-muted)",
    "editor.selectionBackground":     "var(--color-bg-selection)",
    "editor.lineHighlightBackground": "var(--color-bg-neutral-muted)",
  },
  tokenColors: [
    // ─── Comments ─────────────────────────────────────────────────────────────
    {
      scope: [
        "comment",
        "comment.line",
        "comment.line.double-slash",
        "comment.line.number-sign",
        "comment.block",
        "comment.block.documentation",
        "punctuation.definition.comment",
        "string.quoted.docstring.multi",
        // Markdown YAML frontmatter block
        "comment.frontmatter",
      ],
      settings: { foreground: "var(--color-code-syntax-comment)", fontStyle: "italic" }
    },

    // ─── Keywords, control flow, storage types & modifiers ───────────────────
    {
      scope: [
        // Generic keyword scopes
        "keyword",
        "keyword.control",
        "keyword.control.flow",
        "keyword.control.conditional",
        "keyword.control.loop",
        "keyword.control.import",
        "keyword.control.export",
        "keyword.control.from",
        "keyword.control.as",
        "keyword.control.async",
        "keyword.control.await",
        "keyword.control.return",
        "keyword.control.new",
        "keyword.control.throw",
        "keyword.control.try",
        "keyword.control.catch",
        "keyword.control.finally",
        "keyword.control.switch",
        "keyword.control.break",
        "keyword.control.continue",
        "keyword.control.default",
        "keyword.control.case",
        "keyword.other",
        "keyword.other.extends",
        "keyword.other.implements",
        // Word-form operators
        "keyword.operator.new",
        "keyword.operator.delete",
        "keyword.operator.typeof",
        "keyword.operator.void",
        "keyword.operator.instanceof",
        "keyword.operator.in",
        "keyword.operator.of",
        "keyword.operator.keyof",
        "keyword.operator.expression",
        // Storage
        "storage.type",
        "storage.type.function",
        "storage.type.function.arrow",
        "storage.type.class",
        "storage.type.interface",
        "storage.type.type",
        "storage.type.namespace",
        "storage.type.enum",
        "storage.type.let",
        "storage.type.const",
        "storage.type.var",
        "storage.type.ts",
        "storage.type.tsx",
        "storage.modifier",
        "storage.modifier.public",
        "storage.modifier.private",
        "storage.modifier.protected",
        "storage.modifier.static",
        "storage.modifier.abstract",
        "storage.modifier.async",
        "storage.modifier.readonly",
        "storage.modifier.override",
        "storage.modifier.export",
        // YAML document boundary markers (--- and ...)
        "entity.other.document.begin.yaml",
        "entity.other.document.end.yaml",
        // YAML reserved directives (%YAML, %TAG)
        "support.other.directive.reserved.yaml",
        // Word-form / symbol operators (optional chaining, nullish, spread)
        "keyword.operator.optional-chaining",
        "keyword.operator.optional-chaining.ts",
        "keyword.operator.optional-chaining.tsx",
        "keyword.operator.nullish",
        "keyword.operator.spread",
        "keyword.operator.rest",
        // CSS !important
        "keyword.other.important.css",
        "keyword.other.important.scss",
        // SCSS !default / !global flags
        "keyword.other.default.scss",
        "keyword.other.global.scss",
        // SCSS flow control
        "keyword.control.at-rule.include.scss",
        "keyword.control.at-rule.mixin.scss",
        "keyword.control.at-rule.extend.scss",
        "keyword.control.at-rule.if.scss",
        "keyword.control.at-rule.else.scss",
        "keyword.control.at-rule.each.scss",
        "keyword.control.at-rule.for.scss",
        "keyword.control.at-rule.while.scss",
        "keyword.control.at-rule.use.scss",
        "keyword.control.at-rule.forward.scss",
        /*
          CSS structural at-rules (@media, @import, @charset, @supports, @keyframes) — grouped
          with keyword rather than meta so they colour the same as in the live code editor,
          which draws no such distinction.
        */
        "keyword.control.at-rule",
        "keyword.control.at-rule.css",
        "keyword.control.at-rule.scss",
        "keyword.control.at-rule.sass",
        "keyword.control.at-rule.media",
        "keyword.control.at-rule.keyframes",
        "keyword.control.at-rule.import",
        "keyword.control.at-rule.charset",
        "keyword.control.at-rule.supports",
        "meta.at-rule",
        "meta.at-rule.keyframes",
        // The `@` sign in CSS/SCSS at-rules — matched here so `@media` renders as a uniform unit.
        "punctuation.definition.keyword.css",
        "punctuation.definition.keyword.scss",
        // this / super / self — more specific than bare `variable.*`
        "variable.language.this",
        "variable.language.super",
        "variable.language.self",
      ],
      settings: { foreground: "var(--color-code-syntax-keyword)" }
    },

    // ─── String literals ──────────────────────────────────────────────────────
    {
      scope: [
        "string",
        "string.quoted",
        "string.quoted.single",
        "string.quoted.double",
        "string.quoted.backtick",
        "string.quoted.triple",
        "string.template",
        "string.unquoted",
        "string.unquoted.plain.out.yaml",
        "string.other",
        // HTML attribute values
        "string.quoted.double.html",
        "string.quoted.single.html",
        // CSS / SCSS strings
        "string.quoted.double.css",
        "string.quoted.single.css",
        "string.quoted.double.scss",
        "string.quoted.single.scss",
        // Sass's unquoted @import path (indented syntax)
        "constant.character.css.sass",
        // Markdown link title / alt text
        "string.other.link.title.markdown",
        "string.other.link.description.markdown",
      ],
      settings: { foreground: "var(--color-code-syntax-string)" }
    },

    // ─── Numeric literals ─────────────────────────────────────────────────────
    {
      scope: [
        "constant.numeric",
        "constant.numeric.integer",
        "constant.numeric.float",
        "constant.numeric.hex",
        "constant.numeric.binary",
        "constant.numeric.octal",
        "constant.numeric.css",
        "constant.numeric.scss",
        // CSS hex color values — more specific than bare `constant.other.color`
        "constant.other.color.rgb-value",
        "constant.other.color.rgb-value.hex",
        "constant.other.color",
        // CSS @keyframes percentage offsets (0%, 50%, 100%)
        "entity.other.keyframe-offset.css",
        "entity.other.keyframe-offset.percentage.css",
      ],
      settings: { foreground: "var(--color-code-syntax-number)" }
    },

    /*
      Generic punctuation — plain foreground so it stays quiet and matches the live code
      editor; punctuation with a more specific role gets its own group.
    */
    {
      scope: [
        "punctuation",
        "punctuation.separator",
        "punctuation.separator.comma",
        "punctuation.separator.key-value",
        "punctuation.terminator",
        "punctuation.terminator.statement",
        "punctuation.accessor",
        "punctuation.definition.block",
        "punctuation.definition.block.begin",
        "punctuation.definition.block.end",
        "punctuation.definition.parameters.begin",
        "punctuation.definition.parameters.end",
        "punctuation.definition.array.begin",
        "punctuation.definition.array.end",
        "meta.brace.round",
        "meta.brace.square",
        "meta.brace.curly",
      ],
      settings: { foreground: "var(--color-fg-default)" }
    },

    // ─── Functions & bold markdown ────────────────────────────────────────────
    {
      scope: [
        "entity.name.function",
        "entity.name.function.js",
        "entity.name.function.ts",
        "entity.name.function.tsx",
        "entity.name.function.jsx",
        "support.function",
        "support.function.builtin",
        "meta.function-call.generic",
        // CSS / SCSS built-in functions (url, calc, …)
        "support.function.url.css",
        "support.function.calc.css",
        "support.function.misc.css",
        "entity.name.function.scss",
        "support.function.sass",
        "support.function.scss",
        // Bold emphasis (Markdown)
        "markup.bold",
        "markup.bold.markdown",
        "strong",
      ],
      settings: { foreground: "var(--color-code-syntax-function)", fontStyle: "bold" }
    },

    // ─── HTML/JSX/CSS tags ────────────────────────────────────────────────────
    {
      scope: [
        "entity.name.tag",
        "entity.name.tag.html",
        "entity.name.tag.jsx",
        "entity.name.tag.tsx",
        // React/JSX component names (PascalCase)
        "support.class.component",
        "support.class.component.jsx",
        "support.class.component.tsx",
        // Tag angle-bracket punctuation
        "punctuation.definition.tag",
        "punctuation.definition.tag.begin",
        "punctuation.definition.tag.end",
        "punctuation.definition.tag.html",
        // CSS tag-part of a selector
        "entity.name.tag.css",
        "entity.name.tag.scss",
        "entity.name.tag.sass",
      ],
      settings: { foreground: "var(--color-code-syntax-tag)" }
    },

    // ─── Namespaces & modules ─────────────────────────────────────────────────
    {
      scope: [
        "entity.name.namespace",
        "entity.name.namespace.ts",
        "entity.name.namespace.tsx",
        "entity.other.namespace",
        "storage.type.namespace",
        "storage.type.namespace.ts",
        "entity.name.module",
        "entity.name.module.ts",
        // CSS namespace prefixes (ns|selector) and SCSS's own namespace-prefix scope
        "entity.other.namespace-prefix.css",
        "entity.name.namespace-prefix.scss",
        // Sass module references (math.pow(...))
        "constant.character.module",
        "constant.character.module.name",
      ],
      settings: { foreground: "var(--color-code-syntax-namespace)" }
    },

    // ─── Variables & property names ───────────────────────────────────────────
    {
      scope: [
        "variable",
        "variable.other",
        "variable.other.readwrite",
        "variable.other.constant",
        "variable.other.object",
        "variable.other.object.property",
        "variable.other.property",
        "variable.other.enummember",
        "variable.parameter",
        "variable.parameter.function",
        // SCSS / Sass / CSS custom properties
        "variable.scss",
        "variable.sass",
        "variable.other.scss",
        "variable.other.sass",
        "variable.other.less",
        "variable.css",
        "variable.other.css",
        // YAML aliases (*anchorName) and anchor declarations (&anchorName)
        "variable.other.alias.yaml",
        "entity.name.label.yaml",
        // Labeled statements (outer: for (...) { ... })
        "entity.name.label.js",
        "entity.name.label.ts",
        "entity.name.label.tsx",
        "entity.name.label.js.jsx",
        // CSS property names — grouped with variables/names, not entity, to match the live code editor
        "support.type.property-name",
        "support.type.property-name.css",
        "support.type.property-name.scss",
        "support.type.property-name.less",
        "support.type.property-name.media",
        // JSON keys — the string + support.type.property-name.json compound scope
        "support.type.property-name.json",
        "punctuation.support.type.property-name.begin.json",
        "punctuation.support.type.property-name.end.json",
      ],
      settings: { foreground: "var(--color-code-syntax-name)" }
    },

    // ─── Built-in constants, types, classes ───────────────────────────────────
    {
      scope: [
        "constant.language",
        "constant.language.boolean",
        "constant.language.null",
        "constant.language.undefined",
        "constant.language.nan",
        "constant.language.infinity",
        // TypeScript primitive types & built-ins
        "support.type",
        "support.type.primitive",
        "support.type.primitive.ts",
        "support.type.primitive.tsx",
        "support.type.builtin",
        // Named types / interfaces / aliases
        "entity.name.type",
        "entity.name.type.ts",
        "entity.name.type.tsx",
        "entity.name.type.interface",
        "entity.name.type.alias",
        // Class names
        "entity.name.class",
        "entity.name.class.ts",
        "entity.name.class.tsx",
        "entity.name.class.jsx",
        "entity.other.inherited-class",
        "support.class",
        "support.class.ts",
        // CSS value keywords (flex, center, auto, …)
        "support.constant",
        "support.constant.property-value",
        "support.constant.property-value.css",
        "support.constant.font-name",
        "support.constant.media",
        // Other constants that fall through from numeric/color
        "constant.other",
        "support.variable",
        "support.variable.dom",
        "support.variable.property",
      ],
      settings: { foreground: "var(--color-code-syntax-builtin)" }
    },

    // ─── Decorators / annotations ─────────────────────────────────────────────
    {
      scope: [
        "meta.decorator",
        "entity.name.function.decorator",
        "entity.name.function.decorator.ts",
        "entity.name.function.decorator.tsx",
        "punctuation.definition.decorator",
        "punctuation.decorator",
        "punctuation.decorator.ts",
      ],
      settings: { foreground: "var(--color-code-syntax-decorator)" }
    },

    // ─── HTML attributes, pseudo-classes/elements ──────────────────────────────
    {
      scope: [
        // HTML / JSX attribute names
        "entity.other.attribute-name",
        // SCSS %placeholder selectors
        "entity.other.attribute-name.placeholder.css",
        "entity.other.attribute-name.placeholder.scss",
        "entity.other.attribute-name.html",
        "entity.other.attribute-name.jsx",
        "entity.other.attribute-name.tsx",
        // HTML character entities (&amp; etc.) and XML DTD parameter entities (%name;)
        "constant.character.entity",
        "constant.character.entity.html",
        "constant.character.parameter-entity.xml",
        "punctuation.definition.entity.html",
        // Sass indented-syntax attribute selectors, e.g. input[type="text"]
        "entity.other.attribute-selector.sass",
        // CSS pseudo-classes / pseudo-elements
        "entity.other.pseudo-class",
        "entity.other.pseudo-class.css",
        "entity.other.pseudo-element",
        "entity.other.pseudo-element.css",
        // CSS class/id selector parts (.foo, #bar)
        "entity.other.attribute-name.class",
        "entity.other.attribute-name.class.css",
        "entity.other.attribute-name.class.scss",
        "entity.other.attribute-name.id",
        "entity.other.attribute-name.id.css",
        "entity.other.attribute-name.id.scss",
        // Markdown link URL
        "markup.underline.link",
        "markup.underline.link.markdown",
        "markup.underline.link.image.markdown",
        // Markdown reference-style link IDs: [text][id] — the id token
        "constant.other.reference.link.markdown",
      ],
      settings: { foreground: "var(--color-code-syntax-entity)" }
    },

    // ─── Symbols, escape sequences, regex, CSS units, SCSS interpolation ──────
    {
      scope: [
        "constant.character.escape",
        "constant.character.escape.ts",
        // Regular expressions
        "string.regexp",
        "string.regexp.ts",
        "constant.other.character-class.regexp",
        "constant.character.control.regexp",
        "constant.character.numeric.regexp",
        "punctuation.definition.group.regexp",
        // Template literal expression delimiters ${ and }
        "punctuation.definition.template-expression.begin",
        "punctuation.definition.template-expression.end",
        // SCSS #{} interpolation brackets
        "punctuation.definition.interpolation",
        "punctuation.definition.interpolation.begin.scss",
        "punctuation.definition.interpolation.end.scss",
        // CSS units (px, em, rem, vw, …)
        "keyword.other.unit",
        "keyword.other.unit.css",
        "keyword.other.unit.scss",
        "keyword.other.unit.sass",
        // CSS selector combinators (>, +, ~)
        "keyword.operator.combinator.css",
        "keyword.operator.combinator.scss",
        // Markdown punctuation markers
        "punctuation.definition.metadata.markdown",
        "punctuation.definition.list.begin.markdown",
        "punctuation.definition.raw.markdown",
        "punctuation.definition.bold.markdown",
        "punctuation.definition.constant.markdown",
        "punctuation.definition.link.markdown",
        "punctuation.definition.string.begin.markdown",
        "punctuation.definition.string.end.markdown",
        "punctuation.separator.key-value.markdown",
        // TypeScript optional-chaining accessor (?.)
        "punctuation.accessor.optional.ts",
        // YAML list-item bullets (- )
        "punctuation.definition.block.sequence.item.yaml",
        // YAML anchor & alias sigils (& and *)
        "punctuation.definition.anchor.yaml",
        "punctuation.definition.alias.yaml",
        "punctuation.definition.key-value.begin.yaml",
        /*
          Markdown link bracket pairs [text](url) and [text][id]
          Note: punctuation.definition.link.markdown does NOT prefix-match
          punctuation.definition.link.description.* — they must be listed explicitly
        */
        "punctuation.definition.link.description.begin.markdown",
        "punctuation.definition.link.description.end.markdown",
        "punctuation.definition.link.title.begin.markdown",
        "punctuation.definition.link.title.end.markdown",
        "punctuation.definition.constant.begin.markdown",
        "punctuation.definition.constant.end.markdown",
      ],
      settings: { foreground: "var(--color-code-syntax-symbol)" }
    },

    // ─── Headings (Markdown) ─────────────────────────────────────────────────
    {
      scope: [
        "markup.heading",
        "markup.heading.markdown",
        "markup.heading.setext.1.markdown",
        "markup.heading.setext.2.markdown",
        "entity.name.section",
        "entity.name.section.markdown",
        "punctuation.definition.heading.markdown",
        // Heading level scopes emitted by the Shiki Markdown grammar
        "heading.1.markdown",
        "heading.2.markdown",
        "heading.3.markdown",
        "heading.4.markdown",
        "heading.5.markdown",
        "heading.6.markdown",
      ],
      settings: { foreground: "var(--color-code-syntax-heading)" }
    },

    // ─── Italic emphasis (Markdown / markup) ─────────────────────────────────
    {
      scope: [
        "markup.italic",
        "markup.italic.markdown",
        "punctuation.definition.italic.markdown",
        "emphasis",
      ],
      settings: { foreground: "var(--color-code-syntax-entity)", fontStyle: "italic" }
    },

    // ─── Strikethrough (Markdown) ─────────────────────────────────────────────
    {
      scope: [
        "markup.strikethrough",
        "markup.strikethrough.markdown",
        "punctuation.definition.strikethrough.markdown",
      ],
      settings: { foreground: "var(--color-code-syntax-deleted-text)" }
    },

    // ─── Meta, Markdown blockquote & raw ──────────────────────────────────────
    {
      scope: [
        // Markdown blockquotes
        "markup.quote",
        "markup.quote.markdown",
        // `>` prefix marker of blockquote lines (separate scope from the content)
        "punctuation.definition.quote.begin.markdown",
        /*
          Markdown raw/code: `markup.raw.*` matches markup.raw.block / markup.raw.inline
          but NOT markup.inline.raw.string which has a different path — list both explicitly.
        */
        "markup.raw",
        "markup.raw.inline",
        "markup.raw.block",
        "markup.raw.block.markdown",
        "markup.raw.inline.markdown",
        // These are the actual scopes the Shiki Markdown grammar emits for inline / fenced code
        "markup.inline.raw.string.markdown",
        "markup.fenced_code.block.markdown",
        // Language tag inside a fenced block (```ts ← this token)
        "fenced_code.block.language",
        "fenced_code.block.language.markdown",
        // Markdown table
        "markup.table.markdown",
        "punctuation.separator.table.markdown",
        "punctuation.definition.table.markdown",
        // Markdown horizontal rule (---, ***, ___)
        "meta.separator.markdown",
        // Frontmatter delimiters (--- / ---)
        "punctuation.definition.begin.frontmatter",
        "punctuation.definition.end.frontmatter",
      ],
      settings: { foreground: "var(--color-code-syntax-meta)" }
    },

    // ─── Invalid / error tokens ───────────────────────────────────────────────
    {
      scope: ["invalid", "invalid.illegal", "invalid.deprecated"],
      settings: { foreground: "var(--color-code-syntax-error-text)" }
    },

    // ─── Diff — inserted lines ────────────────────────────────────────────────
    {
      scope: [
        "markup.inserted",
        "markup.inserted.diff",
        "meta.diff.header.to-file",
        "punctuation.definition.inserted",
      ],
      settings: { foreground: "var(--color-code-syntax-inserted-text)" }
    },

    // ─── Diff — deleted lines ─────────────────────────────────────────────────
    {
      scope: [
        "markup.deleted",
        "markup.deleted.diff",
        "meta.diff.header.from-file",
        "punctuation.definition.deleted",
      ],
      settings: { foreground: "var(--color-code-syntax-deleted-text)" }
    },

    // ─── Diff — changed lines ─────────────────────────────────────────────────
    {
      scope: ["markup.changed", "markup.changed.diff"],
      settings: { foreground: "var(--color-code-syntax-changed-text)" }
    },

    // ─── Terminal / REPL output ───────────────────────────────────────────────
    {
      scope: ["meta.output"],
      settings: { foreground: "var(--color-code-syntax-output)" }
    },
  ],
};
