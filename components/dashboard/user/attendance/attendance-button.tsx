"use client";

import { useMutation } from "@tanstack/react-query";
import { Clock5, Clock9 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

type AttendanceButtonProps = {
  userId: string;
  attendance: {
    id: string;
    checkIn: Date | null;
    checkOut: Date | null;
  } | null;
};

type AttendanceEndpoint = { endpoint: "check-in" | "check-out" };

export default function AttendanceButton({
  userId,
  attendance,
}: AttendanceButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Business rules
  const now = new Date();
  const wibHour = (now.getUTCHours() + 7) % 24;
  const disabledByTime = wibHour >= 18;
  const alreadyCheckedIn = !!attendance?.checkIn;
  const alreadyCheckedOut = !!attendance?.checkOut;

  const buttonLabel = alreadyCheckedIn ? "Check Out" : "Check In";
  const icon = alreadyCheckedIn ? <Clock5 size={16} /> : <Clock9 size={16} />;
  const buttonColor = alreadyCheckedIn
    ? "bg-orange-500 hover:bg-orange-600"
    : "bg-green-500 hover:bg-green-600";

  const mutation = useMutation({
    mutationFn: async ({ endpoint }: AttendanceEndpoint) => {
      const res = await fetch(`${BASE_URL}/api/admin/attendance/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Request failed");
      }
      return data as { message: string };
    },
    onSuccess: (data) => {
      customToast("success", "Success 🎉", data.message);
      router.refresh();
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Please try again later.";
      customToast("error", "Uh oh! Something went wrong 😵", message);
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  return (
    <AlertDialog
      open={open}
      onOpenChange={(val) => !mutation.isPending && setOpen(val)}
    >
      {alreadyCheckedIn && alreadyCheckedOut ? (
        <Button disabled className="cursor-not-allowed bg-gray-400 text-white">
          ✅ Attendance Completed
        </Button>
      ) : (
        <AlertDialogTrigger asChild>
          <Button
            disabled={disabledByTime || mutation.isPending}
            className={`flex items-center gap-2 text-sm text-white duration-200 ${buttonColor} ${
              disabledByTime || mutation.isPending
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            title={
              disabledByTime
                ? "Attendance is closed after 18:00 WIB"
                : undefined
            }
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
          <AlertDialogCancel
            className="w-[130px]"
            disabled={mutation.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <SubmitButton
            onClick={() =>
              mutation.mutate({
                endpoint: alreadyCheckedIn
                  ? ("check-out" as const)
                  : ("check-in" as const),
              })
            }
            isSubmitting={mutation.isPending}
            className="w-[130px] bg-emerald-500 text-white hover:bg-emerald-300"
          >
            {mutation.isPending ? "Confirming..." : "Confirm"}
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
