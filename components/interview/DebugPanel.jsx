"use client";

import React, { useState } from "react";
import { Bug, X, RefreshCw, Smartphone, Monitor, Wifi, Mic, Cpu } from "lucide-react";

/**
 * DebugPanel
 *
 * Development-only panel that shows real-time speech recognition diagnostics.
 * Displays browser/platform info, recognition state, events, errors,
 * and which engine (SpeechRecognition vs MediaRecorder) is active.
 *
 * Only renders when NODE_ENV === "development".
 *
 * Props:
 *   debugInfo – object from useSpeechRecognition() hook
 *   isListening – boolean
 *   isTranscribing – boolean
 *   error – string | null
 *   recordingDuration – number
 */
export function DebugPanel({
  debugInfo = {},
  isListening = false,
  isTranscribing = false,
  error = null,
  recordingDuration = 0,
}) {
  const [isOpen, setIsOpen] = useState(true);

  // Only show in development
  if (typeof process === "undefined" || process.env.NODE_ENV !== "development") {
    return null;
  }

  if (!isOpen) return null;

  const {
    platform = "unknown",
    browserSR = false,
    mediaRecorder = false,
    currentEvent = "",
    lastError = null,
    srRetries = 0,
    srRestarts = 0,
    fallbacksToMediaRecorder = 0,
    audioActive = false,
    mode = "idle",
  } = debugInfo;

  const platformIcon = platform === "android" || platform === "ios"
    ? <Smartphone className="w-3.5 h-3.5" />
    : <Monitor className="w-3.5 h-3.5" />;

  const engineLabel = mode === "browser-sr"
    ? "Web Speech API"
    : mode === "media-recorder"
    ? "MediaRecorder → FastAPI"
    : "Idle";

  const engineColor = mode === "browser-sr"
    ? "text-emerald-400"
    : mode === "media-recorder"
    ? "text-amber-400"
    : "text-slate-500";

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-[320px] bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden text-[11px] font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
        <span className="flex items-center gap-1.5 text-indigo-400 font-semibold text-[10px] uppercase tracking-wider">
          <Bug className="w-3 h-3" />
          STT Debug
        </span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-600 hover:text-slate-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-2.5 max-h-[400px] overflow-y-auto">
        {/* Platform Row */}
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-500 flex items-center gap-1">
            {platformIcon} Platform
          </span>
          <span className="font-semibold capitalize">{platform}</span>
        </div>

        {/* Capabilities */}
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-500 flex items-center gap-1">
            <Mic className="w-3 h-3" /> SR API
          </span>
          <span className={browserSR ? "text-emerald-400" : "text-rose-400"}>
            {browserSR ? "Available" : "Unavailable"}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-500 flex items-center gap-1">
            <Cpu className="w-3 h-3" /> MediaRec
          </span>
          <span className={mediaRecorder ? "text-emerald-400" : "text-rose-400"}>
            {mediaRecorder ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/60" />

        {/* Engine */}
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Active Engine</span>
          <span className={`font-bold ${engineColor}`}>{engineLabel}</span>
        </div>

        {/* Mode State */}
        <div className="flex items-center justify-between">
          <span className="text-slate-500">State</span>
          <span className={`flex items-center gap-1 ${
            isListening
              ? "text-emerald-400"
              : isTranscribing
              ? "text-amber-400"
              : "text-slate-500"
          }`}>
            {isListening && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            {isTranscribing && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
            {isListening ? "Listening" : isTranscribing ? "Transcribing" : "Idle"}
          </span>
        </div>

        {/* Current Event */}
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Last Event</span>
          <span className="text-indigo-300 truncate max-w-[160px]" title={currentEvent}>
            {currentEvent || "—"}
          </span>
        </div>

        {/* Audio Active */}
        <div className="flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1">
            <Wifi className="w-3 h-3" /> Audio Active
          </span>
          <span className={audioActive ? "text-emerald-400" : "text-slate-500"}>
            {audioActive ? "Yes" : "No"}
          </span>
        </div>

        {/* Recording Duration */}
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Duration</span>
          <span className="text-slate-300">{recordingDuration}s</span>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center justify-between">
            <span className="text-rose-400">Error</span>
            <span className="text-rose-300 truncate max-w-[180px]" title={error}>
              {error}
            </span>
          </div>
        )}

        {/* Divider */}
        {(srRetries > 0 || srRestarts > 0 || fallbacksToMediaRecorder > 0) && (
          <div className="border-t border-slate-800/60" />
        )}

        {/* SR Retries */}
        {srRetries > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> SR Retries
            </span>
            <span className="text-amber-400">{srRetries}</span>
          </div>
        )}

        {/* SR Restarts */}
        {srRestarts > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">SR Restarts</span>
            <span className="text-indigo-400">{srRestarts}</span>
          </div>
        )}

        {/* Fallbacks */}
        {fallbacksToMediaRecorder > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">→ MR Fallbacks</span>
            <span className="text-amber-400">{fallbacksToMediaRecorder}</span>
          </div>
        )}
      </div>
    </div>
  );
}
