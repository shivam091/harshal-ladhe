import { JSX } from "react";
import PageSignOff from "@/components/SignOff/PageSignOff";
import { PostSignOffProps } from "@/interfaces/post-signoff";
import { PostSignOffRoot } from "@/components/SignOff/PostSignOff/PostSignOff.styles";

const DEFAULT_SIGNOFF = "I hope you found this post informative and helpful. It took a lot of work to create, and I’m thrilled to finally share it with the world. Thank you for reading. 💖";

/**
 * Renders a closing signoff blurb at the bottom of a post.
 *
 * **Priority chain:** `message` prop → `metadata.signoff` → built-in default.
 *
 * ---
 *
 * **Scenario A — Default fallback**
 *
 * Omit all props and the built-in fallback text is used automatically.
 *
 * ```tsx
 * <PostSignOff />
 * ```
 *
 * ---
 *
 * **Scenario B — MDX / frontmatter metadata**
 *
 * Pass the post’s metadata object (e.g. from a dynamic layout).
 * The component reads `metadata.signoff` when present.
 *
 * ```tsx
 * // signoff: "Catch you on the flip side! ✌️"  ← frontmatter field
 * <PostSignOff metadata={post.metadata} />
 * ```
 *
 * ---
 *
 * **Scenario C — Hard prop override**
 *
 * Supply `message` directly for a one-off customisation on a specific page.
 *
 * ```tsx
 * <PostSignOff message="Custom quick signoff message just for this specific page layout! 🚀" />
 * ```
 *
 * ---
 *
 * **Scenario D — Suppressed text**
 *
 * Set `metadata.signoff` to `false` to drop the closing paragraph entirely,
 * leaving just the bare PageSignOff divider.
 *
 * ```tsx
 * // signoff: false  ← registry field
 * <PostSignOff metadata={post} />
 * ```
 */
export default function PostSignOff({ message, metadata }: PostSignOffProps): JSX.Element {
  // metadata.signoff === false suppresses the text, unless a direct `message` prop overrides it.
  if (!message && metadata?.signoff === false) {
    return <PageSignOff />;
  }

  // Logic Chain Priority: 1. Direct Prop -> 2. Metadata Field -> 3. Hardcoded Default
  const finalMessage = message ?? (typeof metadata?.signoff === "string" ? metadata.signoff : undefined) ?? DEFAULT_SIGNOFF;

  return (
    <>
      <PostSignOffRoot>
        <p>{finalMessage}</p>
        <PageSignOff />
      </PostSignOffRoot>
    </>
  );
}
