import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    const setupUrl = new URL("/zoho-setup", req.url);
    setupUrl.searchParams.set("error", error);
    return NextResponse.redirect(setupUrl);
  }

  if (!code) {
    const setupUrl = new URL("/zoho-setup", req.url);
    setupUrl.searchParams.set("error", "no_code");
    return NextResponse.redirect(setupUrl);
  }

  const clientId = process.env.ZOHO_CLIENT_ID!;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET!;
  const redirectUri = process.env.ZOHO_REDIRECT_URI!;

  try {
    const params = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const res = await axios.post(
      `https://accounts.zoho.com/oauth/v2/token?${params.toString()}`
    );

    const { access_token, refresh_token } = res.data;

    if (!refresh_token) {
      const setupUrl = new URL("/zoho-setup", req.url);
      setupUrl.searchParams.set("error", "no_refresh_token");
      return NextResponse.redirect(setupUrl);
    }

    const setupUrl = new URL("/zoho-setup", req.url);
    setupUrl.searchParams.set("refresh_token", refresh_token);
    setupUrl.searchParams.set("access_token", access_token);
    return NextResponse.redirect(setupUrl);
  } catch (err) {
    console.error("Zoho token exchange error:", err);
    const setupUrl = new URL("/zoho-setup", req.url);
    setupUrl.searchParams.set("error", "token_exchange_failed");
    return NextResponse.redirect(setupUrl);
  }
}
