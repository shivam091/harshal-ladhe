// A contact form submission as persisted in the database.
export type ContactSubmission = {
  name: string;
  email: string;
  message: string;
  recaptchaScore: number;
  createdAt: Date;
};

// Google reCAPTCHA v3 siteverify API response, used to validate a submission's score.
export interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  "error-codes"?: string[];
}
