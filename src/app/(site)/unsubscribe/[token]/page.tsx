import type { JSX } from "react";
import type { Metadata } from "next";
import { Main } from "@/app/(site)/route-shell.styles";
import { findUnsubscribeTarget } from "@/lib/newsletter-subscribers";
import UnsubscribeConfirm from "@/app/(site)/unsubscribe/[token]/UnsubscribeConfirm";
import { AlreadyUnsubscribed, InvalidLink } from "@/app/(site)/unsubscribe/[token]/UnsubscribeStates";
import { Card } from "@/app/(site)/unsubscribe/[token]/unsubscribe.styles";

// Each link is one subscriber's, so none of them belong in search results.
export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false }
};

/*
  Outside the (internal) group, whose PageHeading would title the page with the token.
*/
export default async function UnsubscribePage({ params }: { params: Promise<{ token: string }> }): Promise<JSX.Element> {
  const { token } = await params;
  const target = await findUnsubscribeTarget(token);

  return (
    <Main id="main-content" tabIndex={-1}>
      <Card aria-labelledby="unsubscribe-title">
        {target.status === "subscribed" && <UnsubscribeConfirm token={token} email={target.email} />}
        {target.status === "gone" && <AlreadyUnsubscribed />}
        {target.status === "invalid" && <InvalidLink />}
      </Card>
    </Main>
  );
}
