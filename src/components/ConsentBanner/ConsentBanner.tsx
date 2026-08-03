"use client";

import type { JSX } from "react";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import Button from "@/components/Button";
import { CONSENT_OPEN_EVENT, CONSENT_STORAGE_KEY, consentParams, type ConsentChoice } from "@/lib/consent";
import { Wrapper, Panel, Title, Message, Actions } from "@/components/ConsentBanner/ConsentBanner.styles";

// Storage can throw (private mode, blocked cookies); without it the banner simply asks again next visit.
function readChoice(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
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
    const controller = new AbortController();

    if (!readChoice()) {
      fetch("/api/consent-region", { cache: "no-store", signal: controller.signal })
        .then((res) => (res.ok ? (res.json() as Promise<{ required?: boolean }>) : null))
        .then((data) => {
          if (data?.required) setIsOpen(true);
        })
        .catch(() => {});
    }

    const open = (): void => setIsOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => {
      controller.abort();
      window.removeEventListener(CONSENT_OPEN_EVENT, open);
    };
  }, []);

  function choose(choice: ConsentChoice): void {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // The choice still applies for this visit even if it can't be remembered.
    }
    window.gtag?.("consent", "update", consentParams(choice));
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
