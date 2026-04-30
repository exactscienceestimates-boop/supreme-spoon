import axios from "axios";
import { LeadData, ClaimData } from "./types";

const ZOHO_API_BASE = "https://www.zohoapis.com/crm/v2";
const ORG_ID = process.env.ZOHO_ORG_ID;

async function getAccessToken(): Promise<string> {
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: "refresh_token",
  });

  const res = await axios.post(
    `https://accounts.zoho.com/oauth/v2/token?${params.toString()}`
  );

  if (!res.data.access_token) {
    throw new Error("Failed to obtain Zoho access token");
  }

  return res.data.access_token;
}

function zohoHeaders(token: string) {
  return {
    Authorization: `Zoho-oauthtoken ${token}`,
    "Content-Type": "application/json",
    orgId: ORG_ID,
  };
}

export async function createZohoLead(lead: LeadData): Promise<string> {
  const token = await getAccessToken();

  const payload = {
    data: [
      {
        First_Name: lead.firstName,
        Last_Name: lead.lastName,
        Email: lead.email,
        Phone: lead.phone,
        Street: lead.address,
        Lead_Source: "Website",
        Lead_Status: "New",
        Description: lead.notes || "",
        $custom_json: {
          Roof_System: lead.roofSystem || "",
          Estimate_Total: lead.estimateTotal || 0,
          Submission_Source: lead.source,
        },
      },
    ],
    trigger: ["workflow"],
  };

  const res = await axios.post(`${ZOHO_API_BASE}/Leads`, payload, {
    headers: zohoHeaders(token),
  });

  return res.data.data?.[0]?.details?.id || "";
}

export async function createZohoDeal(
  claim: ClaimData,
  supplementTotal: number
): Promise<string> {
  const token = await getAccessToken();

  const contactPayload = {
    data: [
      {
        First_Name: claim.adjusterName.split(" ")[0] || claim.adjusterName,
        Last_Name: claim.adjusterName.split(" ").slice(1).join(" ") || ".",
        Email: claim.adjusterEmail,
        Phone: claim.adjusterPhone,
        Account_Name: claim.companyName,
        Lead_Source: "Insurance Claim",
      },
    ],
  };

  const contactRes = await axios.post(
    `${ZOHO_API_BASE}/Contacts`,
    contactPayload,
    { headers: zohoHeaders(token) }
  );
  const contactId = contactRes.data.data?.[0]?.details?.id;

  const dealPayload = {
    data: [
      {
        Deal_Name: `${claim.insuredName} - Claim #${claim.claimNumber}`,
        Stage: "Qualification",
        Amount: supplementTotal,
        Lead_Source: "Insurance Claim",
        Description: `Policy: ${claim.policyNumber}\nLoss Date: ${claim.lossDate}\nProperty: ${claim.propertyAddress}\nInsured: ${claim.insuredName}\n${claim.notes || ""}`,
        Contact_Name: contactId ? { id: contactId } : undefined,
      },
    ],
    trigger: ["workflow"],
  };

  const dealRes = await axios.post(`${ZOHO_API_BASE}/Deals`, dealPayload, {
    headers: zohoHeaders(token),
  });

  return dealRes.data.data?.[0]?.details?.id || "";
}
