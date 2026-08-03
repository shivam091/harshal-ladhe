import type { Status } from "@/types/newsletter";

// Props for the newsletter form's submit button — its progress ring, arrow, and spinner all key off the shared submission status.
export interface SubmitButtonProps {
  // Current lifecycle state of the enclosing NewsletterForm submission.
  status: Status;
}
