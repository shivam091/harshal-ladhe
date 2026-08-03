"use client";

import type { JSX } from "react";
import { useActionState } from "react";
import Button from "@/components/Button";
import { unsubscribeAction } from "@/app/(site)/unsubscribe/[token]/actions";
import { AlreadyUnsubscribed, StatusIcon, Unsubscribed } from "@/app/(site)/unsubscribe/[token]/UnsubscribeStates";
import { Actions, Badge, Email, ErrorText, Lead, Note, Title } from "@/app/(site)/unsubscribe/[token]/unsubscribe.styles";

/*
  Asks before unsubscribing, since mail scanners open every link in an email; only the button's POST unsubscribes.
  A server action, so it still works with JavaScript off.
*/
export default function UnsubscribeConfirm({ token, email }: { token: string; email: string }): JSX.Element {
  const [state, formAction, pending] = useActionState(unsubscribeAction.bind(null, token), null);

  if (state?.status === "unsubscribed") return <Unsubscribed email={state.email} />;
  if (state?.status === "gone") return <AlreadyUnsubscribed />;

  return (
    <>
      <Badge><StatusIcon name="mail" /></Badge>
      <Title id="unsubscribe-title">Unsubscribe from the newsletter?</Title>
      <Lead>
        You&apos;re subscribed as <Email>{email}</Email>. You&apos;ll stop getting emails about new posts, tutorials
        and snippets.
      </Lead>

      <Note>
        <ul>
          <li>Takes effect straight away</li>
          <li>Your address is removed from the list, not just muted</li>
          <li>You can subscribe again whenever you like</li>
        </ul>
      </Note>

      {state?.status === "error" && (
        <ErrorText role="alert">Something went wrong, so you&apos;re still subscribed. Please try again.</ErrorText>
      )}

      <form action={formAction}>
        <Actions>
          <Button type="submit" intent="danger" fullWidth loading={pending}>
            {pending ? "Unsubscribing…" : "Yes, unsubscribe me"}
          </Button>
          <Button href="/" variant="outlined" fullWidth>No, keep me subscribed</Button>
        </Actions>
      </form>
    </>
  );
}
