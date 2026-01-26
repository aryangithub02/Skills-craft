"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveResume } from "@/actions/resume";
import { improveWithAI } from "@/lib/ai/improveResume";
import ResumePreview from "./ResumePreview";
import EntryForm from "./EntryForm";

const resumeSchema = z.object({
  contactInfo: z.object({
    name: z.string().min(1, "Name is required"), // Added Name
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    location: z.string().optional(), // Added Location
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
  }),
  summary: z.string().min(1, "Summary is required"),
  skills: z.string().optional(),
  experience: z.array(z.object({
    title: z.string().optional(),
    organization: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().optional(), // Keeping for backward compatibility or summary line if needed, but mainly focusing on bullets
    bullets: z.array(z.string()).optional(),
    current: z.boolean().optional(),
  })).optional(),
  education: z.array(z.object({
    title: z.string().optional(), // Degree
    organization: z.string().optional(), // School
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().optional(),
    current: z.boolean().optional(),
  })).optional(),
  projects: z.array(z.object({
    title: z.string().optional(), // Project Name
    techStack: z.string().optional(), 
    github: z.string().optional(),
    link: z.string().optional(),
    bullets: z.array(z.string()).optional(),
  })).optional(),
  certifications: z.array(z.object({
    name: z.string().optional(),
    issuer: z.string().optional(),
    date: z.string().optional(),
  })).optional(),
  achievements: z.string().optional(),
});

