"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/lib/supabase";
import { convertRupiah, formatDate, handleCopyClick } from "@/lib/utils";
import { EmployeeColumnProps } from "@/types/admin/employee";
import {
  Banknote,
  Briefcase,
  Calendar,
  Calendar1,
  Copy,
  LetterText,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";

type EmployeeGalleryCardProps = {
  employee: EmployeeColumnProps;
};

function EmployeeGalleryCard({ employee }: EmployeeGalleryCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        <div className="bg-card rounded-lg border p-4 shadow-md">
          <div className="flex items-center gap-1">
            <div className="size-8 rounded-full">
              <Image
                src={
                  getImageUrl(employee.image as string, "users") ||
                  "/assets/image-placeholder.svg"
                }
                alt={employee.name}
                width={80}
                height={80}
                className="size-8 rounded-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold">{employee.name}</p>
              <p className="text-muted-foreground text-sm font-medium">
                {employee.department?.name} {employee.employeeRole}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-muted-foreground flex items-center gap-1">
              <Mail size={16} />
              <p>{employee.email}</p>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>
            Details for the selected Employee.
          </DialogDescription>
        </DialogHeader>

        {/* Employee Details Content */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Image
              src={
                getImageUrl(employee.image as string, "users") ||
                "/assets/image-placeholder.svg"
              }
              alt={employee.name}
              width={80}
              height={80}
              className="size-8 rounded-full border-2 object-cover md:size-10"
            />
            <div>
              <p className="font-semibold">{employee.name}</p>
              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                {employee.id}
                <span
                  title="Copy ID"
                  onClick={() => handleCopyClick(employee.id)}
                  className="cursor-pointer duration-200 hover:text-gray-600"
                >
                  <Copy strokeWidth={2} size={16} />
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Mail size={14} />
                <p>Email</p>
              </div>
              <p>{employee.email}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Briefcase size={14} />
                <p>Role</p>
              </div>
              <p>{employee.employeeRole ? employee.employeeRole : "-"}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <LetterText size={14} />
                <p>Department</p>
              </div>
              <p>
                {employee.department?.name ? employee.department?.name : "-"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Phone size={14} />
                <p>Phone</p>
              </div>
              <p>{employee.phone ? employee.phone : "-"}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <MapPin size={14} />
                <p>Address</p>
              </div>
              <p className="line-clamp-2 text-right">
                {employee.address ? employee.address : "-"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Banknote size={14} />
                <p>Base Salary</p>
              </div>
              <p className="line-clamp-2 text-right">
                {employee.baseSalary ? convertRupiah(employee.baseSalary) : "-"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Calendar1 size={14} />
                <p>Birthdate</p>
              </div>
              <p>
                {employee.dateOfBirth ? formatDate(employee.dateOfBirth) : "-"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Calendar size={14} />
                <p>Joined</p>
              </div>
              <p>{formatDate(employee.joinDate)}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Company & Department Details</h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="text-sm">
                <div className="text-muted-foreground flex items-center gap-1">
                  <LetterText size={14} />
                  <p>Company Name</p>
                </div>
                <p className="font-semibold">
                  {employee.company?.name ? employee.company?.name : "-"}
                </p>
              </div>
              <div className="text-sm">
                <div className="text-muted-foreground flex items-center gap-1">
                  <Briefcase size={14} />
                  <p>Position</p>
                </div>
                <p className="font-semibold">
                  {employee.department?.name && employee.employeeRole
                    ? `${employee.department.name} ${employee.employeeRole}`
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EmployeeGalleryCard;
