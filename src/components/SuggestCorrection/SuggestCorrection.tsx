"use client";

import type { JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCorrectionUrl } from "@/utils/correction";
import type { SuggestCorrectionProps } from "@/components/SuggestCorrection/SuggestCorrection.types";
import { CorrectionNote } from "@/components/SuggestCorrection/SuggestCorrection.styles";

// Routes corrections to the contact form rather than public comments, so a fixed mistake leaves no stale thread behind.
export default function SuggestCorrection({ contentLabel = "post" }: SuggestCorrectionProps): JSX.Element {
  const pathname = usePathname().replace(/\/$/, "");

  return (
    <>
      <CorrectionNote>
        Spotted a mistake or something outdated in this {contentLabel}?{" "}
        <Link href={getCorrectionUrl(pathname)}>Suggest a correction</Link>.
      </CorrectionNote>
    </>
  );
}

SuggestCorrection.displayName = "SuggestCorrection";
