"use client";

import { AllCompaniesProps } from "@/types/super-admin/company";

import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { IdCard, LetterText } from "lucide-react";
import DeleteCompanyDialog from "./delete-company-dialog";
import EditCompanyDialog from "./edit-company-dialog";
import Image from "next/image";
import { getImageUrl } from "@/lib/supabase";

export const CompanyColumns: ColumnDef<AllCompaniesProps>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID" icon={IdCard} />;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Name" icon={LetterText} />
      );
    },
    cell: ({ row }) => {
      const company = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="size-16 rounded-lg md:size-20">
            <Image
              src={
                getImageUrl(company.image as string, "employees") ||
                "/assets/image-placeholder.svg"
              }
              alt={company.name}
              width={80}
              height={80}
              className="size-16 object-contain md:size-20"
            />
          </div>
          <p>{company.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const company = row.original;
      return (
        <div className="flex items-center gap-1">
          <EditCompanyDialog companyData={company} />
          <DeleteCompanyDialog companyData={company} />
        </div>
      );
    },
  },
];
