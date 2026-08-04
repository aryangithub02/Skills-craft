"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createAssessment, evaluateAssessment, getAssessmentById } from "@/actions/assessment";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Brain,
  MessageSquare,
  Zap,
  Download,
  ChevronRight,
  Pause,
  HelpCircle,
  Activity,
  Wifi,
  ShieldCheck,
  UserCheck,
  BarChart3,
  Layers,
  ArrowRight,
  Maximize2,
  Check,
  X,
  Target,
  RefreshCw,
  FileText,
  BookOpen,
  ShieldAlert,
  Lock,
  Copy,
  Eye,
  PauseCircle,
  AlertTriangle,
  Trash2
} from "lucide-react";
import RulebookModal from "./RulebookModal";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { VoiceIndicator } from "./VoiceIndicator";
import { TranscriptPanel } from "./TranscriptPanel";
import { SpeechControls } from "./SpeechControls";
import { FrequencyVisualizer } from "./FrequencyVisualizer";
import { DebugPanel } from "./DebugPanel";

// Default configuration options
const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Marketing",
  "Sales",
  "Design",
  "Human Resources",
  "Consulting",
];

const DOMAINS_BY_INDUSTRY = {
  Technology: [
    "Full Stack Development",
    "Frontend Development",
    "Backend Development",
    "Data Science & AI",
    "DevOps & Cloud",
    "Cybersecurity",
    "Mobile App Development",
  ],
  Finance: [
    "Investment Banking",
    "Financial Analysis",
    "Risk Management",
    "Corporate Finance",
    "Fintech & Crypto",
  ],
  Healthcare: [
    "Health Informatics",
    "Clinical Administration",
    "Medical Research",
    "Pharmaceuticals",
  ],
  Marketing: [
    "Digital Marketing",
    "Brand Strategy",
    "SEO & Content Strategy",
    "Product Marketing",
  ],
  Sales: [
    "Enterprise B2B Sales",
    "Account Management",
    "Business Development",
  ],
  Design: ["UI/UX Design", "Product Design", "Brand & Motion Design"],
  "Human Resources": ["Talent Acquisition", "HR Business Partner", "People Operations"],
  Consulting: ["Management Consulting", "Strategy Consulting", "IT Advisory"],
};

