// Run with: node scripts/zoho-exchange.mjs <grant_token>
// Example:   node scripts/zoho-exchange.mjs 1000.abc123...

const grantToken = process.argv[2];

if (!grantToken) {
  console.error("Usage: node scripts/zoho-exchange.mjs <grant_token>");
  process.exit(1);
}

const CLIENT_ID     = "1000.UXDVI5LVHF15EJQ220727K5KRANLTH";
const CLIENT_SECRET = "fb445c5f26933efb4a21412a1076367d750813d9c1";

const params = new URLSearchParams({
  code:          grantToken,
  client_id:     CLIENT_ID,
  client_secret: CLIENT_SECRET,
  grant_type:    "authorization_code",
});

console.log("Exchanging grant token with Zoho...\n");

const res = await fetch(`https://accounts.zoho.com/oauth/v2/token?${params.toString()}`, {
  method: "POST",
});

const data = await res.json();

if (data.refresh_token) {
  console.log("SUCCESS!\n");
  console.log("Add this line to your .env.local:\n");
  console.log(`ZOHO_REFRESH_TOKEN=${data.refresh_token}\n`);
} else {
  console.log("Response:", JSON.stringify(data, null, 2));
  if (data.error === "invalid_code") {
    console.log("\nGrant token expired (they last 10 min). Generate a new one at api-console.zoho.com and rerun.");
  }
}
