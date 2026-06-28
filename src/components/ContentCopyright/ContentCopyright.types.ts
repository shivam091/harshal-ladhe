import type { CopyrightLicense } from "@/data/copyright";

// Label is a prop so the notice reads naturally for any content type.
export interface ContentCopyrightProps {
  license: CopyrightLicense;
  contentLabel?: string;
}
