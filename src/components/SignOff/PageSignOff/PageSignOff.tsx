import type { JSX } from "react";
import { WaveDividerIcon } from "@/components/Icon";
import { PageSignOffRoot, DividerRoot } from "@/components/SignOff/PageSignOff/PageSignOff.styles";
import type { PageSignOffProps } from "@/components/SignOff/PageSignOff/PageSignOff.types";
import { inlineMarkdownToHtml } from "@/utils/markdown";

// Fallback text used when showText is set but no message/metadata.signoff is supplied.
const DEFAULT_SIGNOFF = "I hope you found this post informative and helpful. It took a lot of work to create, and I’m thrilled to finally share it with the world. Thank you for reading. 💖";

/**
 * Renders the closing divider at the bottom of a page, optionally preceded by a signoff paragraph.
 *
 * **Priority chain (when `showText` is set):** `message` prop → `metadata.signoff` → built-in default.
 *
 * The resolved text is run through {@link inlineMarkdownToHtml} before rendering — the same inline
 * formatting (`` `code` ``, `**bold**`, `[text](url)`) used for post titles elsewhere on the site —
 * so a signoff can reference a property or term in code font instead of it showing as a literal backtick.
 *
 * ---
 *
 * **Scenario A — Bare divider (default)**
 *
 * Omit `showText` and only the wave divider is rendered.
 *
 * ```tsx
 * <PageSignOff />
 * ```
 *
 * ---
 *
 * **Scenario B — Default signoff text**
 *
 * Set `showText` with no other props for the built-in fallback text.
 *
 * ```tsx
 * <PageSignOff showText />
 * ```
 *
 * ---
 *
 * **Scenario C — MDX / frontmatter metadata**
 *
 * Pass the post's metadata object (e.g. from a dynamic layout).
 * The component reads `metadata.signoff` when present.
 *
 * ```tsx
 * // signoff: "Catch you on the flip side! ✌️"  ← frontmatter field
 * <PageSignOff showText metadata={post.metadata} />
 * ```
 *
 * ---
 *
 * **Scenario D — Hard prop override**
 *
 * Supply `message` directly for a one-off customisation on a specific page.
 *
 * ```tsx
 * <PageSignOff message="Custom quick signoff message just for this specific page layout! 🚀" />
 * ```
 *
 * ---
 *
 * **Scenario E — Suppressed text**
 *
 * Set `metadata.signoff` to `false` to drop the closing paragraph entirely,
 * leaving just the bare divider, even when `showText` is set.
 *
 * ```tsx
 * // signoff: false  ← registry field
 * <PageSignOff showText metadata={post} />
 * ```
 */
export default function PageSignOff({ showText = false, message, metadata }: PageSignOffProps): JSX.Element {
  const divider = (
    <DividerRoot aria-hidden="true">
      <WaveDividerIcon />
    </DividerRoot>
  );

  // No text requested, or metadata explicitly suppresses it (unless a direct `message` prop overrides that).
  if ((!showText && !message) || (!message && metadata?.signoff === false)) {
    return divider;
  }

  // Logic Chain Priority: 1. Direct Prop -> 2. Metadata Field -> 3. Hardcoded Default
  const finalMessage = message ?? (typeof metadata?.signoff === "string" ? metadata.signoff : undefined) ?? DEFAULT_SIGNOFF;

  return (
    <PageSignOffRoot>
      <p dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(finalMessage) }} />
      {divider}
    </PageSignOffRoot>
  );
}
