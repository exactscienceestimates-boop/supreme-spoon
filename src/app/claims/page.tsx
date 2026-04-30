"use client";

import { useState } from "react";
import ClaimUploader from "@/components/ClaimUploader";
import { SupplementResult, SupplementItem } from "@/lib/types";

type Step = "form" | "loading" | "results";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function ClaimsPage() {
  const [step, setStep] = useState<Step>("form");
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    adjusterName: "",
    adjusterEmail: "",
    adjusterPhone: "",
    companyName: "",
    insuredName: "",
    claimNumber: "",
    policyNumber: "",
    lossDate: "",
    propertyAddress: "",
    notes: "",
  });
  const [result, setResult] = useState<SupplementResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStep("loading");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/claims/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to process claim");
      }

      const data = await res.json();
      setResult(data);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("form");
    }
  };

  const field = (
    id: keyof typeof form,
    label: string,
    type = "text",
    placeholder = "",
    required = true
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={form[id]}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy-950 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold mb-2">Insurance Claim Portal</h1>
          <p className="text-gray-400">
            Upload your claim documents and get an AI-generated supplemental estimate with Xactimate line items.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Adjuster Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Adjuster / Submitter Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field("adjusterName", "Your Name", "text", "John Smith")}
                {field("adjusterEmail", "Email", "email", "john@insuranceco.com")}
                {field("adjusterPhone", "Phone", "tel", "(954) 000-0000")}
                {field("companyName", "Company / Agency", "text", "State Farm")}
              </div>
            </div>

            {/* Claim Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Claim Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field("insuredName", "Insured Name", "text", "Jane Doe")}
                {field("claimNumber", "Claim Number", "text", "CLM-2024-00001")}
                {field("policyNumber", "Policy Number", "text", "POL-123456")}
                {field("lossDate", "Date of Loss", "date")}
                <div className="sm:col-span-2">
                  {field("propertyAddress", "Property Address", "text", "123 Main St, Fort Lauderdale, FL 33301")}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    placeholder="Any additional context, prior supplement history, or special circumstances..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Claim Documents</h2>
              <p className="text-sm text-gray-500 mb-5">
                Upload the adjuster&apos;s estimate, claim photos, Xactimate reports, or any supporting documents.
              </p>
              <ClaimUploader files={files} onFilesChange={setFiles} />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold py-4 rounded-xl transition-colors text-base"
            >
              Generate Supplemental Estimate
            </button>
            <p className="text-xs text-gray-500 text-center">
              Results typically ready in under 60 seconds. A copy will be sent to your email.
            </p>
          </form>
        )}

        {step === "loading" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Analyzing Your Claim</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Our AI is reviewing the documents against Xactimate pricing and FBC code requirements to identify every supplement opportunity...
            </p>
          </div>
        )}

        {step === "results" && result && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => { setStep("form"); setResult(null); }}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Submit Another Claim
              </button>
            </div>

            <div className="bg-navy-900 text-white rounded-xl p-6">
              <h2 className="text-xl font-bold mb-1">Supplemental Estimate</h2>
              <p className="text-gray-400 text-sm">
                Claim #{result.claimNumber} &mdash; {result.insuredName} &mdash; {result.propertyAddress}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Supplement Line Items</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-5 py-3 text-gray-600 font-medium">Xactimate Code</th>
                      <th className="text-left px-5 py-3 text-gray-600 font-medium">Description</th>
                      <th className="text-right px-5 py-3 text-gray-600 font-medium">Qty</th>
                      <th className="text-right px-5 py-3 text-gray-600 font-medium">Unit</th>
                      <th className="text-right px-5 py-3 text-gray-600 font-medium">Unit Price</th>
                      <th className="text-right px-5 py-3 text-gray-600 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.supplementItems.map((item: SupplementItem, i: number) => (
                      <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-5 py-3 font-mono text-xs text-gray-600">{item.xactimateLine}</td>
                        <td className="px-5 py-3">
                          <div className="font-medium text-gray-800">{item.description}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.justification}</div>
                        </td>
                        <td className="px-5 py-3 text-right">{item.quantity}</td>
                        <td className="px-5 py-3 text-right text-gray-600">{item.unit}</td>
                        <td className="px-5 py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-5 py-3 text-right font-semibold">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-amber-50">
                    <tr className="border-t-2 border-amber-200">
                      <td colSpan={5} className="px-5 py-4 font-bold text-navy-950 text-base">
                        Supplement Total
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-amber-600 text-xl">
                        {formatCurrency(result.supplementTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {result.narrative && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Professional Supplement Narrative</h3>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{result.narrative}</p>
              </div>
            )}

            <div className="bg-navy-50 border border-navy-100 rounded-xl p-5 text-center">
              <p className="text-navy-900 font-semibold mb-1">Need help presenting this supplement?</p>
              <p className="text-gray-600 text-sm mb-3">
                Our team can help negotiate with the carrier directly.
              </p>
              <a
                href="tel:9542607973"
                className="inline-block bg-navy-950 text-white font-bold px-6 py-3 rounded-lg text-sm hover:bg-navy-800 transition-colors"
              >
                Call (954) 260-7973
              </a>
            </div>

            <p className="text-xs text-gray-500 text-center">
              * This supplement was generated by AI for informational purposes. All figures should be verified by a licensed roofing contractor before submission to the carrier.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
