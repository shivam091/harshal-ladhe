import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import type { SandboxFiles } from "@/types/sandbox";

/*
  Reads a runnable sandbox's source files from disk for the <Sandbox> MDX component. Examples
  live as real files under /sandboxes/<slug>/ so they're editable/lintable/diffable like normal code.
*/

// Directory holding every runnable sandbox's example folder, keyed by slug.
const SANDBOXES_DIR = join(process.cwd(), "sandboxes");

// Lists every file under `dir`, recursively, as `/`-joined paths relative to it. Skips dotfiles/dot-directories.
function listFilesRecursive(dir: string): string[] {
  return readdirSync(dir, { recursive: true })
    .map((entry) => entry.toString())
    .filter((entry) => !entry.split(sep).some((part) => part.startsWith(".")))
    .filter((entry) => statSync(join(dir, entry)).isFile());
}

// Reads every file under sandboxes/<slug>/ into a Sandpack files map, keyed by absolute path (e.g. "/App.tsx").
export function getSandboxExample(slug: string): SandboxFiles {
  const exampleDir = join(SANDBOXES_DIR, slug);
  const relativePaths = listFilesRecursive(exampleDir);
  if (relativePaths.length === 0) {
    throw new Error(
      `No files found for sandbox example "${slug}" (looked in ${exampleDir})`
    );
  }

  const files: SandboxFiles = {};
  for (const relativePath of relativePaths) {
    const sandpackPath = `/${relativePath.split(sep).join("/")}`;
    files[sandpackPath] = readFileSync(join(exampleDir, relativePath), "utf-8");
  }

  return files;
}
