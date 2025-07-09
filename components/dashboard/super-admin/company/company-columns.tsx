"use client";

import { AllCompaniesProps } from "@/types/super-admin/company";

import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { IdCard, LetterText } from "lucide-react";
import DeleteCompanyDialog from "./delete-company-dialog";
import EditCompanyDialog from "./edit-company-dialog";
import Image from "next/image";
import { getImageUrl } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import ViewCompanyDialog from "./view-company-dialog";

export const CompanyColumns: ColumnDef<AllCompaniesProps>[] = [
  {
    accessorKey: "id",
    enableSorting: true,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID" icon={IdCard} />;
    },
  },
  {
    accessorKey: "name",
    enableSorting: true,
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
                getImageUrl(company.image as string, "companies") ||
                "/assets/image-placeholder.svg"
              }
              alt={company.name}
              width={80}
              height={80}
              className="size-16 rounded-lg object-cover md:size-20"
            />
          </div>
          <p>{company.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const company = row.original;
      const badgeBackground = company.isActive ? "bg-green-500" : "bg-gray-400";

      return (
        <Badge
          className={`${badgeBackground} rounded-full px-3 text-white uppercase`}
        >
          {company.isActive ? "Active" : "Inactive"}
        </Badge>
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
          <ViewCompanyDialog company={company} />
          <EditCompanyDialog companyData={company} />
          <DeleteCompanyDialog companyData={company} />
        </div>
      );
    },
  },
];
