import { NextRequest, NextResponse } from "next/server";
import { generateSupplementEstimate } from "@/lib/claude";
import { createZohoDeal } from "@/lib/zoho";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const claimData = {
      adjusterName: formData.get("adjusterName") as string,
      adjusterEmail: formData.get("adjusterEmail") as string,
      adjusterPhone: formData.get("adjusterPhone") as string,
      companyName: formData.get("companyName") as string,
      insuredName: formData.get("insuredName") as string,
      claimNumber: formData.get("claimNumber") as string,
      policyNumber: formData.get("policyNumber") as string,
      lossDate: formData.get("lossDate") as string,
      propertyAddress: formData.get("propertyAddress") as string,
      notes: (formData.get("notes") as string) || "",
    };

    if (!claimData.insuredName || !claimData.claimNumber || !claimData.propertyAddress) {
      return NextResponse.json(
        { error: "insuredName, claimNumber, and propertyAddress are required" },
        { status: 400 }
      );
    }

    const files = formData.getAll("files") as File[];
    let fileContents = "";

    for (const file of files) {
      if (file.type === "text/plain") {
        const text = await file.text();
        fileContents += `\n\n--- File: ${file.name} ---\n${text}`;
      } else {
        fileContents += `\n\n--- File: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(1)}KB) ---\n[Binary file — use metadata for context]`;
      }
    }

    const supplement = await generateSupplementEstimate(
      {
        insuredName: claimData.insuredName,
        claimNumber: claimData.claimNumber,
        propertyAddress: claimData.propertyAddress,
        lossDate: claimData.lossDate,
      },
      fileContents
    );

    if (
      process.env.ZOHO_CLIENT_ID &&
      process.env.ZOHO_CLIENT_SECRET &&
      process.env.ZOHO_REFRESH_TOKEN
    ) {
      try {
        await createZohoDeal(claimData, supplement.supplementTotal);
      } catch (zohoErr) {
        console.error("Zoho deal creation failed (non-fatal):", zohoErr);
      }
    }

    return NextResponse.json(supplement);
  } catch (err) {
    console.error("Claim processing error:", err);
    return NextResponse.json(
      { error: "Failed to process claim. Please try again." },
      { status: 500 }
    );
  }
}
