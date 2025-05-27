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
import { formatDate } from "@/lib/utils";
import { EmployeeColumnProps } from "@/types/admin/employee";
import {
  Briefcase,
  BriefcaseBusiness,
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
          <div className="flex items-center gap-2">
            <Image
              src={
                getImageUrl(employeeData.image as string, "users") ||
                "/assets/image-placeholder.svg"
              }
              alt={employeeData.name}
              width={80}
              height={80}
              className="size-8 rounded-full border-2 object-contain md:size-10"
            />
            <div>
              <p className="font-semibold">{employeeData.name}</p>
              <p className="text-muted-foreground flex items-center gap-1 text-sm">
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

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Mail size={14} />
                <p>Email</p>
              </div>
              <p>{employeeData.email}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <BriefcaseBusiness size={14} />
                <p>Position</p>
              </div>
              <p>{employeeData.position ?? "-"}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Briefcase size={14} />
                <p>Role</p>
              </div>
              <p>{employeeData.employeeRole ?? "-"}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Phone size={14} />
                <p>Phone</p>
              </div>
              <p>{employeeData.phone ?? "-"}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <MapPin size={14} />
                <p>Address</p>
              </div>
              <p className="line-clamp-2 text-right">
                {employeeData.address ?? "-"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Calendar1 size={14} />
                <p>Birthdate</p>
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
                <p>Joined</p>
              </div>
              <p>{formatDate(employeeData.joinDate)}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Company & Department Details</h4>

            <div className="text-sm">
              <div className="text-muted-foreground flex items-center gap-1">
                <LetterText size={14} />
                <p>Company Name</p>
              </div>
              <p className="font-semibold">
                {employeeData.company?.name ?? "-"}
              </p>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground flex items-center gap-1">
                <LetterText size={14} />
                <p>Department Name</p>
              </div>
              <p className="font-semibold">
                {employeeData.department?.name ?? "-"}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewEmployeeDialog;
