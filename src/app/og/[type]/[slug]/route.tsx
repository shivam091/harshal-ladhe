import { snippets } from "@/data/snippets";
import { renderOgImage } from "@/lib/og-image";

/*
  A route handler rather than per-folder opengraph-image files: those would need adding by hand
  for every uncovered entry, and file-based images outrank a cover set in metadata.
*/
export const dynamic = "force-static";
// Only uncovered entries are prerendered; anything else 404s rather than rendering on demand.
export const dynamicParams = false;

// Keyed by the first segment of each type's route, which is how content-metadata.ts builds the URL.
const SOURCES: Record<string, { label: string; entries: { slug: string; title: string; image?: unknown }[] }> = {
  snippet: { label: "Snippet", entries: snippets }
};

export function generateStaticParams(): { type: string; slug: string }[] {
  return Object.entries(SOURCES).flatMap(([type, { entries }]) =>
    entries.filter((entry) => !entry.image).map((entry) => ({ type, slug: entry.slug }))
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string; slug: string }> }
): Promise<Response> {
  const { type, slug } = await params;
  const source = SOURCES[type];
  const entry = source?.entries.find((candidate) => candidate.slug === slug);
  if (!source || !entry) return new Response("Not found", { status: 404 });

  return renderOgImage({ title: entry.title, label: source.label });
}
