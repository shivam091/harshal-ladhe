import type { ReactNode } from "react";

// The site key arrives as a prop because Vercel won't accept a NEXT_PUBLIC_ name for it, so client code can't read it from env.
export interface RecaptchaProviderProps {
  children: ReactNode;
  siteKey: string;
}
