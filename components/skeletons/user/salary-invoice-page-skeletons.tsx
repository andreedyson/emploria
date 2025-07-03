import { Skeleton } from "@/components/ui/skeleton";

function SalaryInvoicePageSkeletons() {
  return (
    <div>
      {/* Salary Header Skeleton */}
      <div className="flex h-full w-full gap-2 sm:mt-4 md:items-center md:justify-between">
        <div className="flex h-full w-full items-center gap-2">
          <Skeleton className="size-8" />
          <div className="h-full w-full space-y-2">
            <Skeleton className="h-3 w-full max-w-[200px]" />
            <Skeleton className="h-3 w-full max-w-[120px]" />
          </div>
        </div>
        <Skeleton className="h-8 w-full max-w-[180px]" />
      </div>

      {/* PDF Viewer Skeletons */}
      <Skeleton className="mt-4 h-[400px] w-full md:h-[600px]" />
    </div>
  );
}

export default SalaryInvoicePageSkeletons;
