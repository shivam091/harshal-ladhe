import type { Status } from "@/components/NewsletterForm/NewsletterForm.types";

// Props for the newsletter form's submit button — its progress ring, arrow, and spinner all key off the shared submission status.
export interface SubmitButtonProps {
  // Current lifecycle state of the enclosing NewsletterForm submission.
  status: Status;
}
