/*
  Token colours are CSS variable references, so the highlighted markup follows
  theme changes through the cascade with no client-side JavaScript.
*/

import { visit } from "unist-util-visit";
import { SHIKI_THEME, LANG_LOADERS, normalizeLang, getHighlighter } from "./shiki.mjs";

// Shiki needs the plain source text, not the HAST nodes MDX produced for it.
function extractText(node) {
  if (node.type === "text") return node.value;
  if (Array.isArray(node.children)) return node.children.map(extractText).join("");
  return "";
}

// Highlighting during the MDX build keeps Shiki and its grammars out of the client bundle for articles.
export default function rehypeShiki() {
  return async function transformer(tree) {
    const highlighter = await getHighlighter();

    // Collect first, mutate later — replacing nodes mid-traversal would derail visit().
    const raw = [];

    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre") return;
      const codeEl = node.children?.[0];
      if (codeEl?.tagName !== "code") return;
      raw.push({ node, index, parent });
    });

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

    // Grammars load lazily, and "plaintext" is a Shiki built-in with no grammar to load.
    const langsNeeded   = new Set(targets.map((t) => t.lang).filter((l) => l !== "plaintext"));
    const alreadyLoaded = new Set(highlighter.getLoadedLanguages());

    await Promise.all(
      [...langsNeeded]
        .filter((lang) => !alreadyLoaded.has(lang) && LANG_LOADERS[lang])
        .map((lang) => highlighter.loadLanguage(LANG_LOADERS[lang]))
    );

    for (const { node, index, parent, codeEl, rawLang, lang } of targets) {
      const source = extractText(codeEl).replace(/\n$/, ""); // strip trailing newline MDX appends inside backtick fences

      try {
        // Only the <pre> is kept so the fence isn't wrapped in an extra root node.
        const hastRoot = highlighter.codeToHast(source, {
          lang,
          theme: SHIKI_THEME.name,
        });

        const newPre = hastRoot.children[0];
        if (!newPre) continue;

        // data-language exposes the lang for CSS targeting and accessibility.
        newPre.properties["data-language"] = rawLang || lang;

        // Merged rather than replaced so classes authored on the fence survive highlighting.
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
        // A failed highlight falls back to the plain <pre> so the page still builds.
      }
    }
  };
}