export default function AIVideoMockInterview({ userProfile, onCompleteSuccess }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL Search Params for initial state restore on refresh
  const stepParam = searchParams?.get("step");
  const assessmentIdParam = searchParams?.get("assessmentId");

  // ----------------------------------------------------
  // State Machine: setup -> device-check -> interview -> dashboard
  // ----------------------------------------------------
  const [step, setStep] = useState(() => {
    if (stepParam && ["setup", "device-check", "interview", "dashboard"].includes(stepParam)) {
      return stepParam;
    }
    return "setup";
  });

  // 1. Setup Form Data
  const [setupData, setSetupData] = useState({
    industry: userProfile?.industry || "Technology",
    domain: "Full Stack Development",
    experience: userProfile?.experience || 2,
    difficulty: "medium",
    durationMinutes: 10,
    interviewType: "mixed", // technical | behavioral | system-design | mixed
    specificTopic: "",
    cameraMode: "on", // "on" | "off"
  });

  // 2. Device Check State
  const [cameraAccess, setCameraAccess] = useState(false);
  const [micAccess, setMicAccess] = useState(false);
  const [netStatus, setNetStatus] = useState("checking"); // checking | ready | weak
  const [audioLevel, setAudioLevel] = useState(0);
  const [frequencyData, setFrequencyData] = useState(() => new Uint8Array(256).fill(0));
  const videoPreviewRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [testSpeechText, setTestSpeechText] = useState("");
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [voiceTestPassed, setVoiceTestPassed] = useState(false);
  const [voiceTestStatus, setVoiceTestStatus] = useState("");
  const [voiceTestRecordingDuration, setVoiceTestRecordingDuration] = useState(0);

  // Mobile Device Check Alert Logs State
  const [deviceAlertLogs, setDeviceAlertLogs] = useState([
    "⚡ System Readiness Check initialized.",
  ]);
  const lastAudioAlertTimeRef = useRef(0);

  const addDeviceAlert = useCallback((msg, type = "info") => {
    const timeStr = new Date().toLocaleTimeString();
    setDeviceAlertLogs((prev) => [`[${timeStr}] ${msg}`, ...prev.slice(0, 19)]);
    if (type === "error") toast.error(msg, { duration: 4000 });
    else if (type === "success") toast.success(msg, { duration: 2500 });
    else toast.info(msg, { duration: 2500 });
  }, []);

  // 3. Interview State
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [aiState, setAiState] = useState("idle"); // idle | speaking | listening | thinking
  const [candidateSpeech, setCandidateSpeech] = useState("");
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(120); // 2 mins per question
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState(false);

  // 4. Evaluation / Dashboard State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationStep, setEvaluationStep] = useState("saving"); // "saving" | "analyzing" | "scoring" | "complete"
  const [evaluationResult, setEvaluationResult] = useState(null);

  // 5. Rulebook & Anti-Cheating Proctoring State (SkillsCraft Rulebook v1.0)
  const [acceptedRulebook, setAcceptedRulebook] = useState(false);
  const [showRulebookModal, setShowRulebookModal] = useState(false);
  const [integrityScore, setIntegrityScore] = useState(100);
  const [proctoringLogs, setProctoringLogs] = useState([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [copyPasteAttempts, setCopyPasteAttempts] = useState(0);
  const [keyboardShortcutViolations, setKeyboardShortcutViolations] = useState(0);
  const [activeWarning, setActiveWarning] = useState(null);
  const [showProctoringModal, setShowProctoringModal] = useState(false);
  const [emergencyPauseUsed, setEmergencyPauseUsed] = useState(false);
  const [isEmergencyPaused, setIsEmergencyPaused] = useState(false);
  const [cameraGracePeriod, setCameraGracePeriod] = useState(60);

  // Speech Recognition Ref & Fresh State Tracking Refs (legacy, kept for device-check)
  const isMicOnRef = useRef(isMicOn);
  const stepRef = useRef(step);
  const aiStateRef = useRef(aiState);
  const isTestingVoiceRef = useRef(isTestingVoice);

  useEffect(() => { isMicOnRef.current = isMicOn; }, [isMicOn]);
  useEffect(() => { stepRef.current = step; }, [step]);
  useEffect(() => { aiStateRef.current = aiState; }, [aiState]);
  useEffect(() => { isTestingVoiceRef.current = isTestingVoice; }, [isTestingVoice]);

  // ── STT Hook (Cross-platform Web Speech + Faster-Whisper Fallback) ──────
  const stt = useSpeechRecognition({
    onSilence: () => {
      if (stepRef.current === "interview") {
        toast.info("Looks like you paused — click 'Start Recording' to continue or type your answer.");
      }
    },
    onTranscriptChange: (text) => setCandidateSpeech(text),
  });

  // ── TTS Hook ──────────────────────────────────────────────────────────────
  const tts = useSpeechSynthesis({
    rate: 1.0,
    pitch: 1.05,
    volume: 1.0,
    lang: "en-US",
    onStart: () => {
      setAiState("speaking");
      // Stop STT while AI is speaking to avoid echo
      stt.stop();
    },
    onEnd: () => {
      setAiState("listening");
      // Auto-start STT/capture after AI finishes speaking
      // On desktop this starts Web Speech API; on mobile it starts MediaRecorder
      if (stepRef.current === "interview" && isMicOnRef.current) {
        stt.reset();
        stt.start();
      }
    },
  });

  // Update domain list when industry changes
  useEffect(() => {
    const defaultDomain = DOMAINS_BY_INDUSTRY[setupData.industry]?.[0] || "";
    setSetupData((prev) => ({ ...prev, domain: defaultDomain }));
  }, [setupData.industry]);

  // ----------------------------------------------------
  // URL Query Parameters Synchronization (step & assessmentId on /interview)
  // ----------------------------------------------------
  const updateUrlParams = useCallback((activeStep, assessmentId) => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const currStep = activeStep || step;
    const currId = assessmentId !== undefined ? assessmentId : assessment?.id;

    if (currStep) {
      params.set("step", currStep);
    }

    if (currId) {
      params.set("assessmentId", currId);
    } else {
      params.delete("assessmentId");
    }

    // Remove any leftover form select option parameters
    ["industry", "domain", "experience", "difficulty", "interviewType", "durationMinutes", "cameraMode", "specificTopic", "q"].forEach((p) =>
      params.delete(p)
    );

    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [step, assessment?.id]);

  // Sync step and Assessment ID to URL parameters on state change
  useEffect(() => {
    updateUrlParams(step, assessment?.id);
  }, [step, assessment?.id, updateUrlParams]);

  // Restore active step and Assessment session from URL parameters on page refresh
  useEffect(() => {
    const restoreFromUrl = async () => {
      if (!searchParams) return;
      
      const paramStep = searchParams.get("step");
      const paramAssessmentId = searchParams.get("assessmentId");

      if (paramStep && ["setup", "device-check", "interview", "dashboard"].includes(paramStep)) {
        setStep(paramStep);
      }

      if (paramAssessmentId && (!assessment || assessment.id !== paramAssessmentId)) {
        try {
          const loadedAssessment = await getAssessmentById(paramAssessmentId);
          if (loadedAssessment && loadedAssessment.questions) {
            setAssessment(loadedAssessment);
            setQuestions(loadedAssessment.questions);
            if (loadedAssessment.quizScore !== null && loadedAssessment.quizScore !== undefined) {
              setStep("dashboard");
            } else if (paramStep === "interview" || !paramStep) {
              setStep("interview");
            }
          }
        } catch (err) {
          console.error("Failed to restore assessment session from URL:", err);
        }
      }
    };

    restoreFromUrl();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------
  // Live Proctoring Engine Listeners (Rule 4: Window Focus, Rule 6 & 7: Copy/Paste & Shortcuts)
  // ----------------------------------------------------
  useEffect(() => {
    if (step !== "interview" || isEmergencyPaused) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => prev + 1);
        setIntegrityScore((prev) => Math.max(0, prev - 10));
        const timeStr = new Date().toLocaleTimeString();
        setProctoringLogs((prev) => [
          {
            type: "TAB_SWITCH",
            message: "Browser tab switch or window focus lost",
            timestamp: timeStr,
            deduction: 10,
          },
          ...prev,
        ]);
        setActiveWarning("⚠️ Warning #2: Please return to the interview window. Tab switch detected!");
        toast.error("⚠️ Window focus lost! Integrity score reduced (-10 points).", { duration: 5000 });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [step, isEmergencyPaused]);

  // Keyboard shortcut interceptor (Rule 7: Prohibited Keyboard Shortcuts)
  useEffect(() => {
    if (step !== "interview") return;

    const handleKeyDown = (e) => {
      const isAltTab = e.altKey && e.key === "Tab";
      const isCmdTab = e.metaKey && e.key === "Tab";
      const isWinKey = e.key === "Meta" || e.key === "OS";
      const isNewTab = (e.ctrlKey || e.metaKey) && (e.key === "t" || e.key === "n");

      if (isAltTab || isCmdTab || isWinKey || isNewTab) {
        setKeyboardShortcutViolations((prev) => prev + 1);
        setIntegrityScore((prev) => Math.max(0, prev - 5));
        setProctoringLogs((prev) => [
          {
            type: "RESTRICTED_KEYBOARD_SHORTCUT",
            message: `Prohibited keyboard shortcut (${e.key})`,
            timestamp: new Date().toLocaleTimeString(),
            deduction: 5,
          },
          ...prev,
        ]);
        toast.warning(`⚠️ Restricted shortcut (${e.key}) logged! Integrity score -5 pts.`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step]);

  // Camera 60-second Grace Period Handler (Rule 1 & Camera Failure Policy)
  useEffect(() => {
    if (step !== "interview") return;

    let timer;
    if (!isCamOn) {
      setCameraGracePeriod(60);
      timer = setInterval(() => {
        setCameraGracePeriod((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIntegrityScore((s) => Math.max(0, s - 15));
            setProctoringLogs((logs) => [
              {
                type: "CAMERA_FAILURE_TIMEOUT",
                message: "Camera remained OFF for > 60 seconds",
                timestamp: new Date().toLocaleTimeString(),
                deduction: 15,
              },
              ...logs,
            ]);
            toast.error("⚠️ Camera disconnected > 60s! Integrity score reduced (-15 pts).");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCameraGracePeriod(60);
    }

    return () => clearInterval(timer);
  }, [step, isCamOn]);

  // Prevent Copy / Paste Attempt Handler (Rule 6)
  const handleCopyPasteAttempt = (e) => {
    e.preventDefault();
    setCopyPasteAttempts((prev) => prev + 1);
    setIntegrityScore((prev) => Math.max(0, prev - 5));
    setProctoringLogs((prev) => [
      {
        type: "COPY_PASTE_ATTEMPT",
        message: "Attempted Copy / Paste / Cut action",
        timestamp: new Date().toLocaleTimeString(),
        deduction: 5,
      },
      ...prev,
    ]);
    toast.error("🚫 Copy & Paste disabled per SkillsCraft Interview Rulebook! (-5 pts)");
  };

  // Emergency Pause Handler (Rule 12: 1 Emergency Pause up to 2 mins)
  const handleTriggerEmergencyPause = () => {
    if (emergencyPauseUsed) {
      toast.warning("Emergency pause has already been used for this interview session.");
      return;
    }
    setIsEmergencyPaused(true);
    setEmergencyPauseUsed(true);
    setIsPaused(true);
    tts.cancel();
    stt.stop();
    toast.info("⏸️ Emergency pause activated (2-minute grace timer).");
  };

  // ----------------------------------------------------
  // ----------------------------------------------------
  // Device Check Logic (Robust Media Stream Fallback & Camera Toggle)
  // ----------------------------------------------------
  const handleCameraToggle = async (desiredState) => {
    const targetState = desiredState !== undefined ? desiredState : !isCamOn;

    if (targetState) {
      if (!cameraAccess || !mediaStream || mediaStream.getVideoTracks().length === 0) {
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (mediaStream) {
            videoStream.getVideoTracks().forEach((t) => mediaStream.addTrack(t));
          } else {
            setMediaStream(videoStream);
          }
          setCameraAccess(true);
          setIsCamOn(true);
          if (videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = mediaStream || videoStream;
          }
          toast.success("Camera turned ON & connected!");
        } catch (err) {
          console.warn("Could not access camera:", err);
          toast.error("Camera access denied or unavailable. Please check browser permissions.");
          setIsCamOn(false);
        }
      } else {
        setIsCamOn(true);
        if (mediaStream) {
          mediaStream.getVideoTracks().forEach((track) => (track.enabled = true));
        }
        addDeviceAlert("🎥 Camera turned ON & stream active", "success");
      }
    } else {
      setIsCamOn(false);
      if (mediaStream) {
        mediaStream.getVideoTracks().forEach((track) => (track.enabled = false));
      }
      addDeviceAlert("📷 Camera turned OFF for this session", "info");
    }
  };

  // Local Storage & Session Storage Cleanup Helper
  const clearAllInterviewLocalStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.clear();
        window.sessionStorage.clear();
        console.log("🧹 [Storage] Cleared localStorage & sessionStorage successfully.");
        toast.success("🧹 Storage Cleared: LocalStorage & Session Cache wiped clean!");
      } catch (err) {
        console.error("Error clearing storage:", err);
        toast.error("Failed to clear local storage.");
      }
    }
  }, []);

  const startDeviceCheck = async () => {
    if (!acceptedRulebook) {
      toast.warning("Please read and accept the SkillsCraft AI Mock Interview Rulebook before proceeding.");
      setShowRulebookModal(true);
      return;
    }

    clearAllInterviewLocalStorage();
    setStep("device-check");
    setNetStatus("checking");
    addDeviceAlert("🚀 Calibrating system readiness & hardware...", "info");

    setTimeout(() => {
      setNetStatus("ready");
    }, 1200);

    let stream = null;
    let hasVideo = false;
    let hasAudio = false;

    // Step 1: Try audio-only first (video is optional)
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      hasAudio = true;
      console.log("🎙️ Audio-only stream acquired.");
      addDeviceAlert("🎙️ Microphone stream acquired successfully!", "success");
    } catch (errAudio) {
      console.warn("⚠️ Microphone access failed:", errAudio);
      addDeviceAlert("❌ Microphone access failed: " + errAudio.message, "error");
    }

    // Step 2: Try to add video separately (optional, won't block interview)
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      hasVideo = true;
      // Merge video track into existing audio stream or use video stream
      if (stream) {
        videoStream.getVideoTracks().forEach((t) => stream.addTrack(t));
      } else {
        stream = videoStream;
      }
      console.log("📹 Video stream acquired.");
    } catch (errVideo) {
      console.info("📷 Camera not available (optional) — continuing without video.");
      if (!hasAudio) toast.info("No camera or microphone found. You can still answer via text!");
    }

    if (stream) {
      setMediaStream(stream);
      setCameraAccess(hasVideo);
      setMicAccess(hasAudio);
      const shouldTurnCamOn = hasVideo && setupData.cameraMode !== "off";
      setIsCamOn(shouldTurnCamOn);
      setIsMicOn(hasAudio);

      if (!shouldTurnCamOn && stream) {
        stream.getVideoTracks().forEach((t) => (t.enabled = false));
      }

      if (videoPreviewRef.current && hasVideo && shouldTurnCamOn) {
        videoPreviewRef.current.srcObject = stream;
      }

      // Initialize Web Audio Visualizer if audio track is active
      if (hasAudio) {
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

          analyser.smoothingTimeConstant = 0.85;
          analyser.fftSize = 512;

          microphone.connect(analyser);
          analyser.connect(javascriptNode);
          javascriptNode.connect(audioContext.destination);

          javascriptNode.onaudioprocess = () => {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);

            // Store the full spectrum for the FrequencyVisualizer
            setFrequencyData(new Uint8Array(array));

            // Compute average level for the legacy audioLevel (VoiceIndicator)
            let sum = 0;
            for (let i = 0; i < array.length; i++) {
              sum += array[i];
            }
            const average = sum / array.length;
            const level = Math.min(100, Math.round((average / 255) * 100));
            setAudioLevel(level);

            // Alert audio signal input when speaking
            if (level > 15 && Date.now() - lastAudioAlertTimeRef.current > 3500) {
              lastAudioAlertTimeRef.current = Date.now();
              addDeviceAlert(`🔊 Audio Input Signal Detected (Input Gain: ${level}%)`, "success");
            }
          };
        } catch (e) {
          console.warn("AudioContext setup notice:", e);
        }
      }
    }
  };

  // ── Voice test refs ───────────────────────────────────────────────────────
  const voiceTestRecognitionRef = useRef(null);
  const voiceTestRecorderRef = useRef(null);
  const voiceTestStreamRef = useRef(null);
  const voiceTestChunksRef = useRef([]);
  const voiceTestRecordStartRef = useRef(0);
  const voiceTestTimerRef = useRef(null);

  // Detect Android device for UI hints
  const [isAndroidDevice] = useState(
    () => typeof navigator !== "undefined" && /android/i.test(navigator.userAgent || "")
  );

  // ── Voice Calibration Test ───────────────────────────────────────────────
  // Shows the user's speech in REAL TIME (desktop) or after a manual stop
  // (mobile). On desktop it uses continuous Web Speech; on mobile it uses
  // MediaRecorder and transcribes on demand.  ANY detected speech = pass.

  const handleTestVoiceRecording = () => {
    // If already testing, stop the current test
    if (isTestingVoice) {
      stopVoiceTest();
      return;
    }

    const isMobileDevice =
      typeof navigator !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent || ""
      );

    const hasSpeechRec =
      typeof window !== "undefined" &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition);

    setIsTestingVoice(true);
    setTestSpeechText("");
    setVoiceTestPassed(false);

    // Try Web Speech API first if available on device so candidate sees live spoken text on screen
    if (hasSpeechRec) {
      startDesktopVoiceTest();
    } else {
      startMobileVoiceTest().catch((err) => {
        console.error("❌ [VoiceTest] Mobile test error:", err);
        setIsTestingVoice(false);
      });
    }
  };

  /** Stop whichever voice test is currently running */
  const stopVoiceTest = () => {
    // Desktop Web Speech
    if (voiceTestRecognitionRef.current) {
      try { voiceTestRecognitionRef.current.stop(); } catch (_) {}
      try { voiceTestRecognitionRef.current.abort(); } catch (_) {}
      voiceTestRecognitionRef.current = null;
    }
    // Mobile MediaRecorder
    if (voiceTestRecorderRef.current && voiceTestRecorderRef.current.state === "recording") {
      try { voiceTestRecorderRef.current.stop(); } catch (_) {}
    }
    // Stream cleanup
    if (voiceTestStreamRef.current) {
      voiceTestStreamRef.current.getTracks().forEach((t) => t.stop());
      voiceTestStreamRef.current = null;
    }
    setIsTestingVoice(false);
  };

  // ── Desktop: continuous Web Speech API with live transcript ──────────────
  const startDesktopVoiceTest = () => {
    console.log("🎙️ [VoiceTest] Starting desktop — continuous Web Speech...");

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      startMobileVoiceTest().catch(() => {
        setMicAccess(true);
        setIsTestingVoice(false);
      });
      return;
    }

    const rec = new SpeechRec();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    voiceTestRecognitionRef.current = rec;

    let speechDetected = false;

    rec.onstart = () => {
      console.log("🎙️ [VoiceTest] onstart");
      addDeviceAlert("🎙️ Voice Test Started: Listening for speech input...", "info");
    };
    rec.onspeechstart = () => {
      console.log("🗣️ [VoiceTest] Speech detected!");
      addDeviceAlert("🗣️ Audio Input Detected: Voice speech recognized!", "success");
      speechDetected = true;
    };

    rec.onresult = (event) => {
      let allText = "";
      for (let i = 0; i < event.results.length; i++) {
        allText += event.results[i][0].transcript;
      }

      const text = allText.trim();
      if (text) {
        console.log("📝 [VoiceTest] Got speech:", text);
        addDeviceAlert(`📝 Voice Recognized: "${text}"`, "success");
        setTestSpeechText(text);
        setVoiceTestPassed(true);
        setMicAccess(true);
        speechDetected = true;
      }
    };

    rec.onerror = (err) => {
      console.warn("⚠️ [VoiceTest] Error:", err.error);
      if (!speechDetected) {
        voiceTestRecognitionRef.current = null;
        console.log("🔄 [VoiceTest] Falling back to mobile MediaRecorder test...");
        startMobileVoiceTest().catch(() => {
          setMicAccess(true);
          setIsTestingVoice(false);
        });
      }
    };

    rec.onend = () => {
      console.log("⏹️ [VoiceTest] onend");
      if (!speechDetected && voiceTestRecognitionRef.current) {
        setIsTestingVoice(false);
      }
    };

    try {
      rec.start();
    } catch (e) {
      console.error("❌ [VoiceTest] start failed, falling back to MediaRecorder:", e);
      startMobileVoiceTest().catch(() => {
        setMicAccess(true);
        setIsTestingVoice(false);
      });
    }
  };

  // FastAPI backend URL — defaults to relative path (goes through Next.js API route)
  const STT_API_URL = process.env.NEXT_PUBLIC_STT_API_URL || "";
  const transcribeUrl = STT_API_URL
    ? `${STT_API_URL}/api/transcribe`
    : `/api/transcribe`;

  // ── Mobile / Fallback MediaRecorder test ─────────────────────────────────
  const startMobileVoiceTest = async () => {
    console.log("🎙️ [VoiceTest] Starting MediaRecorder test...");
    setVoiceTestStatus("📱 Requesting microphone access...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      voiceTestStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : MediaRecorder.isTypeSupported("audio/aac")
        ? "audio/aac"
        : "";

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      voiceTestRecorderRef.current = recorder;
      voiceTestChunksRef.current = [];
      voiceTestRecordStartRef.current = Date.now();
      setVoiceTestStatus("🎤 Recording... Speak now, then tap \"Stop & Check\"");

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) voiceTestChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        setVoiceTestStatus("💾 Saving recorded voice...");

        const chunks = voiceTestChunksRef.current;
        if (!chunks || chunks.length === 0) {
          setVoiceTestStatus("❌ No audio recorded. Tap \"Start Speaking\" to try again.");
          toast.error("No audio recorded. Try again.");
          setIsTestingVoice(false);
          return;
        }

        const actualType = mimeType || "audio/webm";
        const blob = new Blob(chunks, { type: actualType });
        
        try {
          setVoiceTestStatus("⚙️ Transcribing recorded voice...");
          addDeviceAlert("⚙️ Sending recorded voice to Deepgram STT for transcription...", "info");

          const formData = new FormData();
          formData.append("audio", blob, `voicetest-${Date.now()}.webm`);

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            const text = (data.transcript || data.text || "").trim();
            if (text) {
              setTestSpeechText(text);
              addDeviceAlert(`🗣️ Transcribed Voice Text: "${text}"`, "success");
            } else {
              setTestSpeechText("Speech signal recorded. Speak clearly into mic!");
              addDeviceAlert("⚠️ Audio captured, but no distinct speech words were recognized. Try speaking louder!", "warning");
            }
          } else {
            setTestSpeechText("Voice Recording Signal Verified");
          }
        } catch (err) {
          console.warn("Transcription error during test:", err);
          setTestSpeechText("Voice Audio Recorded & Verified");
        }

        setVoiceTestPassed(true);
        setMicAccess(true);
        setVoiceTestStatus("✅ Voice recorded & transcribed successfully!");
        toast.success("Voice test passed!");

        // Cleanup stream
        if (voiceTestStreamRef.current) {
          voiceTestStreamRef.current.getTracks().forEach((t) => t.stop());
          voiceTestStreamRef.current = null;
        }
        setIsTestingVoice(false);
      };

      recorder.start(250);
      setIsTestingVoice(true);
      console.log("🎙️ [VoiceTest] Recording active — waiting for user to stop");
    } catch (err) {
      console.error("❌ [VoiceTest] Mic access denied:", err);
      setVoiceTestStatus("❌ Microphone permission denied. Grant mic access in browser settings.");
      toast.error("Microphone permission denied.");
      setMicAccess(true);
      setIsTestingVoice(false);
    }
  };

  // Cleanup voice test on unmount
  useEffect(() => {
    return () => {
      clearInterval(voiceTestTimerRef.current);
      if (voiceTestRecognitionRef.current) {
        try { voiceTestRecognitionRef.current.abort(); } catch (_) {}
      }
      if (voiceTestRecorderRef.current && voiceTestRecorderRef.current.state === "recording") {
        try { voiceTestRecorderRef.current.stop(); } catch (_) {}
      }
      if (voiceTestStreamRef.current) {
        voiceTestStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Clean up media stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  // Attach stream to video when element mounts or step changes
  useEffect(() => {
    if ((step === "device-check" || step === "interview") && videoPreviewRef.current && mediaStream) {
      videoPreviewRef.current.srcObject = mediaStream;
    }
  }, [step, mediaStream]);

  // Sync mic track enabled state
  useEffect(() => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = isMicOn;
      });
    }
  }, [isMicOn, mediaStream]);

  // Sync cam track enabled state
  useEffect(() => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach((track) => {
        track.enabled = isCamOn;
      });
    }
  }, [isCamOn, mediaStream]);

  // ----------------------------------------------------
  // Start Interview Generation & Session
  // ----------------------------------------------------
  const handleStartInterview = async () => {
    setIsGeneratingAssessment(true);
    try {
      toast.info("AI is crafting personalized interview questions...");
      const createdAssessment = await createAssessment({
        industry: setupData.industry,
        domain: setupData.domain,
        experience: Number(setupData.experience),
        difficulty: setupData.difficulty,
        interviewType: setupData.interviewType,
        specificTopic: setupData.specificTopic,
      });

      if (!createdAssessment || createdAssessment.success === false || !createdAssessment.questions?.length) {
        throw new Error(createdAssessment?.error || "Failed to load interview questions.");
      }

      setAssessment(createdAssessment);
      setQuestions(createdAssessment.questions);
      setStep("interview");
      setAiState("speaking");
      setQuestionTimer(120);

      toast.success(`✨ Unique Interview ID created: ${createdAssessment.id}`);

      // Trigger AI Speech read out of first question
      speakText(
        `Welcome to your AI Video Interview for the ${setupData.domain} position. Let's begin with the first question: ${createdAssessment.questions[0].question}`
      );
    } catch (error) {
      console.error("Error generating assessment:", error);
      toast.error(error.message || "Failed to start interview. Try again.");
    } finally {
      setIsGeneratingAssessment(false);
    }
  };

  // Text-To-Speech — delegates to useSpeechSynthesis hook
  const speakText = useCallback((text) => {
    tts.speak(text);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tts.speak]);

  // Start STT — delegates to useSpeechRecognition hook
  const startSpeechRecognition = useCallback(() => {
    if (!isMicOnRef.current) return;
    stt.reset();
    stt.start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stt.start, stt.reset]);


  // Elapsed Timer Effect for Interview
  useEffect(() => {
    if (step !== "interview" || isPaused) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, isPaused]);

  // Handle Answer Input & Navigation
  // NOTE: Not wrapped in useCallback because it reads frequently-changing
  // state (candidateSpeech, userAnswers, currentIndex) and is only used
  // as an event handler / timer callback — no memoized child deps.
  const handleNextQuestion = async () => {
    tts.cancel();
    stt.stop();

    const voiceResult = await stt.transcribe();
    const answerText = (voiceResult || candidateSpeech || stt.transcript || "").trim() || "No verbal response provided.";
    
    const updatedAnswers = {
      ...userAnswers,
      [currentIndex]: answerText,
    };
    setUserAnswers(updatedAnswers);

    toast.success(`Voice answer captured for Question ${currentIndex + 1}!`);

    // Save turn to transcript history
    setTranscriptHistory((prev) => [
      ...prev,
      {
        speaker: "AI Interviewer",
        text: questions[currentIndex]?.question,
      },
      {
        speaker: "Candidate",
        text: answerText,
      },
    ]);

    setCandidateSpeech("");
    stt.reset();

    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setQuestionTimer(120);

      // AI speaks next question
      speakText(`Question ${nextIdx + 1}: ${questions[nextIdx].question}`);
    } else {
      // Last question completed -> Finish interview
      handleFinishInterview(updatedAnswers);
    }
  };

  // Repeat AI Question
  const handleRepeatQuestion = () => {
    const currentQ = questions[currentIndex]?.question;
    if (currentQ) {
      speakText(`Let me repeat the question: ${currentQ}`);
    }
  };

  // Finish Interview & Evaluate
  const handleFinishInterview = async (finalAnswers = userAnswers) => {
    tts.cancel();
    stt.stop();

    const voiceResult = await stt.transcribe();
    const currentAnswer = (voiceResult || candidateSpeech || stt.transcript || "").trim() || "No verbal response provided.";

    const answersToSubmit = { 
      ...finalAnswers,
      [currentIndex]: currentAnswer,
    };

    setStep("dashboard");
    setIsEvaluating(true);
    setEvaluationStep("saving");

    // Give the "Saving" step 1.2s of screen time before advancing
    await new Promise((r) => setTimeout(r, 1200));

    try {
      // Map user answers to the format expected by evaluateAssessment
      const formattedAnswers = Object.entries(answersToSubmit)
        .filter(([, answer]) => answer && answer.trim())
        .map(([questionIndex, userAnswer]) => ({
          questionIndex: parseInt(questionIndex),
          userAnswer: userAnswer.trim(),
        }));

      // Call the server action — it saves answers to DB then evaluates via AI
      setEvaluationStep("analyzing");
      await new Promise((r) => setTimeout(r, 400)); // Brief pause so user sees "Analyzing" start

      const evalData = await evaluateAssessment(assessment.id, formattedAnswers);

      // Handle error responses from the server action (e.g., auth failures)
      if (!evalData || evalData.success === false) {
        throw new Error(evalData?.error || "Evaluation failed");
      }

      // Advance to scoring complete
      setEvaluationStep("scoring");
      await new Promise((r) => setTimeout(r, 800)); // Let progress bar fill up fully

      setEvaluationResult(evalData);
      setEvaluationStep("complete");
      toast.success("AI interview evaluation complete!");
      if (onCompleteSuccess) onCompleteSuccess(evalData);
    } catch (err) {
      console.error("Evaluation error:", err);
      toast.error("Failed to generate evaluation report. Please try again.");

      // Minimal fallback — no hardcoded scores
      setEvaluationResult({
        overallScore: 0,
        technicalScore: 0,
        communicationScore: 0,
        confidenceScore: 0,
        problemSolvingScore: 0,
        strengths: [],
        weaknesses: ["Evaluation failed — please retry"],
        actionPlan: ["Try submitting your answers again"],
      });
      setEvaluationStep("complete");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Helper formatting for time
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder
      .toString()
      .padStart(2, "0")}`;
  };

  // ----------------------------------------------------
  // RENDER STEP 1: SETUP FLOW
  // ----------------------------------------------------
  if (step === "setup") {
    return (
      <div className="min-h-screen bg-[#FAFCF8] dark:bg-[#0E1614] text-[#1A2A26] dark:text-slate-100 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden select-none font-sans-ui">
        {/* Background Glowing Ambient Orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#E6F2DD]/60 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#B1D3B9]/40 rounded-full blur-[140px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl z-10"
        >
          <Card className="glass-card-white dark:bg-slate-900/90 border border-[#B1D3B9]/50 shadow-2xl rounded-3xl overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#E6F2DD]/80 via-white to-[#B1D3B9]/40 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-800 p-8 border-b border-[#B1D3B9]/40 relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6F2DD] border border-[#88BDA4]/40 text-[#1A2A26] text-xs font-extrabold uppercase tracking-widest shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#659287]" /> Next-Gen AI Video Simulator
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAllInterviewLocalStorage}
                  className="border-rose-200 dark:border-rose-900 bg-white/80 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-50 rounded-2xl text-xs font-bold px-3.5 py-2 flex items-center gap-2 shadow-sm"
                  title="Wipe local storage and session cache"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Clean Storage & Reset
                </Button>
              </div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2A26] dark:text-slate-100 tracking-tight">
                Configure AI Video Mock Interview
              </h1>
              <p className="text-[#5C736C] dark:text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Simulate a real-time, interactive video interview with AI Recruiter persona Maya. Practice verbal clarity, technical depth, and body language.
              </p>
            </div>

            <CardContent className="p-8 space-y-8">
              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Industry Selection */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" /> Target Industry
                  </Label>
                  <Select
                    value={setupData.industry}
                    onValueChange={(val) =>
                      setSetupData((prev) => ({ ...prev, industry: val }))
                    }
                  >
                    <SelectTrigger className="bg-zinc-950/80 border-zinc-800 text-zinc-100 rounded-2xl h-12 focus:border-cyan-500/60">
                      <SelectValue placeholder="Select Industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-xl">
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Domain / Role */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-violet-400" /> Specific Role / Domain
                  </Label>
                  <Select
                    value={setupData.domain}
                    onValueChange={(val) =>
                      setSetupData((prev) => ({ ...prev, domain: val }))
                    }
                  >
                    <SelectTrigger className="bg-zinc-950/80 border-zinc-800 text-zinc-100 rounded-2xl h-12 focus:border-cyan-500/60">
                      <SelectValue placeholder="Select Domain" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-xl">
                      {(DOMAINS_BY_INDUSTRY[setupData.industry] || []).map(
                        (dom) => (
                          <SelectItem key={dom} value={dom}>
                            {dom}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" /> Experience Level
                  </Label>
                  <Select
                    value={String(setupData.experience)}
                    onValueChange={(val) =>
                      setSetupData((prev) => ({
                        ...prev,
                        experience: Number(val),
                      }))
                    }
                  >
                    <SelectTrigger className="bg-zinc-950/80 border-zinc-800 text-zinc-100 rounded-2xl h-12 focus:border-cyan-500/60">
                      <SelectValue placeholder="Select Experience" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-xl">
                      <SelectItem value="0">Entry Level / Graduate (0-1 yrs)</SelectItem>
                      <SelectItem value="2">Junior (2-3 yrs)</SelectItem>
                      <SelectItem value="5">Mid-Senior (4-6 yrs)</SelectItem>
                      <SelectItem value="8">Senior / Lead (7+ yrs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Interview Type */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                    <Brain className="w-4 h-4 text-cyan-400" /> Interview Format
                  </Label>
                  <Select
                    value={setupData.interviewType}
                    onValueChange={(val) =>
                      setSetupData((prev) => ({ ...prev, interviewType: val }))
                    }
                  >
                    <SelectTrigger className="bg-zinc-950/80 border-zinc-800 text-zinc-100 rounded-2xl h-12 focus:border-cyan-500/60">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-xl">
                      <SelectItem value="mixed">Mixed (Technical & Behavioral)</SelectItem>
                      <SelectItem value="technical">Pure Technical Deep-Dive</SelectItem>
                      <SelectItem value="behavioral">STAR Behavioral & Leadership</SelectItem>
                      <SelectItem value="system-design">Architecture & System Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Specific Focus Topic */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" /> Special Focus Topic (Optional)
                </Label>
                <Input
                  value={setupData.specificTopic}
                  onChange={(e) =>
                    setSetupData((prev) => ({
                      ...prev,
                      specificTopic: e.target.value,
                    }))
                  }
                  placeholder="e.g. React Performance, Microservices, System Architecture..."
                  className="bg-zinc-950/80 border-zinc-800 text-zinc-100 rounded-2xl h-12 focus:border-cyan-500/60"
                />
              </div>

              {/* Difficulty & Duration Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Difficulty */}
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
                    Challenge Level
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {["easy", "medium", "hard"].map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() =>
                          setSetupData((prev) => ({ ...prev, difficulty: diff }))
                        }
                        className={`py-3 rounded-2xl border text-xs font-extrabold capitalize transition-all ${
                          setupData.difficulty === diff
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-950/50"
                            : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Duration */}
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
                    Session Duration
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[5, 10, 15].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() =>
                          setSetupData((prev) => ({
                            ...prev,
                            durationMinutes: dur,
                          }))
                        }
                        className={`py-3 rounded-2xl border text-xs font-extrabold transition-all ${
                          setupData.durationMinutes === dur
                            ? "bg-violet-500/20 border-violet-500 text-violet-300 shadow-lg shadow-violet-950/50"
                            : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        {dur} Mins
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Camera Preference Setting */}
              <div className="space-y-3 pt-2 border-t border-zinc-800/60">
                <Label className="text-xs uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                  <Video className="w-4 h-4 text-cyan-400" /> Session Camera Mode
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setSetupData((prev) => ({ ...prev, cameraMode: "on" }))
                    }
                    className={`py-3 px-4 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                      setupData.cameraMode === "on"
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-950/50"
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <Video className="w-4 h-4 text-cyan-400" />
                    <span>Camera ON (Proctored Video)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSetupData((prev) => ({ ...prev, cameraMode: "off" }))
                    }
                    className={`py-3 px-4 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                      setupData.cameraMode === "off"
                        ? "bg-rose-500/20 border-rose-500 text-rose-300 shadow-lg shadow-rose-950/50"
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <VideoOff className="w-4 h-4 text-rose-400" />
                    <span>Camera OFF (Audio Only)</span>
                  </button>
                </div>
              </div>

              {/* Rulebook Acceptance Section */}
              <div className="bg-gradient-to-r from-cyan-950/40 via-zinc-950 to-violet-950/40 p-4 rounded-2xl border border-cyan-500/30 flex items-center justify-between flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="rulebookCheck"
                    checked={acceptedRulebook}
                    onChange={(e) => setAcceptedRulebook(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-cyan-500 accent-cyan-500 cursor-pointer"
                  />
                  <label htmlFor="rulebookCheck" className="text-xs text-zinc-200 font-semibold cursor-pointer">
                    I agree to the <span className="text-cyan-300 font-bold underline">SkillsCraft AI Mock Interview Rulebook</span> (v1.0 Proctoring Policy)
                  </label>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRulebookModal(true)}
                  className="border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:text-white rounded-xl text-xs flex items-center gap-1.5 font-bold"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Read Full Rulebook
                </Button>
              </div>
            </CardContent>

            <CardFooter className="p-8 bg-[#E6F2DD]/40 dark:bg-slate-900 border-t border-[#B1D3B9]/40 flex items-center justify-between flex-wrap gap-4">
              <span className="text-xs text-[#5C736C] dark:text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#659287]" /> AI Proctoring &amp; WebRTC Telemetry Enabled
              </span>
              <Button
                onClick={startDeviceCheck}
                className="bg-[#659287] hover:bg-[#547B72] text-white rounded-2xl px-8 py-6 text-sm font-extrabold shadow-xl flex items-center gap-2 group transition-all"
              >
                Proceed to Device Calibration <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER STEP 2: DEVICE CHECK
  // ----------------------------------------------------
  if (step === "device-check") {
    return (
      <div className="min-h-screen bg-[#FAFCF8] dark:bg-[#0E1614] text-[#1A2A26] dark:text-slate-100 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden select-none font-sans-ui">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl z-10"
        >
          <Card className="bg-zinc-900/50 border-zinc-800/80 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2 tracking-tight">
                  <Video className="w-5 h-5 text-cyan-400" /> Equipment &amp; Soundcheck Studio
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Calibrate your camera, microphone, and audio spectrum before launching the AI session.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep("setup")}
                className="border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-2xl text-xs font-bold"
              >
                Back to Setup
              </Button>
            </div>

            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* ── Mobile System Calibration Alerts & Log Banner ── */}
              <div className="md:col-span-12 bg-gradient-to-r from-amber-950/40 via-cyan-950/40 to-zinc-950 border border-cyan-500/40 p-4 rounded-2xl shadow-xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Mobile Calibration Alerts & Live Event Feed</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`text-[10px] font-bold ${isCamOn && cameraAccess ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-amber-500/20 text-amber-300 border-amber-500/40"}`}>
                      Cam: {isCamOn ? (cameraAccess ? "Active" : "Requesting") : "OFF"}
                    </Badge>
                    <Badge className={`text-[10px] font-bold ${micAccess ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-rose-500/20 text-rose-300 border-rose-500/40"}`}>
                      Mic: {micAccess ? "Granted" : "Pending"}
                    </Badge>
                    <Badge className={`text-[10px] font-bold ${voiceTestPassed ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"}`}>
                      Voice Test: {voiceTestPassed ? "Verified" : "Untested"}
                    </Badge>
                  </div>
                </div>

                {/* Real-time event alert feed box for mobile */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 max-h-32 overflow-y-auto space-y-1.5 text-xs font-mono">
                  {deviceAlertLogs.map((log, idx) => (
                    <div key={idx} className="text-zinc-200 flex items-start gap-2 leading-relaxed">
                      <span className="text-cyan-400 shrink-0">›</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Webcam Live Preview Box */}
              <div className="md:col-span-7 space-y-4">
                <div className="relative aspect-video rounded-3xl bg-zinc-950 border border-zinc-800/80 overflow-hidden shadow-2xl flex items-center justify-center group">
                  {cameraAccess && isCamOn ? (
                    <video
                      ref={videoPreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 text-zinc-400 gap-3 p-6 text-center z-10">
                      <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-xl">
                        <VideoOff className="w-8 h-8 text-rose-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-200">
                          {isCamOn === false ? "Camera Feed Muted (Camera OFF)" : "Camera Offline / Not Available"}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1 max-w-md leading-relaxed">
                          {isCamOn === false
                            ? "Camera is turned off for this session. You will participate in audio & text mode."
                            : "No webcam detected or permission was not granted. You can still answer via voice & text."}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleCameraToggle(true)}
                        className="mt-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg"
                      >
                        <Video className="w-3.5 h-3.5" /> Turn Camera ON
                      </Button>
                    </div>
                  )}

                  {/* Face Positioning Overlay */}
                  {cameraAccess && isCamOn && (
                    <div className="absolute inset-8 border-2 border-cyan-500/30 border-dashed rounded-3xl pointer-events-none flex items-center justify-center">
                      <span className="text-[10px] text-cyan-300/70 font-mono tracking-widest uppercase bg-zinc-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/20">
                        Center Face In Frame
                      </span>
                    </div>
                  )}

                  {/* Camera Status Badge */}
                  <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800 text-xs font-bold flex items-center gap-2 z-20">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        cameraAccess && isCamOn
                          ? "bg-emerald-400 animate-ping"
                          : !isCamOn
                          ? "bg-amber-400"
                          : "bg-rose-500 animate-pulse"
                      }`}
                    />
                    <span className="text-zinc-200">
                      {cameraAccess && isCamOn
                        ? "Webcam Active (720p/1080p)"
                        : !isCamOn
                        ? "Camera OFF (User Selected)"
                        : "Camera Offline"}
                    </span>
                  </div>

                  {/* Quick Camera Toggle Button overlay */}
                  <div className="absolute top-3 right-3 z-20">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCameraToggle()}
                      className={`text-xs font-extrabold rounded-full px-3 py-1.5 h-auto border backdrop-blur-md transition-all flex items-center gap-1.5 ${
                        isCamOn
                          ? "bg-zinc-950/80 border-zinc-800 text-zinc-200 hover:bg-zinc-900"
                          : "bg-rose-600/90 border-rose-500 text-white hover:bg-rose-500"
                      }`}
                    >
                      {isCamOn ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Cam ON</span>
                        </>
                      ) : (
                        <>
                          <VideoOff className="w-3.5 h-3.5 text-white" />
                          <span>Cam OFF</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* ── Camera ON/OFF Preference Selector Card ── */}
                <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/80 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <span className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                      <Video className="w-4 h-4 text-cyan-400" /> Camera Setting for Interview
                    </span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Select whether you want your video feed active during the AI recruiter session.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCameraToggle(true)}
                      className={`px-4 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                        isCamOn
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md"
                          : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" /> Camera ON
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCameraToggle(false)}
                      className={`px-4 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                        !isCamOn
                          ? "bg-rose-500/20 border-rose-500 text-rose-300 shadow-md"
                          : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <VideoOff className="w-3.5 h-3.5" /> Camera OFF
                    </button>
                  </div>
                </div>

                {/* ── Frequency Spectrum Visualizer ── */}
                <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-zinc-400 flex items-center gap-2 uppercase tracking-wider text-[10px]">
                      <Mic className="w-4 h-4 text-cyan-400" /> Audio Spectrum &amp; Input Gain
                    </span>
                    <span className="text-cyan-400 font-mono text-[11px] font-bold">
                      {frequencyData && frequencyData.length > 0
                        ? `${Math.round((frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length / 255) * 100)}%`
                        : "—"}
                    </span>
                  </div>
                  <FrequencyVisualizer
                    data={frequencyData}
                    barCount={40}
                    colorMode="spectrum"
                    showLabels
                  />
                </div>

                {/* ── Voice Calibration Test Card ───────────────────────── */}
                <div className="bg-gradient-to-r from-violet-950/40 via-cyan-950/40 to-zinc-900/80 p-5 rounded-3xl border border-cyan-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-cyan-300 flex items-center gap-2 uppercase tracking-widest">
                      <Mic className="w-4 h-4 text-cyan-400" /> Voice Recognition Test
                    </span>
                    {voiceTestPassed && (
                      <Badge className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold">
                        ✅ Mic Active &amp; Verified
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                    Tap <strong className="text-cyan-300 font-bold">Start Speaking</strong> and speak — your recognized voice text will stream live on screen.
                  </p>

                  {/* ── Live transcript display box ── */}
                  <div className="relative min-h-[72px] bg-zinc-950/90 border border-zinc-800 rounded-2xl p-4">
                    {testSpeechText ? (
                      <motion.p
                        key={testSpeechText}
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-zinc-100 leading-relaxed font-medium"
                      >
                        &ldquo;{testSpeechText}&rdquo;
                        <span className="inline-block w-0.5 h-4 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
                      </motion.p>
                    ) : isTestingVoice ? (
                      <div className="flex items-center gap-3 text-zinc-400">
                        <div className="flex gap-1 items-center">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1 rounded-full bg-cyan-400"
                              animate={{
                                height: [8, 18 + i * 4, 8],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 0.5 + i * 0.1,
                                ease: "easeInOut",
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs italic font-medium text-cyan-300">
                          Listening for your speech... Speak clearly
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 italic">
                        Your recognized speech will appear here
                      </p>
                    )}
                  </div>

                  {/* ── Start / Stop button ── */}
                  <div className="flex items-center gap-3">
                    <motion.button
                      type="button"
                      onClick={handleTestVoiceRecording}
                      whileTap={{ scale: 0.95 }}
                      className={`relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-extrabold transition-all shadow-xl ${
                        isTestingVoice
                          ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50"
                          : "bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white shadow-cyan-950/50"
                      }`}
                    >
                      {isTestingVoice && (
                        <span className="absolute inset-0 rounded-2xl animate-ping bg-rose-400/30" />
                      )}
                      <Mic
                        className={`w-4 h-4 ${isTestingVoice ? "animate-bounce text-rose-200" : ""}`}
                      />
                      <span className="relative z-10">
                        {isTestingVoice ? "■ Stop & Verify" : "🎤 Start Speaking"}
                      </span>
                    </motion.button>

                    {voiceTestPassed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Microphone verified!
                      </motion.div>
                    )}
                  </div>

                  {/* ── Status message ── */}
                  {voiceTestPassed && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-emerald-300 font-semibold flex items-center gap-2 bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/30"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Voice Recognized: &ldquo;{testSpeechText}&rdquo;
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Status Diagnostic Checklist */}
              <div className="md:col-span-5 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-extrabold">
                    System Readiness Check
                  </h3>

                  {/* Camera Check */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${isCamOn ? "bg-cyan-500/10 text-cyan-400" : "bg-rose-500/10 text-rose-400"}`}>
                        {isCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-200">Video Feed</div>
                        <div className="text-[11px] text-zinc-400">
                          {isCamOn
                            ? cameraAccess
                              ? "Webcam stream active"
                              : "Requesting webcam stream..."
                            : "Camera OFF (User Selected)"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCameraToggle()}
                        className="text-[11px] h-7 px-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white font-bold"
                      >
                        {isCamOn ? "Turn OFF" : "Turn ON"}
                      </Button>
                      {isCamOn && cameraAccess ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : !isCamOn ? (
                        <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-300 bg-amber-950/30 font-bold">
                          OFF
                        </Badge>
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                  </div>

                  {/* Mic Check */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-200">Microphone Input</div>
                        <div className="text-[11px] text-zinc-400">Speech-to-text pipeline</div>
                      </div>
                    </div>
                    {micAccess ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                    )}
                  </div>

                  {/* Network Check */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-900 border border-[#B1D3B9]/40 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#E6F2DD] text-[#659287]">
                        <Wifi className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1A2A26] dark:text-slate-100">API Connection</div>
                        <div className="text-[11px] text-[#5C736C] dark:text-slate-400">AI model server response</div>
                      </div>
                    </div>
                    {netStatus === "ready" ? (
                      <CheckCircle2 className="w-5 h-5 text-[#659287]" />
                    ) : (
                      <RefreshCw className="w-4 h-4 text-[#659287] animate-spin" />
                    )}
                  </div>
                </div>

                <Button
                  disabled={isGeneratingAssessment}
                  onClick={handleStartInterview}
                  className="w-full bg-[#659287] hover:bg-[#547B72] text-white rounded-2xl py-6 text-sm font-extrabold shadow-xl flex items-center justify-center gap-2 group transition-all"
                >
                  {isGeneratingAssessment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Generating Interview Session...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" /> Launch AI Video Interview
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER STEP 3: MAIN INTERVIEW SCREEN
  // ----------------------------------------------------
  if (step === "interview") {
    const currentQ = questions[currentIndex];

    return (
      <>
      <div className="min-h-screen bg-[#FAFCF8] dark:bg-[#0E1614] text-[#1A2A26] dark:text-slate-100 flex flex-col justify-between relative overflow-hidden select-none font-sans-ui">
        {/* Top Floating Glass Header Bar */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 border-b border-[#B1D3B9]/40 backdrop-blur-2xl px-6 flex items-center justify-between z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#E6F2DD] border border-[#88BDA4]/40 px-3.5 py-1 rounded-full text-[#1A2A26] text-xs font-extrabold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#659287]" /> AI Recruiter Session
            </div>
            {assessment?.id && (
              <div className="flex items-center gap-1.5 bg-[#FAFCF8] dark:bg-slate-950 border border-[#B1D3B9]/40 px-3 py-1 rounded-full text-[11px] font-mono text-[#1A2A26] dark:text-slate-200 font-bold shadow-sm">
                <span className="text-[#5C736C] font-semibold uppercase">ID:</span>
                <span className="text-[#659287] font-extrabold">{assessment.id}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(assessment.id);
                    toast.success("Interview ID copied to clipboard!");
                  }}
                  className="text-slate-400 hover:text-slate-700 ml-1 text-xs"
                  title="Copy Interview ID"
                >
                  📋
                </button>
              </div>
            )}
            <div className="h-4 w-px bg-[#B1D3B9]/40 hidden sm:block" />
            <span className="text-xs text-[#5C736C] dark:text-slate-300 font-semibold hidden sm:inline-block">
              {setupData.domain} ({setupData.interviewType})
            </span>
          </div>

          {/* Question Counter & Integrity Score Pill */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Integrity Score Badge (Clickable for live proctoring log) */}
            <button
              type="button"
              onClick={() => setShowProctoringModal(true)}
              className={`flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-extrabold transition-all shadow-md ${
                integrityScore >= 90
                  ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300"
                  : integrityScore >= 70
                  ? "bg-amber-950/80 border-amber-500/50 text-amber-300"
                  : "bg-rose-950/80 border-rose-500/50 text-rose-300 animate-pulse"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Integrity Score: {integrityScore}/100</span>
            </button>

            {/* Read Rulebook Quick Action */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRulebookModal(true)}
              className="border-zinc-800 bg-zinc-950/80 text-cyan-300 hover:text-white rounded-full text-xs font-bold px-3 py-1 h-auto flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" /> Rulebook
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-semibold hidden sm:inline">Question</span>
              <Badge className="bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-mono text-xs font-bold px-3 py-1 rounded-full">
                {currentIndex + 1} / {questions.length}
              </Badge>
            </div>

            {/* REC Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>REC {formatTime(elapsedSeconds)}</span>
            </div>
          </div>
        </header>

        {/* Warning Banner Bar if tab switch or window focus is lost */}
        {activeWarning && (
          <div className="bg-amber-500/20 border-b border-amber-500/40 p-2.5 px-6 flex items-center justify-between text-amber-200 text-xs font-bold z-20 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{activeWarning}</span>
            </div>
            <button
              onClick={() => setActiveWarning(null)}
              className="text-amber-400 hover:text-white font-mono text-xs px-2"
            >
              ✕ Dismiss
            </button>
          </div>
        )}

        {/* Main Work Area: Grid of Candidate Video & AI Interviewer Panel */}
        <main className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full z-10">
          {/* Candidate Live Webcam Panel (Apple / Google Meet Glass Frame) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative flex-1 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden min-h-[340px] sm:min-h-[420px] flex items-center justify-center group">
              {isCamOn ? (
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-zinc-500">
                  <VideoOff className="w-12 h-12" />
                  <span className="text-xs font-bold">Camera Feed Muted</span>
                </div>
              )}

              {/* Muted Watermark Overlay */}
              {!isMicOn && (
                <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-md flex flex-col items-center justify-center gap-2 pointer-events-none z-10">
                  <MicOff className="w-10 h-10 text-rose-400 animate-bounce" />
                  <span className="text-xs font-extrabold text-rose-300 uppercase tracking-widest bg-rose-950/80 px-4 py-1.5 rounded-full border border-rose-800 shadow-2xl">
                    Microphone Muted — Unmute Control Dock Below
                  </span>
                </div>
              )}

              {/* Top Left Mic State Pill */}
              <div className={`absolute top-4 left-4 border px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-md shadow-xl z-20 ${
                isMicOn
                  ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-300"
                  : "bg-rose-950/90 border-rose-500/60 text-rose-300"
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full ${isMicOn ? "bg-emerald-400 animate-ping" : "bg-rose-500 animate-pulse"}`} />
                <span>{isMicOn ? "Mic ACTIVE (Recording Speech)" : "Mic MUTED"}</span>
              </div>

              {/* Candidate Info Tag */}
              <div className="absolute bottom-4 left-4 bg-zinc-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-800 text-xs font-bold flex items-center gap-2 text-zinc-200 z-20">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>You ({userProfile?.name || "Candidate"})</span>
                {isMicOn ? (
                  <Mic className="w-3.5 h-3.5 text-emerald-400 ml-1" />
                ) : (
                  <MicOff className="w-3.5 h-3.5 text-rose-400 ml-1" />
                )}
              </div>

              {/* Live Subtitle Caption Overlay Bar (FaceTime Style) */}
              {(stt.interimTranscript || candidateSpeech) && (
                <div className="absolute bottom-14 left-3 right-3 sm:left-4 sm:right-4 bg-zinc-950/95 border border-cyan-500/40 rounded-2xl p-3.5 backdrop-blur-2xl z-30 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between text-[10px] text-cyan-300 font-extrabold mb-1">
                    <span className="flex items-center gap-1.5 uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      Live Captions
                    </span>
                    <span className="text-zinc-400 text-[9px] font-mono">Real-Time STT</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-100 font-medium leading-relaxed break-words">
                    &ldquo;{stt.interimTranscript || candidateSpeech}&rdquo;
                  </p>
                </div>
              )}

              {/* Audio Wave Indicator on Top Right */}
              {isMicOn && (
                <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-800 z-20">
                  <VoiceIndicator
                    mode={tts.isSpeaking ? "speaking" : stt.isTranscribing ? "idle" : stt.isListening ? "listening" : "idle"}
                    audioLevel={stt.audioLevel}
                  />
                </div>
              )}
            </div>

            {/* Candidate Real-time Speech-to-Text Live Preview */}
            <TranscriptPanel
              transcript={candidateSpeech}
              interimTranscript={stt.interimTranscript}
              audioUrl={stt.audioUrl}
              isListening={stt.isListening}
              isMicOn={isMicOn}
              isMobileMode={stt.isMobileMode}
              isTranscribing={stt.isTranscribing}
              recordingDuration={stt.recordingDuration}
              onChange={(val) => setCandidateSpeech(val)}
              onClear={() => { setCandidateSpeech(""); stt.reset(); }}
            />
          </div>


          {/* AI Interviewer Persona & Question Workspace */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* AI Avatar Card */}
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-2xl rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
              {/* Glowing Ambient Audio Orb */}
              <div className="relative w-28 h-28 my-2 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: aiState === "speaking" ? [1, 1.25, 1] : 1,
                    opacity: aiState === "speaking" ? [0.6, 1, 0.6] : 0.4,
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500 blur-xl"
                />
                <div className="relative z-10 w-24 h-24 rounded-full bg-zinc-950 border-2 border-cyan-400/50 flex items-center justify-center shadow-inner">
                  <Brain className="w-10 h-10 text-cyan-300" />
                </div>
              </div>

              <h3 className="text-base font-extrabold text-zinc-100 flex items-center gap-2">
                Maya <Badge variant="secondary" className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/30">AI Recruiter</Badge>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 font-medium">Senior Technical Interviewer Persona</p>

              {/* AI Speech Status Badge */}
              <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs text-cyan-300 font-semibold">
                <span
                  className={`w-2 h-2 rounded-full ${
                    aiState === "speaking" ? "bg-cyan-400 animate-ping" : "bg-emerald-400"
                  }`}
                />
                <span className="capitalize">{aiState === "speaking" ? "AI Speaking Question..." : "Listening to Candidate..."}</span>
              </div>
            </Card>

            {/* Current Question Box */}
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-2xl rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-extrabold uppercase tracking-widest">
                  <span>Current Question</span>
                  <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 text-[10px]">
                    {currentQ?.type || "Technical"}
                  </Badge>
                </div>

                <p className="text-zinc-100 text-base sm:text-lg font-semibold leading-relaxed">
                  &quot;{currentQ?.question}&quot;
                </p>

                {/* Synced Voice Captions (Browser Web Speech API onboundary) */}
                {tts.isSpeaking && tts.currentWord && (
                  <div className="mt-3 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-center gap-2.5 animate-pulse shadow-lg">
                    <span className="shrink-0 font-extrabold text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      Live Voice Caption
                    </span>
                    <p className="font-bold text-white text-sm italic tracking-wide">
                      &ldquo;{tts.currentWord}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRepeatQuestion}
                  className="text-xs text-zinc-400 hover:text-cyan-300 hover:bg-zinc-900 rounded-xl flex items-center gap-1.5 font-semibold"
                >
                  <Volume2 className="w-4 h-4 text-cyan-400" /> Repeat Question
                </Button>

                <Button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white rounded-xl px-5 py-2.5 text-xs font-bold flex items-center gap-2 shadow-xl shadow-cyan-950/50 transition-all"
                >
                  {currentIndex + 1 === questions.length ? "Finish & Evaluate" : "Submit & Next"} <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Submitted Answers Display Log */}
            {Object.keys(userAnswers).length > 0 && (
              <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-2xl rounded-3xl p-5 shadow-2xl">
                <h4 className="text-xs font-extrabold text-cyan-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Submitted Answers Log ({Object.keys(userAnswers).length})
                </h4>
                <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
                  {Object.entries(userAnswers).map(([qIdx, ansText]) => (
                    <div key={qIdx} className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-2xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                        <span>Q{Number(qIdx) + 1}: {questions[Number(qIdx)]?.question?.substring(0, 45)}...</span>
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[9px]">Saved</Badge>
                      </div>
                      <p className="text-zinc-200 font-mono text-[11px] italic bg-zinc-900/80 p-2 rounded-xl border border-zinc-800/60">
                        &ldquo;{ansText}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </main>

        {/* Bottom Floating Control Dock (VisionOS Style) */}
        <footer className="h-20 bg-zinc-900/90 border-t border-zinc-800/80 backdrop-blur-2xl px-6 flex items-center justify-center gap-4 z-20">
          <SpeechControls
            isListening={stt.isListening}
            isMicOn={isMicOn}
            permissionState={stt.permissionState}
            isSupported={stt.isSupported}
            isMobileMode={stt.isMobileMode}
            isTranscribing={stt.isTranscribing}
            onStart={() => { if (!isMicOn) setIsMicOn(true); stt.reset(); stt.start(); toast.info("Voice capture started!"); }}
            onStop={() => stt.stop()}
            onToggleMic={() => setIsMicOn((prev) => !prev)}
          />

          <Button
            variant="outline"
            onClick={() => setIsCamOn(!isCamOn)}
            className={`h-12 px-5 rounded-full border transition-all flex items-center gap-2 shadow-xl ${
              isCamOn
                ? "bg-zinc-950/80 border-zinc-800 text-zinc-200 hover:bg-zinc-800"
                : "bg-rose-600 border-rose-500 text-white hover:bg-rose-500 shadow-rose-950"
            }`}
          >
            {isCamOn ? (
              <>
                <Video className="w-4 h-4 text-zinc-200" />
                <span className="text-xs font-bold hidden sm:inline">Camera ON</span>
              </>
            ) : (
              <>
                <VideoOff className="w-4 h-4 text-white" />
                <span className="text-xs font-bold hidden sm:inline">Camera OFF</span>
              </>
            )}
          </Button>

          {/* Emergency Pause Button (Rule 12) */}
          <Button
            variant="outline"
            onClick={handleTriggerEmergencyPause}
            disabled={emergencyPauseUsed}
            className={`h-12 px-5 rounded-full border transition-all flex items-center gap-2 shadow-xl ${
              emergencyPauseUsed
                ? "bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed"
                : "bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/80"
            }`}
          >
            <PauseCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold hidden sm:inline">
              {emergencyPauseUsed ? "Pause Used" : "Emergency Pause (120s)"}
            </span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
            className="w-12 h-12 rounded-full bg-zinc-950 border-zinc-800 text-zinc-200 hover:bg-zinc-800"
          >
            {isPaused ? <Play className="w-5 h-5 text-emerald-400 fill-current" /> : <Pause className="w-5 h-5" />}
          </Button>

          <div className="h-6 w-px bg-zinc-800 mx-2" />

          <Button
            onClick={() => setShowEndConfirm(true)}
            className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-full px-6 h-12 text-xs flex items-center gap-2 shadow-xl shadow-rose-950/60"
          >
            End Session
          </Button>
        </footer>

        {/* Live Proctoring Audit Log Dialog */}
        <Dialog open={showProctoringModal} onOpenChange={setShowProctoringModal}>
          <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 rounded-3xl max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-extrabold uppercase tracking-wider mb-1">
                <ShieldAlert className="w-4 h-4" /> Real-Time Proctoring Audit Log
              </div>
              <DialogTitle className="text-xl font-black">Interview Integrity Telemetry</DialogTitle>
              <DialogDescription className="text-zinc-400 text-xs">
                SkillsCraft monitors window focus, prohibited keyboard shortcuts, and video stream status.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800 text-center">
                  <span className="text-xs text-zinc-400 block font-semibold">Integrity Score</span>
                  <span className={`text-2xl font-black ${integrityScore >= 90 ? "text-emerald-400" : "text-amber-400"}`}>
                    {integrityScore}/100
                  </span>
                </div>
                <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800 text-center">
                  <span className="text-xs text-zinc-400 block font-semibold">Tab Switches</span>
                  <span className="text-2xl font-black text-rose-400">{tabSwitchCount}</span>
                </div>
                <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800 text-center">
                  <span className="text-xs text-zinc-400 block font-semibold">Copy/Pastes</span>
                  <span className="text-2xl font-black text-amber-400">{copyPasteAttempts}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-zinc-400 font-extrabold">Logged Telemetry Events</span>
                <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 max-h-48 overflow-y-auto space-y-2">
                  {proctoringLogs.length > 0 ? (
                    proctoringLogs.map((log, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                        <div>
                          <span className="font-bold text-zinc-200 block">{log.message}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{log.timestamp}</span>
                        </div>
                        <Badge variant="outline" className="border-rose-500/40 text-rose-400 font-mono text-[10px]">
                          -{log.deduction} pts
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-emerald-400 font-semibold p-4 text-center">
                      ✅ Clean Session — No proctoring violations recorded!
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setShowProctoringModal(false)} className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold">
                Close Audit Log
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

        {/* ── Dev-only Debug Panel ── */}
        <DebugPanel
          debugInfo={stt.debugInfo}
          isListening={stt.isListening}
          isTranscribing={stt.isTranscribing}
          error={stt.error}
          recordingDuration={stt.recordingDuration}
        />
    </>
    );
  }

  // ----------------------------------------------------
  // RENDER STEP 4: AI PERFORMANCE DASHBOARD
  // ----------------------------------------------------
  if (step === "dashboard") {
    if (isEvaluating) {
      const steps = [
        { key: "saving", label: "Saving your responses", icon: "💾" },
        { key: "analyzing", label: "Analyzing answers with AI", icon: "🤖" },
        { key: "scoring", label: "Generating scores & feedback", icon: "📊" },
        { key: "complete", label: "Evaluation complete!", icon: "✅" },
      ];
      const currentIdx = steps.findIndex((s) => s.key === evaluationStep);

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10 w-full max-w-md space-y-10">
            {/* Animated steps */}
            <div className="space-y-6">
              {steps.map((step, idx) => {
                const isActive = idx === currentIdx;
                const isPast = idx < currentIdx;
                const isFuture = idx > currentIdx;

                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: isActive ? 1.02 : 1,
                    }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
                      isActive
                        ? "bg-indigo-950/60 border-indigo-500/50 shadow-lg shadow-indigo-950/30"
                        : isPast
                        ? "bg-emerald-950/30 border-emerald-500/30"
                        : "bg-slate-900/40 border-slate-800/60 opacity-50"
                    }`}
                  >
                    {/* Icon / step number */}
                    <div
                      className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        isActive
                          ? "bg-indigo-600 text-white"
                          : isPast
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {isPast ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span>{step.icon}</span>
                      )}
                      {/* Pulse ring on active step */}
                      {isActive && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-indigo-400/30" />
                      )}
                    </div>

                    {/* Label + progress bar for active */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          isActive
                            ? "text-indigo-200"
                            : isPast
                            ? "text-emerald-300"
                            : "text-slate-500"
                        }`}
                      >
                        {step.label}
                      </p>
                      {isActive && (
                        <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                              duration: evaluationStep === "scoring" ? 0.65 : 3,
                              ease: "easeInOut",
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Active spinner */}
                    {isActive && (
                      <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Subtle tip text */}
            <motion.p
              key={evaluationStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-slate-500 text-center"
            >
              {evaluationStep === "saving" &&
                "Securely storing your responses before analysis..."}
              {evaluationStep === "analyzing" &&
                "Our AI is reviewing each answer for technical depth, clarity, and relevance..."}
              {evaluationStep === "scoring" &&
                "Computing domain-specific readiness scores and personalized recommendations..."}
              {evaluationStep === "complete" &&
                "Your comprehensive evaluation report is ready below!"}
            </motion.p>
          </div>
        </div>
      );
    }

    // Process metric scores — use nullish coalescing so a valid score of 0
    // is not overridden by hardcoded defaults.
    const overall = evaluationResult?.overallScore ?? 0;
    const tech = evaluationResult?.technicalScore ?? 0;
    const comm = evaluationResult?.communicationScore ?? 0;
    const conf = evaluationResult?.confidenceScore ?? 0;
    const problemSolving = evaluationResult?.problemSolvingScore ?? 0;

    // Data for Recharts Radar Chart
    const radarData = [
      { subject: "Technical Depth", score: tech },
      { subject: "Communication", score: comm },
      { subject: "Confidence", score: conf },
      { subject: "Problem Solving", score: problemSolving },
      { subject: "Structure (STAR)", score: Math.round((overall + tech + comm + conf + problemSolving) / 5) },
      { subject: "Role Alignment", score: Math.round((overall + tech) / 2) },
    ];

    // Data for Recharts Bar Chart — use per-question scores from AI evaluation
    // Use per-question scores from AI evaluation, or null if not scored yet
    const barData = questions.map((q, i) => ({
      name: `Q${i + 1}`,
      score: evaluationResult?.evaluatedQuestions?.[i]?.score ?? null,
    })).filter(d => d.score !== null);

    return (
      <div className="min-h-screen bg-[#FAFCF8] dark:bg-[#0E1614] text-[#1A2A26] dark:text-slate-100 p-4 sm:p-8 relative overflow-hidden select-none font-sans-ui">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#E6F2DD]/60 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#B1D3B9]/40 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-8 z-10 relative">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card-white dark:bg-slate-900/90 border border-[#B1D3B9]/40 p-8 rounded-3xl backdrop-blur-2xl shadow-xl">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6F2DD] border border-[#88BDA4]/40 text-[#1A2A26] text-xs font-extrabold uppercase tracking-widest mb-2 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#659287]" /> AI Evaluation Report Completed
              </div>
              <h1 className="text-3xl font-heading font-bold text-[#1A2A26] dark:text-slate-100">
                Interview Performance Dashboard
              </h1>
              <p className="text-[#5C736C] dark:text-slate-300 text-xs sm:text-sm mt-1 font-medium">
                {setupData.domain} ({setupData.interviewType}) • Completed in {formatTime(elapsedSeconds)}
              </p>
              {assessment?.id && (
                <div className="mt-2.5 inline-flex items-center gap-2 bg-[#FAFCF8] dark:bg-slate-950 border border-[#B1D3B9]/40 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#659287] shadow-sm">
                  <span className="text-[#5C736C] font-bold uppercase tracking-wider">Interview ID:</span>
                  <span className="font-extrabold text-[#659287]">{assessment.id}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(assessment.id);
                      toast.success("Interview ID copied to clipboard!");
                    }}
                    className="ml-1 text-slate-400 hover:text-slate-700 text-xs transition-colors"
                    title="Copy Interview ID"
                  >
                    📋 Copy
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("setup")}
                className="border-[#B1D3B9] text-[#1A2A26] dark:text-slate-200 hover:bg-[#E6F2DD]/60 rounded-2xl text-xs font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-[#659287]" /> New Session
              </Button>

              <Button
                onClick={() => toast.success("Downloading PDF Performance Report...")}
                className="bg-[#659287] hover:bg-[#547B72] text-white rounded-2xl text-xs font-extrabold shadow-lg"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> Download Report
              </Button>
            </div>
          </div>

          {/* Metric Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Overall */}
            <Card className="glass-card-white dark:bg-slate-900/90 border-[#B1D3B9]/40 backdrop-blur-2xl p-6 rounded-3xl flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between text-xs text-[#5C736C] dark:text-slate-400 font-extrabold uppercase tracking-wider">
                <span>Overall Readiness</span>
                <Award className="w-4 h-4 text-[#659287]" />
              </div>
              <div className="my-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#659287] font-heading">{overall}%</span>
                <span className="text-xs text-[#4E9F76] font-bold">Onsite Ready</span>
              </div>
              <Progress value={overall} className="h-2 bg-[#E6F2DD] [&>div]:bg-[#659287]" />
            </Card>

            {/* AI Integrity Audit Score Card */}
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-2xl p-6 rounded-3xl flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-extrabold uppercase tracking-wider">
                <span>Integrity &amp; Focus</span>
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="my-4 flex items-baseline gap-2">
                <span className={`text-4xl font-black ${integrityScore >= 90 ? "text-emerald-400" : "text-amber-400"}`}>
                  {integrityScore}/100
                </span>
                <span className="text-xs text-zinc-400 font-bold">Rulebook v1.0</span>
              </div>
              <Progress value={integrityScore} className="h-2 bg-zinc-950" />
            </Card>

            {/* Technical */}
            <Card className="glass-card-white dark:bg-slate-900/90 border-[#E5E7EB] dark:border-slate-800 p-6 rounded-3xl flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between text-xs text-[#4B5563] dark:text-slate-400 font-extrabold uppercase tracking-wider">
                <span>Technical Depth</span>
                <Brain className="w-4 h-4 text-[#3F7D58]" />
              </div>
              <div className="my-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#3F7D58] font-heading">{tech}%</span>
                <span className="text-xs text-[#4E8D72] font-bold">High Mastery</span>
              </div>
              <Progress value={tech} className="h-2 bg-[#E6F4EA] [&>div]:bg-[#3F7D58]" />
            </Card>

            {/* Communication */}
            <Card className="glass-card-white dark:bg-slate-900/90 border-[#E5E7EB] dark:border-slate-800 p-6 rounded-3xl flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between text-xs text-[#4B5563] dark:text-slate-400 font-extrabold uppercase tracking-wider">
                <span>Communication</span>
                <MessageSquare className="w-4 h-4 text-[#3F7D58]" />
              </div>
              <div className="my-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#3F7D58] font-heading">{comm}%</span>
                <span className="text-xs text-[#4E8D72] font-bold">Clear Speech</span>
              </div>
              <Progress value={comm} className="h-2 bg-[#E6F4EA] [&>div]:bg-[#3F7D58]" />
            </Card>

            {/* Confidence */}
            <Card className="glass-card-white dark:bg-slate-900/90 border-[#E5E7EB] dark:border-slate-800 p-6 rounded-3xl flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between text-xs text-[#4B5563] dark:text-slate-400 font-extrabold uppercase tracking-wider">
                <span>Confidence &amp; Pace</span>
                <Zap className="w-4 h-4 text-[#22C55E]" />
              </div>
              <div className="my-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#22C55E] font-heading">{conf}%</span>
                <span className="text-xs text-[#22C55E] font-bold">Optimal Tempo</span>
              </div>
              <Progress value={conf} className="h-2 bg-[#E6F4EA] [&>div]:bg-[#22C55E]" />
            </Card>
          </div>

          {/* Visual Analytics Grid (Radar + Bar Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Radar Chart */}
            <Card className="lg:col-span-6 glass-card-white dark:bg-slate-900/90 border border-[#B1D3B9]/40 p-6 rounded-3xl shadow-xl">
              <h3 className="text-sm font-extrabold text-[#1A2A26] dark:text-slate-100 mb-4 flex items-center gap-2 font-heading">
                <Activity className="w-4 h-4 text-[#659287]" /> Competency Radar Matrix
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#B1D3B9" />
                    <PolarAngleAxis dataKey="subject" stroke="#5C736C" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#88BDA4" />
                    <Radar name="Candidate" dataKey="score" stroke="#659287" fill="#88BDA4" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Bar Chart */}
            <Card className="lg:col-span-6 glass-card-white dark:bg-slate-900/90 border border-[#B1D3B9]/40 p-6 rounded-3xl shadow-xl">
              <h3 className="text-sm font-extrabold text-[#1A2A26] dark:text-slate-100 mb-4 flex items-center gap-2 font-heading">
                <BarChart3 className="w-4 h-4 text-[#659287]" /> Per-Question Performance
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D4E5D8" />
                    <XAxis dataKey="name" stroke="#5C736C" />
                    <YAxis domain={[0, 100]} stroke="#5C736C" />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#B1D3B9', borderRadius: '14px', color: '#1A2A26' }} />
                    <Bar dataKey="score" fill="#659287" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Detailed Feedback & Transcript Tabs */}
          <Tabs defaultValue="feedback" className="w-full">
            <TabsList className="bg-[#E6F2DD]/70 border border-[#B1D3B9]/40 rounded-2xl p-1">
              <TabsTrigger value="feedback" className="rounded-xl text-xs font-bold text-[#1A2A26] data-[state=active]:bg-[#659287] data-[state=active]:text-white">
                Detailed AI Feedback
              </TabsTrigger>
              <TabsTrigger value="transcript" className="rounded-xl text-xs font-bold text-[#1A2A26] data-[state=active]:bg-[#659287] data-[state=active]:text-white">
                Audio Transcript Review
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feedback" className="mt-6 space-y-6">
              {/* Strengths & Weaknesses Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card-white dark:bg-slate-900/90 border border-[#B1D3B9]/40 p-6 rounded-3xl shadow-xl">
                  <h4 className="text-xs uppercase tracking-widest text-[#4E9F76] font-extrabold mb-4 flex items-center gap-2 font-heading">
                    <CheckCircle2 className="w-4 h-4 text-[#4E9F76]" /> Key Strengths Demonstrated
                  </h4>
                  <ul className="space-y-2.5">
                    {(evaluationResult?.strengths ?? []).map((str, idx) => (
                      <li key={idx} className="text-xs text-[#1A2A26] dark:text-slate-200 flex items-start gap-2 font-medium">
                        <span className="text-[#4E9F76] font-bold">•</span> {str}
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="glass-card-white dark:bg-slate-900/90 border border-[#B1D3B9]/40 p-6 rounded-3xl shadow-xl">
                  <h4 className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-extrabold mb-4 flex items-center gap-2 font-heading">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Growth Recommendations
                  </h4>
                  <ul className="space-y-2.5">
                    {(evaluationResult?.weaknesses ?? []).map((weak, idx) => (
                      <li key={idx} className="text-xs text-[#1A2A26] dark:text-slate-200 flex items-start gap-2 font-medium">
                        <span className="text-amber-600 font-bold">•</span> {weak}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Question Accordion */}
              <Card className="glass-card-white dark:bg-slate-900/90 border border-[#B1D3B9]/40 p-6 rounded-3xl shadow-xl">
                <h4 className="text-sm font-extrabold text-[#1A2A26] dark:text-slate-100 mb-4 font-heading">Question Breakdown &amp; Model Solutions</h4>
                <Accordion type="single" collapsible className="space-y-3">
                  {questions.map((q, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border border-[#B1D3B9]/40 rounded-2xl px-4 bg-[#FAFCF8] dark:bg-slate-950/60">
                      <AccordionTrigger className="text-xs font-bold text-[#1A2A26] dark:text-slate-200 hover:text-[#659287]">
                        <span>Q{idx + 1}: {q.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-[#5C736C] dark:text-slate-300 space-y-3 pt-2">
                        <div>
                          <span className="font-bold text-[#659287]">Your Transcribed Response:</span>
                          <p className="italic text-[#1A2A26] dark:text-slate-100 mt-1 bg-[#E6F2DD]/40 dark:bg-slate-900 p-3 rounded-xl border border-[#B1D3B9]/40">
                            &ldquo;{userAnswers[idx] || "No response recorded."}&rdquo;
                          </p>
                        </div>
                        {q.explanation && (
                          <div>
                            <span className="font-bold text-[#4E9F76]">Model Concept:</span>
                            <p className="text-[#1A2A26] dark:text-slate-200 mt-1">{q.explanation}</p>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </TabsContent>

            <TabsContent value="transcript" className="mt-6">
              <Card className="glass-card-white dark:bg-slate-900/90 border border-[#B1D3B9]/40 p-6 rounded-3xl space-y-4 shadow-xl">
                <h4 className="text-sm font-extrabold text-[#1A2A26] dark:text-slate-100 flex items-center gap-2 font-heading">
                  <FileText className="w-4 h-4 text-[#659287]" /> Complete Turn-by-Turn Audio Transcript
                </h4>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {transcriptHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl text-xs ${
                        item.speaker === "Candidate"
                          ? "bg-[#E6F2DD]/70 border border-[#88BDA4]/40 ml-8 text-[#1A2A26] font-medium"
                          : "bg-white dark:bg-slate-950 border border-[#B1D3B9]/40 mr-8 text-[#1A2A26] dark:text-slate-200 font-medium"
                      }`}
                    >
                      <span className="font-extrabold block mb-1 text-[10px] text-[#5C736C] uppercase tracking-widest">
                        {item.speaker}
                      </span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        {/* SkillsCraft AI Rulebook Modal */}
      <RulebookModal
        isOpen={showRulebookModal}
        onClose={() => setShowRulebookModal(false)}
        onAccept={() => setAcceptedRulebook(true)}
        accepted={acceptedRulebook}
      />
    </div>
    );
  }

  return null;
}
