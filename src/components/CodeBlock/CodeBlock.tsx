import type { JSX } from "react";
import { SHIKI_THEME, LANG_LOADERS, normalizeLang, getHighlighter } from "@/lib/shiki/shiki.mjs";
import { escapeHTML } from "@/utils/string";
import type { CodeBlockProps } from "@/components/CodeBlock/CodeBlock.types";
import CodeBlockClient from "@/components/CodeBlock/CodeBlockClient";
import { highlightHtmlWithEmbeds } from "@/components/CodeBlock/embedded-highlighting";

// Highlights on the server so neither Shiki nor its grammars ship to the browser.
export default async function CodeBlock({ language, children, showCopyButton = true }: CodeBlockProps): Promise<JSX.Element> {
  const code = children.trim(); // MDX always appends a trailing newline inside backtick fences
  const lang: string = normalizeLang(language);

  const highlighter = await getHighlighter();

  if (lang !== "plaintext" && !highlighter.getLoadedLanguages().includes(lang) && LANG_LOADERS[lang]) {
    await highlighter.loadLanguage(LANG_LOADERS[lang]);
  }

  let html: string;
  try {
    html = lang === "html"
      ? highlightHtmlWithEmbeds(code, highlighter, SHIKI_THEME.name)
      : highlighter.codeToHtml(code, {
          lang,
          theme: SHIKI_THEME.name
        });
    // The wrapper is the real scroller and tab stop, so Shiki's own tabindex would add a dead second stop.
    html = html.replace(/\s*tabindex="0"/i, "");
  } catch {
    html = `<pre><code>${escapeHTML(code)}</code></pre>`;
  }

  return (
    <>
      <CodeBlockClient code={code} html={html} showCopyButton={showCopyButton} />
    </>
  );
}

CodeBlock.displayName = "CodeBlock";
