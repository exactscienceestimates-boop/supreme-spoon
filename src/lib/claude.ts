import Anthropic from "@anthropic-ai/sdk";
import { EstimateResult, SupplementResult } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-4-6";

export async function generateRoofEstimate(
  address: string,
  squareFootage: number,
  pitch: string,
  stories: number
): Promise<EstimateResult> {
  const squares = Math.ceil(squareFootage / 100);
  const wasteFactor = pitch === "steep" ? 1.15 : 1.1;
  const adjustedSquares = Math.ceil(squares * wasteFactor);

  const prompt = `You are an expert roofing estimator in Fort Lauderdale, Florida with 20+ years of experience. Generate a detailed, realistic roofing estimate for the following property.

Property Details:
- Address: ${address}
- Roof Size: ${adjustedSquares} squares (${squareFootage} sq ft + waste factor)
- Pitch: ${pitch}
- Stories: ${stories}
- Location: South Florida (hurricane zone, must meet FBC requirements)

Generate estimates for ALL FIVE of these roof systems. Use current South Florida market pricing (2024-2025). Return ONLY valid JSON in this exact format:

{
  "address": "${address}",
  "estimatedSquares": ${adjustedSquares},
  "pitch": "${pitch}",
  "systems": [
    {
      "name": "Architectural Shingle",
      "description": "Premium laminated asphalt shingles with enhanced wind resistance",
      "lineItems": [
        {"description": "Tear off existing roof system", "quantity": ${adjustedSquares}, "unit": "SQ", "unitPrice": 85, "total": ${adjustedSquares * 85}},
        {"description": "Dispose of debris", "quantity": ${adjustedSquares}, "unit": "SQ", "unitPrice": 35, "total": ${adjustedSquares * 35}},
        {"description": "Install synthetic underlayment (2 layers)", "quantity": ${adjustedSquares}, "unit": "SQ", "unitPrice": 45, "total": ${adjustedSquares * 45}},
        {"description": "Install drip edge - eaves", "quantity": 0, "unit": "LF", "unitPrice": 3.50, "total": 0},
        {"description": "Install drip edge - rakes", "quantity": 0, "unit": "LF", "unitPrice": 3.50, "total": 0},
        {"description": "Architectural shingles (130 MPH rated)", "quantity": ${adjustedSquares}, "unit": "SQ", "unitPrice": 210, "total": ${adjustedSquares * 210}},
        {"description": "Ridge cap shingles", "quantity": 0, "unit": "LF", "unitPrice": 8, "total": 0},
        {"description": "Pipe boots / penetration flashings", "quantity": 0, "unit": "EA", "unitPrice": 75, "total": 0},
        {"description": "Permit and inspection fee", "quantity": 1, "unit": "LS", "unitPrice": 350, "total": 350}
      ],
      "subtotal": 0,
      "tax": 0,
      "total": 0,
      "warranty": "25-year manufacturer warranty, 5-year workmanship warranty",
      "timeline": "1-2 days",
      "pros": ["Most cost-effective", "Wide color selection", "Fast installation", "FBC compliant"]
    }
  ],
  "generatedAt": "${new Date().toISOString()}"
}

Fill in ALL quantities and totals accurately based on the ${adjustedSquares} squares. Include realistic line items for all 5 systems: Architectural Shingle, 3-Tab Shingle, Metal Standing Seam, Clay/Concrete Tile, and TPO/Flat. Use actual South Florida contractor pricing. Calculate subtotals accurately, add 7% sales tax on materials only, compute final totals. Return only the JSON object, no markdown.`;

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system:
      "You are a professional roofing estimator. Always respond with valid JSON only. No markdown, no explanations — just the JSON object.",
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const text = content.text.trim();
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  const json = text.slice(jsonStart, jsonEnd + 1);

  return JSON.parse(json) as EstimateResult;
}

export async function generateSupplementEstimate(
  claimData: {
    insuredName: string;
    claimNumber: string;
    propertyAddress: string;
    lossDate: string;
  },
  fileContents: string
): Promise<SupplementResult> {
  const prompt = `You are a roofing insurance supplement specialist with expert knowledge of Xactimate pricing and insurance claim procedures in South Florida.

Analyze the following claim information and generate a professional supplemental estimate with missed or undervalued line items.

Claim Details:
- Insured: ${claimData.insuredName}
- Claim #: ${claimData.claimNumber}
- Property: ${claimData.propertyAddress}
- Loss Date: ${claimData.lossDate}

Uploaded Claim Content:
${fileContents || "No document content provided — generate a standard South Florida roofing supplement based on typical adjuster oversights."}

Generate a supplement that identifies commonly missed items in South Florida roofing claims. Return ONLY valid JSON in this format:

{
  "claimNumber": "${claimData.claimNumber}",
  "insuredName": "${claimData.insuredName}",
  "propertyAddress": "${claimData.propertyAddress}",
  "supplementItems": [
    {
      "xactimateLine": "RFG SHNG",
      "description": "Roofing - shingles - architectural",
      "quantity": 0,
      "unit": "SQ",
      "unitPrice": 0,
      "total": 0,
      "justification": "Adjuster undervalued at Xactimate default — local market pricing applies per Haag Engineering standards"
    }
  ],
  "supplementTotal": 0,
  "narrative": "Professional supplement narrative explaining why these items were missed or undervalued, referencing industry standards (Haag Engineering, IBHS, FRSA guidelines).",
  "generatedAt": "${new Date().toISOString()}"
}

Include 10-15 commonly missed supplement items such as: code upgrades (FBC), secondary water barrier, drip edge LF, ridge cap LF, starter strip, pipe boots, step flashing, valley flashing, permit fees, dumpster/haul, mobilization, additional layer tear-off, decking replacement, OSHA safety equipment, and O&P. Use current Xactimate South Florida pricing. Return only JSON.`;

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 6000,
    system:
      "You are a roofing supplement specialist. Always respond with valid JSON only. No markdown, no explanations.",
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const text = content.text.trim();
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  const json = text.slice(jsonStart, jsonEnd + 1);

  return JSON.parse(json) as SupplementResult;
}
