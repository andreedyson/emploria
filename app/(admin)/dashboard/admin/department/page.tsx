import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AddDepartmentDialog from "@/components/admin/department/add-department-dialog";
import { DepartmentColumns } from "@/components/admin/department/department-columns";
import { DataTable } from "@/components/ui/data-table";
import { getAllDepartments } from "@/lib/data/admin/department";
import { Building2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function SuperAdminCompanyDepartmentPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const companyId = session.user.companyId;
  const departments = await getAllDepartments(companyId as string);
  return (
    <section className="space-y-4">
      <div className="bg-background space-y-3 rounded-lg border-2 p-4">
        {/* Departments Page Header */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full space-y-2">
            <h2 className="flex items-center gap-2 text-2xl leading-none font-bold md:text-3xl">
              <Building2 className="size-6 md:size-8" />
              Departments
            </h2>
            <p className="text-muted-foreground text-sm leading-none md:text-base">
              Organize and manage all department on this company.
            </p>
          </div>
          <div className="flex w-full justify-end">
            <AddDepartmentDialog companyId={companyId as string} />
          </div>
        </div>
        {/* Data Table */}
        <div>
          <DataTable columns={DepartmentColumns} data={departments} />
        </div>
      </div>
    </section>
  );
}

export default SuperAdminCompanyDepartmentPage;
