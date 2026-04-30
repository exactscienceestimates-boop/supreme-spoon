import { NextRequest, NextResponse } from "next/server";
import { createZohoLead } from "@/lib/zoho";
import { LeadData } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const lead: LeadData = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      roofSystem: body.roofSystem,
      estimateTotal: body.estimateTotal,
      source: body.source || "estimate",
      notes: body.notes,
    };

    if (!lead.firstName || !lead.lastName || !lead.email) {
      return NextResponse.json(
        { error: "firstName, lastName, and email are required" },
        { status: 400 }
      );
    }

    if (
      !process.env.ZOHO_CLIENT_ID ||
      !process.env.ZOHO_CLIENT_SECRET ||
      !process.env.ZOHO_REFRESH_TOKEN
    ) {
      return NextResponse.json({ id: "zoho-not-configured", note: "Zoho credentials not set" });
    }

    const id = await createZohoLead(lead);
    return NextResponse.json({ id });
  } catch (err) {
    console.error("Zoho lead creation error:", err);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
