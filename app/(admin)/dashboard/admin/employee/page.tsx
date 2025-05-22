import { Button } from "@/components/ui/button";
import { User, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

async function SuperAdminCompanyEmployeePage() {
  return (
    <section className="space-y-4">
      <div className="bg-background space-y-3 rounded-lg border-2 p-4">
        {/* Employees Page Header */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full space-y-2">
            <h2 className="flex items-center gap-2 text-2xl leading-none font-bold md:text-3xl">
              <Users className="size-6 md:size-8" />
              Employees
            </h2>
            <p className="text-muted-foreground text-sm leading-none md:text-base">
              Organize and manage all employees that are using this SAP
              Dashboard.
            </p>
          </div>
          <div className="flex w-full justify-end">
            <Link href={"/dashboard/admin/employee/create"}>
              <Button
                size={"sm"}
                className="bg-picton-blue-400 hover:bg-picton-blue-500 flex h-9 cursor-pointer items-center gap-2 px-3 text-xs text-white duration-200 xl:text-sm"
              >
                <User size={16} />
                Add Employee
              </Button>
            </Link>
          </div>
        </div>
        {/* Data Table */}
        <div></div>
      </div>
    </section>
  );
}

export default SuperAdminCompanyEmployeePage;
