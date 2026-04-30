import Link from "next/link";

const services = [
  {
    icon: "🏠",
    title: "AI Roof Estimator",
    description:
      "Enter your address and get an instant, itemized estimate for 5 roof systems — architectural shingle, metal, tile, and more. No obligation.",
    cta: "Get My Estimate",
    href: "/estimate",
  },
  {
    icon: "📋",
    title: "Insurance Supplement",
    description:
      "Upload your claim documents and our AI analyzes them against Xactimate pricing to identify every missed or undervalued line item.",
    cta: "Submit a Claim",
    href: "/claims",
  },
  {
    icon: "📊",
    title: "Xactimate Analysis",
    description:
      "We review adjuster estimates line by line against current South Florida market pricing and FBC code requirements.",
    cta: "Learn More",
    href: "/claims",
  },
];

const stats = [
  { value: "$2.4M+", label: "Supplements Recovered" },
  { value: "98%", label: "Approval Rate" },
  { value: "48hr", label: "Turnaround Time" },
  { value: "500+", label: "Claims Processed" },
];

const roofSystems = [
  { name: "Architectural Shingle", range: "$12,000 – $22,000", icon: "🏘️" },
  { name: "3-Tab Shingle", range: "$9,000 – $16,000", icon: "🏚️" },
  { name: "Metal Standing Seam", range: "$22,000 – $45,000", icon: "🏗️" },
  { name: "Clay / Concrete Tile", range: "$20,000 – $40,000", icon: "🏛️" },
  { name: "TPO / Flat Roof", range: "$8,000 – $18,000", icon: "🏢" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-amber-400 text-sm font-medium">AI-Powered Roofing Estimates</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
              Roof Estimates &amp;{" "}
              <span className="text-amber-400">Insurance Supplements</span>{" "}
              Powered by AI
            </h1>
            <p className="text-gray-300 text-lg lg:text-xl leading-relaxed mb-8 max-w-2xl">
              ExactScience Estimators combines cutting-edge AI with 20+ years of South Florida roofing expertise. Homeowners get instant multi-system quotes. Contractors get automated supplemental estimates that maximize every claim.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/estimate"
                className="bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold text-base px-8 py-4 rounded-xl transition-colors text-center"
              >
                Get Free Roof Estimate
              </Link>
              <Link
                href="/claims"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base px-8 py-4 rounded-xl transition-colors text-center"
              >
                Submit Insurance Claim
              </Link>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              Fort Lauderdale, FL &middot; (954) 260-7973 &middot; brent@exactestimate.pro
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-navy-950">{stat.value}</div>
                <div className="text-navy-800 text-sm font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-navy-950 mb-4">
              Two Portals. One Platform.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you&apos;re a homeowner needing a new roof or a contractor fighting for a fair insurance settlement, we have AI-powered tools built for you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-navy-950 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{service.description}</p>
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 text-amber-600 font-semibold text-sm hover:text-amber-700 transition-colors"
                >
                  {service.cta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roof Systems Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-navy-950 mb-4">
                Instant Estimates for 5 Roof Systems
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our AI generates detailed, line-item estimates for every major roofing system — all calibrated to current South Florida market pricing and Florida Building Code requirements.
              </p>
              <div className="space-y-3">
                {roofSystems.map((rs) => (
                  <div
                    key={rs.name}
                    className="flex items-center justify-between bg-gray-50 rounded-xl px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{rs.icon}</span>
                      <span className="font-medium text-gray-900">{rs.name}</span>
                    </div>
                    <span className="text-amber-600 font-semibold text-sm">{rs.range}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/estimate"
                className="mt-8 inline-block bg-navy-950 hover:bg-navy-800 text-white font-bold px-8 py-4 rounded-xl transition-colors"
              >
                Get My Exact Quote
              </Link>
            </div>
            <div className="bg-navy-950 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-2">For Insurance Professionals</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Upload claim documents and get a professional supplemental estimate with Xactimate line items, justifications, and a carrier-ready narrative — in minutes.
              </p>
              <ul className="space-y-3 text-sm mb-8">
                {[
                  "Identifies all FBC code upgrade requirements",
                  "Flags undervalued Xactimate line items",
                  "Generates professional supplement narrative",
                  "Includes Haag Engineering references",
                  "Pushes directly to your Zoho CRM pipeline",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-amber-400 mt-0.5">✓</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/claims"
                className="block text-center bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Submit Your First Claim
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join hundreds of South Florida homeowners and contractors who trust ExactScience Estimators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/estimate"
              className="bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold px-8 py-4 rounded-xl transition-colors"
            >
              Homeowner — Get Estimate
            </Link>
            <Link
              href="/claims"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
            >
              Contractor — Submit Claim
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            Questions? Call us at{" "}
            <a href="tel:9542607973" className="text-amber-400 hover:underline">
              (954) 260-7973
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
