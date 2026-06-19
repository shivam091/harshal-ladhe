"use client";

import { JSX, ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

// Wraps children with the reCAPTCHA v3 provider, scoped to client components only.
export default function RecaptchaProvider({ children }: { children: ReactNode }): JSX.Element {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

  return (
    <>
      <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
        {children}
      </GoogleReCaptchaProvider>
    </>
  );
}

RecaptchaProvider.displayName = "RecaptchaProvider";
