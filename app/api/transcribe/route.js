import { NextResponse } from "next/server";
const deepgramSdk = require("@deepgram/sdk");

function getDeepgramClient(apiKey) {
  const createFn = deepgramSdk.createClient || deepgramSdk.default?.createClient;
  if (typeof createFn === "function") {
    return createFn(apiKey);
  }
  const ClientClass = deepgramSdk.DeepgramClient || deepgramSdk.default?.DeepgramClient || deepgramSdk.Deepgram;
  if (typeof ClientClass === "function") {
    return new ClientClass(apiKey);
  }
  if (typeof deepgramSdk === "function") {
    return new deepgramSdk(apiKey);
  }
  throw new Error("Could not instantiate Deepgram SDK client");
}

/**
 * POST /api/transcribe
 *
 * Saves candidate voice recordings AND returns full transcribed text via:
 * 1. FastAPI + Faster-Whisper backend (if running locally/server)
 * 2. Deepgram Nova-2 Cloud STT API fallback (via DEEPGRAM_API_KEY)
 *
 * Accepts: multipart/form-data with an "audio" field.
 * Returns: { transcript, text, audio_url, filename, duration }
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile) {
      return NextResponse.json({
        transcript: "",
        text: "",
        language: "en",
        duration: 0,
        segments: [],
      });
    }

    // Limit maximum upload size to 15MB
    const MAX_FILE_SIZE = 15 * 1024 * 1024;
    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Payload Too Large. Audio file size exceeds 15MB threshold." },
        { status: 413 }
      );
    }

    const FASTAPI_URL = process.env.NEXT_PUBLIC_STT_API_URL || "http://localhost:8000";

    // ── Step 1: Try FastAPI + Faster-Whisper local backend ─────────────────────
    try {
      const form = new FormData();
      form.append("audio", audioFile, audioFile.name || "recording.webm");

      const res = await fetch(`${FASTAPI_URL}/api/transcribe`, {
        method: "POST",
        body: form,
        signal: AbortSignal.timeout(4000), // Fast 4-second timeout for local backend
      });

      if (res.ok) {
        const data = await res.json();
        const text = (data.transcript || "").trim();
        if (text) {
          console.log(`✅ [Transcribe API] FastAPI transcript result: "${text}"`);
          return NextResponse.json({
            transcript: text,
            text: text,
            audio_url: data.audio_url || null,
            filename: data.filename || null,
            language: data.language || "en",
            duration: data.duration_seconds || 0,
          });
        }
      }
    } catch (err) {
      console.warn("[Transcribe API] FastAPI backend unreachable:", err.message);
    }

    // ── Step 2: Fallback to Deepgram Nova-2 Cloud STT ──────────────────────────
    if (process.env.DEEPGRAM_API_KEY) {
      try {
        console.log("🎙️ [Transcribe API] Using Deepgram Nova-2 Cloud STT Fallback...");
        const deepgram = getDeepgramClient(process.env.DEEPGRAM_API_KEY);
        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Clean mimetype by stripping codecs string (Deepgram API expects clean "audio/webm" or "audio/mp4")
        const rawMime = audioFile.type || "audio/webm";
        const cleanMimeType = rawMime.split(";")[0].trim() || "audio/webm";

        console.log(`🎙️ [Transcribe API] Transcribing ${(buffer.length / 1024).toFixed(1)} KB audio (mimetype="${cleanMimeType}")...`);

        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
          buffer,
          {
            model: "nova-2",
            smart_format: true,
            language: "en",
            mimetype: cleanMimeType,
          }
        );

        if (error) {
          console.error("❌ [Transcribe API] Deepgram error:", error);
        } else {
          const text = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
          console.log(`✨ [Transcribe API] Deepgram transcript result: "${text}"`);
          return NextResponse.json({
            transcript: text.trim(),
            text: text.trim(),
            language: "en",
            duration: result?.metadata?.duration || 0,
          });
        }
      } catch (dgErr) {
        console.error("❌ [Transcribe API] Deepgram Exception:", dgErr);
      }
    }

    return NextResponse.json({
      transcript: "",
      text: "",
      language: "en",
      duration: 0,
    });
  } catch (err) {
    console.error("[Transcribe API] Exception:", err);
    return NextResponse.json(
      { transcript: "", text: "", error: "An unexpected error occurred during transcription processing." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/transcribe
 */
export async function GET() {
  const FASTAPI_URL = process.env.NEXT_PUBLIC_STT_API_URL || "http://localhost:8000";
  let status = "unreachable";
  try {
    const res = await fetch(`${FASTAPI_URL}/api/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) status = "ok";
  } catch {}

  return NextResponse.json({
    status,
    service: "Faster-Whisper STT + Voice Storage",
  });
}
