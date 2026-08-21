"use client";

import { useEffect, useState } from "react";
import { getHighlighter, normalizeLang, SHIKI_THEME, LANG_LOADERS } from "@/lib/shiki/shiki.mjs";
import { escapeHTML } from "@/utils/string";
import { highlightHtmlWithEmbeds } from "@/components/CodeBlock/embedded-highlighting";

// A slider drag fires many "input" events per second — debounce so each one doesn't re-run the highlighter.
const DEBOUNCE_MS = 150;

// Escaped-plaintext fallback shown until the first highlight resolves, and again if highlighting throws.
function plainFallback(code: string): string {
  return `<pre><code>${escapeHTML(code)}</code></pre>`;
}

/*
  Same highlighter and fallback as the server-rendered code blocks, but debounced so rapid
  control changes don't re-run it on every value.
*/
export function useHighlightedCode(code: string, language: string): string {
  const [html, setHtml] = useState(() => plainFallback(code));

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      const lang = normalizeLang(language);
      try {
        const highlighter = await getHighlighter();
        if (lang !== "plaintext" && !highlighter.getLoadedLanguages().includes(lang) && LANG_LOADERS[lang]) {
          await highlighter.loadLanguage(LANG_LOADERS[lang]);
        }
        if (cancelled) return;
        setHtml(
          lang === "html"
            ? highlightHtmlWithEmbeds(code, highlighter, SHIKI_THEME.name)
            : highlighter.codeToHtml(code, { lang, theme: SHIKI_THEME.name })
        );
      } catch {
        if (!cancelled) setHtml(plainFallback(code));
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [code, language]);

  return html;
}
