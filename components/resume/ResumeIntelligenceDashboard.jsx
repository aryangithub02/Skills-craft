"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  Brain, 
  Eye, 
  TrendingUp, 
  FileText, 
  Download, 
  Zap, 
  ArrowRight, 
  BookOpen, 
  Target, 
  Award, 
  ChevronRight, 
  Flame, 
  DollarSign, 
  RefreshCw, 
  X,
  Upload,
  Check,
  Copy,
  Edit3,
  FileType,
  FileCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analyzeResumeIntelligence, improveWholeResumeAction } from "@/actions/resume-intelligence";
import { parseDocumentAction } from "@/actions/parse-document";
import { toast } from "sonner";

const SAMPLE_RESUME_TEXT = `# Alex Morgan
Senior Full Stack Engineer | San Francisco, CA | alex@example.com | (555) 019-2834

## Professional Summary
Results-driven Full Stack Developer with 6+ years of experience building high-scale web applications using React, Next.js, Node.js, and PostgreSQL. Reduced query latency by 52% and led team of 5 engineers.

## Technical Skills
- Languages: JavaScript, TypeScript, SQL, HTML5, CSS3
- Frameworks: React.js, Next.js, Node.js, Express.js, TailwindCSS
- Databases: PostgreSQL, MongoDB, Redis
- Tools: Git, GitHub, Vercel, Jest, Postman

## Work Experience
### Senior Software Engineer | TechCorp Inc. | 2022 - Present
- Spearheaded microservices migration using Next.js 15 App Router & Redis, improving page load speed by 52% across 2M monthly active users.
- Architected automated CI/CD pipeline in Docker & AWS EKS, cutting deployment cycle times from 4 hours to 12 minutes.
- Worked on database optimization and Redis caching layers.

### Full Stack Developer | WebDev Solutions | 2019 - 2022
- Built MERN Website for student events used by 500+ students.
- Developed RESTful APIs in Node.js and Express with JWT authentication.

## Education
- B.S. in Computer Science | University of California, Berkeley | 2015 - 2019
`;

