import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AddLeaveDialog from "@/components/dashboard/admin/leave/add-leave-dialog";
import { LeaveColumns } from "@/components/dashboard/admin/leave/leave-columns";
import { DataTable } from "@/components/ui/data-table";
import { getAllLeaves } from "@/lib/data/admin/leave";
import { CalendarX } from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Leave",
  description:
    "Employee Leave page view for Emploria Super Admin Company Dashboard",
};

async function SuperAdminCompanyLeavePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const companyId = session.user.companyId;
  const leaves = await getAllLeaves(companyId as string);
  return (
    <section className="space-y-4">
      <div className="bg-background space-y-3 rounded-lg border-2 p-4">
        {/* Leave Page Header */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full space-y-2">
            <h2 className="flex items-center gap-2 text-2xl leading-none font-bold md:text-3xl">
              <CalendarX className="size-6 md:size-8" />
              Leaves
            </h2>
            <p className="text-muted-foreground max-w-sm text-sm leading-5 md:text-base">
              View and manage leaves records for your employees by date,
              department, and status.
            </p>
          </div>
          <div className="flex w-full justify-end gap-2">
            <AddLeaveDialog companyId={companyId as string} />
          </div>
        </div>
        {/* Data Table */}
        <div>
          <DataTable
            columns={LeaveColumns}
            data={leaves}
            columnFilter="employee"
          />
        </div>
      </div>
    </section>
  );
}

export default SuperAdminCompanyLeavePage;
