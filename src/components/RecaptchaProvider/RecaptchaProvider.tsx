"use client";

import type { JSX, ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

// Client-only boundary so server layouts can supply reCAPTCHA context without becoming client components.
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
