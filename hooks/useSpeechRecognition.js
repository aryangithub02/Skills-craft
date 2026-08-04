"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Configuration ─────────────────────────────────────────────────────────
// Use relative path /api/transcribe as default so it works from any device
// (Next.js API route forwards to FastAPI backend on the server, where localhost resolves to the PC)
// Override via NEXT_PUBLIC_STT_API_URL for a custom backend URL.
const FASTAPI_URL = process.env.NEXT_PUBLIC_STT_API_URL || "";

/** Build the full transcription endpoint URL */
function transcribeUrl() {
  return FASTAPI_URL
    ? `${FASTAPI_URL}/api/transcribe`
    : `/api/transcribe`;
}
const PROGRESSIVE_INTERVAL_MS = 1500;  // How often to send progressive chunks (ultra-fast live text feedback on mobile)
const SILENCE_TIMEOUT_MS = 8000;       // Silence timeout before firing onSilence
const SR_FALLBACK_TIMEOUT_MS = 5000;   // Wait for onresult after audio activity before falling back
const MAX_SR_RETRIES = 2;              // Max retries for Android SR errors

// ─── Logging helpers ───────────────────────────────────────────────────────
const LOG = (tag, msg, ...args) => console.log(`[STT:${tag}]`, msg, ...args);
const WARN = (tag, msg, ...args) => console.warn(`[STT:${tag}]`, msg, ...args);
const ERR = (tag, msg, ...args) => console.error(`[STT:${tag}]`, msg, ...args);

// ─── Platform detection ────────────────────────────────────────────────────
function getPlatform() {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/i.test(ua)) return "ios";
  return "desktop";
}

