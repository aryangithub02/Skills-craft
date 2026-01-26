"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";
import { Loader2, ArrowRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import useFetch from "@/hooks/use-fetch";

const onboardingSchema = z.object({
  industry: z.string().min(1, "Please select an industry"),
  subIndustry: z.string().min(1, "Please select a specialization"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(500, "Bio must not exceed 500 characters"),
  experience: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().min(0, "Experience must be at least 0 years").max(50, "Experience cannot exceed 50 years")),
  skills: z.array(z.string()).min(1, "Please add at least one skill"),
});

export default function OnboardingForm({ industries }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [currentSkill, setCurrentSkill] = useState("");

  const {
      loading: updateLoading,
      fn: updateUserFn,
      data: updateResult,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      skills: [],
      experience: 0,
      bio: "",
    },
  });

  const watchIndustry = watch("industry");
  const watchSkills = watch("skills");

  // Reset skills and subIndustry when industry changes
  useEffect(() => {
     if(watchIndustry) {
         const ind = industries.find((ind) => ind.id === watchIndustry);
         setSelectedIndustry(ind);
         setValue("subIndustry", ""); // Reset subIndustry
     }
  }, [watchIndustry, industries, setValue]);


  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(["industry", "subIndustry", "experience"]);
    } else if (currentStep === 2) {
      isValid = await trigger(["skills"]);
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      const skill = currentSkill.trim();
      if (skill && !watchSkills.includes(skill)) {
        setValue("skills", [...watchSkills, skill]);
        setCurrentSkill("");
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setValue(
      "skills",
      watchSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const onSubmit = async (values) => {
      const formattedIndustry = `${values.industry}-${values.subIndustry.toLowerCase().replace(/ /g, "-")}`;

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
  };

  useEffect(() => {
      if (updateResult?.success && !updateLoading) {
        toast.success("Profile completed successfully!");
        router.push("/dashboard");
        router.refresh();
      }
  }, [updateResult, updateLoading])

  // Progress Bar
  const renderProgress = () => {
      const progress = ((currentStep - 1) / 2) * 100;
      return (
          <div className="w-full bg-muted rounded-full h-2 mb-8 overflow-hidden">
              <div
                  className="bg-primary h-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
              />
          </div>
      )
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {renderProgress()}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {currentStep === 1 && "Start Your Journey"}
            {currentStep === 2 && "Add Your Skills"}
            {currentStep === 3 && "Professional Bio"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Tell us about your professional background."}
            {currentStep === 2 && "What are your key technical strengths?"}
            {currentStep === 3 && "A brief description for your AI generation."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* STEP 1: CAREER CONTEXT */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    onValueChange={(value) => setValue("industry", value)}
                    value={watchIndustry}
                  >
                    <SelectTrigger id="industry">
                       <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind.id} value={ind.id}>
                          {ind.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.industry && (
                    <p className="text-sm text-red-500">{errors.industry.message}</p>
                  )}
                </div>

                {watchIndustry && (
                  <div className="space-y-2">
                    <Label htmlFor="subIndustry">Specialization</Label>
                    <Select
                      onValueChange={(value) => setValue("subIndustry", value)}
                      value={watch("subIndustry")}
                    >
                      <SelectTrigger id="subIndustry">
                         <SelectValue placeholder="Select your specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedIndustry?.subIndustries.map((sub) => (
                          <SelectItem key={sub.slug} value={sub.slug}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subIndustry && (
                      <p className="text-sm text-red-500">
                        {errors.subIndustry.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    placeholder="e.g., 5"
                    {...register("experience")}
                  />
                  <p className="text-xs text-muted-foreground">
                      Enter 0 if you are a student or fresher.
                  </p>
                  {errors.experience && (
                    <p className="text-sm text-red-500">{errors.experience.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: SKILLS */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="skills">Add Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      id="skills"
                      placeholder="e.g., Python, React, Project Management"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyDown={handleAddSkill}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => handleAddSkill(e)}
                    >
                      Add
                    </Button>
                  </div>
                   <p className="text-xs text-muted-foreground">
                      Press Enter to add a skill.
                  </p>
                  {errors.skills && (
                    <p className="text-sm text-red-500">{errors.skills.message}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    {watchSkills.length > 0 ? (
                        watchSkills.map((skill) => (
                            <div
                                key={skill}
                                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                            >
                                {skill}
                                <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="text-primary hover:text-red-500"
                                >
                                <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PROFESSIONAL BIO */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Example: Final-year CS student interested in backend development..."
                    className="h-40"
                    {...register("bio")}
                  />
                  <p className="text-xs text-muted-foreground">
                     Minimum 10 characters. This helps us generate personalized content.
                  </p>
                  {errors.bio && (
                    <p className="text-sm text-red-500">{errors.bio.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        disabled={isSubmitting}
                     >
                        Back
                     </Button>
                )}

              {currentStep < 3 && (
                <Button
                    type="button"
                    onClick={handleNextStep}
                    className={cn("ml-auto", currentStep === 1 && "w-full")} // Full width on step 1
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}

              {currentStep === 3 && (
                <Button type="submit" className="ml-auto" disabled={updateLoading}>
                  {updateLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Finish Setup"
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
