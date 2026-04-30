import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Self-Client grant token exchange — for users who generated a grant token
// directly in the Zoho API Console without a redirect URI.
export async function POST(req: NextRequest) {
  try {
    const { grantToken } = await req.json();

    if (!grantToken) {
      return NextResponse.json({ error: "grantToken is required" }, { status: 400 });
    }

    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET must be set in .env.local" },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      code: grantToken,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: "https://zwc.zoho.com/zwc/gmailsync",
      grant_type: "authorization_code",
    });

    const res = await axios.post(
      `https://accounts.zoho.com/oauth/v2/token?${params.toString()}`
    );

    const { access_token, refresh_token } = res.data;

    if (!refresh_token) {
      return NextResponse.json(
        { error: "No refresh_token returned — grant token may be expired (they last 3 minutes)", raw: res.data },
        { status: 400 }
      );
    }

    return NextResponse.json({ refresh_token, access_token });
  } catch (err: unknown) {
    console.error("Zoho self-client exchange error:", err);
    const message = err instanceof Error ? err.message : "Exchange failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
