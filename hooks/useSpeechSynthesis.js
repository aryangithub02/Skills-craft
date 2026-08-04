"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useSpeechSynthesis
 * Production-ready TTS hook wrapping the browser SpeechSynthesis API.
 * - Auto-selects best voice (female English preferred, mobile-friendly)
 * - Configurable rate, pitch, volume
 * - isSpeaking state, onStart/onEnd callbacks
 * - Full cleanup on unmount
 */
export function useSpeechSynthesis({
  rate = 1.0,
  pitch = 1.05,
  volume = 1.0,
  lang = "en-US",
  onStart,
  onEnd,
  onBoundary,
} = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [spokenCharIndex, setSpokenCharIndex] = useState(-1);
  const [isSupported, setIsSupported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window
  );
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);
  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);
  const onBoundaryRef = useRef(onBoundary);

  useEffect(() => { onStartRef.current = onStart; }, [onStart]);
  useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);
  useEffect(() => { onBoundaryRef.current = onBoundary; }, [onBoundary]);

  // Load available voices (async on Chrome)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth) return;

    const loadVoices = () => {
      const v = synth.getVoices();
      if (v.length) setVoices(v);
    };
    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);

    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
      synth.cancel();
    };
  }, []);

  // Pick best voice from available list
  const selectVoice = useCallback((voiceList) => {
    if (!voiceList.length) return null;
    const preferred = [
      "Google US English",
      "Samantha",
      "Karen",
      "Moira",
      "Victoria",
      "en-US",
      "en-GB",
    ];
    for (const name of preferred) {
      const match = voiceList.find(
        (v) =>
          v.name.toLowerCase().includes(name.toLowerCase()) ||
          v.lang.toLowerCase().includes(name.toLowerCase())
      );
      if (match) return match;
    }
    return voiceList.find((v) => v.lang.startsWith("en")) || voiceList[0];
  }, []);

  const speak = useCallback((text) => {
    if (!text || typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth) return;

    synth.cancel();
    setCurrentWord("");
    setSpokenCharIndex(-1);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    const chosenVoice = selectVoice(voices.length ? voices : synth.getVoices());
    if (chosenVoice) utterance.voice = chosenVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      console.log("[TTS] Speaking:", text.substring(0, 60));
      onStartRef.current?.();
    };

    utterance.onboundary = (event) => {
      if (event.name === "word" || event.charIndex !== undefined) {
        const charIdx = event.charIndex;
        const charLength = event.charLength || (
          text.slice(charIdx).search(/\s/) !== -1 
            ? text.slice(charIdx).search(/\s/) 
            : text.length - charIdx
        );
        const word = text.slice(charIdx, charIdx + charLength).trim();
        if (word) {
          setCurrentWord(word);
          setSpokenCharIndex(charIdx);
          onBoundaryRef.current?.({ word, charIndex: charIdx, charLength });
        }
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentWord("");
      setSpokenCharIndex(-1);
      console.log("[TTS] Speech complete.");
      onEndRef.current?.();
    };

    utterance.onerror = (e) => {
      if (e.error === "interrupted" || e.error === "canceled") return;
      console.warn("[TTS] Error:", e.error);
      setIsSpeaking(false);
      setCurrentWord("");
      setSpokenCharIndex(-1);
      onEndRef.current?.();
    };

    utteranceRef.current = utterance;

    // Chrome bug workaround: delay speak invocation
    setTimeout(() => { synth.speak(utterance); }, 50);
  }, [lang, rate, pitch, volume, voices, selectVoice]);

  const cancel = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setCurrentWord("");
    setSpokenCharIndex(-1);
  }, []);

  return { speak, cancel, isSpeaking, currentWord, spokenCharIndex, isSupported, voices };
}