export default function ResumeIntelligenceDashboard({ initialContent, initialData }) {
  const [resumeText, setResumeText] = useState(initialContent || "");
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [targetIndustry, setTargetIndustry] = useState("Technology");
  const [jobDescription, setJobDescription] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview | keywords | recruiter | roadmap | heatmap
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedRoadmapNode, setSelectedRoadmapNode] = useState(null);
  
  // Document Viewer States
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("text"); // "pdf" | "docx" | "text"
  const [docxHtml, setDocxHtml] = useState("");
  const [showViewResumeModal, setShowViewResumeModal] = useState(false);
  const [modalViewTab, setModalViewTab] = useState("visual"); // "visual" | "text" | "edit"

  // Run initial analysis if user has a saved resume in DB
  useEffect(() => {
    if (initialContent) {
      runAnalysisWithContent(initialContent);
    }
  }, [initialContent]);

  const runAnalysisWithContent = async (contentToAnalyze) => {
    const text = contentToAnalyze || resumeText;
    if (!text || text.trim().length < 20) {
      toast.warning("Please upload a resume file or paste resume text first.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeResumeIntelligence({
        resumeText: text,
        targetRole,
        targetIndustry,
        jobDescription
      });

      if (result?.success) {
        setAnalysisData(result.data);
        toast.success("✨ AI Resume Intelligence Analysis Complete!");
      }
    } catch (err) {
      console.error("Analysis Error:", err);
      toast.error(err.message || "Failed to analyze resume.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsAnalyzing(true);

    try {
      // 1. Send file to Server Action for pdf-parse / mammoth text extraction
      const formData = new FormData();
      formData.append("file", file);

      const parseRes = await parseDocumentAction(formData);

      if (parseRes?.success && parseRes.text && parseRes.text.trim().length > 10) {
        const cleanText = parseRes.text;
        setResumeText(cleanText);

        // Document Viewer setup
        if (file.name.endsWith(".pdf") || file.type === "application/pdf") {
          setFileUrl(URL.createObjectURL(file));
          setFileType("pdf");
          setModalViewTab("visual");
        } else if (file.name.endsWith(".docx") || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          setFileType("docx");
          setModalViewTab("visual");
          try {
            const mammoth = await import("mammoth");
            const arrayBuffer = await file.arrayBuffer();
            const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
            // Basic HTML sanitization to prevent XSS execution from DOCX HTML conversion
            const sanitizedHtml = htmlResult.value
              .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
              .replace(/on\w+="[^"]*"/gi, "")
              .replace(/on\w+='[^']*'/gi, "")
              .replace(/javascript:/gi, "");
            setDocxHtml(sanitizedHtml);
          } catch (mErr) {
            console.warn("Docx HTML conversion notice:", mErr);
          }
        } else {
          setFileType("text");
          setModalViewTab("text");
        }

        toast.success(`Successfully extracted text from ${file.name}! Analyzing...`);
        await runAnalysisWithContent(cleanText);
        return;
      }
    } catch (err) {
      console.warn("Server action document parsing fallback:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOneClickImprove = async () => {
    if (!resumeText) {
      toast.warning("Please upload a resume or load sample text first.");
      return;
    }

    setIsOptimizing(true);
    try {
      const res = await improveWholeResumeAction(resumeText);
      if (res?.success) {
        setResumeText(res.content);
        toast.success("⚡ Resume optimized with 99%+ ATS formatting! Re-analyzing...");
        runAnalysisWithContent(res.content);
      }
    } catch (err) {
      console.error("Optimization Error:", err);
      toast.error("Failed to run One-Click AI Optimization.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownloadReport = () => {
    if (!analysisData) {
      toast.warning("Please run an analysis first to download report.");
      return;
    }
    toast.success("📄 Generating AI Resume Intelligence Report...");
    window.print();
  };

  const handleCopyResumeText = () => {
    if (!resumeText) return;
    navigator.clipboard.writeText(resumeText);
    toast.success("Copied resume text to clipboard!");
  };

  return (
    <div className="space-y-8 select-none font-sans">
      
      {/* ── Top Header Banner ── */}
      <div className="neo-surface p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden bg-white dark:bg-[#13141f]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider">
              <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Next-Gen AI Resume Intelligence
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Resume Intelligence &amp; ATS Simulator
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-medium max-w-2xl leading-relaxed">
              Simulate ATS parsers &amp; executive recruiter evaluations. Inspect keyword match density, rejection risk probability, AI writing detection, and interactive career skill roadmaps.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap shrink-0">
            {resumeText && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowViewResumeModal(true)}
                className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 text-sm font-extrabold rounded-xl px-5 h-12 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Eye className="w-4 h-4 text-indigo-500" /> View Document Viewer
              </Button>
            )}

            <Button
              type="button"
              onClick={handleOneClickImprove}
              disabled={isOptimizing || !resumeText}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-extrabold rounded-xl px-6 h-12 shadow-md flex items-center gap-2"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Optimizing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300 fill-current" /> One-Click AI Improve
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadReport}
              disabled={!analysisData}
              className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 text-sm font-bold rounded-xl px-5 h-12 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Download className="w-4 h-4" /> Download Report
            </Button>
          </div>
        </div>
      </div>

      {/* ── Input & Job Target Configuration Box ── */}
      <div className="neo-surface p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 bg-white dark:bg-[#13141f]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* File Drop / Upload Box (4 cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-extrabold flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-500" /> Upload Resume (PDF / DOCX / TXT)
              </Label>
              {resumeText && (
                <button
                  type="button"
                  onClick={() => setShowViewResumeModal(true)}
                  className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Open Viewer
                </button>
              )}
            </div>
            
            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-6 text-center bg-slate-50 dark:bg-slate-900/60 transition-colors cursor-pointer group">
              <input
                type="file"
                accept=".pdf,.docx,.txt,.md"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <FileType className="w-8 h-8 text-indigo-500 mx-auto group-hover:scale-110 transition-transform" />
              
              {fileName ? (
                <div className="mt-2 space-y-1">
                  <Badge className="bg-emerald-500 text-white text-xs font-extrabold px-3 py-1">
                    📄 {fileName}
                  </Badge>
                  <span className="text-xs text-slate-500 block font-medium">Click or drag file to replace</span>
                </div>
              ) : initialContent ? (
                <div className="mt-2 space-y-1">
                  <Badge className="bg-indigo-600 text-white text-xs font-extrabold px-3 py-1">
                    📄 Saved Account Resume Active
                  </Badge>
                  <span className="text-xs text-slate-500 block font-medium">Click or drag file to replace</span>
                </div>
              ) : (
                <div className="mt-2 space-y-1">
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 block">
                    Click or drag PDF/DOCX file to analyze
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                    PDF, DOCX, TXT supported
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Role & Industry Selectors (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-extrabold">Target Job Role</Label>
              <Input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Developer, DevOps Lead"
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl text-sm h-11 font-bold text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-extrabold">Target Industry</Label>
              <Select value={targetIndustry} onValueChange={setTargetIndustry}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl text-sm h-11 font-bold text-slate-900 dark:text-slate-100">
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl">
                  <SelectItem value="Technology">Technology / Software</SelectItem>
                  <SelectItem value="Financial Services">Financial Services / Fintech</SelectItem>
                  <SelectItem value="Healthcare">Healthcare &amp; Biotech</SelectItem>
                  <SelectItem value="E-Commerce">E-Commerce &amp; Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target Job Description Paste (4 cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <Label className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-extrabold flex items-center gap-1.5">
              <Target className="w-4 h-4 text-purple-500" /> Target Job Description (Optional)
            </Label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description text here for exact keyword match calculation..."
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl text-xs h-24 font-medium resize-none text-slate-900 dark:text-slate-100"
            />
            <Button
              type="button"
              onClick={() => runAnalysisWithContent()}
              disabled={isAnalyzing}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl h-11 flex items-center justify-center gap-2 shadow-md"
            >
              {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isAnalyzing ? "Analyzing Resume..." : "Run AI Resume Intelligence Analysis"}</span>
            </Button>
          </div>

        </div>
      </div>

      {/* ── Empty State: Upload or Sample Request ── */}
      {!analysisData && !isAnalyzing && (
        <div className="neo-surface p-12 rounded-3xl text-center space-y-6 bg-white dark:bg-[#13141f]">
          <div className="w-20 h-20 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <Upload className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">Upload PDF/DOCX Resume to Begin AI Analysis</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Upload your PDF/DOCX resume file above, or click below to load a sample resume to test the ATS simulator.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button
              type="button"
              onClick={() => {
                setResumeText(SAMPLE_RESUME_TEXT);
                setFileName("Sample_Engineer_Resume.md");
                setFileType("text");
                runAnalysisWithContent(SAMPLE_RESUME_TEXT);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl px-6 h-12 shadow-md inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Load Sample Resume &amp; Analyze
            </Button>
          </div>
        </div>
      )}

      {/* ── Navigation Tabs Bar ── */}
      {analysisData && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 border-b border-slate-200/80 dark:border-slate-800">
          {[
            { id: "overview", label: "📊 Overview & ATS Score", badge: `${analysisData.atsScore}%` },
            { id: "keywords", label: "🔍 Keywords & Density", badge: `${analysisData.keywordAnalysis.found.length} Found` },
            { id: "recruiter", label: "🧠 Recruiter & AI Detector", badge: `${analysisData.aiDetection.humanPercent}% Human` },
            { id: "roadmap", label: "🗺️ Interactive Skill Roadmap", badge: "Roadmap 🔥" },
            { id: "heatmap", label: "⚡ Heatmap & AI Recommendations", badge: "Action Plan" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white dark:bg-[#13141f] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              <Badge variant="outline" className={`text-[11px] font-mono ${activeTab === tab.id ? "border-white/40 text-white" : "border-slate-300 dark:border-slate-700 text-indigo-600 dark:text-indigo-400"}`}>
                {tab.badge}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {/* Loading Skeleton */}
      {isAnalyzing && (
        <div className="neo-surface p-12 rounded-3xl text-center space-y-4 bg-white dark:bg-[#13141f]">
          <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto animate-spin">
            <RefreshCw className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">Running AI Resume Intelligence Analysis...</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">Parsing ATS tags, simulating recruiter eye tracking, detecting AI writing patterns, and building your skill roadmap.</p>
        </div>
      )}

      {/* ── TAB 1: OVERVIEW & ATS SCORE ── */}
      {!isAnalyzing && analysisData && activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            
            {/* ATS Score Gauge (4 cols) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-4 neo-surface rounded-3xl p-6 sm:p-8 text-center flex flex-col justify-between shadow-sm space-y-6 bg-white dark:bg-[#13141f]">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">ATS Compatibility Score</span>
                <div className="relative w-40 h-40 mx-auto flex items-center justify-center my-4">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="68" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                    <circle cx="80" cy="80" r="68" stroke="currentColor" strokeWidth="12" className="text-emerald-500" strokeDasharray="427" strokeDashoffset={427 - (427 * (analysisData?.atsScore || 92)) / 100} strokeLinecap="round" fill="transparent" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 font-mono block">{analysisData?.atsScore || 92}%</span>
                    <span className="text-xs font-extrabold uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-0.5 rounded-full">
                      Excellent
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-left text-xs sm:text-sm font-extrabold">
                {Object.entries(analysisData?.atsBreakdown || {}).map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between capitalize text-slate-800 dark:text-slate-200">
                      <span>{key}</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{val.score}/{val.max}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden neo-inset">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(val.score / val.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Rejection Risk Meter (4 cols) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-4 neo-surface rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm space-y-6 bg-white dark:bg-[#13141f]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">ATS Rejection Risk</span>
                  <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 text-xs font-black">
                    {analysisData?.rejectionRisk?.riskLevel || "Low Risk"}
                  </Badge>
                </div>

                <div className="mt-4 p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-center">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block uppercase tracking-wider">Probability of Rejection</span>
                  <span className="text-4xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1 block">
                    {analysisData?.rejectionRisk?.probability || 23}%
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-extrabold block">Primary Risk Drivers</span>
                {(analysisData?.rejectionRisk?.reasons || []).map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{reason}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* What ATS Sees vs What ATS Ignores (4 cols) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-4 neo-surface rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm space-y-6 bg-white dark:bg-[#13141f]">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">Parser Extraction Diagnostic</span>
                
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-1">
                    <span className="font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Detected Fields
                    </span>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                      Name: {analysisData?.atsSees?.candidateName || "Detected"}, Email: {analysisData?.atsSees?.email || "Detected"}, Skills: {analysisData?.atsSees?.skills?.length || 8} Tags
                    </p>
                  </div>

                  {analysisData?.atsSees?.undetectedWarnings?.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-1">
                      <span className="font-extrabold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" /> Undetected Fields Warning
                      </span>
                      <p className="text-xs text-rose-700 dark:text-rose-400 font-semibold">
                        Could not detect: {analysisData.atsSees.undetectedWarnings.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-extrabold block">What ATS Ignores &amp; Filters Out</span>
                <div className="space-y-1.5 text-xs sm:text-sm">
                  {(analysisData?.atsIgnores || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      )}

      {/* ── TAB 2: KEYWORDS & DENSITY ── */}
      {!isAnalyzing && analysisData && activeTab === "keywords" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Found vs Missing Keywords (6 cols) */}
            <div className="md:col-span-6 neo-surface rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm bg-white dark:bg-[#13141f]">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" /> Required Tech Stack Keyword Audit
              </h3>

              <div className="space-y-5">
                <div className="space-y-2.5">
                  <span className="text-xs uppercase font-extrabold text-emerald-600 dark:text-emerald-400 block tracking-wider">✓ Matched Keywords Found in Resume</span>
                  <div className="flex flex-wrap gap-2">
                    {(analysisData?.keywordAnalysis?.found || []).map((kw) => (
                      <span key={kw} className="text-xs sm:text-sm font-extrabold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs uppercase font-extrabold text-rose-600 dark:text-rose-400 block tracking-wider">✖ Missing Keywords Required for Role</span>
                  <div className="flex flex-wrap gap-2">
                    {(analysisData?.keywordAnalysis?.missing || []).map((kw) => (
                      <span key={kw} className="text-xs sm:text-sm font-extrabold px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Keyword Density Breakdown & JD Match (6 cols) */}
            <div className="md:col-span-6 neo-surface rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm bg-white dark:bg-[#13141f]">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" /> Keyword Density &amp; Job Match Score
              </h3>

              <div className="space-y-4">
                {Object.entries(analysisData?.keywordDensity || {}).map(([k, v]) => (
                  <div key={k} className="space-y-1">
                    <div className="flex justify-between text-xs sm:text-sm font-extrabold capitalize text-slate-800 dark:text-slate-200">
                      <span>{k.replace("Percent", "")}</span>
                      <span className="font-mono text-purple-600 dark:text-purple-400">{v}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden neo-inset">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {analysisData?.jdMatch && (
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 flex items-center justify-between">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-indigo-900 dark:text-indigo-200 block">Job Description Match Score</span>
                    <span className="text-xs text-indigo-500 font-medium">Calculated against target job posting</span>
                  </div>
                  <span className="text-3xl font-black text-indigo-600 font-mono">{analysisData.jdMatch.overallMatchPercent}%</span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── TAB 3: RECRUITER & AI DETECTOR ── */}
      {!isAnalyzing && analysisData && activeTab === "recruiter" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* AI Writing Detector Box (6 cols) */}
            <div className="md:col-span-6 neo-surface rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm bg-white dark:bg-[#13141f]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-500" /> AI Content &amp; Pattern Detection
                </h3>
                <Badge className="bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/40 text-xs font-black">
                  {analysisData?.aiDetection?.humanPercent || 65}% Human Written
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block uppercase">AI Generated Content</span>
                  <span className="text-3xl font-black text-indigo-600 font-mono mt-1 block">
                    {analysisData?.aiDetection?.aiPercent || 35}%
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block uppercase">Human Originality</span>
                  <span className="text-3xl font-black text-emerald-600 font-mono mt-1 block">
                    {analysisData?.aiDetection?.humanPercent || 65}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-extrabold block">AI Pattern Diagnostics</span>
                {(analysisData?.aiDetection?.explanations || []).map((exp, idx) => (
                  <div key={idx} className="text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                    &bull; {exp}
                  </div>
                ))}
              </div>
            </div>

            {/* Recruiter Strengths & Weaknesses (6 cols) */}
            <div className="md:col-span-6 neo-surface rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm bg-white dark:bg-[#13141f]">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-500" /> Executive Recruiter Insights
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-2">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase block tracking-wider">✓ Recruiter Strengths</span>
                  {(analysisData?.recruiterInsights?.strengths || []).map((st, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-900">
                      ✅ {st}
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 uppercase block tracking-wider">⚠ Recruiter Weaknesses</span>
                  {(analysisData?.recruiterInsights?.weaknesses || []).map((wk, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-900">
                      ⚠️ {wk}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── TAB 4: INTERACTIVE SKILL ROADMAP & SALARY (KILLER FEATURE!) ── */}
      {!isAnalyzing && analysisData && activeTab === "roadmap" && (
        <div className="space-y-8">
          
          {/* Salary Prediction Banner */}
          <div className="neo-surface p-6 sm:p-8 rounded-3xl border border-indigo-500/30 shadow-md bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-widest mb-1">
                <DollarSign className="w-4 h-4" /> AI Salary Prediction Model
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">Target Salary Potential</h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Estimated compensation increase after completing the skill roadmap.</p>
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Resume</span>
                <span className="text-lg font-black font-mono text-slate-200">{analysisData?.salaryPrediction?.currentExpected || "$95,000 – $120,000"}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Post-Roadmap Target</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">{analysisData?.salaryPrediction?.postRoadmapExpected || "$140,000 – $175,000"}</span>
              </div>
              <Badge className="bg-emerald-500 text-white font-black text-xs px-3.5 py-1">
                {analysisData?.salaryPrediction?.potentialIncreasePercent || "+42% Boost"}
              </Badge>
            </div>
          </div>

          {/* Interactive Skill Roadmap Node Graph */}
          <div className="neo-surface p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 bg-white dark:bg-[#13141f]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-indigo-500" /> Interactive Skill Progression Roadmap
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Click any skill node below to view curated learning resources, target projects, and interview questions.</p>
              </div>
            </div>

            {/* Sequential Nodes List */}
            <div className="relative pt-4 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                {(analysisData?.skillRoadmap || []).map((node, idx) => {
                  const isCompleted = node.status === "completed";
                  return (
                    <motion.div
                      key={node.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => setSelectedRoadmapNode(node)}
                      className={`p-5 rounded-3xl border cursor-pointer transition-all duration-200 relative shadow-sm ${
                        isCompleted
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-100"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                          Step {idx + 1}
                        </span>
                        <Badge className={isCompleted ? "bg-emerald-500 text-white font-extrabold" : "bg-indigo-600 text-white font-extrabold"}>
                          {node.status}
                        </Badge>
                      </div>

                      <h4 className="text-base font-black mb-1">{node.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{node.category} • {node.estimatedTime}</p>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                        <span>View Resources</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Node Detail Drawer Modal */}
          {selectedRoadmapNode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#13141f] rounded-3xl p-8 w-full max-w-2xl space-y-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <Badge className="bg-indigo-600 text-white text-xs font-black uppercase mb-1">
                      {selectedRoadmapNode.category} • {selectedRoadmapNode.difficulty}
                    </Badge>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{selectedRoadmapNode.name}</h3>
                  </div>
                  <button onClick={() => setSelectedRoadmapNode(null)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider block flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-500" /> Curated Learning Resources &amp; Documentation
                    </span>
                    <ul className="space-y-1 pl-4 list-disc text-slate-600 dark:text-slate-300 font-medium">
                      {selectedRoadmapNode.learningResources?.map((res, i) => (
                        <li key={i}>{res}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider block flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-purple-500" /> Recommended Portfolio Project
                    </span>
                    <ul className="space-y-1 pl-4 list-disc text-slate-600 dark:text-slate-300 font-medium">
                      {selectedRoadmapNode.targetProjects?.map((proj, i) => (
                        <li key={i}>{proj}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider block flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-emerald-500" /> Top Interview Technical Questions
                    </span>
                    <ul className="space-y-1 pl-4 list-disc text-slate-600 dark:text-slate-300 font-medium">
                      {selectedRoadmapNode.interviewQuestions?.map((q, i) => (
                        <li key={i}>&ldquo;{q}&rdquo;</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Button onClick={() => setSelectedRoadmapNode(null)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 text-xs font-extrabold h-11">
                    Close Skill Drawer
                  </Button>
                </div>
              </motion.div>
            </div>
          )}

        </div>
      )}

      {/* ── TAB 5: HEATMAP & AI RECOMMENDATIONS ── */}
      {!isAnalyzing && analysisData && activeTab === "heatmap" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Visual Heatmap Overlay (6 cols) */}
            <div className="md:col-span-6 neo-surface rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm bg-white dark:bg-[#13141f]">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" /> Visual Section Heatmap &amp; Diagnostic
              </h3>

              <div className="space-y-3">
                {(analysisData?.heatmap || []).map((hm, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border flex items-center justify-between text-xs sm:text-sm font-bold" style={{
                    backgroundColor: hm.color === "green" ? "rgba(34, 197, 94, 0.08)" : hm.color === "yellow" ? "rgba(245, 158, 11, 0.08)" : "rgba(239, 68, 68, 0.08)",
                    borderColor: hm.color === "green" ? "rgba(34, 197, 94, 0.3)" : hm.color === "yellow" ? "rgba(245, 158, 11, 0.3)" : "rgba(239, 68, 68, 0.3)",
                  }}>
                    <div>
                      <span className="text-slate-900 dark:text-slate-100 font-black block">{hm.section}</span>
                      <span className="text-xs text-slate-500 font-medium">{hm.comment}</span>
                    </div>
                    <Badge className={hm.color === "green" ? "bg-emerald-500 text-white font-extrabold" : hm.color === "yellow" ? "bg-amber-500 text-white font-extrabold" : "bg-rose-500 text-white font-extrabold"}>
                      {hm.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Prioritized Recommendations (6 cols) */}
            <div className="md:col-span-6 neo-surface rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm bg-white dark:bg-[#13141f]">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-500" /> Prioritized AI Action Recommendations
              </h3>

              <div className="space-y-4">
                {(analysisData?.prioritizedRecommendations || []).map((rec) => (
                  <div key={rec.priority} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-black">
                      <span className="text-indigo-600 dark:text-indigo-400">Priority #{rec.priority}: {rec.title}</span>
                      <Badge className="bg-emerald-500 text-white font-mono text-xs font-bold">
                        ATS Boost: {rec.atsImprovement}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{rec.action}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── PDF / DOCX DOCUMENT VIEWER MODAL ── */}
      {showViewResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#13141f] rounded-3xl p-6 sm:p-8 w-full max-w-4xl space-y-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <FileType className="w-6 h-6 text-indigo-500" />
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    Resume Document Viewer
                    {fileType === "pdf" && <Badge className="bg-rose-500 text-white text-[10px] font-black">PDF DOCUMENT</Badge>}
                    {fileType === "docx" && <Badge className="bg-blue-600 text-white text-[10px] font-black">WORD DOCX</Badge>}
                    {fileType === "text" && <Badge className="bg-slate-700 text-white text-[10px] font-black">TEXT / MARKDOWN</Badge>}
                  </h3>
                  {fileName && (
                    <p className="text-xs text-slate-500 font-semibold">{fileName}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setShowViewResumeModal(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold hover:bg-slate-200 dark:hover:bg-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Tab Controls */}
            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl shrink-0">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setModalViewTab("visual")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    modalViewTab === "visual"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Visual Document Viewer
                </button>

                <button
                  type="button"
                  onClick={() => setModalViewTab("text")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    modalViewTab === "text"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Parsed Text View
                </button>

                <button
                  type="button"
                  onClick={() => setModalViewTab("edit")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    modalViewTab === "edit"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Resume Text
                </button>
              </div>

              <span className="text-xs text-slate-500 font-bold hidden sm:inline-block pr-2">
                {resumeText.length} Chars • {resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0} Words
              </span>
            </div>

            {/* Modal Body Canvas */}
            <div className="flex-1 overflow-hidden min-h-[450px] relative">
              
              {/* TAB 1: VISUAL DOCUMENT VIEWER (PDF / DOCX CANVAS) */}
              {modalViewTab === "visual" && (
                <div className="w-full h-full min-h-[450px]">
                  {fileType === "pdf" && fileUrl ? (
                    <iframe
                      src={fileUrl}
                      className="w-full h-full min-h-[480px] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner"
                      title="PDF Resume Document Viewer"
                    />
                  ) : fileType === "docx" && docxHtml ? (
                    <div
                      className="w-full h-full min-h-[450px] max-h-[480px] overflow-y-auto p-8 sm:p-12 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner docx-document-canvas"
                      dangerouslySetInnerHTML={{ 
                        __html: docxHtml
                          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                          .replace(/on\w+="[^"]*"/gi, "")
                          .replace(/on\w+='[^']*'/gi, "")
                          .replace(/javascript:/gi, "")
                      }}
                    />
                  ) : (
                    <div className="w-full h-full min-h-[450px] overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm whitespace-pre-wrap">
                      {resumeText}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PARSED TEXT VIEW */}
              {modalViewTab === "text" && (
                <div className="w-full h-full min-h-[450px] max-h-[480px] overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {resumeText}
                </div>
              )}

              {/* TAB 3: EDIT RESUME TEXT */}
              {modalViewTab === "edit" && (
                <div className="w-full h-full min-h-[450px]">
                  <Textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full h-full min-h-[450px] p-6 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm resize-none text-slate-900 dark:text-slate-100 rounded-2xl"
                  />
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyResumeText}
                className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl h-11 flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" /> Copy Text
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    setShowViewResumeModal(false);
                    runAnalysisWithContent(resumeText);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl px-6 h-11 shadow-md flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Re-Analyze Resume
                </Button>
              </div>
            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
}
