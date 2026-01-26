import { Skeleton } from "@/components/ui/skeleton";

export default function SubIndustryDetailLoading() {
  return (
    <div className="container mx-auto p-6 space-y-8">
       {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-4">
           <Skeleton className="h-12 w-64" />
           <div className="flex gap-2">
             <Skeleton className="h-6 w-24 rounded-full" />
             <Skeleton className="h-6 w-24 rounded-full" />
           </div>
        </div>
        <Skeleton className="h-16 w-32" />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {/* Tech Stack Card */}
         <div className="border rounded-xl p-6 h-64 space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-3/4" />
               <Skeleton className="h-4 w-1/2" />
            </div>
         </div>
         {/* Salary Card */}
         <div className="border rounded-xl p-6 h-64 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-[150px] w-full" />
         </div>
         {/* Trends Card */}
         <div className="border rounded-xl p-6 h-64 space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-full" />
            </div>
         </div>
      </div>
    </div>
  );
}
