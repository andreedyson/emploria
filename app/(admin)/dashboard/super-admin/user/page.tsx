import AddSuperAdminUserDialog from "@/components/dashboard/super-admin/user/add-super-admin-user-dialog";
import { SuperAdminUserColumns } from "@/components/dashboard/super-admin/user/user-columns";
import { DataTable } from "@/components/ui/data-table";
import { getAllSuperAdminCompanyUsers } from "@/lib/data/super-admin/user";
import { Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User",
};

async function SuperAdminUserPage() {
  const superAdminCompanyUsers = await getAllSuperAdminCompanyUsers();
  return (
    <section className="space-y-4">
      <div className="bg-background space-y-3 rounded-lg border-2 p-4">
        {/* Super Admin Company Users Page Header */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full space-y-2">
            <h2 className="flex items-center gap-2 text-2xl leading-none font-bold md:text-3xl">
              <Users className="size-6 md:size-8" />
              Users
            </h2>
            <p className="text-muted-foreground text-sm leading-none md:text-base">
              Create and manage Super Admin Company users for this application.
            </p>
          </div>
          <div className="flex w-full justify-end">
            <AddSuperAdminUserDialog />
          </div>
        </div>
        {/* Data Table */}
        <div>
          <DataTable
            columns={SuperAdminUserColumns}
            data={superAdminCompanyUsers}
          />
        </div>
      </div>
    </section>
  );
}

export default SuperAdminUserPage;
