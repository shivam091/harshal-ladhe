"use client";

import type { JSX} from "react";
import { useCallback, useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Button from "@/components/Button";
import IconArrowRight from "@/icons/IconArrowRight";
import { generateEmailFromName, generateFullName } from "@/helpers/fake-data";
import type { ContactFormSubmitStatus } from "@/types/contact-form-submit-status";
import type { ContactFormData } from "@/interfaces/contact-form-data";
import {
  FormBorder,
  FormControl,
  FormFooter,
  FormGroup,
  FormLabel,
  FormRoot,
  FormTextarea,
  RecaptchaDisclaimer
} from "@/app/(site)/(internal)/contact/ContactForm/ContactForm.styles";

// localStorage key used to persist unsaved form data across page reloads.
const STORAGE_KEY = "contact-form-data";

const EMPTY_FORM: ContactFormData = { name: "", email: "", message: "" };

// Reads persisted form data from localStorage, merging with empty defaults to guarantee all keys are strings.
function readStorage(): ContactFormData {
  if (typeof window === "undefined") return EMPTY_FORM;
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<ContactFormData>;
    return {
      name:    parsed.name    ?? "",
      email:   parsed.email   ?? "",
      message: parsed.message ?? ""
    };
  } catch {
    return EMPTY_FORM;
  }
}

// Contact form with reCAPTCHA v3, localStorage persistence, random sample placeholders, and a booping submit arrow.
export default function ContactForm(): JSX.Element {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [namePlaceholder,  setNamePlaceholder]  = useState("");
  const [emailPlaceholder, setEmailPlaceholder] = useState("");
  const [fields,     setFields]     = useState<ContactFormData>(EMPTY_FORM);
  const [status,     setStatus]     = useState<ContactFormSubmitStatus>("idle");
  const [errorMsg,   setErrorMsg]   = useState("");

  // Hydrate saved values and generate fresh random placeholders on first render.
  useEffect(() => {
    const saved = readStorage();
    setFields(saved);

    const fullName = generateFullName();
    setNamePlaceholder(fullName);
    setEmailPlaceholder(generateEmailFromName(fullName));
  }, []);

  // Writes the updated field to state and immediately persists the full form to localStorage.
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFields(prev => {
      const next = { ...prev, [name]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  // Executes reCAPTCHA, then POSTs the form data + token to the API route.
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!executeRecaptcha) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const recaptchaToken = await executeRecaptcha("contact_form");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, recaptchaToken })
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Submission failed.");
      }

      setStatus("success");
      setFields(EMPTY_FORM);
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }, [executeRecaptcha, fields]);

  return (
    <>
      <FormBorder>
        <FormRoot
          id="contact-form"
          aria-label="Contact form"
          onSubmit={handleSubmit}
        >
          <FormGroup>
            <FormLabel htmlFor="name" data-required>
              Preferred Name
            </FormLabel>
            <FormControl
              type="text"
              id="name"
              name="name"
              placeholder={namePlaceholder}
              autoComplete="name"
              value={fields.name}
              onChange={handleChange}
              required
              aria-required="true"
              disabled={status === "submitting"}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="email" data-required>
              Email Address
            </FormLabel>
            <FormControl
              type="email"
              id="email"
              name="email"
              placeholder={emailPlaceholder}
              autoComplete="email"
              value={fields.email}
              onChange={handleChange}
              required
              aria-required="true"
              disabled={status === "submitting"}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="message" data-required>
              Message
            </FormLabel>
            <FormTextarea
              id="message"
              name="message"
              rows={6}
              placeholder="Hi Harshal, I wanted to reach out about..."
              value={fields.message}
              onChange={handleChange}
              required
              aria-required="true"
              disabled={status === "submitting"}
            />
          </FormGroup>

          {status === "error" && (
            <p role="alert" aria-live="assertive" style={{ color: "var(--color-fg-danger)", fontSize: "0.875rem" }}>
              {errorMsg}
            </p>
          )}

          {status === "success" && (
            <p role="status" aria-live="polite" style={{ color: "var(--color-fg-success)", fontSize: "0.875rem" }}>
              Message sent! I'll get back to you soon.
            </p>
          )}

          <FormFooter>
            <Button
              type="submit"
              fullWidth
              iconAlign="split"
              iconVariant="boxed"
              iconRight={<IconArrowRight size={18} />}
              loading={status === "submitting"}
            >
              {status === "submitting" ? "Sending…" : "Send Message"}
            </Button>
          </FormFooter>
        </FormRoot>
      </FormBorder>

      <RecaptchaDisclaimer>
        This site is protected by reCAPTCHA and the Google{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </a>{" "}
        apply.
      </RecaptchaDisclaimer>
    </>
  );
}

ContactForm.displayName = "ContactForm";
