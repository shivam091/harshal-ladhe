import type { NewsletterSource } from "@/components/NewsletterForm/NewsletterForm.types";

// The footer has its own framing, so only in-article placements come through here.
export interface NewsletterCalloutProps {
  source?: Exclude<NewsletterSource, "footer">;
}
