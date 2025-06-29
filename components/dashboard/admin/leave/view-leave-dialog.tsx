import LeaveStatusBadge from "@/components/badges/leave-status-badge";
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
import { formatDate, handleCopyClick } from "@/lib/utils";
import { LeaveColumnProps } from "@/types/admin/leave";
import {
  Calendar,
  Calendar1,
  CalendarDays,
  Copy,
  Eye,
  IdCard,
  Layers,
  LetterText,
  Loader,
} from "lucide-react";
import Image from "next/image";

type ViewLeaveDialogProps = {
  leaveData: LeaveColumnProps;
};

function ViewLeaveDialog({ leaveData }: ViewLeaveDialogProps) {
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
          <SheetTitle>Leave Details</SheetTitle>
          <SheetDescription>
            Details for employee leave request details.
          </SheetDescription>
        </SheetHeader>

        {/* Leave Details Content */}
        <div className="space-y-6 p-4">
          <div className="flex items-center gap-2">
            <Image
              src={
                getImageUrl(leaveData.employee.image as string, "users") ||
                "/assets/image-placeholder.svg"
              }
              alt={leaveData.employee.name}
              width={80}
              height={80}
              className="size-8 rounded-full border-2 object-contain md:size-10"
            />

            <p className="font-semibold">{leaveData.employee.name}</p>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Layers size={14} />
                <p>Leave Type</p>
              </div>
              <p className="line-clamp-1">{leaveData.leaveType}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <Calendar1 size={14} />
                <p>Start Date</p>
              </div>
              <p className="line-clamp-1">{formatDate(leaveData.startDate)}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1">
                <CalendarDays size={14} />
                <p>End Date</p>
              </div>
              <p className="line-clamp-1">{formatDate(leaveData.endDate)}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <IdCard size={14} />
                <p>Leave ID</p>
              </div>
              <p
                title="Copy ID"
                onClick={() => handleCopyClick(leaveData.id)}
                className="flex cursor-pointer items-center gap-1 duration-200 hover:text-gray-600"
              >
                {leaveData.id}
                <Copy strokeWidth={2} size={16} />
              </p>
            </div>
            <div>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Calendar size={14} />
                <p>Requested At</p>
              </div>
              <p>{formatDate(leaveData.createdAt)}</p>
            </div>
            <div>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Loader size={14} />
                <p>Status</p>
              </div>
              <LeaveStatusBadge status={leaveData.status} />
            </div>
            <div>
              <div className="text-muted-foreground flex items-center gap-1">
                <LetterText size={14} />
                <p>Reason</p>
              </div>
              <p>{leaveData.reason ?? "-"}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewLeaveDialog;
