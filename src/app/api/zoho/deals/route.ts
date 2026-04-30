import { NextRequest, NextResponse } from "next/server";
import { createZohoDeal } from "@/lib/zoho";
import { ClaimData } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const claim: ClaimData = {
      adjusterName: body.adjusterName,
      adjusterEmail: body.adjusterEmail,
      adjusterPhone: body.adjusterPhone,
      companyName: body.companyName,
      insuredName: body.insuredName,
      claimNumber: body.claimNumber,
      policyNumber: body.policyNumber,
      lossDate: body.lossDate,
      propertyAddress: body.propertyAddress,
      notes: body.notes,
    };

    if (!claim.insuredName || !claim.claimNumber) {
      return NextResponse.json(
        { error: "insuredName and claimNumber are required" },
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

    const id = await createZohoDeal(claim, body.supplementTotal || 0);
    return NextResponse.json({ id });
  } catch (err) {
    console.error("Zoho deal creation error:", err);
    return NextResponse.json(
      { error: "Failed to create deal" },
      { status: 500 }
    );
  }
}
