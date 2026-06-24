import type { ThemeRegistration, Highlighter } from "shiki";
import type { DynamicImportLanguageRegistration } from "@shikijs/types";

// Canonical Shiki language IDs that are pre-loaded at build time.
export declare const SUPPORTED_LANGS: readonly string[];

// Short aliases mapped to canonical Shiki lang IDs; unrecognised strings fall through to "plaintext".
export declare const LANG_ALIASES: Record<string, string>;

// TextMate-compatible theme using CSS variable references for automatic light/dark theming.
export declare const SHIKI_THEME: ThemeRegistration & { name: string };

// Thunks (arrow functions) so bundlers only include grammars that are actually called.
export declare const LANG_LOADERS: Record<string, DynamicImportLanguageRegistration>;

// Returns (or lazily creates) the singleton Shiki highlighter for this process.
export declare function getHighlighter(): Promise<Highlighter>;

// Maps a raw code-fence language tag to a canonical Shiki lang ID, or "plaintext" for unknown inputs.
export declare function normalizeLang(raw: string): string;