export default function ResumeBuilder({ initialContent, initialData }) { // Added initialData
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Initialize form with saved data or default structure
  const { control, register, handleSubmit, watch, setValue, getValues, reset, formState: { errors } } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialData || { 
      contactInfo: { 
            name: "", // Added
            email: "", 
            phone: "", 
            location: "", // Added
            linkedin: "", 
            twitter: "" 
      },
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      achievements: "",
    }
  });

  // Legacy Recovery: Parse logic for existing resumes that have content but no JSON
  useEffect(() => {
    if (initialContent && !initialData) {
        // Attempt to parse Markdown back to Form Data
        // This is a "best effort" parser for legacy support
        const parsed = { 
            contactInfo: { name: "", email: "", phone: "", location: "", linkedin: "", twitter: "" },
            summary: "",
            skills: "",
            experience: [],
            education: [],
            projects: [],
            certifications: [],
            achievements: ""
        };

        const lines = initialContent.split('\n');
        let currentSection = "";
        let buffer = [];

        // Simple Contact/Header Parser
        // Try to find a name if it's the first line and starts with #
        if (lines[0] && lines[0].startsWith("# ")) {
             parsed.contactInfo.name = lines[0].replace("# ", "").trim();
        }
        // Try to find location if it's the second line and not a contact line
        if (lines[1] && !lines[1].includes("@") && !lines[1].includes("http") && !lines[1].includes("Contact:")) {
            parsed.contactInfo.location = lines[1].trim();
        }
        
        const contactLine = lines.find(l => l.includes("@") || l.includes("http") || l.includes("Contact:")); // Basic heuristic for email/links line
        if (contactLine) {
            // Very fuzzy parsing for contact details
            const parts = contactLine.split("|").map(s => s.trim());
            parts.forEach(p => {
                if (p.includes("@")) parsed.contactInfo.email = p.replace(/📧\s*/, "");
                else if (p.includes("linkedin.com")) parsed.contactInfo.linkedin = p.replace(/🔗\s*/, "");
                else if (p.includes("twitter.com") || p.includes("github.com") || p.includes("portfolio")) parsed.contactInfo.twitter = p.replace(/🔗\s*/, ""); // Assuming twitter field can hold other portfolio links
                else if (/^\+?\d/.test(p) || p.replace(/\s/g, '').match(/^\d{3}-\d{3}-\d{4}$/)) parsed.contactInfo.phone = p.replace(/📱\s*/, "");
            });
        }

        // Section Parser
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith("## ")) {
                currentSection = line.replace("## ", "").trim();
                buffer = []; 
                continue;
            }

            if (currentSection === "Professional Summary") {
                 // Capture all text until next section
                 if (line && !line.startsWith("#")) {
                    parsed.summary += line + "\n";
                 }
            }
            if (currentSection === "Skills") {
                if (line && !line.startsWith("#")) {
                    parsed.skills += line + "\n";
                }
            }
            if (currentSection === "Certifications") {
                if (line && !line.startsWith("#")) {
                    const cleanLine = line.replace(/^- /, "").trim();
                    // Fuzzy parsing: "Name - Issuer"
                    // If multiple dashes, assume first is separator.
                    let name = cleanLine;
                    let issuer = "";
                    
                    if (cleanLine.includes(" - ") || cleanLine.includes(" – ")) {
                         const parts = cleanLine.split(/ – | - /);
                         name = parts[0];
                         issuer = parts.slice(1).join(" - ");
                    }
                    
                    parsed.certifications.push({ name, issuer, date: "" });
                }
            }
            if (currentSection === "Achievements") {
                if (line && !line.startsWith("#")) {
                    parsed.achievements += line.replace(/^- /, "") + "\n";
                }
            }
            // Note: Experience/Education/Projects parsing from this simple loop is hard
            // We focus on recovering the text blobs (Summary/Skills) and Contact.
            // Complex objects might be lost if we don't write a full parser, 
            // but for "preview" purposes, the summary is key.
            // Let's try to catch at least one level deep if possible.
        }

        // Cleanup
        parsed.summary = parsed.summary.trim();
        parsed.skills = parsed.skills.trim();
        
        // Reset form with partially recovered data
        reset(parsed); 
        toast.info("Restored basic info from your previous save. Please re-check Experience sections.");
    }
  }, [initialContent, initialData, reset]);

  // Watch all form data to generate markdown
  const formData = watch();

  useEffect(() => {
    // Generate Markdown from Form Data
    // only if active tab is edit (to avoid overwriting manual edits in preview if we allowed it, 
    // but here we are one-way binding for simplicity)
    
    if (activeTab === 'edit') {
        const md = generateMarkdown(formData);
        setPreviewContent(md);
    }
  }, [formData, activeTab]);

  const generateMarkdown = (data) => {
    const { contactInfo, summary, skills, experience, education, projects } = data;
    const parts = [];

    // Header Structure: Name, Location, Links
    if (contactInfo?.name) {
        parts.push(`# ${contactInfo.name}`);
    }
    
    if (contactInfo?.location) {
        parts.push(`${contactInfo.location}`);
    }

    // Contact Links Line
    const contactLinks = [];
    if (contactInfo?.email) contactLinks.push(`📧 ${contactInfo.email}`);
    if (contactInfo?.phone) contactLinks.push(`📱 ${contactInfo.phone}`);
    if (contactInfo?.linkedin) contactLinks.push(`🔗 ${contactInfo.linkedin}`);
    if (contactInfo?.twitter) contactLinks.push(`🔗 ${contactInfo.twitter}`);
    
    if (contactLinks.length > 0) {
        parts.push(contactLinks.join(" | "));
        parts.push(""); // Spacing
    }

    // Summary
    if (summary) {
        parts.push(`## Professional Summary\n\n${summary}`);
        parts.push("\n");
    }

    // Skills
    if (skills) {
        parts.push(`## Skills\n\n${skills}`);
        parts.push("\n");
    }

    // Work Experience
    if (experience && experience.length > 0) {
        parts.push(`## Work Experience\n`);
        experience.forEach(exp => {
            parts.push(`### ${exp.title}`);
            
            // Subtitle: Org | Date
            const expDetails = [];
            if (exp.organization) expDetails.push(exp.organization);
            const dateRange = `${exp.startDate || ""} - ${exp.endDate || (exp.current ? "Present" : "")}`;
            if (dateRange.trim() !== "-") expDetails.push(dateRange);

            if (expDetails.length > 0) {
                parts.push(`*${expDetails.join(" | ")}*`);
            }
            
            // Description (Paragraph)
            if (exp.description) {
                parts.push(`\n${exp.description}`);
            }

            // Bullets
            if (exp.bullets && exp.bullets.length > 0) {
                parts.push(""); // Spacing before list
                exp.bullets.forEach(bullet => {
                    if (bullet.trim()) parts.push(`- ${bullet.trim()}`);
                });
                parts.push(""); 
            }
            
            parts.push(""); // Spacing block
        });
    }

    // Projects
    if (projects && projects.length > 0) {
        parts.push(`## Projects\n`);
        projects.forEach(proj => {
             parts.push(`### ${proj.title}`);
             
             // Subtitle: Tech Stack
             if (proj.techStack) {
                parts.push(`*${proj.techStack}*`);
             }
             
             // Links
             const links = [];
             if (proj.github) links.push(`[GitHub](${proj.github})`);
             if (proj.link) links.push(`[Demo](${proj.link})`);
             if (links.length > 0) {
                parts.push(`${links.join(" | ")}`);
             }

             // Bullets
             if (proj.bullets && proj.bullets.length > 0) {
                parts.push(""); 
                proj.bullets.forEach(bullet => {
                    if (bullet.trim()) parts.push(`- ${bullet.trim()}`);
                });
                parts.push(""); 
            }
             parts.push(""); 
        });
    }

    // Education
    if (education && education.length > 0) {
        parts.push(`## Education\n`);
        education.forEach(edu => {
             parts.push(`### ${edu.title}`); // Degree
             
             // Subtitle: School | Date
             const eduDetails = [];
             if (edu.organization) eduDetails.push(edu.organization);
             const dateRange = `${edu.startDate || ""} - ${edu.endDate || (edu.current ? "Present" : "")}`;
             if (dateRange.trim() !== "-") eduDetails.push(dateRange);

             if (eduDetails.length > 0) {
                parts.push(`*${eduDetails.join(" | ")}*`);
             }
             
             // Description removed as per user request
             parts.push(""); // Spacing
        });
    }

    // Certifications
    if (data.certifications && data.certifications.length > 0) {
        parts.push(`## Certifications\n`);
        data.certifications.forEach(cert => {
            if (cert.name) {
                parts.push(`- **${cert.name}**${cert.issuer ? " – " + cert.issuer : ""}${cert.date ? " (" + cert.date + ")" : ""}`);
            }
        });
        parts.push("");
    }

    // Achievements
    if (data.achievements) {
        parts.push(`## Achievements\n`);
        data.achievements.split("\n").forEach(line => {
             if (line.trim()) {
                parts.push(`- ${line.trim().replace(/^- /, "")}`);
            }
        });
        parts.push("");
    }

    return parts.join("\n");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save the generated Markdown AND the structured form data
      const currentFormData = getValues();
      await saveResume(previewContent, currentFormData); // Pass JSON
      toast.success("Resume saved successfully");
    } catch (error) {
      toast.error("Failed to save resume");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImproveSummary = async () => {
    const currentSummary = watch("summary");
    if (!currentSummary) {
        toast.error("Please clean summary first");
        return;
    }

    setIsSummarizing(true);
    try {
        const improved = await improveWithAI({
            currentText: currentSummary,
            type: "Professional Summary"
        });
        setValue("summary", improved);
        toast.success("Summary improved successfully!");
    } catch (error) {
        toast.error("Failed to improve summary");
    } finally {
        setIsSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 h-[calc(100vh-100px)] w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Resume Builder</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
             {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown & Preview</TabsTrigger>
        </TabsList>

        <div className="flex-1 mt-4 border rounded-lg overflow-hidden flex">
          <TabsContent value="edit" className="flex-1 p-4 overflow-y-auto w-full h-full space-y-8">
             {/* Contact Info */}
             <Card>
                <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Full Name" {...register("contactInfo.name")} className="md:col-span-2 font-bold" />
                        {errors.contactInfo?.name && <p className="text-red-500 text-sm md:col-span-2">{errors.contactInfo.name.message}</p>}
                        
                        <Input placeholder="Email" {...register("contactInfo.email")} />
                        {errors.contactInfo?.email && <p className="text-red-500 text-sm">{errors.contactInfo.email.message}</p>}
                        
                        <Input placeholder="Phone (Optional)" {...register("contactInfo.phone")} />
                        <Input placeholder="Location (City, Country)" {...register("contactInfo.location")} />
                        
                        <Input placeholder="LinkedIn Profile" {...register("contactInfo.linkedin")} />
                        <Input placeholder="Twitter / Portfolio / GitHub" {...register("contactInfo.twitter")} />
                    </div>
                </CardContent>
             </Card>

             {/* Professional Summary */}
             <Card>
                <CardHeader><CardTitle>Professional Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <Textarea 
                        placeholder="Write a brief professional summary..." 
                        {...register("summary")} 
                        className="min-h-[150px]" 
                    />
                    <Button variant="ghost" size="sm" onClick={handleImproveSummary} disabled={isSummarizing}>
                       {isSummarizing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "✨ "} 
                       Improve with AI
                    </Button>
                </CardContent>
             </Card>

             {/* Skills */}
             <Card>
                <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
                 <CardContent>
                    <Textarea 
                        placeholder="List your key skills (e.g. React, Node.js, Project Management)..." 
                        {...register("skills")}
                        className="min-h-[100px]"
                    />
                </CardContent>
             </Card>

             {/* Experience */}
             <Card>
                <CardHeader><CardTitle>Work Experience</CardTitle></CardHeader>
                <CardContent>
                    <Controller
                        control={control}
                        name="experience"
                        render={({ field }) => (
                            <EntryForm type="Experience" entries={field.value} onChange={field.onChange} />
                        )} 
                    />
                </CardContent>
             </Card>

             {/* Education */}
             <Card>
                <CardHeader><CardTitle>Education</CardTitle></CardHeader>
                <CardContent>
                    <Controller
                        control={control}
                        name="education"
                        render={({ field }) => (
                            <EntryForm type="Education" entries={field.value} onChange={field.onChange} />
                        )} 
                    />
                </CardContent>
             </Card>

             {/* Projects */}
             <Card>
                 <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
                 <CardContent>
                    <Controller
                        control={control}
                        name="projects"
                        render={({ field }) => (
                            <EntryForm type="Project" entries={field.value} onChange={field.onChange} />
                        )} 
                    />
                 </CardContent>
             </Card>

             {/* Certifications (Structured) */}
             <Card>
                <CardHeader><CardTitle>Certifications</CardTitle></CardHeader>
                <CardContent>
                   <Controller
                       control={control}
                       name="certifications"
                       render={({ field }) => (
                           <EntryForm type="Certification" entries={field.value} onChange={field.onChange} />
                       )} 
                   />
                </CardContent>
             </Card>

             {/* Achievements (Text Area) */}
             <Card>
                <CardHeader><CardTitle>Achievements</CardTitle></CardHeader>
                <CardContent>
                   <Textarea 
                       placeholder="List your key achievements (e.g. Reduced server costs by 50%)..." 
                       {...register("achievements")}
                       className="min-h-[100px]"
                   />
                </CardContent>
             </Card>

          </TabsContent>

          <TabsContent value="preview" className="flex-1 h-full w-full overflow-hidden p-0 m-0">
             <div className="h-full w-full">
                <ResumePreview content={previewContent} isPreviewMode={true} onChange={setPreviewContent} />
             </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
