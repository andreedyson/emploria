import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getImageUrl } from "@/lib/supabase";
import { convertRupiah, formatDate } from "@/lib/utils";
import { EmployeeColumnProps } from "@/types/admin/employee";
import {
  Banknote,
  Briefcase,
  Calendar,
  Calendar1,
  Copy,
  Eye,
  LetterText,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

type ViewEmployeeDialogProps = {
  employeeData: EmployeeColumnProps;
};

function ViewEmployeeDialog({ employeeData }: ViewEmployeeDialogProps) {
  const handleCopyClick = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!", {
        id: "clipboard",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size={"icon"}
          className="flex cursor-pointer items-center gap-2 bg-indigo-500 text-white duration-200 hover:bg-indigo-600"
        >
          <Eye size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Employee Details</SheetTitle>
          <SheetDescription>
            Details for the selected Employee.
          </SheetDescription>
        </SheetHeader>

        {/* Employee Details Content */}
        <div className="space-y-6 p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <Image
              src={
                getImageUrl(employeeData.image as string, "users") ||
                "/assets/image-placeholder.svg"
              }
              alt={employeeData.name}
              width={80}
              height={80}
              className="size-8 rounded-full border-2 object-cover md:size-10"
            />
            <div className="text-xs sm:text-sm">
              <p className="font-semibold">{employeeData.name}</p>
              <p className="text-muted-foreground flex items-center gap-1">
                {employeeData.id}
                <span
                  title="Copy ID"
                  onClick={() => handleCopyClick(employeeData.id)}
                  className="cursor-pointer duration-200 hover:text-gray-600"
                >
                  <Copy strokeWidth={2} size={16} />
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Mail size={14} />
                <p>Email</p>
              </div>
              <p className="line-clamp-1">{employeeData.email}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Briefcase size={14} />
                <p>Role</p>
              </div>
              <p>
                {employeeData.employeeRole ? employeeData.employeeRole : "-"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <LetterText size={14} />
                <p>Department</p>
              </div>
              <p className="line-clamp-1">
                {employeeData.department?.name
                  ? employeeData.department?.name
                  : "-"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Phone size={14} />
                <p>Phone</p>
              </div>
              <p className="line-clamp-1">
                {employeeData.phone ? employeeData.phone : "-"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <MapPin size={14} />
                <p>Address</p>
              </div>
              <p className="line-clamp-2 text-right">
                {employeeData.address ? employeeData.address : "-"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Banknote size={14} />
                <p>Base Salary</p>
              </div>
              <p className="line-clamp-2 text-right">
                {employeeData.baseSalary
                  ? convertRupiah(employeeData.baseSalary)
                  : "-"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Calendar1 size={14} />
                <p className="line-clamp-1">Birthdate</p>
              </div>
              <p>
                {employeeData.dateOfBirth
                  ? formatDate(employeeData.dateOfBirth)
                  : "-"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Calendar size={14} />
                <p className="line-clamp-1">Joined</p>
              </div>
              <p>{formatDate(employeeData.joinDate)}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-medium">Company & Department Details</h4>

            <div>
              <div className="text-muted-foreground flex items-center gap-1">
                <LetterText size={14} />
                <p>Company Name</p>
              </div>
              <p className="line-clamp-1 font-semibold">
                {employeeData.company?.name ? employeeData.company?.name : "-"}
              </p>
            </div>
            <div>
              <div className="text-muted-foreground flex items-center gap-1">
                <Briefcase size={14} />
                <p>Position</p>
              </div>
              <p className="line-clamp-1 font-semibold">
                {employeeData.department?.name && employeeData.employeeRole
                  ? `${employeeData.department.name} ${employeeData.employeeRole}`
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewEmployeeDialog;
