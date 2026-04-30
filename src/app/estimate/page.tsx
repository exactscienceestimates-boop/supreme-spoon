"use client";

import { useState } from "react";
import EstimateResults from "@/components/EstimateResults";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { EstimateResult, RoofSystem } from "@/lib/types";

type Step = "form" | "loading" | "results";
type Pitch = "low" | "medium" | "steep";

export default function EstimatePage() {
  const [step, setStep] = useState<Step>("form");
  const [address, setAddress] = useState("");
  const [sqft, setSqft] = useState("");
  const [pitch, setPitch] = useState<Pitch>("medium");
  const [stories, setStories] = useState("1");
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<{ open: boolean; system?: RoofSystem }>({ open: false });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStep("loading");

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          squareFootage: parseInt(sqft),
          pitch,
          stories: parseInt(stories),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate estimate");
      }

      const data = await res.json();
      setResult(data);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("form");
    }
  };

  const handleLeadSubmit = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) => {
    await fetch("/api/zoho/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        address,
        roofSystem: modal.system?.name,
        estimateTotal: modal.system?.total,
        source: "estimate",
        notes: `Roof system selected: ${modal.system?.name}. Estimate: $${modal.system?.total?.toLocaleString()}`,
      }),
    });
    setLeadSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy-950 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold mb-2">AI Roof Estimator</h1>
          <p className="text-gray-400">
            Get an instant, itemized estimate for 5 roof systems — calibrated to South Florida pricing.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {step === "form" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Property Details</h2>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Address *
                </label>
                <input
                  required
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, Fort Lauderdale, FL 33301"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approximate Roof Size (sq ft) *
                  </label>
                  <input
                    required
                    type="number"
                    min="500"
                    max="20000"
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value)}
                    placeholder="e.g. 2000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Not sure? Use your home&apos;s living area as an approximation.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Stories *
                  </label>
                  <select
                    value={stories}
                    onChange={(e) => setStories(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="1">1 Story</option>
                    <option value="2">2 Stories</option>
                    <option value="3">3+ Stories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Roof Pitch
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["low", "medium", "steep"] as Pitch[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPitch(p)}
                      className={`py-3 px-4 rounded-lg border-2 text-sm font-medium capitalize transition-colors ${
                        pitch === p
                          ? "border-amber-500 bg-amber-50 text-amber-700"
                          : "border-gray-200 text-gray-600 hover:border-amber-300"
                      }`}
                    >
                      {p}
                      <div className="text-xs font-normal mt-0.5 text-gray-500">
                        {p === "low" && "Flat to 3/12"}
                        {p === "medium" && "4/12 to 6/12"}
                        {p === "steep" && "7/12 and up"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold py-4 rounded-xl transition-colors text-base"
              >
                Generate AI Estimate — All 5 Systems
              </button>

              <p className="text-xs text-gray-500 text-center">
                Free. No credit card required. Results in under 30 seconds.
              </p>
            </form>
          </div>
        )}

        {step === "loading" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Generating Your Estimate</h2>
            <p className="text-gray-500 text-sm">
              Our AI is calculating detailed line items for all 5 roof systems using current South Florida pricing...
            </p>
          </div>
        )}

        {step === "results" && result && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setStep("form")}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                New Estimate
              </button>
            </div>
            <EstimateResults
              result={result}
              onRequestConsultation={(system) => setModal({ open: true, system })}
            />
          </>
        )}
      </div>

      {modal.open && !leadSubmitted && (
        <LeadCaptureModal
          system={modal.system}
          address={address}
          onClose={() => setModal({ open: false })}
          onSubmit={handleLeadSubmit}
        />
      )}
    </div>
  );
}