function supportsBrowserSR() {
  if (typeof window === "undefined") return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function supportsMediaRecorder() {
  if (typeof window === "undefined") return false;
  return !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined";
}

/**
 * Clean & deduplicate repeated n-grams and stutters from speech recognition
 * e.g., "if he is if he is if he is lacking in" -> "if he is lacking in"
 */
function cleanSpeechTranscript(text) {
  if (!text || typeof text !== "string") return "";
  let cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";

  // 1. Remove consecutive identical words: "the the" -> "the"
  cleaned = cleaned.replace(/\b(\w+)(?:\s+\1\b)+/gi, "$1");

  // 2. Remove consecutive repeating phrases (2-6 words)
  for (let pass = 0; pass < 3; pass++) {
    cleaned = cleaned.replace(/\b(.{3,50}?)\s+\1\b/gi, "$1");
  }

  return cleaned.trim();
}

/**
 * useSpeechRecognition
 *
 * Cross-platform speech-to-text hook with intelligent mode selection:
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ Platform      │ Primary mode            │ Fallback                  │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ Desktop       │ Web Speech API (live)   │ MediaRecorder → FastAPI   │
 * │ Android       │ Web Speech API (try)    │ MediaRecorder → FastAPI   │
 * │ iOS           │ MediaRecorder → FastAPI │ (no fallback)             │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * Returns:
 *   transcript, interimTranscript, isListening, isSupported, permissionState,
 *   error, start(), stop(), reset(), setTranscript(),
 *   transcribe(), isTranscribing(), isMobileMode, recordingDuration,
 *   frequencyData, audioLevel, recognitionMode, debugInfo
 */
export function useSpeechRecognition({
  onSilence,
  onTranscriptChange,
  language = "en-IN",  // Default for Android-friendly recognition
} = {}) {
  // ── Core state ────────────────────────────────────────────────────────
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [permissionState, setPermissionState] = useState("prompt");
  const [isSupported, setIsSupported] = useState(
    () => typeof window !== "undefined" && supportsMediaRecorder()
  );
  const [error, setError] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [frequencyData, setFrequencyData] = useState(() => new Uint8Array(256).fill(0));
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const [lastAudioBlob, setLastAudioBlob] = useState(null);

  // ── New: Mode tracking & debug state ──────────────────────────────────
  const [recognitionMode, setRecognitionMode] = useState("idle"); // "idle" | "browser-sr" | "media-recorder"
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    platform: getPlatform(),
    browserSR: supportsBrowserSR(),
    mediaRecorder: supportsMediaRecorder(),
    currentEvent: "",
    lastError: null,
    srRetries: 0,
    srRestarts: 0,
    fallbacksToMediaRecorder: 0,
    audioActive: false,
    mode: "idle",
  });

  // ── Refs (shared) ─────────────────────────────────────────────────────
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const progressiveTimerRef = useRef(null);
  const progressiveChunkEndRef = useRef(0);
  const isActiveRef = useRef(false);
  const onSilenceRef = useRef(onSilence);
  const onTranscriptChangeRef = useRef(onTranscriptChange);
  const languageRef = useRef(language);
  const currentModeRef = useRef("idle"); // "idle" | "browser-sr" | "media-recorder"

  // ── Refs (SpeechRecognition) ──────────────────────────────────────────
  const srRecognitionRef = useRef(null);
  const srTranscriptRef = useRef("");        // Accumulated final transcript from SR
  const srInterimRef = useRef("");           // Latest interim from SR
  const srAudioActiveRef = useRef(false);    // True from onsoundstart/onaudiostart
  const srFallbackTimerRef = useRef(null);   // Fallback timeout
  const srRetryCountRef = useRef(0);
  const srHasResultRef = useRef(false);      // True if we got onresult

  // ── Refs (MediaRecorder) ──────────────────────────────────────────────
  const mediaRecorderRef = useRef(null);

  // ── Refs (Silence detection) ──────────────────────────────────────────
  const silenceTimerRef = useRef(null);
  const lastChunkTimeRef = useRef(0);

  // ── Keep refs in sync ─────────────────────────────────────────────────
  useEffect(() => { onSilenceRef.current = onSilence; }, [onSilence]);
  useEffect(() => { onTranscriptChangeRef.current = onTranscriptChange; }, [onTranscriptChange]);
  useEffect(() => { languageRef.current = language; }, [language]);

  // ── Update debug info helper ──────────────────────────────────────────
  const updateDebug = useCallback((partial) => {
    setDebugInfo((prev) => ({ ...prev, ...partial }));
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      stopBrowserSR(true);
      stopMediaRecorder();
      stopAudioAnalysis();
      clearAllTimers();
      clearSrFallbackTimer();
      releaseMediaStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Timer helpers ─────────────────────────────────────────────────────
  const clearAllTimers = useCallback(() => {
    clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = null;
    clearInterval(progressiveTimerRef.current);
    progressiveTimerRef.current = null;
  }, []);

  const startRecordingTimer = useCallback(() => {
    setRecordingDuration(0);
    clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopRecordingTimer = useCallback(() => {
    clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = null;
  }, []);

  const clearSrFallbackTimer = useCallback(() => {
    if (srFallbackTimerRef.current) {
      clearTimeout(srFallbackTimerRef.current);
      srFallbackTimerRef.current = null;
    }
  }, []);

  // ── Stream lifecycle ──────────────────────────────────────────────────
  const requestMicrophone = useCallback(async () => {
    if (mediaStreamRef.current) return mediaStreamRef.current;

    LOG("MIC", "Requesting microphone permission...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
          channelCount: 1,
        },
      });
      setPermissionState("granted");
      mediaStreamRef.current = stream;
      LOG("MIC", "✅ Microphone permission granted");
      return stream;
    } catch (err) {
      ERR("MIC", "Microphone access denied:", err);
      setPermissionState("denied");
      setError("microphone-unavailable");
      throw err;
    }
  }, []);

  const releaseMediaStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
      LOG("MIC", "Media stream released");
    }
  }, []);

  // ── Audio analysis (waveform) ─────────────────────────────────────────
  const startAudioAnalysis = useCallback((stream) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.smoothingTimeConstant = 0.85;
      analyser.fftSize = 512;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const updateFrequency = () => {
        if (!analyserRef.current) return;
        const array = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(array);
        setFrequencyData(new Uint8Array(array));

        let sum = 0;
        for (let i = 0; i < array.length; i++) sum += array[i];
        const avg = sum / array.length;
        setAudioLevel(Math.min(100, Math.round((avg / 255) * 100)));

        animationFrameRef.current = requestAnimationFrame(updateFrequency);
      };
      updateFrequency();
      LOG("ANALYSIS", "Audio analysis started");
    } catch (e) {
      WARN("ANALYSIS", "AudioContext setup skipped:", e.message);
    }
  }, []);

  const stopAudioAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => { });
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
    setFrequencyData(new Uint8Array(256).fill(0));
  }, []);

  // ════════════════════════════════════════════════════════════════════════
  // SPEECH RECOGNITION (Web Speech API) — Primary mode
  // ════════════════════════════════════════════════════════════════════════

  /** Create a brand-new SpeechRecognition instance (not reused) */
  const createSRInstance = useCallback(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return null;

    const rec = new SpeechRec();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = languageRef.current || "en-IN";
    rec.maxAlternatives = 1;

    LOG("SR", `Created new SpeechRecognition instance (lang=${rec.lang})`);
    return rec;
  }, []);

  // ── Transcript helpers ────────────────────────────────────────────────
  // NOTE: Must be defined BEFORE attachSREventHandlers to avoid TDZ ReferenceError
  const setTranscriptAndNotify = useCallback((text) => {
    setTranscript(text);
    setInterimTranscript("");
    onTranscriptChangeRef.current?.(text);
  }, []);

  /** Attach all event handlers to a SpeechRecognition instance */
  const attachSREventHandlers = useCallback((rec, stream) => {
    const platform = getPlatform();
    let audioActivityDetected = false;

    rec.onstart = () => {
      LOG("SR:onstart", "Recognition started");
      updateDebug({ currentEvent: "onstart", audioActive: false });
      srHasResultRef.current = false;
    };

    rec.onaudiostart = () => {
      LOG("SR:onaudiostart", "Audio capture started");
      srAudioActiveRef.current = true;
      audioActivityDetected = true;
      updateDebug({ currentEvent: "onaudiostart", audioActive: true });

      clearSrFallbackTimer();
    };

    rec.onsoundstart = () => {
      LOG("SR:onsoundstart", "Sound detected");
      audioActivityDetected = true;
      srAudioActiveRef.current = true;
      updateDebug({ currentEvent: "onsoundstart", audioActive: true });
    };

    rec.onspeechstart = () => {
      LOG("SR:onspeechstart", "🗣️ Speech start detected");
      updateDebug({ currentEvent: "onspeechstart", audioActive: true });
    };

    rec.onresult = (event) => {
      srHasResultRef.current = true;
      clearSrFallbackTimer();

      let finalText = "";
      let interimText = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const textSegment = result[0]?.transcript?.trim() || "";
        if (!textSegment) continue;

        if (result.isFinal) {
          finalText += (finalText ? " " : "") + textSegment;
        } else {
          interimText += (interimText ? " " : "") + textSegment;
        }
      }

      LOG("SR:onresult", `final="${finalText.slice(0, 60)}" interim="${interimText.slice(0, 60)}"`);

      if (finalText) {
        const cleanedFinal = cleanSpeechTranscript(finalText);
        srTranscriptRef.current = cleanedFinal;
        setTranscriptAndNotify(cleanedFinal);
      }

      if (interimText) {
        const cleanedInterim = cleanSpeechTranscript(interimText);
        srInterimRef.current = cleanedInterim;
        setInterimTranscript(cleanedInterim);
      }

      updateDebug({ currentEvent: "onresult", audioActive: true });
    };

    rec.onspeechend = () => {
      LOG("SR:onspeechend", "Speech ended");
      updateDebug({ currentEvent: "onspeechend" });
    };

    rec.onsoundend = () => {
      LOG("SR:onsoundend", "Sound ended");
      updateDebug({ currentEvent: "onsoundend" });
    };

    rec.onaudioend = () => {
      LOG("SR:onaudioend", "Audio capture ended");
      srAudioActiveRef.current = false;
      updateDebug({ currentEvent: "onaudioend", audioActive: false });
    };

    rec.onerror = (event) => {
      const err = event.error;
      LOG("SR:onerror", `Error: ${err}`);
      updateDebug({ currentEvent: `onerror:${err}`, lastError: err });

      // Android-specific: no-speech and audio-capture are common
      if (platform === "android" && (err === "no-speech" || err === "audio-capture")) {
        // Retry with exponential backoff
        if (srRetryCountRef.current < MAX_SR_RETRIES) {
          srRetryCountRef.current++;
          const delay = 1000 * Math.pow(2, srRetryCountRef.current - 1);
          LOG("SR:RETRY", `Android retry ${srRetryCountRef.current}/${MAX_SR_RETRIES} in ${delay}ms`);
          updateDebug({ currentEvent: `sr-retry-${srRetryCountRef.current}`, srRetries: srRetryCountRef.current });

          clearSrFallbackTimer();
          setTimeout(() => {
            if (!isActiveRef.current) return;
            // Clean up old instance
            try { rec.abort(); } catch (_) { }
            // Create new instance and restart
            const newRec = createSRInstance();
            if (newRec) {
              attachSREventHandlers(newRec, stream);
              srRecognitionRef.current = newRec;
              try { newRec.start(); } catch (_) { }
            }
          }, delay);
          return;
        }
      }

      // Non-retryable errors or retries exhausted → fallback to MediaRecorder
      if (isActiveRef.current && currentModeRef.current === "browser-sr") {
        LOG("SR:FALLBACK", `Falling back to MediaRecorder after error: ${err}`);
        updateDebug({ currentEvent: "sr-fallback-error", fallbacksToMediaRecorder: debugInfo.fallbacksToMediaRecorder + 1 });
        fallbackToMediaRecorder(stream);
      }
    };

    rec.onend = () => {
      LOG("SR:onend", "Recognition ended");
      updateDebug({ currentEvent: "onend" });

      // If still active but browser SR ended naturally, restart if we got results
      // (Android Chrome sometimes stops after first speech segment)
      if (isActiveRef.current && currentModeRef.current === "browser-sr") {
        if (srHasResultRef.current) {
          // Got results but recognizer stopped — restart with new instance
          updateDebug({ currentEvent: "sr-restart", srRestarts: debugInfo.srRestarts + 1 });
          const newRec = createSRInstance();
          if (newRec) {
            attachSREventHandlers(newRec, stream);
            srRecognitionRef.current = newRec;
            try { newRec.start(); } catch (_) { }
          }
        } else {
          // Never got results — fallback
          LOG("SR:FALLBACK", "onend without onresult — falling back to MediaRecorder");
          updateDebug({ currentEvent: "sr-fallback-noresult", fallbacksToMediaRecorder: debugInfo.fallbacksToMediaRecorder + 1 });
          fallbackToMediaRecorder(stream);
        }
      }
    };
  }, [
    createSRInstance, clearSrFallbackTimer, updateDebug,
    setTranscriptAndNotify,
  ]);

  /** Start browser SpeechRecognition */
  const startBrowserSR = useCallback(async (stream) => {
    LOG("SR:START", "Starting browser SpeechRecognition...");
    currentModeRef.current = "browser-sr";
    setRecognitionMode("browser-sr");
    setIsMobileMode(false);
    setIsListening(true);
    setError(null);
    srTranscriptRef.current = "";
    srInterimRef.current = "";
    srAudioActiveRef.current = false;
    srHasResultRef.current = false;
    srRetryCountRef.current = 0;

    const rec = createSRInstance();
    if (!rec) {
      LOG("SR:START", "SpeechRecognition not available — falling back to MediaRecorder");
      startMediaRecorder(stream);
      return;
    }

    srRecognitionRef.current = rec;
    attachSREventHandlers(rec, stream);

    try {
      rec.start();
      startRecordingTimer();
      startAudioAnalysis(stream);
      LOG("SR:START", "✅ Browser SR started");
      updateDebug({ currentEvent: "sr-started", mode: "browser-sr" });
    } catch (err) {
      ERR("SR:START", "Failed to start:", err);
      updateDebug({ currentEvent: "sr-start-failed", lastError: err.message });
      startMediaRecorder(stream);
    }
  }, [createSRInstance, attachSREventHandlers, startRecordingTimer, startAudioAnalysis, updateDebug]);

  /** Stop browser SpeechRecognition */
  const stopBrowserSR = useCallback((isUnmount = false) => {
    clearSrFallbackTimer();
    if (srRecognitionRef.current) {
      try {
        srRecognitionRef.current.stop();
      } catch (_) { }
      try {
        srRecognitionRef.current.abort();
      } catch (_) { }
      srRecognitionRef.current = null;
      LOG("SR:STOP", "Browser SR stopped");
    }
    if (!isUnmount) {
      setIsListening(false);
      setRecognitionMode("idle");
      currentModeRef.current = "idle";
    }
  }, [clearSrFallbackTimer]);

  // ════════════════════════════════════════════════════════════════════════
  // MEDIA RECORDER — Fallback / iOS mode
  // ════════════════════════════════════════════════════════════════════════

  const stopMediaRecorder = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch (_) { }
    }
    mediaRecorderRef.current = null;
  }, []);

  const startMediaRecorder = useCallback((stream) => {
    LOG("MR:START", "Starting MediaRecorder (fallback)...");
    currentModeRef.current = "media-recorder";
    setRecognitionMode("media-recorder");
    setIsMobileMode(true);
    setIsListening(true);
    setError(null);

    // Update debug
    updateDebug({
      currentEvent: "media-recorder-started",
      mode: "media-recorder",
      fallbacksToMediaRecorder: debugInfo.fallbacksToMediaRecorder + (
        currentModeRef.current === "browser-sr" ? 1 : 0
      ),
    });

    stopMediaRecorder();

    const mimeType =
      MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")
            ? "audio/ogg;codecs=opus"
            : "";

    LOG("MR", `Starting MediaRecorder (mimeType="${mimeType || "default"}")`);

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
    audioChunksRef.current = [];
    progressiveChunkEndRef.current = 0;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        audioChunksRef.current.push(e.data);
        trackChunkActivity();
      }
    };

    recorder.onstop = () => {
      LOG("MR", "MediaRecorder stopped");
      setIsListening(false);
      stopRecordingTimer();
      stopAudioAnalysis();
      if (currentModeRef.current === "media-recorder") {
        setRecognitionMode("idle");
        currentModeRef.current = "idle";
      }
    };

    recorder.onerror = (event) => {
      ERR("MR", "MediaRecorder error:", event.error);
      setError(event.error?.name || "recording-error");
      setIsListening(false);
      stopRecordingTimer();
      stopAudioAnalysis();
      stopMediaRecorder();
    };

    mediaRecorderRef.current = recorder;
    recorder.start(250);

    startRecordingTimer();
    startAudioAnalysis(stream);
    setPermissionState("granted");

    LOG("MR", `State: ${recorder.state}`);
  }, [stopMediaRecorder, startRecordingTimer, stopRecordingTimer, startAudioAnalysis, stopAudioAnalysis, updateDebug, debugInfo.fallbacksToMediaRecorder]);

  /** Fallback from browser SR to MediaRecorder */
  const fallbackToMediaRecorder = useCallback((stream) => {
    if (currentModeRef.current !== "browser-sr") return;
    LOG("FALLBACK", "Switching from browser SR to MediaRecorder");
    stopBrowserSR();
    startMediaRecorder(stream);
  }, [stopBrowserSR, startMediaRecorder]);

  // ── Silence / Inactivity Timer ───────────────────────────────────────

  const resetSilenceTimer = useCallback(() => {
    // Silence checks and inactivity timeouts disabled
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const trackChunkActivity = useCallback(() => {
    lastChunkTimeRef.current = Date.now();
    resetSilenceTimer();
  }, [resetSilenceTimer]);

  // ── Progressive transcription (MediaRecorder mode only) ───────────────
  const sendProgressiveChunk = useCallback(async () => {
    if (currentModeRef.current !== "media-recorder") return;
    const chunks = audioChunksRef.current;
    if (!chunks || chunks.length === 0) return;

    const startIdx = progressiveChunkEndRef.current;
    if (startIdx >= chunks.length) return;

    const newChunks = chunks.slice(startIdx);
    if (newChunks.length === 0) return;

    progressiveChunkEndRef.current = chunks.length;
    trackChunkActivity();

    const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
    const blob = new Blob(newChunks, { type: mimeType });

    LOG("PROGRESSIVE", `Sending progressive chunk: ${(blob.size / 1024).toFixed(1)} KB`);

    try {
      const form = new FormData();
      form.append("audio", blob, `progressive-${Date.now()}.webm`);

      const res = await fetch(transcribeUrl(), {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        WARN("PROGRESSIVE", `API error (${res.status}) — skipping`);
        return;
      }

      const data = await res.json();
      const text = (data.transcript || "").trim();
      if (text) {
        setInterimTranscript(text);
      }
    } catch (err) {
      WARN("PROGRESSIVE", "Progressive transcription failed:", err.message);
    }
  }, [trackChunkActivity]);

  // ── Start ─────────────────────────────────────────────────────────────
  const start = useCallback(async () => {
    if (isActiveRef.current) {
      LOG("START", "Already active — ignoring");
      return;
    }
    isActiveRef.current = true;

    try {
      const stream = await requestMicrophone();
      const platform = getPlatform();
      const hasSR = supportsBrowserSR();

      LOG("START", `Platform=${platform}, browserSR=${hasSR}`);

      // Decide which mode to use
      if (platform === "ios") {
        // iOS: MediaRecorder only (Web Speech API is unreliable on iOS)
        LOG("START", "iOS detected — using MediaRecorder directly");
        updateDebug({ currentEvent: "start-ios-mr" });
        startMediaRecorder(stream);
      } else if (platform === "android" && hasSR) {
        // Android: Try Web Speech API first (may fail, will fallback)
        LOG("START", "Android detected — trying browser SR with fallback");
        updateDebug({ currentEvent: "start-android-sr" });
        startBrowserSR(stream);
      } else if (platform === "desktop" && hasSR) {
        // Desktop with SR support
        LOG("START", "Desktop with SR — using browser SR");
        updateDebug({ currentEvent: "start-desktop-sr" });
        startBrowserSR(stream);
      } else {
        // Desktop without SR, or fallback
        LOG("START", "No browser SR — using MediaRecorder");
        updateDebug({ currentEvent: "start-mr-fallback" });
        startMediaRecorder(stream);
      }

      // Start progressive transcription timer (only used in MediaRecorder mode)
      if (PROGRESSIVE_INTERVAL_MS > 0) {
        clearInterval(progressiveTimerRef.current);
        progressiveTimerRef.current = setInterval(() => {
          if (isActiveRef.current) {
            sendProgressiveChunk();
          }
        }, PROGRESSIVE_INTERVAL_MS);
      }

      LOG("START", "✅ Recording started");
    } catch (err) {
      ERR("START", "Failed to start recording:", err);
      isActiveRef.current = false;
    }
  }, [requestMicrophone, startBrowserSR, startMediaRecorder, sendProgressiveChunk, updateDebug]);

  // ── Stop ──────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    LOG("STOP", "Stopping...");
    isActiveRef.current = false;
    clearInterval(progressiveTimerRef.current);
    progressiveTimerRef.current = null;
    clearSilenceTimer();
    clearSrFallbackTimer();

    if (currentModeRef.current === "browser-sr") {
      stopBrowserSR();
    } else {
      stopMediaRecorder();
      stopRecordingTimer();
      stopAudioAnalysis();
    }

    setRecognitionMode("idle");
    currentModeRef.current = "idle";
  }, [stopBrowserSR, stopMediaRecorder, stopRecordingTimer, stopAudioAnalysis, clearSilenceTimer, clearSrFallbackTimer]);

  // ── Reset ─────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    LOG("RESET", "Resetting state...");
    setTranscript("");
    setInterimTranscript("");
    setRecordingDuration(0);
    setAudioLevel(0);
    setFrequencyData(new Uint8Array(256).fill(0));
    audioChunksRef.current = [];
    progressiveChunkEndRef.current = 0;
    clearInterval(progressiveTimerRef.current);
    progressiveTimerRef.current = null;
    clearSilenceTimer();
    clearSrFallbackTimer();
    srTranscriptRef.current = "";
    srInterimRef.current = "";
    srAudioActiveRef.current = false;
    srHasResultRef.current = false;
    srRetryCountRef.current = 0;
    isActiveRef.current = false;
    setError(null);
    setRecognitionMode("idle");
    currentModeRef.current = "idle";
  }, [clearSilenceTimer, clearSrFallbackTimer]);

  // ── Transcribe (final) ────────────────────────────────────────────────
  /**
   * transcribe – get the final transcript.
   *
   * @param {boolean} stopRecorderIfNeeded - Whether to stop the recorder first. Default true.
   * @returns {Promise<string>} Transcribed text
   */
  const transcribe = useCallback(async (stopRecorderIfNeeded = true) => {
    LOG("TRANSCRIBE", "Direct live voice detection — returning accumulated transcript");
    const rawText = (srTranscriptRef.current || transcript || "").trim();
    const text = cleanSpeechTranscript(rawText);
    if (stopRecorderIfNeeded) stop();
    if (text) setTranscriptAndNotify(text);
    return text;
  }, [transcript, stop, setTranscriptAndNotify]);

  return {
    transcript,
    interimTranscript,
    audioUrl,
    lastAudioBlob,
    isListening,
    isSupported,
    permissionState,
    error,
    frequencyData,
    audioLevel,
    start,
    stop,
    reset,
    setTranscript,
    transcribe,
    isTranscribing,
    isMobileMode,
    recordingDuration,
    recognitionMode,
    debugInfo,
  };
}
