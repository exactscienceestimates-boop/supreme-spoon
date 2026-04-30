import { NextRequest, NextResponse } from "next/server";
import { generateRoofEstimate } from "@/lib/claude";

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

    const result = await generateRoofEstimate(
      address,
      parseInt(squareFootage),
      pitch,
      parseInt(stories) || 1
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("Estimate generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate estimate. Please try again." },
      { status: 500 }
    );
  }
}
