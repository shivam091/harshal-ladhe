"use client";

import type { JSX} from "react";
import { useCallback, useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Button from "@/components/Button";
import IconArrowRight from "@/icons/IconArrowRight";
import { generateEmailFromName, generateFullName } from "@/helpers/fake-data";
// One status union rather than booleans so contradictory states like submitting + success can't occur.
type ContactFormSubmitStatus = "idle" | "submitting" | "success" | "error";

// Mirrors the API payload so the form state can be posted and persisted as-is.
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
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

// Lets an unsent message survive an accidental reload or navigation.
const STORAGE_KEY = "contact-form-data";

const EMPTY_FORM: ContactFormData = { name: "", email: "", message: "" };

// Tolerates missing or corrupt storage so a bad saved value never breaks the controlled inputs.
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

// Invisible reCAPTCHA v3 blocks spam without making visitors solve a challenge.
export default function ContactForm(): JSX.Element {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [namePlaceholder,  setNamePlaceholder]  = useState("");
  const [emailPlaceholder, setEmailPlaceholder] = useState("");
  const [fields,     setFields]     = useState<ContactFormData>(EMPTY_FORM);
  const [status,     setStatus]     = useState<ContactFormSubmitStatus>("idle");
  const [errorMsg,   setErrorMsg]   = useState("");

  // Runs after mount because localStorage and random placeholders would otherwise mismatch the server render.
  useEffect(() => {
    const saved = readStorage();
    setFields(saved);

    const fullName = generateFullName();
    setNamePlaceholder(fullName);
    setEmailPlaceholder(generateEmailFromName(fullName));
  }, []);

  // Persists on every keystroke so nothing typed is lost if the tab closes.
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFields(prev => {
      const next = { ...prev, [name]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  // Token is fetched per submit because reCAPTCHA v3 tokens expire after two minutes.
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
