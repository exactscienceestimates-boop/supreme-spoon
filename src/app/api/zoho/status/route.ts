import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

  const configured = {
    clientId: !!clientId,
    clientSecret: !!clientSecret,
    refreshToken: !!refreshToken,
  };

  const allConfigured = Object.values(configured).every(Boolean);

  if (!allConfigured) {
    return NextResponse.json({ connected: false, configured });
  }

  // Test the token by hitting the Zoho org endpoint
  try {
    const tokenRes = await axios.post(
      `https://accounts.zoho.com/oauth/v2/token?refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=refresh_token`
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      return NextResponse.json({ connected: false, configured, error: "Token refresh failed" });
    }

    const orgRes = await axios.get("https://www.zohoapis.com/crm/v2/org", {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    });

    const org = orgRes.data.org?.[0];
    return NextResponse.json({
      connected: true,
      configured,
      org: {
        name: org?.company_name,
        email: org?.primary_email,
        plan: org?.license_details?.paid_type,
      },
    });
  } catch {
    return NextResponse.json({ connected: false, configured, error: "Could not reach Zoho API" });
  }
}
