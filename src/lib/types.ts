export interface RoofSystem {
  name: string;
  description: string;
  lineItems: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  warranty: string;
  timeline: string;
  pros: string[];
}

export interface LineItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface EstimateResult {
  address: string;
  estimatedSquares: number;
  pitch: string;
  systems: RoofSystem[];
  generatedAt: string;
}

export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  roofSystem?: string;
  estimateTotal?: number;
  source: "estimate" | "claims" | "contact";
  notes?: string;
}

export interface ClaimData {
  adjusterName: string;
  adjusterEmail: string;
  adjusterPhone: string;
  companyName: string;
  insuredName: string;
  claimNumber: string;
  policyNumber: string;
  lossDate: string;
  propertyAddress: string;
  notes?: string;
}

export interface SupplementItem {
  xactimateLine: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  justification: string;
}

export interface SupplementResult {
  claimNumber: string;
  insuredName: string;
  propertyAddress: string;
  supplementItems: SupplementItem[];
  supplementTotal: number;
  narrative: string;
  generatedAt: string;
}
