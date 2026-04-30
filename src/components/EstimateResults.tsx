"use client";

import { useState } from "react";
import { EstimateResult, RoofSystem } from "@/lib/types";

interface Props {
  result: EstimateResult;
  onRequestConsultation: (system: RoofSystem) => void;
}

export default function EstimateResults({ result, onRequestConsultation }: Props) {
  const [activeSystem, setActiveSystem] = useState(0);

  const system = result.systems[activeSystem];

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <div className="space-y-6">
      <div className="bg-navy-900 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-1">Your Roof Estimate</h2>
        <p className="text-gray-400 text-sm">
          {result.address} &mdash; {result.estimatedSquares} squares &mdash; {result.pitch} pitch
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {result.systems.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveSystem(i)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSystem === i
                ? "bg-amber-500 text-navy-950"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {system && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-navy-800 text-white p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{system.name}</h3>
                <p className="text-gray-300 text-sm mt-1">{system.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-amber-400">
                  {formatCurrency(system.total)}
                </div>
                <div className="text-gray-400 text-xs mt-1">Estimated Total</div>
              </div>
            </div>
            <div className="flex gap-6 mt-4 text-sm">
              <span className="text-gray-300">
                <span className="text-white font-medium">Timeline:</span> {system.timeline}
              </span>
              <span className="text-gray-300">
                <span className="text-white font-medium">Warranty:</span> {system.warranty}
              </span>
            </div>
          </div>

          <div className="p-5">
            <h4 className="font-semibold text-gray-900 mb-3">Line Items</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-600 font-medium">Description</th>
                    <th className="text-right py-2 text-gray-600 font-medium w-16">Qty</th>
                    <th className="text-right py-2 text-gray-600 font-medium w-16">Unit</th>
                    <th className="text-right py-2 text-gray-600 font-medium w-24">Unit Price</th>
                    <th className="text-right py-2 text-gray-600 font-medium w-24">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {system.lineItems.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 text-gray-700">{item.description}</td>
                      <td className="py-2 text-right text-gray-600">{item.quantity}</td>
                      <td className="py-2 text-right text-gray-600">{item.unit}</td>
                      <td className="py-2 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-2 text-right font-medium text-gray-800">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-300">
                    <td colSpan={4} className="py-2 text-right font-medium text-gray-700">Subtotal</td>
                    <td className="py-2 text-right font-medium">{formatCurrency(system.subtotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="py-2 text-right text-gray-600">Tax (7%)</td>
                    <td className="py-2 text-right text-gray-600">{formatCurrency(system.tax)}</td>
                  </tr>
                  <tr className="border-t-2 border-navy-900">
                    <td colSpan={4} className="py-3 text-right font-bold text-navy-900 text-base">Total</td>
                    <td className="py-3 text-right font-bold text-navy-900 text-base">{formatCurrency(system.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {system.pros && system.pros.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {system.pros.map((pro, i) => (
                  <span key={i} className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200">
                    {pro}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => onRequestConsultation(system)}
              className="mt-5 w-full bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold py-3 rounded-lg transition-colors"
            >
              Schedule Free Consultation &mdash; {system.name}
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        * Estimates are approximate and subject to on-site inspection. Final pricing may vary based on actual conditions, local permit fees, and material availability. Valid for 30 days.
      </p>
    </div>
  );
}
