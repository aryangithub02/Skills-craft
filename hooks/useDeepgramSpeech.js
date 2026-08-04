"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Configuration ─────────────────────────────────────────────────────────
// The WebSocket proxy server URL (default: localhost:3002)
const DEEPGRAM_WS_URL = process.env.NEXT_PUBLIC_DEEPGRAM_WS_URL || "ws://localhost:3002";

// Silence timeout before firing onSilence callback
const SILENCE_TIMEOUT_MS = 8000;

// Max reconnection attempts before giving up
const MAX_RECONNECT_ATTEMPTS = 3;

// Interval (ms) between reconnection attempts
const RECONNECT_INTERVAL_MS = 2000;

// Logging helpers
const LOG = (tag, msg, ...args) => console.log(`[DG:${tag}]`, msg, ...args);
const WARN = (tag, msg, ...args) => console.warn(`[DG:${tag}]`, msg, ...args);
const ERR = (tag, msg, ...args) => console.error(`[DG:${tag}]`, msg, ...args);

/**
 * useDeepgramSpeech
 *
 * Production-ready speech-to-text hook that streams audio to Deepgram
 * via a secure WebSocket proxy server (keeping the API key server-side).
 *
 * Architecture:
 *   Browser (MediaRecorder) → WebSocket → Deepgram WS Proxy → Deepgram API
 *
 * Features:
 * - Real-time streaming with interim + final results
 * - Automatic microphone permission handling
 * - Recording timer & audio level visualization
 * - Reconnection logic with exponential backoff
 * - Silence detection
 * - Cleanup on unmount
 * - Works on all platforms (Android, iOS, Desktop)
 *
 * Returns:
 *   transcript, interimTranscript, isListening, isSupported, permissionState,
 *   error, start(), stop(), reset(), setTranscript(),
 *   transcribe(), isTranscribing(), isMobileMode, recordingDuration,
 *   frequencyData, audioLevel, connectionStatus, finalTranscript
 */
