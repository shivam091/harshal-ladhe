import type { JSX } from "react";
import { WaveDividerIcon } from "@/components/Icon";
import { PageSignOffRoot, DividerRoot } from "@/components/SignOff/PageSignOff/PageSignOff.styles";
import type { PageSignOffProps } from "@/components/SignOff/PageSignOff/PageSignOff.types";
import { inlineMarkdownToHtml } from "@/utils/markdown";

// Lets a page opt into a closing note without having to write one.
const DEFAULT_SIGNOFF = "I hope you found this post informative and helpful. It took a lot of work to create, and I’m thrilled to finally share it with the world. Thank you for reading. 💖";

/*
  Gives every page a consistent closing mark with an optional, per-post note. Text goes through
  inlineMarkdownToHtml so a signoff can use code font, bold and links instead of literal backticks.
*/
export default function PageSignOff({ showText = false, message, metadata }: PageSignOffProps): JSX.Element {
  const divider = (
    <DividerRoot aria-hidden="true">
      <WaveDividerIcon />
    </DividerRoot>
  );

  // An explicit `message` wins even over `signoff: false`, so a page can always force its own note.
  if ((!showText && !message) || (!message && metadata?.signoff === false)) {
    return divider;
  }

  // Most specific source wins, so per-page overrides beat frontmatter and frontmatter beats the default.
  const finalMessage = message ?? (typeof metadata?.signoff === "string" ? metadata.signoff : undefined) ?? DEFAULT_SIGNOFF;

  return (
    <PageSignOffRoot>
      <p dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(finalMessage) }} />
      {divider}
    </PageSignOffRoot>
  );
}
