import type { Status } from "@/components/NewsletterForm/NewsletterForm.types";

// Takes the form's status rather than holding its own, so the button can never drift from the submission.
export interface SubmitButtonProps {
  // Current lifecycle state of the enclosing NewsletterForm submission.
  status: Status;
}
