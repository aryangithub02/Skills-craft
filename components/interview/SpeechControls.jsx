"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, RefreshCw, Loader2 } from "lucide-react";

/**
 * SpeechControls
 * Compact mic start/stop toggle button with permission feedback.
 * Adapts to mobile vs desktop speech recognition mode.
 *
 * Props:
 *   isListening     - boolean
 *   isMicOn         - boolean (hardware mute state)
 *   permissionState - "prompt" | "granted" | "denied"
 *   isSupported     - boolean (Web Speech API available)
 *   isMobileMode    - boolean (using MediaRecorder instead of Web Speech)
 *   isTranscribing  - boolean (transcription in progress — mobile only)
 *   onStart         - () => void
 *   onStop          - () => void
 *   onToggleMic     - () => void  (mute/unmute the mic track)
 *   className       - extra classes
 */
export function SpeechControls({
  isListening = false,
  isMicOn = true,
  permissionState = "prompt",
  isSupported = true,
  isMobileMode = false,
  isTranscribing = false,
  onStart,
  onStop,
  onToggleMic,
  className = "",
}) {
  const handleVoiceCapture = () => {
    if (isTranscribing) return;
    if (isListening) {
      onStop?.();
    } else {
      if (!isMicOn) onToggleMic?.();
      onStart?.();
    }
  };

  const denied = permissionState === "denied";

  const micBtnClass = isMicOn
    ? "bg-slate-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-950/40 shadow-emerald-950/40"
    : "bg-rose-950/90 border-rose-500/80 text-rose-200 hover:bg-rose-900 shadow-rose-950/60 animate-pulse";

  const captureBtnClass = isTranscribing
    ? "bg-amber-600 border-amber-400 text-white shadow-amber-950/50"
    : isListening
    ? "bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-400 text-white shadow-indigo-950/60"
    : "bg-slate-950/80 border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/40 shadow-indigo-950/40";

  return (
    <div className={"flex items-center gap-2.5 sm:gap-3 flex-wrap " + className}>
      {/* Mobile mode indicator badge */}
      {isMobileMode && (
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-medium backdrop-blur-md">
          <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
          <span>Universal Mobile Engine Active</span>
        </div>
      )}

      {/* Mute/Unmute hardware mic button */}
      <Button
        type="button"
        variant="outline"
        onClick={onToggleMic}
        disabled={isTranscribing}
        title={isMicOn ? "Mute microphone" : "Unmute microphone"}
        className={"h-11 sm:h-12 px-4 sm:px-5 rounded-full border backdrop-blur-xl transition-all flex items-center gap-2 shadow-xl " + micBtnClass}
      >
        {isMicOn ? (
          <div className="relative flex items-center justify-center">
            <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <Mic className="w-4 h-4 text-emerald-400 relative z-10" />
          </div>
        ) : (
          <MicOff className="w-4 h-4 text-rose-400" />
        )}
        <span className="text-xs font-bold hidden xs:inline">{isMicOn ? "Mic ON" : "Mic MUTED"}</span>
      </Button>

      {/* Start / Stop Voice Capture Button */}
      {isSupported && !denied && (
        <Button
          type="button"
          onClick={handleVoiceCapture}
          disabled={isTranscribing}
          className={"h-11 sm:h-12 px-5 sm:px-6 rounded-full border backdrop-blur-xl transition-all flex items-center gap-2.5 shadow-xl text-xs font-bold tracking-wide " + captureBtnClass}
        >
          {isTranscribing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
              <span>AI Transcribing...</span>
            </>
          ) : isListening ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <span>{isMobileMode ? "Stop & Transcribe" : "Stop Voice Capture"}</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-indigo-300 animate-pulse" />
              <span>{isMobileMode ? "Start Recording Voice" : "Start Voice Capture"}</span>
            </>
          )}
        </Button>
      )}

      {denied && (
        <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <MicOff className="w-3.5 h-3.5" />
          <span>Microphone access blocked — type answer</span>
        </div>
      )}
    </div>
  );
}
