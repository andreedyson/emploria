import { Skeleton } from "@/components/ui/skeleton";

function AttendancePageSkeletons() {
  return (
    <>
      {/* Stats Card Skeletons */}
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-[70px] w-full" key={index} />
        ))}
      </div>

      {/* Employee Today's Attendance Skeleton */}
      <Skeleton className="mt-4 mb-2 h-7 w-full max-w-[200px]" />

      <div className="flex h-full w-full flex-col gap-2 sm:mt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex h-full w-full flex-col gap-2 max-sm:mt-3 sm:flex-row sm:items-center sm:gap-4">
          <Skeleton className="h-2 w-full max-w-[120px]" />
          <Skeleton className="h-2 w-full max-w-[120px]" />
        </div>
        <Skeleton className="h-8 w-full md:max-w-[200px]" />
      </div>

      {/* Attendances Table */}
      <Skeleton className="mt-4 h-[400px] w-full md:h-[600px]" />
    </>
  );
}

export default AttendancePageSkeletons;
