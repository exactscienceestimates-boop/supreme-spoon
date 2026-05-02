import { NextRequest, NextResponse } from "next/server";

// In-memory rate limit store — resets per cold start, good enough as a first line of defence
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMITS: Record<string, { requests: number; windowMs: number }> = {
  "/api/estimate":       { requests: 5,  windowMs: 60_000 },   // 5 per minute per IP
  "/api/claims/upload":  { requests: 3,  windowMs: 60_000 },   // 3 per minute per IP
  "/api/zoho/leads":     { requests: 10, windowMs: 60_000 },
  "/api/zoho/deals":     { requests: 10, windowMs: 60_000 },
  "/api/zoho/exchange":  { requests: 5,  windowMs: 60_000 },
  "/api/zoho/status":    { requests: 10, windowMs: 60_000 },
};

// Admin-only paths — require x-admin-secret header or ?secret= query param
const ADMIN_PATHS = [
  "/zoho-setup",
  "/api/zoho/status",
  "/api/zoho/exchange",
];

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(path: string, ip: string): boolean {
  const limit = Object.entries(RATE_LIMITS).find(([p]) => path.startsWith(p));
  if (!limit) return true;

  const [, { requests, windowMs }] = limit;
  const key = `${ip}:${path}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= requests) return false;

  entry.count++;
  return true;
}

function isAdminAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true; // not configured — allow (warn in setup)

  const headerSecret = req.headers.get("x-admin-secret");
  const querySecret = new URL(req.url).searchParams.get("secret");
  const cookieSecret = req.cookies.get("admin_secret")?.value;

  return headerSecret === secret || querySecret === secret || cookieSecret === secret;
}

export function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);

  // Block access to admin paths without secret
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (!isAdminAuthorized(req)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const ip = getIp(req);
    if (!checkRateLimit(pathname, ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        {
          status: 429,
          headers: { "Retry-After": "60" },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/zoho-setup/:path*",
    "/zoho-setup",
  ],
};
