"use client";

import type { JSX } from "react";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import Button from "@/components/Button";
import type { ConsentChoice } from "@/lib/consent";
import { CONSENT_OPEN_EVENT, CONSENT_STORAGE_KEY, consentParams, fetchConsentRequired, readConsentStatus, reportConsent } from "@/lib/consent";
import { trackEvent } from "@/lib/analytics";
import { Wrapper, Panel, Title, Message, Actions } from "@/components/ConsentBanner/ConsentBanner.styles";

// Session-scoped so a reader who ignores the banner across many pages is one impression, not one per page.
const SHOWN_KEY = "analytics-consent-shown";

// Counts the banner once per browser session; storage failing just means it may be counted again.
function reportShownOnce(): void {
  try {
    if (window.sessionStorage.getItem(SHOWN_KEY)) return;
    window.sessionStorage.setItem(SHOWN_KEY, "1");
  } catch {
    // Unknown whether it was counted before, so counting again is the safer error.
  }
  reportConsent("shown", readConsentStatus());
}

/*
  Only readers where opt-in is the law are asked; everywhere else gtag's default already grants. Non-modal and
  without focus capture, so the page stays fully usable while the question waits.
*/
export default function ConsentBanner(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    let cancelled = false;

    // A stored answer needs no question, so the region lookup is skipped for returning readers.
    if (readConsentStatus() === "pending") {
      fetchConsentRequired().then((required) => {
        if (cancelled || !required) return;
        setIsOpen(true);
        reportShownOnce();
      });
    }

    const open = (): void => setIsOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => {
      cancelled = true;
      window.removeEventListener(CONSENT_OPEN_EVENT, open);
    };
  }, []);

  function choose(choice: ConsentChoice): void {
    const previous = readConsentStatus();
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // The choice still applies for this visit even if it can't be remembered.
    }
    window.gtag?.("consent", "update", consentParams(choice));
    // Reported after the update so GA receives it under the reader's new choice; a decline arrives as a cookieless ping.
    trackEvent("consent_choice", { choice, previous_choice: previous });
    reportConsent(choice, previous);
    setIsOpen(false);
  }

  return (
    <>
      <Wrapper>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 170, damping: 26 }}
            >
              <Panel aria-labelledby={titleId} aria-describedby={messageId}>
                <Title id={titleId}>Analytics cookies</Title>
                <Message id={messageId}>
                  May I use Google Analytics cookies to see which pages get read? None are set unless you accept,
                  and you can change your mind any time from the <Link href="/privacy-policy">privacy policy</Link>.
                </Message>
                <Actions>
                  <Button size="sm" intent="accent" onClick={() => choose("granted")}>Accept</Button>
                  <Button size="sm" intent="accent" onClick={() => choose("denied")}>Decline</Button>
                </Actions>
              </Panel>
            </motion.div>
          )}
        </AnimatePresence>
      </Wrapper>
    </>
  );
}

ConsentBanner.displayName = "ConsentBanner";
