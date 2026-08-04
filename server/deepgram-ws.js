/**
 * Deepgram WebSocket Proxy Server
 * ==================================
 *
 * A lightweight Node.js WebSocket server that:
 *  1. Accepts WebSocket connections from the browser client
 *  2. Creates a Deepgram Live Transcription connection using @deepgram/sdk
 *  3. Forwards audio chunks from client → Deepgram
 *  4. Forwards transcription results from Deepgram → client
 *
 * This keeps the DEEPGRAM_API_KEY server-side only.
 *
 * Usage:
 *   node server/deepgram-ws.js
 *
 * Environment variables:
 *   DEEPGRAM_API_KEY   – Required. Your Deepgram API key.
 *   DEEPGRAM_WS_PORT   – Port to listen on (default: 3002)
 *   DEEPGRAM_MODEL     – Model name (default: nova-2)
 *   DEEPGRAM_LANGUAGE  – Language (default: en)
 *   NODE_ENV           – Set to "production" for prod (default: "development")
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });

const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");
const { WebSocketServer } = require("ws");
const http = require("http");
const url = require("url");

// ─── Configuration ─────────────────────────────────────────────────────────
const PORT = parseInt(process.env.DEEPGRAM_WS_PORT || "3002", 10);
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const MODEL = process.env.DEEPGRAM_MODEL || "nova-2";
const LANGUAGE = process.env.DEEPGRAM_LANGUAGE || "en";
const isDev = (process.env.NODE_ENV || "development") !== "production";

// ─── Validation ────────────────────────────────────────────────────────────
if (!DEEPGRAM_API_KEY && !isDev) {
  console.error("❌ DEEPGRAM_API_KEY environment variable is required in production.");
  process.exit(1);
}

if (!DEEPGRAM_API_KEY) {
  console.warn(
    "⚠️  DEEPGRAM_API_KEY not set. The server will start but reject connections.\n" +
    "   Set the DEEPGRAM_API_KEY environment variable to enable transcription."
  );
}

// ─── HTTP server (for health checks & upgrade) ─────────────────────────────
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  if (parsed.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "ok",
      deepgramConfigured: !!DEEPGRAM_API_KEY,
      model: MODEL,
      language: LANGUAGE,
      uptime: process.uptime(),
    }));
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

// ─── WebSocket Server ──────────────────────────────────────────────────────
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  const connectionId = Math.random().toString(36).slice(2, 8);
  console.log(`[${connectionId}] 🔌 Client connected from ${clientIp}`);

  let deepgram = null;
  let deepgramKeepAlive = null;
  let isActive = true;

  // ── Helper: send JSON to client ───────────────────────────────────────
  const send = (type, data) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type, ...data }));
    }
  };

  // ── Connect to Deepgram ───────────────────────────────────────────────
  const connectToDeepgram = () => {
    if (!DEEPGRAM_API_KEY) {
      send("error", { message: "Deepgram API key not configured on server." });
      return;
    }

    try {
      const deepgramClient = createClient(DEEPGRAM_API_KEY);

      deepgram = deepgramClient.listen.live({
        model: MODEL,
        language: LANGUAGE,
        punctuate: true,
        smart_format: true,
        interim_results: true,
        utterance_end_ms: 1000,
        vad_events: true,
        endpointing: 300,
        encoding: "opus",
        sample_rate: 16000,
        channels: 1,
      });

      // ── Deepgram events ──────────────────────────────────────────────
      deepgram.on(LiveTranscriptionEvents.Open, () => {
        console.log(`[${connectionId}] ✅ Deepgram connection opened`);
        send("connected", { model: MODEL, language: LANGUAGE });

        // Keep alive — send keepalive every 5s
        deepgramKeepAlive = setInterval(() => {
          if (deepgram && deepgram.getReadyState() === 1) {
            deepgram.keepAlive();
          }
        }, 5000);
      });

      deepgram.on(LiveTranscriptionEvents.Transcript, (data) => {
        const alt = data?.channel?.alternatives?.[0];
        if (!alt) return;

        const transcript = alt.transcript || "";
        const isFinal = data?.is_final ?? false;
        const confidence = alt.confidence ?? 0;

        if (transcript) {
          send("transcript", {
            text: transcript,
            isFinal,
            confidence,
            words: alt.words || [],
          });

          if (isFinal) {
            console.log(`[${connectionId}] ✅ Final: "${transcript.slice(0, 80)}" (${(confidence * 100).toFixed(0)}%)`);
          }
        }
      });

      deepgram.on(LiveTranscriptionEvents.UtteranceEnd, (data) => {
        send("utteranceEnd", {
          lastWordEnd: data?.last_word_end || 0,
        });
      });

      deepgram.on(LiveTranscriptionEvents.Metadata, (data) => {
        console.log(`[${connectionId}] 📊 Metadata:`, data);
      });

      deepgram.on(LiveTranscriptionEvents.Error, (err) => {
        console.error(`[${connectionId}] ❌ Deepgram error:`, err.message || err);
        send("error", { message: `Deepgram error: ${err.message || "Unknown"}` });
      });

      deepgram.on(LiveTranscriptionEvents.Close, () => {
        console.log(`[${connectionId}] 🔒 Deepgram connection closed`);
        clearInterval(deepgramKeepAlive);
        deepgramKeepAlive = null;
        deepgram = null;

        if (isActive) {
          send("disconnected", { reason: "deepgram_closed" });
        }
      });

      deepgram.on(LiveTranscriptionEvents.Warning, (warn) => {
        console.warn(`[${connectionId}] ⚠️ Deepgram warning:`, warn);
      });
    } catch (err) {
      console.error(`[${connectionId}] ❌ Failed to create Deepgram connection:`, err.message);
      send("error", { message: `Failed to connect to Deepgram: ${err.message}` });
    }
  };

  // ── Handle client messages ────────────────────────────────────────────
  ws.on("message", (raw) => {
    try {
      // Try parsing as JSON (control messages)
      const parsed = JSON.parse(raw.toString());
      const { action } = parsed;

      if (action === "start") {
        connectToDeepgram();
        return;
      }

      if (action === "stop") {
        if (deepgram) {
          deepgram.finish();
        }
        return;
      }

      if (action === "setLanguage") {
        send("info", { message: "Language must be set via environment variable DEEPGRAM_LANGUAGE" });
        return;
      }
    } catch {
      // Not JSON — must be binary audio data. Forward to Deepgram.
      if (deepgram && deepgram.getReadyState() === 1) {
        deepgram.send(raw);
      }
    }
  });

  // ── Handle client disconnect ──────────────────────────────────────────
  ws.on("close", () => {
    console.log(`[${connectionId}] 🔌 Client disconnected`);
    isActive = false;
    clearInterval(deepgramKeepAlive);
    deepgramKeepAlive = null;

    if (deepgram) {
      try { deepgram.finish(); } catch (_) {}
      deepgram = null;
    }
  });

  ws.on("error", (err) => {
    console.error(`[${connectionId}] ❌ WebSocket error:`, err.message);
    isActive = false;
    clearInterval(deepgramKeepAlive);
    if (deepgram) {
      try { deepgram.finish(); } catch (_) {}
      deepgram = null;
    }
  });

  // Send initial connection acknowledged
  send("acknowledged", { serverVersion: "1.0.0" });
});

// ─── Start server ──────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║        Deepgram WebSocket Proxy Server          ║
╠══════════════════════════════════════════════════╣
║  Status  : ${DEEPGRAM_API_KEY ? "✅ Ready (key configured)" : "⚠️  No API key set".padEnd(34)}║
║  Port    : ${String(PORT).padEnd(39)}║
║  Model   : ${MODEL.padEnd(39)}║
║  Lang    : ${LANGUAGE.padEnd(39)}║
║  WS URL  : ${`ws://localhost:${PORT}`.padEnd(39)}║
║  Health  : ${`http://localhost:${PORT}/health`.padEnd(37)}║
╚══════════════════════════════════════════════════╝
  `);
});
