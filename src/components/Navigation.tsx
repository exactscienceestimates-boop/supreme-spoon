"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-navy-950 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center font-bold text-navy-950 text-sm">
              ES
            </div>
            <div className="leading-tight">
              <div className="font-bold text-sm tracking-wide">ExactScience</div>
              <div className="text-amber-400 text-xs tracking-widest uppercase">Estimators</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/estimate" className="text-sm text-gray-300 hover:text-white transition-colors">
              Roof Estimator
            </Link>
            <Link href="/claims" className="text-sm text-gray-300 hover:text-white transition-colors">
              Submit Claim
            </Link>
            <Link href="/tutorial" className="text-sm text-gray-300 hover:text-white transition-colors">
              VS Code Tutorial
            </Link>
            <a href="tel:9542607973" className="text-sm text-gray-300 hover:text-white transition-colors">
              (954) 260-7973
            </a>
            <Link
              href="/estimate"
              className="bg-amber-500 hover:bg-amber-600 text-navy-950 font-semibold text-sm px-4 py-2 rounded transition-colors"
            >
              Free Estimate
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-navy-900 px-4 pb-4 space-y-3">
          <Link href="/" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/estimate" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>
            Roof Estimator
          </Link>
          <Link href="/claims" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>
            Submit Claim
          </Link>
          <Link href="/tutorial" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>
            VS Code Tutorial
          </Link>
          <a href="tel:9542607973" className="block text-sm text-gray-300 hover:text-white py-2">
            (954) 260-7973
          </a>
          <Link
            href="/estimate"
            className="block bg-amber-500 text-navy-950 font-semibold text-sm px-4 py-2 rounded text-center"
            onClick={() => setMenuOpen(false)}
          >
            Free Estimate
          </Link>
        </div>
      )}
    </nav>
  );
}
