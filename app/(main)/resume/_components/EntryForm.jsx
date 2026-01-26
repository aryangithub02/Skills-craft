"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Loader2, Sparkles, Trash2 } from "lucide-react";
import { improveWithAI } from "@/lib/ai/improveResume";
import { toast } from "sonner";

export default function EntryForm({ type, entries = [], onChange }) {
  const [isImproving, setIsImproving] = useState(false);

  const handleAddAttribute = () => {
    let newEntry;
    if (type === "Project") {
        newEntry = {
            title: "",
            techStack: "",
            github: "",
            link: "",
            bullets: [""] 
        };
    } else if (type === "Experience") {
        newEntry = {
            title: "",
            organization: "",
            startDate: "",
            endDate: "",
            description: "", 
            bullets: [""],
            current: false,
        };
    } else if (type === "Certification") {
        newEntry = {
            name: "",
            issuer: "",
            date: ""
        };
    } else {
        newEntry = {
            title: "",
            organization: "",
            startDate: "",
            endDate: "",
            description: "",
            current: false,
        };
    }
    onChange([...entries, newEntry]);
  };

  const handleRemoveAttribute = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    onChange(newEntries);
  };

  // --- Project Bullet Logic ---
  const handleAddBullet = (entryIndex) => {
    const newEntries = [...entries];
    const currentBullets = newEntries[entryIndex].bullets || [];
    newEntries[entryIndex].bullets = [...currentBullets, ""];
    onChange(newEntries);
  };

  const handleRemoveBullet = (entryIndex, bulletIndex) => {
      const newEntries = [...entries];
      const currentBullets = newEntries[entryIndex].bullets || [];
      newEntries[entryIndex].bullets = currentBullets.filter((_, i) => i !== bulletIndex);
      onChange(newEntries);
  };

  const handleBulletChange = (entryIndex, bulletIndex, value) => {
      const newEntries = [...entries];
      const currentBullets = newEntries[entryIndex].bullets || [];
      currentBullets[bulletIndex] = value;
      newEntries[entryIndex].bullets = [...currentBullets]; // Trigger re-render
      onChange(newEntries);
  };
  // ---------------------------

  // AI Improvement for Description (Experience/Education)
  const handleImproveDescription = async (index, currentText) => {
    setIsImproving(true);
    try {
      const improvedText = await improveWithAI({
        currentText: currentText,
        type: type 
      });
      handleChange(index, "description", improvedText);
      toast.success("Description improved successfully!");
    } catch (error) {
      toast.error("Failed to improve description via AI");
    } finally {
      setIsImproving(false);
    }
  };

  // AI Improvement for Bullets (Project)
  // We use a separate state to track WHICH bullet is updating to show spinner correctly
  // Format: `${entryIndex}-${bulletIndex}`
  const [improvingBulletId, setImprovingBulletId] = useState(null);

  const handleImproveBullet = async (entryIndex, bulletIndex, currentText) => {
      if (!currentText || currentText.trim() === "") {
          toast.error("Please enter some text first");
          return;
      }

      setImprovingBulletId(`${entryIndex}-${bulletIndex}`);
      try {
          const improvedText = await improveWithAI({
              currentText: currentText,
              type: "Project Bullet" // Specific type for prompt engineering
          });
          handleBulletChange(entryIndex, bulletIndex, improvedText);
          toast.success("Bullet improved!");
      } catch (error) {
          toast.error("Failed to improve bullet");
      } finally {
          setImprovingBulletId(null);
      }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((entry, index) => (
            <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {type} {index + 1}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveAttribute(index)}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                
                <CardContent className="grid gap-4">
                    {/* --- PROJECT LAYOUT --- */}
                    {type === "Project" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Input 
                                        placeholder="Project Name"
                                        value={entry.title}
                                        onChange={(e) => handleChange(index, "title", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input 
                                        placeholder="Tech Stack (e.g. React, Node.js)"
                                        value={entry.techStack}
                                        onChange={(e) => handleChange(index, "techStack", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Input 
                                        placeholder="GitHub URL (Optional)"
                                        value={entry.github}
                                        onChange={(e) => handleChange(index, "github", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input 
                                        placeholder="Live Demo URL (Optional)"
                                        value={entry.link}
                                        onChange={(e) => handleChange(index, "link", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- EXPERIENCE LAYOUT (Dates + Org + Bullets) --- */}
                    {type === "Experience" && (
                         <div className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Input 
                                        placeholder="Job Title"
                                        value={entry.title}
                                        onChange={(e) => handleChange(index, "title", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input 
                                        placeholder="Company"
                                        value={entry.organization}
                                        onChange={(e) => handleChange(index, "organization", e.target.value)}
                                    />
                                </div>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Input 
                                        type="month"
                                        placeholder="Start Date"
                                        value={entry.startDate}
                                        onChange={(e) => handleChange(index, "startDate", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input 
                                        type="month"
                                        placeholder="End Date"
                                        disabled={entry.current}
                                        value={entry.endDate}
                                        onChange={(e) => handleChange(index, "endDate", e.target.value)}
                                    />
                                </div>
                             </div>
                             {/* Optional Description / Summary Line */}
                             <div className="space-y-2">
                                <Textarea 
                                   placeholder="Role Summary (Optional)"
                                   value={entry.description}
                                   onChange={(e) => handleChange(index, "description", e.target.value)}
                                   className="min-h-[60px]"
                                />
                             </div>
                         </div>
                    )}

                    {/* --- EDUCATION LAYOUT (Standard) --- */}
                    {type === "Education" && (
                        <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input 
                                    placeholder="Degree"
                                    value={entry.title}
                                    onChange={(e) => handleChange(index, "title", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input 
                                    placeholder="School/University"
                                    value={entry.organization}
                                    onChange={(e) => handleChange(index, "organization", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Input 
                                    type="month"
                                    placeholder="Start Date"
                                    value={entry.startDate}
                                    onChange={(e) => handleChange(index, "startDate", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input 
                                    type="month"
                                    placeholder="End Date"
                                    disabled={entry.current}
                                    value={entry.endDate}
                                    onChange={(e) => handleChange(index, "endDate", e.target.value)}
                                />
                            </div>
                        </div>

                        </>
                    )}

                    {/* --- CERTIFICATION LAYOUT --- */}
                    {type === "Certification" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input 
                                    placeholder="Certification Name"
                                    value={entry.name}
                                    onChange={(e) => handleChange(index, "name", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input 
                                    placeholder="Issuing Organization"
                                    value={entry.issuer}
                                    onChange={(e) => handleChange(index, "issuer", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input 
                                    placeholder="Date (e.g. 2024)"
                                    value={entry.date}
                                    onChange={(e) => handleChange(index, "date", e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* --- BULLETS SECTION (Project & Experience) --- */}
                    {(type === "Project" || type === "Experience") && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    {type === "Experience" ? "Responsibilities & Achievements" : "Key Features & Achievements"}
                                </label>
                                <div className="space-y-3">
                                    {(entry.bullets || []).map((bullet, bIndex) => (
                                        <div key={bIndex} className="flex items-center gap-2">
                                            <Input 
                                                placeholder={`Bullet point ${bIndex + 1}`}
                                                value={bullet}
                                                onChange={(e) => handleBulletChange(index, bIndex, e.target.value)}
                                            />
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                type="button"
                                                disabled={improvingBulletId === `${index}-${bIndex}`}
                                                onClick={() => handleImproveBullet(index, bIndex, bullet)}
                                                title="Improve with AI"
                                                className="text-indigo-600 hover:text-indigo-700"
                                            >
                                                {improvingBulletId === `${index}-${bIndex}` ? 
                                                    <Loader2 className="h-4 w-4 animate-spin" /> : 
                                                    <Sparkles className="h-4 w-4" />
                                                }
                                            </Button>
                                            {(entry.bullets || []).length > 1 && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    type="button"
                                                    onClick={() => handleRemoveBullet(index, bIndex)}
                                                >
                                                    <X className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => handleAddBullet(index)}>
                                        <Plus className="h-3 w-3 mr-1" /> Add Bullet
                                    </Button>
                                </div>
                            </div>
                    )}

                </CardContent>
            </Card>
        ))}
      </div>
      
      <Button type="button" variant="outline" onClick={handleAddAttribute} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add {type}
      </Button>
    </div>
  );
}
