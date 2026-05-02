import { NextRequest, NextResponse } from "next/server";
import { generateRoofEstimate } from "@/lib/claude";
import {
  sanitizeString,
  validateSquareFootage,
  validatePitch,
  validateStories,
} from "@/lib/security";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, squareFootage, pitch, stories } = body;

    if (!address || !squareFootage || !pitch) {
      return NextResponse.json(
        { error: "address, squareFootage, and pitch are required" },
        { status: 400 }
      );
    }

    const safeAddress = sanitizeString(address, 200);
    const safeSqft = validateSquareFootage(parseInt(squareFootage));
    const safePitch = validatePitch(pitch);
    const safeStories = validateStories(parseInt(stories) || 1);

    const result = await generateRoofEstimate(safeAddress, safeSqft, safePitch, safeStories);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate estimate";
    const isUserError = message.includes("must be") || message.includes("Invalid") || message.includes("required");
    return NextResponse.json({ error: message }, { status: isUserError ? 400 : 500 });
  }
}
