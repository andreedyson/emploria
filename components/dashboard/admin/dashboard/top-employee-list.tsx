import { getImageUrl } from "@/lib/supabase";
import { TopEmployeeListProps } from "@/types/admin/dashboard";
import Image from "next/image";
import React from "react";

type TopEmployeeListItemProps = {
  employee: TopEmployeeListProps;
};

function TopEmployeeListItem({ employee }: TopEmployeeListItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex w-full items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-3">
          <div>
            <Image
              src={
                getImageUrl(employee.image as string, "users") ||
                "/assets/image-placeholder.svg"
              }
              width={80}
              height={80}
              alt={employee.name}
              className="size-12 rounded-lg object-contain"
            />
          </div>
          <div>
            <p className="line-clamp-1 font-medium">{employee.name}</p>
            <p className="text-muted-foreground line-clamp-1">
              {employee.department}
            </p>
          </div>
        </div>
        <p className="line-clamp-1 font-semibold">
          {employee.attendance} Attendance
        </p>
      </div>
    </div>
  );
}

export default TopEmployeeListItem;
