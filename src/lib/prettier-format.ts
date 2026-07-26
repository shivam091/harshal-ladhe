import type { Options } from "prettier";

/*
  A dynamically-imported Prettier plugin module (e.g. `import("prettier/plugins/babel")`) — just
  the shape `format()`'s `plugins` option actually needs.
*/
type PluginModule = NonNullable<Options["plugins"]>[number];

/*
  Parser name plus the plugin bundle it needs, loaded lazily so formatting a .css file never
  pulls in the (much larger) JS/TS parsers, and vice versa.
*/
interface ParserEntry {
  parser: string;
  loadPlugins: () => Promise<PluginModule[]>;
}

// Loads the Babel + estree plugins used to parse JS/JSX/JSON.
async function loadBabelPlugins(): Promise<PluginModule[]> {
  return Promise.all([
    import("prettier/plugins/babel"),
    import("prettier/plugins/estree")
  ]);
}

// Loads the TypeScript + estree plugins used to parse TS/TSX.
async function loadTypeScriptPlugins(): Promise<PluginModule[]> {
  return Promise.all([
    import("prettier/plugins/typescript"),
    import("prettier/plugins/estree")
  ]);
}

// Loads the postcss plugin used to parse CSS/SCSS/Less.
async function loadPostcssPlugins(): Promise<PluginModule[]> {
  return Promise.all([import("prettier/plugins/postcss")]);
}

// Loads the HTML plugin plus the babel/postcss plugins it delegates to for embedded blocks.
async function loadHtmlPlugins(): Promise<PluginModule[]> {
  // The HTML printer formats embedded <script>/<style> blocks through the babel/postcss printers when they're present.
  return Promise.all([
    import("prettier/plugins/html"),
    import("prettier/plugins/babel"),
    import("prettier/plugins/estree"),
    import("prettier/plugins/postcss")
  ]);
}

// Loads the markdown plugin used to parse .md files.
async function loadMarkdownPlugins(): Promise<PluginModule[]> {
  return Promise.all([import("prettier/plugins/markdown")]);
}

// Loads the yaml plugin used to parse .yaml/.yml files.
async function loadYamlPlugins(): Promise<PluginModule[]> {
  return Promise.all([import("prettier/plugins/yaml")]);
}

/*
  Covers what the site highlights and what Sandpack templates can contain. sass and mdx are left
  out on purpose — Prettier can't parse the indented .sass dialect or MDX's JSX islands — so they
  report as unformattable rather than being mis-formatted.
*/
const PARSERS_BY_EXTENSION: Record<string, ParserEntry> = {
  js: { parser: "babel", loadPlugins: loadBabelPlugins },
  jsx: { parser: "babel", loadPlugins: loadBabelPlugins },
  mjs: { parser: "babel", loadPlugins: loadBabelPlugins },
  cjs: { parser: "babel", loadPlugins: loadBabelPlugins },
  json: { parser: "json", loadPlugins: loadBabelPlugins },
  ts: { parser: "typescript", loadPlugins: loadTypeScriptPlugins },
  tsx: { parser: "typescript", loadPlugins: loadTypeScriptPlugins },
  css: { parser: "css", loadPlugins: loadPostcssPlugins },
  scss: { parser: "scss", loadPlugins: loadPostcssPlugins },
  less: { parser: "less", loadPlugins: loadPostcssPlugins },
  html: { parser: "html", loadPlugins: loadHtmlPlugins },
  md: { parser: "markdown", loadPlugins: loadMarkdownPlugins },
  markdown: { parser: "markdown", loadPlugins: loadMarkdownPlugins },
  yaml: { parser: "yaml", loadPlugins: loadYamlPlugins },
  yml: { parser: "yaml", loadPlugins: loadYamlPlugins }
};

// Looks up the parser config registered above for `path`'s file extension.
function getParserEntry(path: string): ParserEntry | undefined {
  const extension = path.split(".").pop()?.toLowerCase();
  return extension ? PARSERS_BY_EXTENSION[extension] : undefined;
}

// True when `path`'s extension has a Prettier parser configured above.
export function isFormattable(path: string): boolean {
  return getParserEntry(path) !== undefined;
}

/*
  Formats `code` (the contents of `path`) with Prettier, loading only the parser plugins that
  extension needs. Throws if the extension has no configured parser, or if `code` doesn't parse —
  both are caller-handled.
*/
export async function formatCode(code: string, path: string): Promise<string> {
  const entry = getParserEntry(path);
  if (!entry) throw new Error(`No Prettier parser configured for "${path}"`);

  const [{ format }, plugins] = await Promise.all([
    import("prettier/standalone"),
    entry.loadPlugins()
  ]);

  const formatted = await format(code, {
    parser: entry.parser,
    plugins,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: "none",
    bracketSpacing: true,
    arrowParens: "always"
  });

  /*
    Prettier always normalizes output to exactly one trailing newline — this adds one more so
    formatted files end with a blank line rather than the last line of code.
  */
  return formatted;
}
