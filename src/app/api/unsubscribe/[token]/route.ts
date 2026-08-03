import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyUnsubscribeToken } from "@/lib/mail/unsubscribe";
import { unsubscribe } from "@/lib/newsletter-subscribers";

type Context = { params: Promise<{ token: string }> };

/*
  A bare OK, as one-click unsubscribe (RFC 8058) comes from mail providers' servers with no page to show. An
  already-removed subscriber gets OK too, since the outcome asked for holds.
*/
export async function POST(_req: NextRequest, { params }: Context) {
  const { token } = await params;

  try {
    if (!verifyUnsubscribeToken(token)) {
      return NextResponse.json({ error: "Invalid unsubscribe link." }, { status: 404 });
    }

    await unsubscribe(token);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unsubscribe route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// Mail apps without one-click support open the header's address in a browser instead, so send people to the page.
export async function GET(req: NextRequest, { params }: Context) {
  const { token } = await params;
  return NextResponse.redirect(new URL(`/unsubscribe/${token}`, req.url), 303);
}
