"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Save, ArrowLeft, Download } from "lucide-react";
import { updateCoverLetter } from "@/actions/cover-letter";
import { generateCoverLetter } from "@/actions/generate-cover-letter"; // We need this action
import { toast } from "sonner";
import Link from "next/link";
import CoverLetterPreview from "./CoverLetterPreview";

const formSchema = z.object({
  jobTitle: z.string().min(1, "Job Title is required"),
  companyName: z.string().min(1, "Company Name is required"),
  jobDescription: z.string().min(1, "Job Description is required"),
});

export default function CoverLetterGenerator({ coverLetter }) {
  const [content, setContent] = useState(coverLetter.content || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
          jobTitle: coverLetter.jobTitle,
          companyName: coverLetter.companyName,
          jobDescription: coverLetter.jobDescription,
      }
  });

  const formData = watch();

  const handleGenerate = async () => {
      setIsGenerating(true);
      try {
          // Call AI Generation Action
          const generatedText = await generateCoverLetter({
              ...formData,
              // We assume backend fetches resume implicitly or we pass resume ID
              // Let's create a server action that fetches the user's resume for context
          });
          setContent(generatedText);
          toast.success("Cover Letter generated successfully!");
          setActiveTab("editor");
      } catch (error) {
          console.error(error);
          toast.error("Failed to generate cover letter");
      } finally {
          setIsGenerating(false);
      }
  };

  const handleSave = async () => {
      setIsSaving(true);
      try {
          await updateCoverLetter(coverLetter.id, content);
          toast.success("Saved successfully");
      } catch (error) {
          toast.error("Failed to save");
      } finally {
          setIsSaving(false);
      }
  };

  return (
    <div className="flex flex-col space-y-4 h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Link href="/cover-letter">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <h1 className="text-2xl font-bold">Cover Letter Builder</h1>
            </div>
            <div className="space-x-2">
                <Button variant="outline" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save
                </Button>
                <Button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    Generate with AI
                </Button>
            </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-hidden">
            {/* Left Panel: Job Details */}
            <Card className="flex flex-col h-full overflow-hidden">
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>Edit these details to regenerate the letter.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Job Title</label>
                        <Input {...register("jobTitle")} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Company Name</label>
                        <Input {...register("companyName")} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Job Description</label>
                        <Textarea 
                            {...register("jobDescription")} 
                            className="min-h-[300px] flex-1"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Right Panel: Editor & Preview */}
            <div className="flex flex-col h-full overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="editor">Editor</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="editor" className="flex-1 h-full min-h-0 overflow-hidden mt-4 border rounded-md relative">
                        {/* Relative needed for MDEditor absolute positioning if used, but here standard flow. */}
                        <MDEditor
                            value={content}
                            onChange={setContent}
                            preview="edit"
                            height="100%"
                            className="h-full"
                        />
                    </TabsContent>

                    <TabsContent value="preview" className="flex-1 h-full min-h-0 overflow-y-auto mt-4 border rounded-md bg-gray-50 p-4">
                        <CoverLetterPreview content={content} className="min-h-full" />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    </div>
  );
}
