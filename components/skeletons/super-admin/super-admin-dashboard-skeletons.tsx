import { Skeleton } from "@/components/ui/skeleton";

function SuperAdminDashboardSkeletons() {
  return (
    <>
      {/* Welcome Header Skeleton */}
      <div>
        <Skeleton className="h-6 w-full max-w-[280px] md:max-w-[400px]" />
        <Skeleton className="mt-2 h-3 w-full max-w-[180px] md:max-w-[480px]" />
      </div>

      {/* Stats Card Skeletons */}
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-[80px] w-full md:h-[120px]" key={index} />
        ))}
      </div>

      {/* Users Per Company and Recently Added Skeletons */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Skeleton className="h-[300px] w-full md:h-[350px]" />
        <Skeleton className="h-[300px] w-full md:h-[350px]" />
      </div>
    </>
  );
}

export default SuperAdminDashboardSkeletons;
