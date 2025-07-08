import { Skeleton } from "@/components/ui/skeleton";

function CompanyAdminDashboardSkeletons() {
  return (
    <>
      {/* Welcome Header Skeleton */}
      <div>
        <Skeleton className="h-6 w-full max-w-[280px] md:max-w-[400px]" />
        <Skeleton className="mt-2 h-3 w-full max-w-[180px] md:max-w-[480px]" />
      </div>

      {/* Stats Card Skeletons */}
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-[80px] w-full md:h-[120px]" key={index} />
        ))}
      </div>

      {/* 2nd Grid Cards Skeletons */}
      <div className="mt-4 grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-5">
        <Skeleton className="col-span-1 h-[250px] w-full lg:col-span-2" />
        <Skeleton className="col-span-1 h-[250px] w-full lg:col-span-2" />
        <Skeleton className="col-span-1 h-[250px] w-full" />
      </div>

      {/* 3rd Grid Cards Skeletons */}
      <div className="mt-4 grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="col-span-1 h-[250px] w-full" />
        <Skeleton className="col-span-1 h-[250px] w-full" />
      </div>
    </>
  );
}

export default CompanyAdminDashboardSkeletons;
