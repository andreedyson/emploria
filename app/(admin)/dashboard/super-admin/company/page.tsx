import AddCompanyDialog from "@/components/dashboard/super-admin/company/add-company-dialog";
import { CompanyColumns } from "@/components/dashboard/super-admin/company/company-columns";
import { DataTable } from "@/components/ui/data-table";
import { getAllCompanies } from "@/lib/data/super-admin/company";
import { Building } from "lucide-react";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Company",
};

async function SuperAdminCompanyPage() {
  const companies = await getAllCompanies();
  return (
    <section className="space-y-4">
      <div className="bg-background space-y-3 rounded-lg border-2 p-4">
        {/* Companies Page Header */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full space-y-2">
            <h2 className="flex items-center gap-2 text-2xl leading-none font-bold md:text-3xl">
              <Building className="size-6 md:size-8" />
              Companies
            </h2>
            <p className="text-muted-foreground text-sm leading-none md:text-base">
              Organize and manage all companies that are using this SAP
              Dashboard.
            </p>
          </div>
          <div className="flex w-full justify-end">
            <AddCompanyDialog />
          </div>
        </div>
        {/* Data Table */}
        <div>
          <DataTable columns={CompanyColumns} data={companies} />
        </div>
      </div>
    </section>
  );
}

export default SuperAdminCompanyPage;
