import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AddEmployeeDialog from "@/components/admin/employee/add-employee-dialog";
import { EmployeeColumns } from "@/components/admin/employee/employee-columns";
import { DataTable } from "@/components/ui/data-table";
import { getAllEmployees } from "@/lib/data/admin/employee";
import { Users } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function SuperAdminCompanyEmployeePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const companyId = session.user.companyId;
  const employees = await getAllEmployees(companyId as string);
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
            <AddEmployeeDialog />
          </div>
        </div>
        {/* Data Table */}
        <div>
          <DataTable columns={EmployeeColumns} data={employees} />
        </div>
      </div>
    </section>
  );
}

export default SuperAdminCompanyEmployeePage;
