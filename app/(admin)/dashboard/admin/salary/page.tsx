import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AddSalaryDialog from "@/components/dashboard/admin/salary/add-salary-dialog";
import { SalaryColumns } from "@/components/dashboard/admin/salary/salary-columns";
import { DataTable } from "@/components/ui/data-table";
import { getAllSalaries } from "@/lib/data/admin/salary";
import { Banknote } from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Salary",
  description: "Salary page view for Emploria Super Admin Company Dashboard",
};

async function SuperAdminCompanySalaryPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const companyId = session.user.companyId;

  const salaries = await getAllSalaries(companyId as string);
  return (
    <section className="space-y-4">
      <div className="bg-background space-y-3 rounded-lg border-2 p-4">
        {/* Salary Page Header */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full space-y-2">
            <h2 className="flex items-center gap-2 text-2xl leading-none font-bold md:text-3xl">
              <Banknote className="size-6 md:size-8" />
              Salary
            </h2>
            <p className="text-muted-foreground max-w-sm text-sm leading-5 md:text-base">
              View and manage all employee salaries monthly data.
            </p>
          </div>
          <div className="flex w-full justify-end gap-2">
            <AddSalaryDialog companyId={companyId as string} />
          </div>
        </div>
        {/* Data Table */}
        <div>
          <DataTable
            columns={SalaryColumns}
            data={salaries}
            columnFilter="employee"
          />
        </div>
      </div>
    </section>
  );
}

export default SuperAdminCompanySalaryPage;
