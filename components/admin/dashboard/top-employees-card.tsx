import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import TopEmployeeListItem from "./top-employee-list";
import { TopEmployeeListProps } from "@/types/admin/dashboard";

type TopEmployeesCardProps = {
  topEmployees: TopEmployeeListProps[];
};

function TopEmployeesCard({ topEmployees }: TopEmployeesCardProps) {
  return (
    <Card className="col-span-1 w-full lg:col-span-2">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold">Top Employees</CardTitle>
          <CardDescription>
            Employees with the most attendances this month
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
        {topEmployees.map((employee, index) => (
          <TopEmployeeListItem
            key={employee.id}
            number={index + 1}
            employee={employee}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export default TopEmployeesCard;
