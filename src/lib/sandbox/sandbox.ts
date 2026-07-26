import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import type { SandboxFiles } from "@/types/sandbox";

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

// Reads every file under sandboxes/<slug>/ (plus the shared/ chrome every sandbox can import from) into a Sandpack files map, keyed by absolute path (e.g. "/App.tsx", "/shared/playground.css").
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
