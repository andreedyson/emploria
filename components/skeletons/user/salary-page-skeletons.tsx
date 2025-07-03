import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function UserSalaryPageSkeletons() {
  return (
    <>
      {/* Leave Table */}
      <Skeleton className="mt-4 h-[400px] w-full md:h-[600px]" />
    </>
  );
}

export default UserSalaryPageSkeletons;
