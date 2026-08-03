// Newsletter subscription lifecycle state — drives the submit button, fall-away transition, and status messaging.
export type Status = "idle" | "submitting" | "success" | "error";
