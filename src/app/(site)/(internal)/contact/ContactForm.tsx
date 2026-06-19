"use client";

import { JSX, useEffect, useState } from "react";
import { useBoop } from "@/hooks/use-boop";
import Button from "@/components/Button";
import IconArrowRight from "@/icons/IconArrowRight";
import { generateEmailFromName, generateFullName } from "@/helpers/fake-data";
import type { ContactFormSubmitStatus } from "@/types/contact-form-submit-status";
import { ContactFormData } from "@/interfaces/contact-form-data";
import {
  FormBorder,
  FormControl,
  FormFooter,
  FormGroup,
  FormLabel,
  FormRoot,
  FormTextarea,
  RecaptchaDisclaimer
} from "@/app/(site)/(internal)/contact/ContactForm.styles";

/** localStorage key used to persist unsaved form data across page reloads. */
const STORAGE_KEY = "contact-form-data";

/** Shape of the controlled form fields. */
interface FormData {
  name: string;
  email: string;
  message: string;
}

/** Reads persisted form data from localStorage, returning empty strings on parse failure or SSR. */
function readStorage(): FormData {
  if (typeof window === "undefined") return { name: "", email: "", message: "" };
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as FormData;
  } catch {
    return { name: "", email: "", message: "" };
  }
}

/** Contact form with localStorage persistence, random sample placeholders, and a booping submit arrow. */
export default function ContactForm(): JSX.Element {
  const [isBooped, triggerBoop] = useBoop();

  const [namePlaceholder,  setNamePlaceholder]  = useState("");
  const [emailPlaceholder, setEmailPlaceholder] = useState("");
  const [fields, setFields] = useState<FormData>({ name: "", email: "", message: "" });

  // Hydrate saved values and generate fresh random placeholders on first render.
  useEffect(() => {
    const saved = readStorage();
    setFields(saved);

    const fullName = generateFullName();
    setNamePlaceholder(fullName);
    setEmailPlaceholder(generateEmailFromName(fullName));
  }, []);

  /** Writes the updated field to state and immediately persists the full form to localStorage. */
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFields(prev => {
      const next = { ...prev, [name]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <>
      <FormBorder>
        <FormRoot
          id="contact-form"
          name="contact"
          method="POST"
          action="#"
          aria-label="Contact form"
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
              placeholder="Hi Harshal, I wanted to reach out about\u2026"
              value={fields.message}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </FormGroup>

          <FormFooter>
            <Button
              type="submit"
              intent="success"
              fullWidth
              iconAlign="split"
              iconRight={<IconArrowRight size={18} isBooped={isBooped} />}
              onPointerEnter={triggerBoop}
              onFocus={triggerBoop}
            >
              Send Message
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
