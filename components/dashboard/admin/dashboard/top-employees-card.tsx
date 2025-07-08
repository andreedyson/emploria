import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TopEmployeeListProps } from "@/types/admin/dashboard";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TopEmployeeListItem from "./top-employee-list";

type TopEmployeesCardProps = {
  topEmployees: TopEmployeeListProps[];
};

function TopEmployeesCard({ topEmployees }: TopEmployeesCardProps) {
  return (
    <Card className="col-span-1 w-full xl:col-span-2">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold">Top Employees</CardTitle>
          <CardDescription>
            Employees with the highest attendance this month
          </CardDescription>
        </div>
        <Link
          href={"/dashboard/admin/employee"}
          className="hover:text-picton-blue-500 flex items-center gap-1 text-xs duration-200 md:text-sm"
        >
          See All
          <ChevronRight size={12} />
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        {topEmployees.length > 0 ? (
          <div className="space-y-3">
            {topEmployees.map((employee) => (
              <TopEmployeeListItem key={employee.id} employee={employee} />
            ))}
          </div>
        ) : (
          <div className="col-span-full flex h-full flex-col items-center justify-center gap-3 text-center">
            <Image
              src={"/assets/empty-list.svg"}
              width={500}
              height={300}
              alt="No Top Employees Found"
              className="aspect-video w-[180px] lg:w-[280px]"
              priority
            />
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold">No Top Employees Found</h4>
              <p className="text-muted-foreground max-w-sm text-xs md:text-sm">
                Showing the list of employees with the highest amount of
                attendance in the current month.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TopEmployeesCard;
