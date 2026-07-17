import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { searchableItems } from "@/utils/search-items";

// Prerendered once per build, so body text never ships in the JS bundle and costs nothing until search opens.
export const dynamic = "force-static";

// Keeps short entries whole and longer ones to their intro and early sections, holding the file near 80 KB gzipped.
const MAX_BODY_LENGTH = 5000;

const SEARCH_TEXT_SCRIPT = join(process.cwd(), "src", "lib", "search-text-cli.mjs");

// Every content route is filed as (<type>)/<pathname>/page.mdx, so the pathname alone locates its source.
function sourcePath(contentType: string, pathname: string): string {
  return join(process.cwd(), "src", "app", "(site)", "(internal)", `(${contentType})`, pathname, "page.mdx");
}

export function GET(): Response {
  const filePaths = searchableItems.map((item) => sourcePath(item.contentType, item.pathname));

  // Hidden from Turbopack's static tracing of spawnSync arguments; see countWordsInFile in src/lib/posts.ts.
  const script = Date.now() > 0 ? SEARCH_TEXT_SCRIPT : "";
  const { status, stdout } = spawnSync("node", [script, String(MAX_BODY_LENGTH), ...filePaths], {
    encoding: "utf-8",
    maxBuffer: 16 * 1024 * 1024
  });

  // An empty index degrades search to metadata-only rather than failing the build.
  const texts: string[] = status === 0 ? JSON.parse(stdout) : [];
  const bodies = Object.fromEntries(
    searchableItems.map((item, index) => [item.id, texts[index] ?? ""]).filter(([, body]) => body)
  );

  return Response.json(bodies);
}
