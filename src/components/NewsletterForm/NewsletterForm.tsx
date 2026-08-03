"use client";

import type { JSX } from "react";
import { useState, useEffect, useId } from "react";
import { usePathname } from "next/navigation";
import type { Status } from "@/components/NewsletterForm/NewsletterForm.types";
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

// SuccessMessage starts fading out only once the form's own FallAway fields have begun reappearing (their slowest stagger delay is 300ms), then takes FallAway's standard 400ms transition to fully disappear.
const SUCCESS_FADE_DELAY = 300;
const SUCCESS_FADE_DURATION = 400;

// Fields fall away on success so the confirmation takes their place without a layout jump.
export default function NewsletterForm(): JSX.Element {
  const [email, setEmail]       = useState("");
  const [status, setStatus]     = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [emailPlaceholder, setEmailPlaceholder] = useState("you@example.com");
  const emailId = useId();
  const pathname = usePathname();

  // SiteFooter lives in a persistent layout, so this only remounts on a hard refresh — re-roll the
  // placeholder and clear any typed-but-unsubmitted email on every client-side navigation too.
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

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Subscription failed.");
      }

      setStatus("success");
      setShowSuccessMessage(true);
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
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
      <OuterWrapper>
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
                onChange={e => setEmail(e.target.value)}
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
