import { NextResponse } from "next/server";

const SCOPES = [
  "ZohoCRM.modules.ALL",
  "ZohoCRM.settings.READ",
  "ZohoCRM.org.READ",
  "ZohoCRM.users.READ",
].join(",");

export async function GET() {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const redirectUri = process.env.ZOHO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        error: "ZOHO_CLIENT_ID and ZOHO_REDIRECT_URI must be set in .env.local before starting OAuth.",
        docs: "Visit https://api-console.zoho.com to create a Server-based Application and obtain these values.",
      },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    scope: SCOPES,
    client_id: clientId,
    response_type: "code",
    access_type: "offline",
    redirect_uri: redirectUri,
  });

  const authUrl = `https://accounts.zoho.com/oauth/v2/auth?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}
