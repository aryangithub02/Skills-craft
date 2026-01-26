"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createCoverLetter } from "@/actions/cover-letter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const formSchema = z.object({
  jobTitle: z.string().min(1, "Job Title is required"),
  companyName: z.string().min(1, "Company Name is required"),
  jobDescription: z.string().min(1, "Job Description is required"),
});

export default function NewCoverLetterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await createCoverLetter(data);
      router.push(`/cover-letter/${response.id}`);
    } catch (error) {
      toast.error("Failed to create cover letter");
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-2xl">
      <Link href="/cover-letter" className="flex items-center text-sm text-muted-foreground mb-4 hover:text-primary">
         <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Link>
      
      <Card>
        <CardHeader>
          <CardTitle>New Cover Letter</CardTitle>
          <CardDescription>Enter the details of the job you are applying for.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Title</label>
              <Input placeholder="e.g. Senior Frontend Developer" {...register("jobTitle")} />
              {errors.jobTitle && <p className="text-red-500 text-sm">{errors.jobTitle.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input placeholder="e.g. Acme Corp" {...register("companyName")} />
              {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Job Description</label>
              <Textarea 
                placeholder="Paste the job description here..." 
                {...register("jobDescription")} 
                className="min-h-[200px]"
              />
              {errors.jobDescription && <p className="text-red-500 text-sm">{errors.jobDescription.message}</p>}
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create & Continue
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
