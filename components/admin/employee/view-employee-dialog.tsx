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
  Calendar,
  Calendar1,
  Copy,
  Eye,
  IdCard,
  LetterText,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

type ViewEmployeeDialogProps = {
  employee: EmployeeColumnProps;
};

function ViewEmployeeDialog({ employee }: ViewEmployeeDialogProps) {
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
      <SheetContent>
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
                getImageUrl(employee.image as string, "users") ||
                "/assets/image-placeholder.svg"
              }
              alt={employee.name}
              width={80}
              height={80}
              className="size-8 rounded-full border-2 object-contain md:size-10"
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
                <Phone size={14} />
                <p>Phone</p>
              </div>
              <p>{employee.phone ?? "-"}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <MapPin size={14} />
                <p>Address</p>
              </div>
              <p>{employee.address ?? "-"}</p>
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
            <div className="text-sm">
              <div className="text-muted-foreground flex items-center gap-1">
                <IdCard size={14} />
                <p>Company ID</p>
              </div>
              <p>{employee.company?.id ?? "-"}</p>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground flex items-center gap-1">
                <LetterText size={14} />
                <p>Company Name</p>
              </div>
              <p className="font-semibold">{employee.company?.name ?? "-"}</p>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground flex items-center gap-1">
                <IdCard size={14} />
                <p>Department ID</p>
              </div>
              <p>{employee.department?.id ?? "-"}</p>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground flex items-center gap-1">
                <LetterText size={14} />
                <p>Department Name</p>
              </div>
              <p className="font-semibold">
                {employee.department?.name ?? "-"}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewEmployeeDialog;
