"use client";

import { customToast } from "@/components/custom-toast";
import { SubmitButton } from "@/components/submit-button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/constants";
import { formatDate } from "@/lib/utils";
import { CalendarCheck, CalendarCheck2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EvaluateAttendanceDayDialogProps = {
  companyId: string;
};

function EvaluateAttendanceDayDialog({
  companyId,
}: EvaluateAttendanceDayDialogProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/attendance/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: companyId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        setOpen(false);
        customToast("error", "Uh oh! Something went wrong 😵", data.message);
      } else {
        setSubmitting(false);
        setOpen(false);
        customToast("success", "Success 🎉", data.message);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      setOpen(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size={"sm"}
          className="flex h-9 cursor-pointer items-center gap-2 bg-lime-600 px-3 text-xs text-white duration-200 hover:bg-lime-500 xl:text-sm"
        >
          <CalendarCheck size={16} />
          Evaluate Day
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[350px] rounded-lg sm:max-w-[420px]">
        <AlertDialogHeader className="flex items-center justify-center text-center">
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <div className="grid place-items-center rounded-full bg-gray-100 p-8">
            <CalendarCheck2 size={60} color="lime" />
          </div>
          <AlertDialogDescription className="text-center">
            This will evaluate your employees attendance for today,
            <span className="text-foreground font-semibold">
              {formatDate(new Date())}
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <SubmitButton
            onClick={handleDelete}
            isSubmitting={submitting}
            className="w-[100px] cursor-pointer rounded-sm bg-lime-600 text-white duration-200 hover:bg-lime-500"
          >
            {submitting ? "Evaluating" : "Evaluate"}
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EvaluateAttendanceDayDialog;
