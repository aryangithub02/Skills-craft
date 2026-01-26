"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteCoverLetter } from "@/actions/cover-letter";
import { toast } from "sonner";
import Link from "next/link";

export default function CoverLetterList({ coverLetters }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this cover letter?")) return;
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete cover letter");
    }
  };

  if (!coverLetters || coverLetters.length === 0) {
    return (
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-semibold text-muted-foreground">No cover letters yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first tailored cover letter to stand out.</p>
            <Link href="/cover-letter/new">
              <Button variant="outline">Create New</Button>
            </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coverLetters.map((cl) => (
        <Card key={cl.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl truncate" title={cl.jobTitle}>
                {cl.jobTitle || "Untitled Role"}
            </CardTitle>
            <CardDescription className="truncate">
                {cl.companyName || "Unknown Company"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm mb-4">
               Created {format(new Date(cl.createdAt), "MMM d, yyyy")}
            </div>
            <div className="flex justify-between gap-2">
                <Link href={`/cover-letter/${cl.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                         <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                </Link>
                <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleDelete(cl.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
