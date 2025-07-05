"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock5, Clock9 } from "lucide-react";

import { customToast } from "@/components/custom-toast";
import { SubmitButton } from "@/components/submit-button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/constants";
import { formatDate } from "@/lib/utils";

type AttendanceButtonProps = {
  userId: string;
  attendance: {
    id: string;
    checkIn: Date | null;
    checkOut: Date | null;
  } | null;
};

export default function AttendanceButton({
  userId,
  attendance,
}: AttendanceButtonProps) {
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const now = new Date();
  const wibHour = (now.getUTCHours() + 7) % 24;
  const disabledByTime = wibHour >= 18;
  const alreadyCheckedIn = !!attendance?.checkIn;
  const alreadyCheckedOut = !!attendance?.checkOut;

  const handleAttendance = async () => {
    setSubmitting(true);
    const endpoint = alreadyCheckedIn ? "check-out" : "check-in";

    try {
      const res = await fetch(`${BASE_URL}/api/admin/attendance/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        customToast("error", "Uh oh! Something went wrong 😵", data.message);
      } else {
        customToast("success", "Success 🎉", data.message);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      customToast("error", "Network error", "Please try again later.");
    } finally {
      setSubmitting(false);
      setOpen(false);
    }
  };

  const buttonLabel = alreadyCheckedIn ? "Check Out" : "Check In";
  const icon = alreadyCheckedIn ? <Clock5 size={16} /> : <Clock9 size={16} />;
  const buttonColor = alreadyCheckedIn
    ? "bg-orange-500 hover:bg-orange-600"
    : "bg-green-500 hover:bg-green-600";

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {alreadyCheckedIn && alreadyCheckedOut ? (
        <Button disabled className="cursor-not-allowed bg-gray-400 text-white">
          ✅ Attendance Completed
        </Button>
      ) : (
        <AlertDialogTrigger asChild>
          <Button
            disabled={disabledByTime}
            className={`flex items-center gap-2 text-sm text-white duration-200 ${buttonColor} ${
              disabledByTime ? "cursor-not-allowed opacity-50" : ""
            }`}
            title={disabledByTime ? "Attendance is closed after 18:00 WIB" : ""}
          >
            {icon}
            {buttonLabel}
          </Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="grid max-w-[350px] place-items-center rounded-lg text-center sm:max-w-[380px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will{" "}
            <span className="font-medium underline">
              {buttonLabel.toLowerCase()}
            </span>{" "}
            for today:{" "}
            <span className="text-foreground font-semibold">
              {formatDate(new Date())}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="w-[130px]">Cancel</AlertDialogCancel>
          <SubmitButton
            onClick={handleAttendance}
            isSubmitting={submitting}
            className="w-[130px] bg-emerald-500 text-white hover:bg-emerald-300"
          >
            {submitting ? "Confirming..." : "Confirm"}
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
