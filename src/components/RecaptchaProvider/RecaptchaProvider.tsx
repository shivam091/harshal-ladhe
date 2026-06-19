"use client";

import type { JSX } from "react";
import type { RecaptchaProviderProps } from "./RecaptchaProvider.types";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

// Client-only boundary so server layouts can supply reCAPTCHA context without becoming client components.
export default function RecaptchaProvider({ children, siteKey }: RecaptchaProviderProps): JSX.Element {
  return (
    <>
      <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
        {children}
      </GoogleReCaptchaProvider>
    </>
  );
}

RecaptchaProvider.displayName = "RecaptchaProvider";
