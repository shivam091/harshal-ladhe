"use client";

import { useEffect } from "react";
import { THEME_KEY } from "@/constants/color-scheme";
import { resolveConsentStatus } from "@/lib/consent";
import { detectGaStatus } from "@/lib/ga-status";
import { configureMixpanel, mixpanelRegister, syncMixpanelConsent } from "@/lib/mixpanel";

// So a Mixpanel reader can be matched to the same visitor in GA's own exports.
function readGaClientId(): string | null {
  const cookie = document.cookie.split("; ").find((part) => part.startsWith("_ga="));
  const parts = cookie?.slice(4).split(".") ?? [];
  return parts.length >= 4 ? parts.slice(-2).join(".") : null;
}

// Falls back to "system" where storage is blocked, so every event still carries a theme.
function readTheme(): string {
  try {
    return window.localStorage.getItem(THEME_KEY) ?? "system";
  } catch {
    return "system";
  }
}

/*
  So every report can be split by preference, consent and GA reach. ga_status is the one thing GA can't tell about
  itself: how many readers it never sees because their browser blocked gtag.
*/
export function useMixpanel(token: string | null): void {
  // In render rather than the effect, because children's effects run first and an event sent from one would be lost.
  configureMixpanel(token);

  useEffect(() => {
    if (!token) return;

    mixpanelRegister({
      theme: readTheme(),
      prefers_reduced_motion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      prefers_dark: window.matchMedia("(prefers-color-scheme: dark)").matches
    });

    resolveConsentStatus().then((status) => {
      mixpanelRegister({ consent_status: status });
      syncMixpanelConsent(status);
    });

    detectGaStatus().then((status) => {
      mixpanelRegister({ ga_status: status ?? "off", ga_client_id: readGaClientId() ?? "(none)" });
    });
  }, [token]);
}
