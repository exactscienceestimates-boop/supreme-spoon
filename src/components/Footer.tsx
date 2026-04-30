import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center font-bold text-navy-950 text-sm">
                ES
              </div>
              <div className="leading-tight">
                <div className="font-bold text-sm text-white tracking-wide">ExactScience</div>
                <div className="text-amber-400 text-xs tracking-widest uppercase">Estimators LLC</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered roofing estimates and insurance supplemental services for South Florida contractors and homeowners.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/estimate" className="hover:text-amber-400 transition-colors">AI Roof Estimator</Link></li>
              <li><Link href="/claims" className="hover:text-amber-400 transition-colors">Insurance Supplement</Link></li>
              <li><Link href="/claims" className="hover:text-amber-400 transition-colors">Claim Documentation</Link></li>
              <li><Link href="/#services" className="hover:text-amber-400 transition-colors">Xactimate Analysis</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:9542607973" className="hover:text-amber-400 transition-colors">
                  (954) 260-7973
                </a>
              </li>
              <li>
                <a href="mailto:exactscienceestimates@gmail.com" className="hover:text-amber-400 transition-colors">
                  exactscienceestimates@gmail.com
                </a>
              </li>
              <li>Fort Lauderdale, FL 33301</li>
              <li>
                <a href="http://www.exactestimate.pro" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                  exactestimate.pro
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} ExactScience Estimators LLC. All rights reserved.
          </p>
          <p className="text-xs">
            Licensed Roofing Estimating &amp; Supplement Services &mdash; Fort Lauderdale, FL
          </p>
        </div>
      </div>
    </footer>
  );
}
