// One lifecycle value so the button, fields and messages can never disagree about a submission.
export type Status = "idle" | "submitting" | "success" | "error";
