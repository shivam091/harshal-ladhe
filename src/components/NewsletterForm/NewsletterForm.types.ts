// One lifecycle value so the button, fields and messages can never disagree about a submission.
export type Status = "idle" | "submitting" | "success" | "error";

// Stored with each sign-up, so the admin can tell which placement brings subscribers in.
export type NewsletterSource = "footer" | "article_end" | "article_inline";

export interface NewsletterFormProps {
  source: NewsletterSource;
}
