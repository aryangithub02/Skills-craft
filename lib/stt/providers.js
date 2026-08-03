/**
 * Individual STT provider implementations.
 *
 * PRIORITY ORDER:
 *   1. FastAPI + Faster-Whisper (self-hosted, free, no API costs)
 *   2. OpenAI Whisper (cloud fallback)
 *   3. Deepgram (cloud fallback)
 *   4. Google Cloud Speech-to-Text (enterprise fallback)
 *   5. AssemblyAI (cloud fallback)
 *
 * Each receives a Blob/Buffer of audio and returns the transcribed text.
 * Throws on failure so the orchestrator can fall through to the next provider.
 */

const FASTAPI_URL = process.env.NEXT_PUBLIC_STT_API_URL || "http://localhost:8000";

// ─── FastAPI + Faster-Whisper (Primary) ─────────────────────────────────

export async function transcribeWithFastAPI(audioBlob, signal) {
  const form = new FormData();
  form.append("audio", audioBlob, "recording.webm");

  const res = await fetch(`${FASTAPI_URL}/api/transcribe`, {
    method: "POST",
    body: form,
    signal,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Faster-Whisper API (${res.status}): ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  return (data.transcript || "").trim();
}

// ─── OpenAI Whisper ─────────────────────────────────────────────────────

export async function transcribeWithOpenAI(audioBlob, signal) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not configured");

  const form = new FormData();
  form.append("file", audioBlob, "recording.webm");
  form.append("model", "whisper-1");
  form.append("language", "en");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
    signal,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OpenAI Whisper (${res.status}): ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  return (data.text || "").trim();
}

// ─── Deepgram ───────────────────────────────────────────────────────────

export async function transcribeWithDeepgram(audioBlob, signal) {
  const key = process.env.DEEPGRAM_API_KEY;
  if (!key) throw new Error("DEEPGRAM_API_KEY not configured");

  const arrayBuffer = await audioBlob.arrayBuffer();

  const res = await fetch(
    "https://api.deepgram.com/v1/listen?model=nova-2&language=en&smart_format=true",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${key}`,
        "Content-Type": audioBlob.type || "audio/webm",
      },
      body: arrayBuffer,
      signal,
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Deepgram (${res.status}): ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const transcript = data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
  return transcript.trim();
}

// ─── Google Cloud Speech-to-Text ────────────────────────────────────────

export async function transcribeWithGoogle(audioBlob, signal) {
  const apiKey = process.env.GOOGLE_CLOUD_STT_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_CLOUD_STT_API_KEY not configured");

  const content = Buffer.from(await audioBlob.arrayBuffer()).toString("base64");

  const body = {
    config: {
      encoding: "WEBM_OPUS",
      languageCode: "en-US",
      model: "latest_long",
      enableAutomaticPunctuation: true,
    },
    audio: { content },
  };

  const res = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    }
  );

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`Google STT (${res.status}): ${errBody.slice(0, 200)}`);
  }

  const data = await res.json();
  const transcript = (data?.results || [])
    .map((r) => r?.alternatives?.[0]?.transcript || "")
    .join(" ")
    .trim();
  return transcript;
}

// ─── AssemblyAI ─────────────────────────────────────────────────────────

export async function transcribeWithAssemblyAI(audioBlob, signal) {
  const key = process.env.ASSEMBLYAI_API_KEY;
  if (!key) throw new Error("ASSEMBLYAI_API_KEY not configured");

  // Step 1: Upload
  const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
    method: "POST",
    headers: {
      Authorization: key,
      "Content-Type": "application/octet-stream",
    },
    body: audioBlob,
    signal,
  });

  if (!uploadRes.ok) {
    const body = await uploadRes.text().catch(() => "");
    throw new Error(`AssemblyAI upload (${uploadRes.status}): ${body.slice(0, 200)}`);
  }

  const { upload_url } = await uploadRes.json();
  if (!upload_url) throw new Error("AssemblyAI upload returned no URL");

  // Step 2: Submit transcription
  const transcribeRes = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    headers: {
      Authorization: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audio_url: upload_url,
      language_code: "en",
    }),
    signal,
  });

  if (!transcribeRes.ok) {
    const body = await transcribeRes.text().catch(() => "");
    throw new Error(`AssemblyAI transcribe (${transcribeRes.status}): ${body.slice(0, 200)}`);
  }

  const { id } = await transcribeRes.json();
  if (!id) throw new Error("AssemblyAI returned no transcript ID");

  // Step 3: Poll until complete (with timeout)
  const POLL_INTERVAL = 1500;
  const MAX_WAIT = 30_000;
  let waited = 0;

  while (waited < MAX_WAIT) {
    if (signal?.aborted) throw new Error("Request aborted");

    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
    waited += POLL_INTERVAL;

    const pollRes = await fetch(
      `https://api.assemblyai.com/v2/transcript/${id}`,
      {
        headers: { Authorization: key },
        signal,
      }
    );

    if (!pollRes.ok) {
      const body = await pollRes.text().catch(() => "");
      throw new Error(`AssemblyAI poll (${pollRes.status}): ${body.slice(0, 200)}`);
    }

    const status = await pollRes.json();
    if (status.status === "completed") {
      return (status.text || "").trim();
    }
    if (status.status === "error") {
      throw new Error(`AssemblyAI error: ${status.error || "unknown"}`);
    }
  }

  throw new Error("AssemblyAI transcription timed out after 30s");
}
