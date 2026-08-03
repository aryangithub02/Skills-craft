/**
 * STT Orchestrator
 *
 * Sends audio to the SkillsCraft FastAPI + Faster-Whisper backend
 * for high-accuracy speech-to-text transcription.
 *
 * The backend is a Python FastAPI server that loads a Faster-Whisper
 * model at startup (medium by default) and provides:
 *   POST /api/transcribe  → { transcript, language, duration_seconds, segments }
 *   GET  /api/health      → { status, model_size, ... }
 *
 * This replaces the previous multi-provider cloud approach (OpenAI,
 * Deepgram, Google STT, AssemblyAI) with a single self-hosted model
 * that runs locally with no per-minute API costs.
 *
 * Usage:
 *   import { transcribe } from "@/lib/stt";
 *   const { text, language, duration } = await transcribe(audioBlob);
 */

// FastAPI backend URL — configure via NEXT_PUBLIC_STT_API_URL or default
const FASTAPI_URL = process.env.NEXT_PUBLIC_STT_API_URL || "http://localhost:8000";

/**
 * Transcribe an audio blob using the Faster-Whisper backend.
 *
 * @param {Blob}  audioBlob  – recorded audio (webm/ogg/wav/etc.)
 * @param {object} [options]
 * @param {AbortSignal} [options.signal] – optional AbortSignal
 * @returns {Promise<{ text: string, language: string, duration: number, segments: Array }>}
 */
export async function transcribe(audioBlob, { signal } = {}) {
  if (!audioBlob || audioBlob.size === 0) {
    console.warn("[STT] Empty audio blob provided");
    return { text: "", language: "", duration: 0, segments: [] };
  }

  const form = new FormData();
  form.append("audio", audioBlob, `recording-${Date.now()}.webm`);

  console.log(`[STT] Sending ${(audioBlob.size / 1024).toFixed(1)} KB to ${FASTAPI_URL}/api/transcribe`);
  const start = Date.now();

  try {
    const res = await fetch(`${FASTAPI_URL}/api/transcribe`, {
      method: "POST",
      body: form,
      signal,
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`Faster-Whisper API (${res.status}): ${errBody.slice(0, 200)}`);
    }

    const data = await res.json();
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    console.log(
      `[STT] ✅ Transcription complete in ${elapsed}s — ` +
      `"${(data.transcript || "").slice(0, 80)}${(data.transcript || "").length > 80 ? "…" : ""}" ` +
      `(lang=${data.language}, dur=${data.duration_seconds}s)`
    );

    return {
      text: (data.transcript || "").trim(),
      language: data.language || "",
      duration: data.duration_seconds || 0,
      segments: data.segments || [],
    };
  } catch (err) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.error(`[STT] ❌ Failed after ${elapsed}s — ${err.message}`);
    throw err;
  }
}

/**
 * Check if the FastAPI backend is reachable and the model is loaded.
 *
 * @returns {Promise<{ status: string, model_size: string, device: string }>}
 */
export async function healthCheck() {
  try {
    const res = await fetch(`${FASTAPI_URL}/api/health`);
    if (!res.ok) return { status: "unreachable" };
    return await res.json();
  } catch {
    return { status: "unreachable" };
  }
}
