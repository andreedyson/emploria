import SalaryStatusBadge from "@/components/badges/salary-status-badge";
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
import { months } from "@/constants";
import { getImageUrl } from "@/lib/supabase";
import { convertRupiah, formatDate } from "@/lib/utils";
import { SalaryColumnsProps } from "@/types/admin/salary";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Copy,
  DollarSign,
  Eye,
  HandCoins,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

type ViewSalaryDialogProps = {
  salaryData: SalaryColumnsProps;
};

function ViewSalaryDialog({ salaryData }: ViewSalaryDialogProps) {
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
      <SheetContent className="w-full max-w-[600px] overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Salary Details</SheetTitle>
          <SheetDescription>
            Details for an employee monthly payslip.
          </SheetDescription>
        </SheetHeader>

        {/* Salary Details Content */}
        <div className="space-y-6 p-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">Payslip ID</p>
              <p
                title="Copy ID"
                onClick={() => handleCopyClick(salaryData.id)}
                className="flex cursor-pointer items-center gap-1 duration-200 hover:text-gray-600"
              >
                {salaryData.id}
                <Copy strokeWidth={2} size={16} />
              </p>
            </div>
            <p className="font-semibold">
              {months.find((month) => month.value === salaryData.month)?.label}{" "}
              {salaryData.year}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={
                getImageUrl(salaryData.employee.image as string, "users") ||
                "/assets/image-placeholder.svg"
              }
              alt={salaryData.employee.name}
              width={80}
              height={80}
              className="size-10 rounded-full border-2 object-contain md:size-14"
            />

            <div>
              <p className="font-semibold">{salaryData.employee.name}</p>
              <p className="text-muted-foreground text-sm">
                {salaryData.employee.id}
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                🕛 Generated On
              </div>
              <p className="font-semibold">{formatDate(salaryData.date)}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                🔃 Status
              </div>
              <SalaryStatusBadge status={salaryData.status} />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                📆 Paid At
              </div>
              <p className="font-semibold">
                {salaryData.paidAt ? formatDate(salaryData.paidAt) : "-"}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="font-medium">💰 Salary Breakdown</p>
            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <div className="grid gap-1">
                <div className="text-muted-foreground flex items-center gap-1">
                  <DollarSign size={14} />
                  <p>Base Salary</p>
                </div>
                <p className="font-semibold">
                  {convertRupiah(salaryData.baseSalary ?? 0)}
                </p>
              </div>
              <div className="grid gap-1">
                <div className="text-muted-foreground flex items-center gap-1">
                  <HandCoins size={14} />
                  <p>Bonus</p>
                </div>
                <p className="font-semibold text-green-500">
                  {convertRupiah(salaryData.bonus ?? 0)}
                </p>
              </div>
              <div className="grid gap-1">
                <div className="text-muted-foreground flex items-center gap-1">
                  <BanknoteArrowDown size={14} />
                  <p>Deduction</p>
                </div>
                <p className="font-semibold text-red-500">
                  {convertRupiah(salaryData.deduction ?? 0)}
                </p>
              </div>
              <div className="grid gap-1">
                <div className="text-muted-foreground flex items-center gap-1">
                  <BanknoteArrowUp size={14} />
                  <p title="Attendance Bonus">Att. Bonus</p>
                </div>
                <p className="font-semibold text-orange-500">
                  {convertRupiah(salaryData.attendanceBonus ?? 0)}
                </p>
              </div>
            </div>
          </div>

          <Separator />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewSalaryDialog;
