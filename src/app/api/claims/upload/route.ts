import { NextRequest, NextResponse } from "next/server";
import { generateSupplementEstimate } from "@/lib/claude";
import { createZohoDeal } from "@/lib/zoho";
import {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  validateFile,
  MAX_FILES,
} from "@/lib/security";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const claimData = {
      adjusterName:    sanitizeString(formData.get("adjusterName") as string || "", 100),
      adjusterEmail:   sanitizeEmail(formData.get("adjusterEmail") as string || ""),
      adjusterPhone:   sanitizePhone(formData.get("adjusterPhone") as string || ""),
      companyName:     sanitizeString(formData.get("companyName") as string || "", 100),
      insuredName:     sanitizeString(formData.get("insuredName") as string || "", 100),
      claimNumber:     sanitizeString(formData.get("claimNumber") as string || "", 50),
      policyNumber:    sanitizeString(formData.get("policyNumber") as string || "", 50),
      lossDate:        sanitizeString(formData.get("lossDate") as string || "", 20),
      propertyAddress: sanitizeString(formData.get("propertyAddress") as string || "", 200),
      notes:           sanitizeString(formData.get("notes") as string || "", 1000),
    };

    if (!claimData.insuredName || !claimData.claimNumber || !claimData.propertyAddress) {
      return NextResponse.json(
        { error: "insuredName, claimNumber, and propertyAddress are required" },
        { status: 400 }
      );
    }

    const files = formData.getAll("files") as File[];
    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} files allowed` }, { status: 400 });
    }

    // Validate every file server-side
    for (const file of files) {
      validateFile(file);
    }

    let fileContents = "";
    for (const file of files) {
      if (file.type === "text/plain") {
        const text = await file.text();
        fileContents += `\n\n--- File: ${file.name} ---\n${sanitizeString(text, 5000)}`;
      } else {
        fileContents += `\n\n--- File: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(1)}KB) ---\n[Binary file]`;
      }
    }

    const supplement = await generateSupplementEstimate(
      {
        insuredName:     claimData.insuredName,
        claimNumber:     claimData.claimNumber,
        propertyAddress: claimData.propertyAddress,
        lossDate:        claimData.lossDate,
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
    const message = err instanceof Error ? err.message : "Failed to process claim";
    const isUserError = message.includes("Invalid") || message.includes("not allowed") || message.includes("required") || message.includes("Maximum");
    return NextResponse.json({ error: message }, { status: isUserError ? 400 : 500 });
  }
}
