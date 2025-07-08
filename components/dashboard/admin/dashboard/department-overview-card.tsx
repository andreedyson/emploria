import { EmployeePerDepartmentProps } from "@/types/admin/dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Plus, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type DepartmentOverviewCardProps = {
  departments: EmployeePerDepartmentProps[];
};

function DepartmentOverviewCard({ departments }: DepartmentOverviewCardProps) {
  const total = departments.reduce((sum, d) => sum + d.count, 0);
  return (
    <Card className="col-span-1 w-full xl:col-span-2">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold">
            Department Overview
          </CardTitle>

          <CardDescription>Total employees per department</CardDescription>
        </div>
        <Link
          href={"/dashboard/admin/department"}
          className="hover:text-picton-blue-500 flex items-center gap-1 text-xs duration-200 md:text-sm"
        >
          See All
          <ChevronRight size={12} />
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        {departments.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium">
              <User size={32} />
              <p>
                <span className="text-2xl font-bold md:text-3xl">{total}</span>{" "}
                Employees
              </p>
            </div>
            {/* Progress Bar */}
            <div className="flex h-2 w-full overflow-hidden rounded-md bg-gray-200">
              {departments.map((dept) => {
                // compute each slice as a percentage of total
                const widthPercent = total > 0 ? (dept.count / total) * 100 : 0;
                return (
                  <div
                    key={dept.name}
                    className="h-full"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: dept.color || "#000",
                    }}
                  />
                );
              })}
            </div>
            {/* Legend */}
            <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-6">
              {departments.map((dept) => {
                const percentage =
                  total > 0 ? ((dept.count / total) * 100).toFixed(0) : "0";
                return (
                  <div
                    key={dept.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      {/* Colored dot */}
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: dept.color || "#000" }}
                      />
                      <div>
                        <p
                          className="line-clamp-1 max-w-[150px] text-sm font-medium"
                          title={dept.name}
                        >
                          {dept.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {dept.count}{" "}
                          {dept.count === 1 ? "Person" : "People"}{" "}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="col-span-full flex h-full flex-col items-center justify-center gap-3 text-center">
            <Image
              src={"/assets/empty-department.svg"}
              width={500}
              height={300}
              alt="Departments Not Found"
              className="aspect-video w-[180px] lg:w-[280px]"
              priority
            />
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold md:text-base">
                No Departments Found
              </h4>
              <p className="text-muted-foreground max-w-sm text-xs md:text-sm">
                Showing the list of available department in this company.
              </p>
              <div className="mt-3 flex items-center justify-center">
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className="flex items-center gap-2"
                >
                  <Plus />
                  <Link href={"/dashboard/admin/department"}>
                    Add Department
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DepartmentOverviewCard;
