"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface StatusData {
  connected: boolean;
  configured: { clientId: boolean; clientSecret: boolean; refreshToken: boolean };
  org?: { name: string; email: string; plan: string };
  error?: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-2 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="flex items-center justify-between bg-gray-900 text-green-400 rounded-lg px-4 py-3 font-mono text-sm">
      <span className="break-all">{children}</span>
      <CopyButton text={children} />
    </div>
  );
}

function ZohoSetupContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [grantToken, setGrantToken] = useState("");
  const [exchangeResult, setExchangeResult] = useState<{ refresh_token?: string; error?: string } | null>(null);
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"server" | "selfclient">("selfclient");

  const refreshToken = searchParams.get("refresh_token");
  const callbackError = searchParams.get("error");

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/zoho/status");
      setStatus(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const handleExchange = async () => {
    setExchangeLoading(true);
    setExchangeResult(null);
    try {
      const res = await fetch("/api/zoho/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grantToken }),
      });
      setExchangeResult(await res.json());
    } finally {
      setExchangeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy-950 text-white py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl font-extrabold mb-1">Zoho CRM OAuth Setup</h1>
          <p className="text-gray-400 text-sm">Connect ExactScience Estimators to your Zoho CRM account</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Connection Status */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Connection Status</h2>
          {loading ? (
            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              Checking connection...
            </div>
          ) : status?.connected ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-700">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                <span className="font-semibold">Connected to Zoho CRM</span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                <p><strong>Organization:</strong> {status.org?.name}</p>
                <p><strong>Email:</strong> {status.org?.email}</p>
                <p><strong>Plan:</strong> {status.org?.plan}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-600">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                <span className="font-semibold">Not connected</span>
                {status?.error && <span className="text-xs text-gray-500">— {status.error}</span>}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(status?.configured || {}).map(([key, val]) => (
                  <div key={key} className={`rounded-lg px-3 py-2 text-xs font-medium border ${val ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                    {val ? "✓" : "✗"} {key === "clientId" ? "Client ID" : key === "clientSecret" ? "Client Secret" : "Refresh Token"}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Callback result */}
        {refreshToken && (
          <div className="bg-green-50 border border-green-300 rounded-2xl p-6">
            <h3 className="font-bold text-green-800 mb-3">OAuth Success — Copy Your Refresh Token</h3>
            <p className="text-sm text-green-700 mb-3">
              Add this to your <code className="bg-green-100 px-1 rounded">.env.local</code> file:
            </p>
            <CodeBlock>{`ZOHO_REFRESH_TOKEN=${refreshToken}`}</CodeBlock>
            <p className="text-xs text-green-600 mt-3">After saving, restart <code>npm run dev</code> and refresh this page to verify the connection.</p>
          </div>
        )}

        {callbackError && !refreshToken && (
          <div className="bg-red-50 border border-red-300 rounded-2xl p-6">
            <h3 className="font-bold text-red-800 mb-2">OAuth Error</h3>
            <p className="text-sm text-red-700">Error code: <code>{callbackError}</code>. Please try again.</p>
          </div>
        )}

        {/* Step 1 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 bg-navy-950 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <h2 className="font-bold text-gray-900">Create a Zoho API Client</h2>
          </div>
          <ol className="space-y-2 text-sm text-gray-700 list-none pl-0">
            <li className="flex gap-2"><span className="text-amber-500 font-bold">a.</span>Go to <strong>api-console.zoho.com</strong> and log in with <strong>exactscienceestimates@gmail.com</strong></li>
            <li className="flex gap-2"><span className="text-amber-500 font-bold">b.</span>Click <strong>&quot;Add Client&quot;</strong></li>
            <li className="flex gap-2"><span className="text-amber-500 font-bold">c.</span>Choose your setup method below:</li>
          </ol>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab("selfclient")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "selfclient" ? "bg-amber-500 text-navy-950" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              Self Client (Recommended)
            </button>
            <button
              onClick={() => setActiveTab("server")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "server" ? "bg-amber-500 text-navy-950" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              Server-based App
            </button>
          </div>

          {activeTab === "selfclient" && (
            <div className="mt-4 space-y-2 text-sm text-gray-700 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="font-semibold text-amber-800">Self Client — No redirect URI needed, tokens generated directly</p>
              <ol className="space-y-1.5 list-decimal list-inside">
                <li>Select <strong>&quot;Self Client&quot;</strong> and click Create</li>
                <li>Copy the <strong>Client ID</strong> and <strong>Client Secret</strong> shown</li>
                <li>Go to the <strong>&quot;Generate Code&quot;</strong> tab</li>
                <li>Paste these scopes: <code className="bg-white px-1 rounded border text-xs">ZohoCRM.modules.ALL,ZohoCRM.settings.READ,ZohoCRM.org.READ</code></li>
                <li>Set scope duration to <strong>10 minutes</strong></li>
                <li>Click <strong>&quot;Create&quot;</strong> — copy the grant token immediately</li>
                <li>Paste Client ID + Secret in <code>.env.local</code>, then use Step 2 below</li>
              </ol>
            </div>
          )}

          {activeTab === "server" && (
            <div className="mt-4 space-y-2 text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="font-semibold text-blue-800">Server-based Application — Full OAuth redirect flow</p>
              <ol className="space-y-1.5 list-decimal list-inside">
                <li>Select <strong>&quot;Server-based Applications&quot;</strong> and click Create</li>
                <li>Homepage URL: <code className="bg-white px-1 rounded border text-xs">http://localhost:3000</code></li>
                <li>Authorized Redirect URIs: <CodeBlock>http://localhost:3000/api/zoho/callback</CodeBlock></li>
                <li>Copy <strong>Client ID</strong> and <strong>Client Secret</strong> to <code>.env.local</code></li>
                <li>Also add: <CodeBlock>ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho/callback</CodeBlock></li>
                <li>Restart the dev server, then click Connect below</li>
              </ol>
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 bg-navy-950 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <h2 className="font-bold text-gray-900">Add Credentials to .env.local</h2>
          </div>
          <p className="text-sm text-gray-600 mb-3">Open <code className="bg-gray-100 px-1.5 py-0.5 rounded">/home/user/supreme-spoon/.env.local</code> and fill in:</p>
          <CodeBlock>ZOHO_CLIENT_ID=your_client_id_here</CodeBlock>
          <div className="mt-2">
            <CodeBlock>ZOHO_CLIENT_SECRET=your_client_secret_here</CodeBlock>
          </div>
          <p className="text-xs text-gray-500 mt-3">Restart <code>npm run dev</code> after saving.</p>
        </div>

        {/* Step 3 — Self Client exchange */}
        {activeTab === "selfclient" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 bg-navy-950 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <h2 className="font-bold text-gray-900">Exchange Grant Token → Refresh Token</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              After adding your Client ID and Secret to <code>.env.local</code> and restarting the dev server, paste your grant token below:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={grantToken}
                onChange={(e) => setGrantToken(e.target.value)}
                placeholder="1000.xxxxxxxxxxxxxxxx..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={handleExchange}
                disabled={!grantToken || exchangeLoading}
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 text-navy-950 font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                {exchangeLoading ? "Exchanging..." : "Get Refresh Token"}
              </button>
            </div>

            {exchangeResult?.refresh_token && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-green-800 mb-2">Success! Add this to .env.local:</p>
                <CodeBlock>{`ZOHO_REFRESH_TOKEN=${exchangeResult.refresh_token}`}</CodeBlock>
                <p className="text-xs text-green-600 mt-2">Restart the dev server and refresh this page to verify the connection.</p>
              </div>
            )}

            {exchangeResult?.error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                <strong>Error:</strong> {exchangeResult.error}
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Server-based connect button */}
        {activeTab === "server" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 bg-navy-950 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <h2 className="font-bold text-gray-900">Authorize with Zoho</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Click below to authorize. You&apos;ll be redirected to Zoho&apos;s login, then returned here with your refresh token automatically.
            </p>
            <a
              href="/api/zoho/auth"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Connect to Zoho CRM
            </a>
          </div>
        )}

        <button
          onClick={fetchStatus}
          className="w-full bg-navy-950 hover:bg-navy-800 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          Refresh Connection Status
        </button>
      </div>
    </div>
  );
}

export default function ZohoSetupPage() {
  return (
    <Suspense>
      <ZohoSetupContent />
    </Suspense>
  );
}
