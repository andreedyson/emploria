import { Skeleton } from "@/components/ui/skeleton";

function UsersDashboardSkeletons() {
  return (
    <>
      {/* Welcome Header Skeleton */}
      <div>
        <Skeleton className="h-6 w-full max-w-[280px] md:max-w-[400px]" />
        <Skeleton className="mt-2 h-3 w-full max-w-[180px] md:max-w-[480px]" />
      </div>

      {/* Employee Today's Attendance Skeleton */}
      <div className="flex h-full w-full flex-col gap-2 sm:mt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex h-full w-full flex-col gap-2 max-sm:mt-3 sm:flex-row sm:items-center sm:gap-4">
          <Skeleton className="h-2 w-full max-w-[120px]" />
          <Skeleton className="h-2 w-full max-w-[120px]" />
        </div>
        <Skeleton className="h-8 w-full md:max-w-[200px]" />
      </div>

      {/* Stats Card Skeletons */}
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-[80px] w-full md:h-[120px]" key={index} />
        ))}
      </div>

      {/* Salaries Growth and Activities Card Skeletons */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Skeleton className="h-[300px] w-full md:h-[350px]" />
        <Skeleton className="h-[300px] w-full md:h-[350px]" />
      </div>
    </>
  );
}

export default UsersDashboardSkeletons;
