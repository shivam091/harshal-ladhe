import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCountry } from "@/lib/visit-keys";
import { isConsentRegion } from "@/lib/consent";

// Localhost has no edge geo header and a loopback IP ipinfo can't place, so dev needs a way to pretend to be somewhere.
const DEV_COUNTRY = process.env.NODE_ENV === "development" ? process.env.DEV_COUNTRY : undefined;

/*
  Asked from the browser rather than read while rendering, so every page can stay static. Never cached, since the
  answer depends on where each reader is.
*/
export async function GET(req: NextRequest) {
  let required = false;
  try {
    required = isConsentRegion(DEV_COUNTRY || (await getCountry(req)));
  } catch {
    // An unknown location gets no banner; gtag's own regional default still keeps analytics denied there.
  }

  return NextResponse.json({ required }, { headers: { "Cache-Control": "no-store" } });
}
