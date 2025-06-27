"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { customToast } from "@/components/custom-toast";
import { SubmitButton } from "@/components/submit-button";
import { BASE_URL } from "@/constants";
import { editLeaveSchema } from "@/validations/admin";
import { LeaveStatus } from "@prisma/client";
import { Loader, ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";

type ApproveRejectDialogProps = {
  leaveId: string;
  currentStatus: LeaveStatus;
};

function ApproveRejectLeaveDialog({
  leaveId,
  currentStatus,
}: ApproveRejectDialogProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof editLeaveSchema>>({
    resolver: zodResolver(editLeaveSchema),
    defaultValues: {
      status: currentStatus === "PENDING" ? undefined : currentStatus,
    },
  });

  useEffect(() => {
    form.reset({
      status: currentStatus,
    });
  }, [form, currentStatus]);

  async function onSubmit(values: z.infer<typeof editLeaveSchema>) {
    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/leave/${leaveId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: values.status }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        customToast("error", "Uh oh! Something went wrong 😵", data.message);
      } else {
        setOpen(false);
        setSubmitting(false);
        customToast("success", "Success 🎉", data.message);
        form.reset();
        router.refresh();
      }
    } catch (error) {
      setOpen(false);
      setSubmitting(false);
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          disabled={currentStatus == "APPROVED"}
          className="flex cursor-pointer items-center gap-2 bg-blue-500 text-white duration-200 hover:bg-blue-600"
        >
          <Loader size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>Approve / Reject Leave</DialogTitle>
          <DialogDescription>
            Change the status of this leave request.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex gap-4">
            <Button
              type="button"
              variant={
                form.watch("status") === "APPROVED" ? "default" : "outline"
              }
              className={`flex-1 cursor-pointer ${
                form.watch("status") === "APPROVED"
                  ? "bg-green-500 text-white hover:bg-green-500"
                  : "text-green-500 outline-green-500 hover:bg-green-500 hover:text-white"
              }`}
              onClick={() => form.setValue("status", "APPROVED")}
            >
              <ThumbsUp className="mr-2 h-4 w-4" /> Approve
            </Button>
            <Button
              type="button"
              variant={
                form.watch("status") === "REJECTED" ? "default" : "outline"
              }
              className={`flex-1 cursor-pointer ${
                form.watch("status") === "REJECTED"
                  ? "bg-red-500 text-white hover:bg-red-500"
                  : "text-red-500 outline-red-500 hover:bg-red-500 hover:text-white"
              }`}
              onClick={() => form.setValue("status", "REJECTED")}
            >
              <ThumbsDown className="mr-2 h-4 w-4" /> Reject
            </Button>
          </div>

          <DialogFooter>
            <SubmitButton
              isSubmitting={submitting}
              className="bg-picton-blue-500 hover:bg-picton-blue-600 w-full text-white duration-200"
            >
              {submitting ? "Submitting..." : "Submit Decision"}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ApproveRejectLeaveDialog;
