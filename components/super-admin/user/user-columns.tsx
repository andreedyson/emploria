"use client";

import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { SuperAdminCompanyUserProps } from "@/types/super-admin/user";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, IdCard, LetterText, Mail } from "lucide-react";
import Image from "next/image";
import ViewSuperAdminDialog from "./view-super-admin-dialog";

export const SuperAdminUserColumns: ColumnDef<SuperAdminCompanyUserProps>[] = [
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
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full">
            <Image
              src={
                getImageUrl(user.image as string, "users") ||
                "/assets/image-placeholder.svg"
              }
              alt={user.name}
              width={80}
              height={80}
              className="size-8 rounded-full object-contain"
            />
          </div>
          <p>{user.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Email" icon={Mail} />
      );
    },
  },
  {
    accessorKey: "createdAt",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Created At"
          icon={Calendar}
        />
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return <div>{formatDate(user.createdAt)}</div>;
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
    accessorKey: "company",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Company" icon={Mail} />
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return <div>{user.company.name}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-1">
          <ViewSuperAdminDialog user={user} />
        </div>
      );
    },
  },
];
