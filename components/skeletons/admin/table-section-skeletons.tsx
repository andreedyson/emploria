import { Skeleton } from "@/components/ui/skeleton";

function TableSectionSkeletons() {
  return (
    <>
      {/* Table Section Header Skeleton */}
      <div className="flex flex-col items-center justify-between md:flex-row">
        <div className="h-full w-full">
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 md:size-8" />
            <Skeleton className="h-8 w-full max-w-[200px]" />
          </div>
          <Skeleton className="mt-3 h-4 w-full max-w-[500px]" />
        </div>
        <div className="mt-4 flex w-full justify-end">
          <Skeleton className="h-8 w-full md:max-w-[180px]" />
        </div>
      </div>

      {/* Table Section Skeletons */}
      <div className="mt-4">
        <Skeleton className="h-8 w-full md:max-w-[180px]" />
        <Skeleton className="mt-4 h-[400px] w-full md:h-[600px]" />
      </div>
    </>
  );
}

export default TableSectionSkeletons;
