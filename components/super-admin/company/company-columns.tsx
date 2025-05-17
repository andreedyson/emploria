"use client";

import { AllCompaniesProps } from "@/types/super-admin/company";

import { ColumnDef } from "@tanstack/react-table";
import { IdCard, LetterText } from "lucide-react";
import EditCompanyDialog from "./edit-company-dialog";
import DeleteCompanyDialog from "./delete-company-dialog";

export const CompanyColumns: ColumnDef<AllCompaniesProps>[] = [
  {
    accessorKey: "id",
    header: () => {
      return (
        <div className="flex items-center gap-1">
          <IdCard size={14} />
          ID
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => {
      return (
        <div className="flex items-center gap-1">
          <LetterText size={14} />
          Name
        </div>
      );
    },
    cell: ({ row }) => {
      const company = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="size-16 rounded-lg md:size-20">
            {/* <Image
              src={getImageUrl(brand.logo, "brands")}
              alt={brand.name}
              width={80}
              height={80}
              className="size-16 object-contain md:size-20"
            /> */}
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