export function useDeepgramSpeech({
  onSilence,
  onTranscriptChange,
  language = "en",
} = {}) {
  // ── Core state ────────────────────────────────────────────────────────
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [permissionState, setPermissionState] = useState("prompt");
  const [isSupported, setIsSupported] = useState(
    () =>
      typeof window !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof MediaRecorder !== "undefined" &&
      typeof WebSocket !== "undefined"
  );
  const [error, setError] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [frequencyData, setFrequencyData] = useState(() => new Uint8Array(256).fill(0));
  const [audioLevel, setAudioLevel] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // "disconnected" | "connecting" | "connected" | "error"
  const [finalTranscript, setFinalTranscript] = useState("");

  // ── Refs ──────────────────────────────────────────────────────────────
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const isActiveRef = useRef(false);
  const onSilenceRef = useRef(onSilence);
  const onTranscriptChangeRef = useRef(onTranscriptChange);
  const languageRef = useRef(language);

  // ── WebSocket Refs ────────────────────────────────────────────────────
  const wsRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef(null);
  const accumulatedTranscriptRef = useRef("");

  // ── Silence detection ─────────────────────────────────────────────────
  const silenceTimerRef = useRef(null);
  const lastAudioTimeRef = useRef(0);

  // ── Keep refs in sync ─────────────────────────────────────────────────
  useEffect(() => { onSilenceRef.current = onSilence; }, [onSilence]);
  useEffect(() => { onTranscriptChangeRef.current = onTranscriptChange; }, [onTranscriptChange]);
  useEffect(() => { languageRef.current = language; }, [language]);

  // ── Cleanup on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      stopMediaRecorder();
      disconnectWebSocket();
      stopAudioAnalysis();
      clearAllTimers();
      releaseMediaStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Timer helpers ─────────────────────────────────────────────────────
  const clearAllTimers = useCallback(() => {
    clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = null;
    clearTimeout(reconnectTimerRef.current);
    reconnectTimerRef.current = null;
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
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
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
    setFrequencyData(new Uint8Array(256).fill(0));
  }, []);

  // ── WebSocket management ──────────────────────────────────────────────
  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      try {
        wsRef.current.send(JSON.stringify({ action: "stop" }));
      } catch (_) {}
      try {
        wsRef.current.close();
      } catch (_) {}
      wsRef.current = null;
    }
    setConnectionStatus("disconnected");
  }, []);

  const connectWebSocket = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (wsRef.current) {
        disconnectWebSocket();
      }

      LOG("WS", `Connecting to ${DEEPGRAM_WS_URL}...`);
      setConnectionStatus("connecting");

      let ws;
      try {
        ws = new WebSocket(DEEPGRAM_WS_URL);
      } catch (err) {
        ERR("WS", "Failed to create WebSocket:", err.message);
        setConnectionStatus("error");
        setError("websocket-connect-failed");
        reject(err);
        return;
      }

      ws.onopen = () => {
        LOG("WS", "✅ WebSocket connected");
        setConnectionStatus("connected");
        // Send start command to initialize Deepgram connection
        ws.send(JSON.stringify({ action: "start" }));
        resolve();
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          switch (msg.type) {
            case "acknowledged":
              LOG("WS", `Server acknowledged (v${msg.serverVersion})`);
              break;

            case "connected":
              LOG("WS", `✅ Deepgram connected (model=${msg.model})`);
              break;

            case "transcript":
              const text = msg.text || "";
              const isFinal = msg.isFinal || false;
              const confidence = msg.confidence || 0;

              // Track audio activity for silence detection
              if (text && !isFinal) {
                lastAudioTimeRef.current = Date.now();
                resetSilenceTimer();
              }

              if (isFinal) {
                // Append final result to accumulated transcript
                accumulatedTranscriptRef.current += (
                  accumulatedTranscriptRef.current ? " " : ""
                ) + text;
                setTranscript(accumulatedTranscriptRef.current);
                setFinalTranscript(accumulatedTranscriptRef.current);
                setInterimTranscript("");
                onTranscriptChangeRef.current?.(accumulatedTranscriptRef.current);
              } else {
                // Show interim result
                setInterimTranscript(text);
              }
              break;

            case "utteranceEnd":
              // Natural pause detected
              break;

            case "disconnected":
              LOG("WS", "Deepgram disconnected");
              setConnectionStatus("disconnected");
              if (isActiveRef.current) {
                attemptReconnect();
              }
              break;

            case "error":
              WARN("WS", `Server error: ${msg.message}`);
              if (isActiveRef.current) {
                setError(msg.message);
                attemptReconnect();
              }
              break;

            case "info":
              LOG("WS", `Info: ${msg.message}`);
              break;

            default:
              LOG("WS", `Unknown message type: ${msg.type}`);
          }
        } catch (e) {
          // Not JSON — might be binary data, ignore
        }
      };

      ws.onerror = (event) => {
        WARN("WS", "Deepgram WebSocket proxy unreachable or failed to connect.");
        setConnectionStatus("error");
        setError("websocket-error");
        if (isActiveRef.current) {
          attemptReconnect();
        }
        reject(new Error("Deepgram WebSocket unreachable"));
      };

      ws.onclose = () => {
        LOG("WS", "WebSocket closed");
        wsRef.current = null;
        setConnectionStatus("disconnected");
        if (isActiveRef.current) {
          attemptReconnect();
        }
      };

      wsRef.current = ws;
    });
  }, [disconnectWebSocket]);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      ERR("WS", `Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached`);
      setError("max-reconnect-attempts");
      return;
    }

    reconnectAttemptsRef.current++;
    const delay = RECONNECT_INTERVAL_MS * reconnectAttemptsRef.current;

    LOG("WS", `Reconnecting (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS}) in ${delay}ms...`);

    clearTimeout(reconnectTimerRef.current);
    reconnectTimerRef.current = setTimeout(() => {
      if (isActiveRef.current) {
        connectWebSocket().catch(() => {});
      }
    }, delay);
  }, [connectWebSocket]);

  // ── Silence detection ─────────────────────────────────────────────────
  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (!onSilenceRef.current) return;
    silenceTimerRef.current = setTimeout(() => {
      if (isActiveRef.current) {
        LOG("SILENCE", "Inactivity timeout — firing onSilence");
        onSilenceRef.current?.();
      }
    }, SILENCE_TIMEOUT_MS);
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // ── MediaRecorder lifecycle ───────────────────────────────────────────
  const stopMediaRecorder = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch (_) {}
    }
    mediaRecorderRef.current = null;
  }, []);

  const startMediaRecorder = useCallback((stream) => {
    stopMediaRecorder();

    // Pick best supported MIME type
    const mimeType =
      MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")
        ? "audio/ogg;codecs=opus"
        : "";

    LOG("RECORDER", `Starting MediaRecorder (mimeType="${mimeType || "default"}")`);

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        // Send audio chunk to Deepgram via WebSocket
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          e.data.arrayBuffer().then((buffer) => {
            wsRef.current?.send(buffer);
          }).catch((err) => {
            WARN("RECORDER", "Failed to send audio chunk:", err.message);
          });
        }
      }
    };

    recorder.onstop = () => {
      LOG("RECORDER", "MediaRecorder stopped");
      setIsListening(false);
      stopRecordingTimer();
      stopAudioAnalysis();
      // Send stop signal to Deepgram
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try { wsRef.current.send(JSON.stringify({ action: "stop" })); } catch (_) {}
      }
    };

    recorder.onerror = (event) => {
      ERR("RECORDER", "MediaRecorder error:", event.error);
      setError(event.error?.name || "recording-error");
      setIsListening(false);
      stopRecordingTimer();
      stopAudioAnalysis();
      stopMediaRecorder();
    };

    mediaRecorderRef.current = recorder;
    // Use smaller timeslice for lower latency
    recorder.start(100);

    setIsListening(true);
    setError(null);
    startRecordingTimer();
    startAudioAnalysis(stream);
    setPermissionState("granted");

    LOG("RECORDER", `State: ${recorder.state}, sending every 100ms`);
  }, [stopMediaRecorder, startRecordingTimer, stopRecordingTimer, startAudioAnalysis, stopAudioAnalysis]);

  // ── Start ─────────────────────────────────────────────────────────────
  const start = useCallback(async () => {
    if (isActiveRef.current) {
      LOG("START", "Already active — ignoring");
      return;
    }
    isActiveRef.current = true;
    reconnectAttemptsRef.current = 0;
    accumulatedTranscriptRef.current = "";
    setTranscript("");
    setInterimTranscript("");
    setFinalTranscript("");

    try {
      const stream = await requestMicrophone();

      // Connect to Deepgram WebSocket proxy
      try {
        await connectWebSocket();
      } catch (wsErr) {
        WARN("START", "WebSocket connection failed — falling back to no-transcription mode");
        setError("deepgram-unavailable");
        // We still record, but transcription won't work
      }

      startMediaRecorder(stream);

      LOG("START", "✅ Deepgram streaming started");
    } catch (err) {
      ERR("START", "Failed to start:", err);
      isActiveRef.current = false;
    }
  }, [requestMicrophone, connectWebSocket, startMediaRecorder]);

  // ── Stop ──────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    LOG("STOP", "Stopping...");
    isActiveRef.current = false;
    clearAllTimers();
    stopMediaRecorder();
    stopRecordingTimer();
    stopAudioAnalysis();
    disconnectWebSocket();
  }, [stopMediaRecorder, stopRecordingTimer, stopAudioAnalysis, disconnectWebSocket, clearAllTimers]);

  // ── Reset ─────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    LOG("RESET", "Resetting state...");
    setTranscript("");
    setInterimTranscript("");
    setFinalTranscript("");
    setRecordingDuration(0);
    setAudioLevel(0);
    setFrequencyData(new Uint8Array(256).fill(0));
    accumulatedTranscriptRef.current = "";
    reconnectAttemptsRef.current = 0;
    isActiveRef.current = false;
    clearAllTimers();
    setError(null);
  }, [clearAllTimers]);

  // ── Transcribe (final) ────────────────────────────────────────────────
  /**
   * transcribe — get the final transcript.
   *
   * With Deepgram streaming, the transcript is already accumulated in real-time.
   * This stops the recorder (if stopRecorderIfNeeded is true) and returns the
   * final accumulated text.
   *
   * @param {boolean} stopRecorderIfNeeded - Whether to stop recording. Default true.
   * @returns {Promise<string>} Final transcribed text
   */
  const transcribe = useCallback(async (stopRecorderIfNeeded = true) => {
    LOG("TRANSCRIBE", "Getting final transcript...");
    const text = accumulatedTranscriptRef.current.trim();
    if (text) {
      setTranscript(text);
      setFinalTranscript(text);
      onTranscriptChangeRef.current?.(text);
    }
    if (stopRecorderIfNeeded) {
      stop();
    }
    return text;
  }, [stop]);

  // ── setTranscript (for manual editing) ────────────────────────────────
  const setTranscriptManually = useCallback((text) => {
    setTranscript(text);
    accumulatedTranscriptRef.current = text;
    onTranscriptChangeRef.current?.(text);
  }, []);

  // ── Debug info (compatible with DebugPanel) ───────────────────────────
  const debugInfo = {
    platform: typeof navigator !== "undefined"
      ? (/android/i.test(navigator.userAgent) ? "android" : /iPad|iPhone|iPod/i.test(navigator.userAgent) ? "ios" : "desktop")
      : "desktop",
    browserSR: false,
    mediaRecorder: true,
    currentEvent: connectionStatus === "connected" ? "deepgram-streaming" : connectionStatus,
    lastError: error,
    srRetries: 0,
    srRestarts: 0,
    fallbacksToMediaRecorder: 0,
    audioActive: audioLevel > 5,
    mode: isListening ? "deepgram" : "idle",
  };

  // ── Public API ────────────────────────────────────────────────────────
  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    permissionState,
    error,
    frequencyData,
    audioLevel,
    start,
    stop,
    reset,
    setTranscript: setTranscriptManually,
    transcribe,
    isTranscribing,
    isMobileMode: false, // Deepgram is real-time streaming on ALL platforms
    recordingDuration,
    connectionStatus,
    finalTranscript,
    debugInfo,
    recognitionMode: connectionStatus === "connected" ? "deepgram" : "idle",
  };
}
