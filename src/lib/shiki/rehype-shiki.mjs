/*
  Rehype plugin — build-time syntax highlighting with Shiki.

  Language loaders and normalisation live in langs.mjs (shared with
  CodeBlock.tsx) so that both highlighting paths stay in sync automatically.

  Token colours are CSS variable references (var(--color-code-syntax-*)) so
  the highlighted markup responds to theme changes through the CSS cascade —
  no client-side JavaScript is required.
*/

import { visit } from "unist-util-visit";
import { SHIKI_THEME, LANG_LOADERS, normalizeLang, getHighlighter } from "./shiki.mjs";

// ─── Helpers ───────────────────────────────────────────────────────────────

// Recursively concatenates all text-node values in a HAST subtree.
function extractText(node) {
  if (node.type === "text") return node.value;
  if (Array.isArray(node.children)) return node.children.map(extractText).join("");
  return "";
}

// ─── Plugin ────────────────────────────────────────────────────────────────

// Rehype plugin that replaces every pre>code node with Shiki-highlighted HTML at MDX build time.
export default function rehypeShiki() {
  return async function transformer(tree) {
    const highlighter = await getHighlighter();

    /*
      ── 1. Collect all pre > code nodes ───────────────────────────────────
      Visit is synchronous; we collect first and mutate after to avoid
      undefined behaviour from modifying the tree during traversal.
    */
    const raw = [];

    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre") return;
      const codeEl = node.children?.[0];
      if (codeEl?.tagName !== "code") return;
      raw.push({ node, index, parent });
    });

    // ── 2. Resolve language for each target ────────────────────────────────
    const targets = raw.map(({ node, index, parent }) => {
      const codeEl    = node.children[0];
      const classes   = Array.isArray(codeEl.properties?.className)
        ? codeEl.properties.className
        : [];
      const langClass = classes.find(
        (c) => typeof c === "string" && c.startsWith("language-")
      );
      const rawLang = langClass ? langClass.slice(9) : "";
      const lang    = normalizeLang(rawLang);
      return { node, index, parent, codeEl, rawLang, lang };
    });

    /*
      ── 3. Load any not-yet-loaded grammars ────────────────────────────────
      "plaintext" is a Shiki built-in — no grammar file needed.
    */
    const langsNeeded   = new Set(targets.map((t) => t.lang).filter((l) => l !== "plaintext"));
    const alreadyLoaded = new Set(highlighter.getLoadedLanguages());

    await Promise.all(
      [...langsNeeded]
        .filter((lang) => !alreadyLoaded.has(lang) && LANG_LOADERS[lang])
        .map((lang) => highlighter.loadLanguage(LANG_LOADERS[lang]))
    );

    // ── 4. Highlight each block and replace its pre node ──────────────────
    for (const { node, index, parent, codeEl, rawLang, lang } of targets) {
      const source = extractText(codeEl).replace(/\n$/, ""); // strip trailing newline MDX appends inside backtick fences

      try {
        // codeToHast returns a HAST Root; its first child is the <pre> element.
        const hastRoot = highlighter.codeToHast(source, {
          lang,
          theme: SHIKI_THEME.name,
        });

        const newPre = hastRoot.children[0];
        if (!newPre) continue;

        // data-language exposes the lang for CSS targeting and accessibility.
        newPre.properties["data-language"] = rawLang || lang;

        // Preserve any existing classes the author placed on the original <pre>.
        const existingClasses = Array.isArray(node.properties?.className)
          ? node.properties.className
          : [];
        if (existingClasses.length > 0) {
          newPre.properties.className = [
            ...(newPre.properties.className ?? []),
            ...existingClasses,
          ];
        }

        parent.children[index] = newPre;
      } catch {
        // Leave original plain <pre> unchanged if highlighting fails.
      }
    }
  };
}
