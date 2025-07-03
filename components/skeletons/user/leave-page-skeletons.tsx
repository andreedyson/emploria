import { Skeleton } from "@/components/ui/skeleton";

function LeavePageSkeletons() {
  return (
    <>
      {/* Stats Card Skeletons */}
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-[70px] w-full" key={index} />
        ))}
      </div>

      {/* Apply Leave Dialog Button Skeleton */}
      <div className="flex h-full w-full items-end justify-end gap-2 sm:mt-4">
        <Skeleton className="h-8 w-full max-w-[120px]" />
      </div>

      {/* Leave Table */}
      <Skeleton className="mt-4 h-[400px] w-full md:h-[600px]" />
    </>
  );
}

export default LeavePageSkeletons;
