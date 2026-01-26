"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Use the same industries list as onboarding (can be imported   or hardcoded for now)
import { industries } from "@/data/industries"; 

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email().optional(), // Read only
  bio: z.string().optional(),
  industry: z.string().min(1, "Please select an industry"),
  image: z.string().url("Invalid URL").optional().or(z.literal("")),
});

/**
 * Render a profile information card that supports viewing and editing user details.
 *
 * @param {Object} props.user - User data used to initialize form fields and avatar.
 * @param {string} [props.user.name] - User's full name (editable).
 * @param {string} [props.user.email] - User's email (read-only).
 * @param {string} [props.user.bio] - User biography (editable).
 * @param {string} [props.user.industry] - Industry id used to select the user's industry.
 * @param {string} [props.user.image] - URL for the user's avatar image (editable).
 * @returns {JSX.Element} A React element rendering the profile form with view/edit toggle, validation, and save behavior.
 */
export default function ProfileForm({ user }) {
  const { update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      bio: user.bio || "",
      industry: user.industry || "",
      image: user.image || "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateUser(data);
      // Update session client-side to reflect changes in Header immediately
      await update({
        name: data.name,
        image: data.image
      });
      router.refresh();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const currentName = watch("name");
  const currentImage = watch("image");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Profile Information</span>
                    <Button 
                        variant={isEditing ? "ghost" : "outline"} 
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                </CardTitle>
                <CardDescription>Update your personal details and professional info</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24 border-2 border-primary/10">
                            <AvatarImage src={currentImage || user.image} alt={currentName} />
                            <AvatarFallback className="text-3xl font-bold">
                                {currentName?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        
                        {isEditing && (
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Profile Image URL</label>
                                <Input {...register("image")} placeholder="https://example.com/avatar.jpg" />
                                <p className="text-xs text-muted-foreground">
                                    Provide a public URL for your profile picture.
                                </p>
                                {errors.image && <p className="text-red-500 text-xs">{errors.image.message}</p>}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input {...register("name")} disabled={!isEditing} />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>

                        {/* Email (Read Only) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Email (Cannot be changed)</label>
                            <Input {...register("email")} disabled className="bg-muted/50" />
                        </div>

                        {/* Industry */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Industry</label>
                            {isEditing ? (
                                <Select 
                                    onValueChange={(val) => setValue("industry", val)}
                                    defaultValue={user.industry}
                                >
                                    <SelectTrigger>
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
                            ) : (
                                <div className="p-2 border rounded-md bg-muted/20 px-3 py-2 text-sm">
                                    {industries.find(i => i.id === user.industry)?.name || user.industry || "Not specified"}
                                </div>
                            )}
                             {errors.industry && <p className="text-red-500 text-xs">{errors.industry.message}</p>}
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Bio</label>
                        {isEditing ? (
                            <Textarea 
                                {...register("bio")} 
                                placeholder="Tell us about your professional background..." 
                                className="min-h-[100px]"
                            />
                        ) : (
                            <div className="p-3 border rounded-md bg-muted/20 min-h-[100px] text-sm whitespace-pre-wrap">
                                {user.bio || "No bio added yet."}
                            </div>
                        )}
                         {errors.bio && <p className="text-red-500 text-xs">{errors.bio.message}</p>}
                    </div>

                    {isEditing && (
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                        </div>
                    )}
                </form>
            </CardContent>
       </Card>
    </div>
  );
}