import { Skeleton } from "@/components/ui/skeleton";

/**
 * Render a skeleton UI for the dashboard loading state.
 *
 * @returns {JSX.Element} A React element containing placeholder Skeletons that mirror the dashboard layout while content is loading.
 */
export default function DashboardLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 border rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 border rounded-xl p-6 h-[400px]">
          <Skeleton className="h-6 w-48 mb-6" />
          <Skeleton className="h-[300px] w-full" />
        </div>
        <div className="col-span-3 border rounded-xl p-6 h-[400px]">
           <Skeleton className="h-6 w-48 mb-6" />
           <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex gap-4">
                 <Skeleton className="h-12 w-12 rounded-full" />
                 <div className="space-y-2 flex-1">
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-3 w-2/3" />
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}