import { NextRequest, NextResponse } from "next/server";

// configuration for the CORS middleware
const allowedOrigins = ["https://acme.com", "https://my-app.org"];
const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

// 'request' parameter is used throughout this function
export function proxy(request: NextRequest) {
  // handing CORS
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);
  const isPreflight = request.method === "OPTIONS";

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Check and delete a cookie
  if (request.cookies.has("nextjs")) {
    request.cookies.delete("nextjs");
  }

  // --- Headers Setup ---
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-hello-from-middleware1", "hello");

  // --- Response Setup ---
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set CORS headers for allowed origins
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // --- Security Headers ---
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("Content-Security-Policy", "default-src 'self'");
  response.headers.set("Clear-Site-Data", '"cache","cookies","storage"');
  response.headers.set("Cache-Control", "public, max-age=604800");

  // --- Cookie on Response ---
  response.cookies.set("vercel", "fast");
  response.cookies.set({
    name: "vercel",
    value: "fast",
    path: "/",
  });

  // --- Response Header ---
  response.headers.set("x-hello-from-middleware2", "hello");

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
