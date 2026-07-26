import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";

/*
  One sandbox file's contents — either a bare code string, or an object form that also seeds
  Sandpack's own per-file flags (hidden from the tab bar, marked active on load, or read-only).
*/
export type SandboxFileEntry =
  | string
  | { code: string; hidden?: boolean; active?: boolean; readOnly?: boolean };

// A sandbox's full file tree, keyed by absolute path (e.g. "/App.tsx").
export type SandboxFiles = Record<string, SandboxFileEntry>;

/*
  Reads a runnable sandbox's source files from disk for the <Sandbox> MDX component. Examples
  live as real files under /sandboxes/<slug>/ so they're editable/lintable/diffable like normal code.
*/

// Directory holding every runnable sandbox's example folder, keyed by slug.
const SANDBOXES_DIR = join(process.cwd(), "sandboxes");

/*
  Common CSS (dark playground shell, field/select/button styling) shared across the vanilla CSS
  sandboxes — lives once here instead of duplicated per example. Merged into every sandbox's file
  map under /shared/, so any of them can pull it in with a plain relative import
  (`import "./shared/playground.css"`) same as importing its own ./styles.css.
*/
const SHARED_DIR = join(SANDBOXES_DIR, "_shared");

// Lists every file under `dir`, recursively, as `/`-joined paths relative to it. Skips dotfiles/dot-directories.
function listFilesRecursive(dir: string): string[] {
  return readdirSync(dir, { recursive: true })
    .map((entry) => entry.toString())
    .filter((entry) => !entry.split(sep).some((part) => part.startsWith(".")))
    .filter((entry) => statSync(join(dir, entry)).isFile());
}

/*
  Never sets Sandpack's own per-file `readOnly` flag, because that makes its editor fall back to a
  static placeholder with no line numbers, folding or highlighting; per-file read-only is handled
  through context instead.
*/
export function getSandbox(slug: string): SandboxFiles {
  const exampleDir = join(SANDBOXES_DIR, slug);
  const relativePaths = listFilesRecursive(exampleDir);
  if (relativePaths.length === 0) {
    throw new Error(
      `No files found for sandbox example "${slug}" (looked in ${exampleDir})`
    );
  }

  const files: SandboxFiles = {};

  // hidden: true keeps these out of the file explorer/tab bar — sandboxes import them but never edit them.
  for (const relativePath of listFilesRecursive(SHARED_DIR)) {
    const sandpackPath = `/shared/${relativePath.split(sep).join("/")}`;
    files[sandpackPath] = { code: readFileSync(join(SHARED_DIR, relativePath), "utf-8"), hidden: true };
  }

  for (const relativePath of relativePaths) {
    const sandpackPath = `/${relativePath.split(sep).join("/")}`;
    files[sandpackPath] = readFileSync(join(exampleDir, relativePath), "utf-8");
  }

  return files;
}
