import { Pill } from "@/components/TagPill/TagPill.styles";
import type { TagPillProps } from "@/components/TagPill/TagPill.types";

// One shared pill so every tag cloud on the site renders identical markup.
export default function TagPill(props: TagPillProps) {
  return (
    <>
      <Pill {...props} />
    </>
  );
}
