import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCountry, UNKNOWN_COUNTRY } from "@/lib/visit-keys";
import { isConsentRegion } from "@/lib/consent";

// Localhost has no edge geo header and a loopback IP ipinfo can't place, so dev needs a way to pretend to be somewhere.
const DEV_COUNTRY = process.env.NODE_ENV === "development" ? process.env.DEV_COUNTRY : undefined;

/*
  Asked from the browser rather than read while rendering, so every page can stay static. Never cached, since the
  answer depends on where each reader is. An unplaceable reader is asked too: skipping the banner would be fail-open
  for exactly the readers the law protects.
*/
export async function GET(req: NextRequest) {
  let required = true;
  try {
    const country = DEV_COUNTRY || (await getCountry(req));
    required = country === UNKNOWN_COUNTRY || isConsentRegion(country);
  } catch {
    // A failed lookup keeps the banner, for the same reason.
  }

  return NextResponse.json({ required }, { headers: { "Cache-Control": "no-store" } });
}
