import { Skeleton } from "@/components/ui/skeleton";

export default function SubIndustryLoading() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section Skeleton */}
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

      {/* Chart Section Skeleton */}
      <div className="grid md:grid-cols-3 gap-6">
         <div className="md:col-span-2 border rounded-xl p-6 h-[450px]">
             <Skeleton className="h-6 w-48 mb-6" />
             <Skeleton className="h-[350px] w-full" />
         </div>
         <div className="border rounded-xl p-6 h-[450px] space-y-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-40 w-40 rounded-full mx-auto" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
         </div>
      </div>
    </div>
  );
}
