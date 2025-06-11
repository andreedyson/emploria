"use client";

import LeaveStatusBadge from "@/components/badges/leave-status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDate, handleCopyClick } from "@/lib/utils";

import { Leave } from "@prisma/client";
import {
  Calendar,
  CalendarDays,
  Copy,
  Eye,
  IdCard,
  LetterText,
  Loader,
} from "lucide-react";

type UserViewLeaveDialogProps = {
  leave: Leave;
};

function UserViewLeaveDialog({ leave }: UserViewLeaveDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          className="flex cursor-pointer items-center gap-2 bg-indigo-500 text-white duration-200 hover:bg-indigo-600"
        >
          <Eye size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px] rounded-md sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Leave Details</DialogTitle>
          <DialogDescription>Your leave request details.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="text-sm">
            <div className="text-muted-foreground flex items-center gap-1.5">
              <Loader size={14} />
              <p>Status</p>
            </div>
            <LeaveStatusBadge status={leave.status} />
          </div>
          <Separator />
          <div className="text-sm">
            <div className="text-muted-foreground flex items-center gap-1.5">
              <IdCard size={14} />
              <p>Leave ID</p>
            </div>
            <p
              title="Copy ID"
              onClick={() => handleCopyClick(leave.id)}
              className="flex cursor-pointer items-center gap-1 duration-200 hover:text-gray-600"
            >
              {leave.id}
              <Copy strokeWidth={2} size={16} />
            </p>
          </div>
          <div className="text-sm">
            <div className="text-muted-foreground flex items-center gap-1.5">
              <Calendar size={14} />
              <p>Requested At</p>
            </div>
            <p>{formatDate(leave.createdAt)}</p>
          </div>
          <div className="text-sm">
            <div className="text-muted-foreground flex items-center gap-1.5">
              <CalendarDays size={14} />
              <p>Duration</p>
            </div>
            <p>
              {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
            </p>
          </div>
          <div className="text-sm">
            <div className="text-muted-foreground flex items-center gap-1">
              <LetterText size={14} />
              <p>Reason</p>
            </div>
            <p>{leave.reason ?? "-"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserViewLeaveDialog;
