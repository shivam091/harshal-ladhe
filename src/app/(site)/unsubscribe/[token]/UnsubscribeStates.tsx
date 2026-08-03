import type { JSX } from "react";
import Button from "@/components/Button";
import { siteConfig } from "@/config/site";
import { Actions, Badge, Email, Lead, Note, Title } from "@/app/(site)/unsubscribe/[token]/unsubscribe.styles";

/*
  No "use client", so both the server-rendered page and the confirm form can show these.
*/

export function StatusIcon({ name }: { name: "mail" | "check" | "alert" }): JSX.Element {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === "mail" && <><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></>}
      {name === "check" && <polyline points="20 6 9 17 4 12" />}
      {name === "alert" && <><path d="M12 3 2 21h20L12 3z" /><line x1="12" y1="10" x2="12" y2="14" /><line x1="12" y1="17.5" x2="12" y2="17.5" /></>}
    </svg>
  );
}

function ResubscribeNote(): JSX.Element {
  return (
    <Note>
      <strong>Changed your mind?</strong> You can subscribe again at any time from the form at the bottom of every
      page.
    </Note>
  );
}

export function Unsubscribed({ email }: { email: string }): JSX.Element {
  return (
    <>
      <Badge data-tone="success"><StatusIcon name="check" /></Badge>
      <Title id="unsubscribe-title">You&apos;re unsubscribed</Title>
      <Lead role="status"><Email>{email}</Email> won&apos;t get any more newsletter emails. Sorry to see you go!</Lead>
      <ResubscribeNote />
      <BackToBlog />
    </>
  );
}

export function AlreadyUnsubscribed(): JSX.Element {
  return (
    <>
      <Badge data-tone="success"><StatusIcon name="check" /></Badge>
      <Title id="unsubscribe-title">You&apos;re already unsubscribed</Title>
      <Lead>This address is no longer on the newsletter list, so there&apos;s nothing more to do.</Lead>
      <ResubscribeNote />
      <BackToBlog />
    </>
  );
}

// Most often a link cut short by a mail app, so the way out is the link in the email again, or a reply.
export function InvalidLink(): JSX.Element {
  return (
    <>
      <Badge data-tone="attention"><StatusIcon name="alert" /></Badge>
      <Title id="unsubscribe-title">This link doesn&apos;t work</Title>
      <Lead>
        It may have been cut short by your mail app. Try the <strong>Unsubscribe</strong> link at the bottom of the
        email again.
      </Lead>
      <Note>Still stuck? Reply to any newsletter email asking to be removed, and it&apos;ll be done by hand.</Note>
      <BackToBlog />
    </>
  );
}

function BackToBlog(): JSX.Element {
  return (
    <Actions>
      <Button href="/" fullWidth>Back to {siteConfig.name}</Button>
    </Actions>
  );
}
