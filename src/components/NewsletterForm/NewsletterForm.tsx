"use client";

import type { JSX } from "react";
import { useState, useEffect, useId, useRef } from "react";
import { usePathname } from "next/navigation";
import type { NewsletterFormProps, Status } from "@/components/NewsletterForm/NewsletterForm.types";
import { generateEmailFromName, generateFullName } from "@/helpers/fake-data";
import FallAway from "@/components/FallAway";
import SubmitButton from "@/components/NewsletterForm/SubmitButton";
import VisuallyHidden from "@/components/VisuallyHidden";
import {
  OuterWrapper,
  FormWrapper,
  IntroText,
  Row,
  EmailInput,
  ErrorBox,
  SuccessMessage
} from "@/components/NewsletterForm/NewsletterForm.styles";
import Sparkles from "@/components/Sparkles";
import { trackEvent } from "@/lib/analytics";
import { mixpanelIdentify } from "@/lib/mixpanel";

// Matches the fields' slowest FallAway stagger, so the message fades only once they begin returning.
const SUCCESS_FADE_DELAY = 300;

// FallAway's standard transition length, so the message unmounts exactly as its fade ends.
const SUCCESS_FADE_DURATION = 400;

// Most of the form on screen, so one scrolled past at the edge of the viewport isn't counted as seen.
const SEEN_THRESHOLD = 0.6;

// Fields fall away on success so the confirmation takes their place without a layout jump.
export default function NewsletterForm({ source }: NewsletterFormProps): JSX.Element {
  const [email, setEmail]       = useState("");
  const [status, setStatus]     = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [emailPlaceholder, setEmailPlaceholder] = useState("you@example.com");
  const emailId = useId();
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Per page, so the seen → focused → started → subscribed funnel counts each page view once per form.
  const focusedRef = useRef(false);
  const startedRef = useRef(false);

  function trackForm(name: string, params: Record<string, string> = {}): void {
    trackEvent(name, { event_label: pathname, form_source: source, ...params });
  }

  useEffect(() => {
    focusedRef.current = false;
    startedRef.current = false;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      trackEvent("newsletter_form_seen", { event_label: pathname, form_source: source });
    }, { threshold: SEEN_THRESHOLD });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [pathname, source]);

  // Its own event, since autocapture sees clicks but not a field reached with the keyboard.
  function handleFocus(): void {
    if (focusedRef.current) return;
    focusedRef.current = true;
    trackForm("newsletter_form_focused");
  }

  function handleStart(): void {
    if (startedRef.current) return;
    startedRef.current = true;
    trackForm("newsletter_form_started");
  }

  // The form persists across client-side navigations, so re-roll the placeholder and clear any unsubmitted email on each one.
  useEffect(() => {
    setEmailPlaceholder(generateEmailFromName(generateFullName()));
    setEmail("");
    setStatus("idle");
    setErrorMsg("");
    setShowSuccessMessage(false);
  }, [pathname]);

  // Drives status through submitting, success and error so the UI can react to each.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    // Every attempt rather than once per page, so a retry after an error shows as one.
    trackForm("newsletter_form_submitted");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, sourcePage: pathname })
      });

      const data = await res.json() as { error?: string; readerId?: string };
      if (!res.ok) throw new Error(data.error ?? "Subscription failed.");
      // Later visits then join the subscriber's profile; the server only sends an id for a reader Mixpanel tracks.
      if (data.readerId) mixpanelIdentify(data.readerId);

      setStatus("success");
      setShowSuccessMessage(true);
      setEmail("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setStatus("error");
      setErrorMsg(message);
      // The message the reader saw, never the address, so the report can tell a typo from an outage.
      trackForm("newsletter_form_error", { error_message: message.slice(0, 100) });
    }
  }

  const isSuccess = status === "success";

  // 5s after a successful submit, drop back to idle so the FallAway fields/text reverse back into view for the next submission.
  useEffect(() => {
    if (!isSuccess) return;
    const revertTimer = setTimeout(() => setStatus("idle"), 5000);
    return () => clearTimeout(revertTimer);
  }, [isSuccess]);

  // Keeps SuccessMessage mounted through its own fade-out instead of vanishing the instant status flips back to idle.
  useEffect(() => {
    if (isSuccess || !showSuccessMessage) return;
    const unmountTimer = setTimeout(
      () => setShowSuccessMessage(false),
      SUCCESS_FADE_DELAY + SUCCESS_FADE_DURATION
    );
    return () => clearTimeout(unmountTimer);
  }, [isSuccess, showSuccessMessage]);

  return (
    <>
      <OuterWrapper ref={wrapperRef}>
        <FormWrapper onSubmit={handleSubmit} aria-label="Newsletter subscription">
          <IntroText onClick={() => document.getElementById(emailId)?.focus()}>
            <FallAway when={isSuccess} distance={7.5} rotation={10} delay={300}>
              Want to know when I publish new content?
            </FallAway>
            <FallAway when={isSuccess} distance={7} rotation={-5} delay={200}>
              Enter your email to join my free newsletter:
            </FallAway>
          </IntroText>

          <VisuallyHidden>
            <label htmlFor={emailId}>Email</label>
          </VisuallyHidden>

          <FallAway when={isSuccess} distance={4} rotation={3} delay={0}>
            <Row>
              <EmailInput
                id={emailId}
                type="email"
                name="email"
                placeholder={emailPlaceholder}
                autoComplete="email"
                value={email}
                onFocus={handleFocus}
                onChange={e => {
                  handleStart();
                  setEmail(e.target.value);
                }}
                required
                aria-required="true"
                aria-hidden={isSuccess || undefined}
                disabled={status === "submitting"}
              />
              <SubmitButton status={status} />
            </Row>
          </FallAway>

          {status === "error" && (
            <ErrorBox role="alert" aria-live="assertive">
              <p>{errorMsg}</p>
            </ErrorBox>
          )}
        </FormWrapper>

        {showSuccessMessage && (
          <FallAway when={!isSuccess} distance={0} rotation={0} delay={SUCCESS_FADE_DELAY}>
            <SuccessMessage role="status" aria-live="polite">
              <Sparkles isToggleable={false} colors={["#FFC700", "#FF8A9B", "#79E0FF"]}>
                You&apos;re subscribed! Thanks for joining. ✨
              </Sparkles>
            </SuccessMessage>
          </FallAway>
        )}
      </OuterWrapper>
    </>
  );
}

NewsletterForm.displayName = "NewsletterForm";
