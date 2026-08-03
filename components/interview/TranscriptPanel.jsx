"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Copy, Trash2, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * TranscriptPanel
 * Displays live final + interim transcript with edit/clear/copy support.
 * Adapts to mobile mode (shows recording state instead of interim text).
 *
 * Props:
 *   transcript        - final transcript string
 *   interimTranscript - partial/interim transcript from recognizer
 *   isListening       - boolean
 *   isMicOn           - boolean
 *   isMobileMode      - boolean (using MediaRecorder, no real-time STT)
 *   isTranscribing    - boolean (API call in progress — mobile only)
 *   recordingDuration - number (seconds elapsed — mobile only)
 *   onChange          - (text: string) => void — user edits
 *   onClear           - () => void
 */

export function TranscriptPanel({
  transcript = "",
  interimTranscript = "",
  audioUrl = "",
  isListening = false,
  isMicOn = true,
  isMobileMode = false,
  isTranscribing = false,
  recordingDuration = 0,
  onChange,
  onClear,
}) {
  const handleCopy = () => {
    const text = transcript || interimTranscript;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => toast.success("Transcript copied!")).catch(() => {});
  };

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const placeholder = !isMicOn
    ? "Microphone is muted — unmute to speak or type your response..."
    : isTranscribing
    ? "Saving your recorded voice answer..."
    : isListening
    ? "Recording your voice response... Speak clearly into your microphone"
    : "Click 'Start Voice Capture' to record your response, or type your answer here...";

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-[#E5E7EB] dark:border-slate-800 rounded-3xl p-5 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] space-y-3 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#E6F4EA] rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-[#4B5563] dark:text-slate-300">
        <span className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#3F7D58]" />
          <span className="font-bold text-[#111827] dark:text-slate-100 tracking-wide font-sans-ui">
            Voice Recording & Live Transcript
          </span>
          {isListening && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#E6F4EA] border border-[#22C55E]/40 text-[#3F7D58] text-[10px] font-bold tracking-wider animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
              RECORDING VOICE ({formatDuration(recordingDuration)})
            </span>
          )}
          {isTranscribing && (
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin text-[#3B82F6]" /> Processing
            </span>
          )}
        </span>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            disabled={!transcript && !interimTranscript}
            className="h-7 px-2.5 text-slate-600 dark:text-slate-300 hover:bg-[#E6F4EA] rounded-xl transition-all"
            title="Copy transcript"
          >
            <Copy className="w-3.5 h-3.5 mr-1 text-[#3F7D58]" />
            <span className="text-[11px] font-medium">Copy</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onClear}
            disabled={!transcript && !interimTranscript}
            className="h-7 px-2.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            title="Clear transcript"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            <span className="text-[11px] font-medium">Clear</span>
          </Button>
        </div>
      </div>

      {/* Editable textarea */}
      <div className="relative">
        <textarea
          value={transcript}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#F8FBF8] dark:bg-slate-950/60 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl p-4 text-sm text-[#111827] dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#3F7D58] focus:ring-2 focus:ring-[#3F7D58]/20 resize-none min-h-[5.5rem] leading-relaxed transition-all font-sans-ui"
        />
        {/* Mobile overlay indicator */}
        {isMobileMode && isListening && !transcript && !interimTranscript && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none p-3">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E6F4EA] border border-[#22C55E] text-[#111827] text-xs font-semibold backdrop-blur-md shadow-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping" />
              Recording voice... Speak now
            </div>
          </div>
        )}
      </div>

      {/* Live / Interim text display */}
      {interimTranscript && (
        <div className="p-3 rounded-2xl bg-[#E6F4EA] dark:bg-emerald-950/40 border border-[#B1D3B9] text-xs text-[#111827] flex items-start gap-2.5 animate-pulse shadow-sm">
          <span className="shrink-0 font-extrabold text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#3F7D58] text-white mt-0.5">
            AI Streaming
          </span>
          <p className="break-words font-medium text-[#111827] dark:text-slate-100 leading-relaxed italic">
            &ldquo;{interimTranscript}&rdquo;
          </p>
        </div>
      )}

      {audioUrl && (
        <div className="p-3 rounded-2xl bg-[#E6F4EA]/60 border border-[#B1D3B9]/60 text-xs text-[#111827] space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-[10px] uppercase tracking-wider text-[#3F7D58]">
              Saved Voice Playback
            </span>
            <span className="text-[10px] text-[#4B5563] font-mono">Audio Ready</span>
          </div>
          <audio controls src={audioUrl} className="w-full h-8 rounded-lg outline-none" />
        </div>
      )}

      {/* Status line */}
      <div className="text-[11px] text-[#4B5563] dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800 font-sans-ui">
        <span>
          {isTranscribing
            ? "Saving voice recording..."
            : audioUrl || transcript
            ? "Voice response recorded & saved"
            : "Awaiting speech input..."}
        </span>
        {isListening && (
          <span className="text-[#22C55E] font-bold animate-pulse">Microphone Active</span>
        )}
      </div>
    </div>
  );
}
