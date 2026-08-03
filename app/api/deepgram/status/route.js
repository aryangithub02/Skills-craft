import { NextResponse } from "next/server";

/**
 * GET /api/deepgram/status
 *
 * Checks whether the Deepgram WebSocket proxy server is running.
 * This helps the frontend decide whether to use Deepgram or fallback.
 */
export async function GET() {
  const wsUrl = process.env.NEXT_PUBLIC_DEEPGRAM_WS_URL || "ws://localhost:3002";
  const apiKeyConfigured = !!process.env.DEEPGRAM_API_KEY;

  // Try to fetch the HTTP health endpoint of the WS proxy
  let proxyStatus = "unreachable";
  let proxyInfo = null;

  try {
    const healthUrl = wsUrl
      .replace(/^ws:/, "http:")
      .replace(/^wss:/, "https:")
      + "/health";

    const res = await fetch(healthUrl, {
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      proxyInfo = await res.json();
      proxyStatus = proxyInfo.deepgramConfigured ? "ready" : "no_key";
    }
  } catch {
    proxyStatus = "unreachable";
  }

  return NextResponse.json({
    status: proxyStatus === "ready" ? "ok" : "degraded",
    proxy: {
      url: wsUrl,
      status: proxyStatus,
      ...(proxyInfo || {}),
    },
    apiKeyConfigured,
    fallback: {
      // The existing /api/transcribe endpoint as fallback
      endpoint: "/api/transcribe",
      type: "Faster-Whisper + cloud fallback",
    },
  });
}
