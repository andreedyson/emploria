"use client";

import { customToast } from "@/components/custom-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SalaryStatus } from "@prisma/client";
import { BadgeDollarSignIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ConfirmPaidDialogProps = {
  salaryId: string;
  salaryStatus: SalaryStatus;
};

export function ConfirmPaidDialog({
  salaryId,
  salaryStatus,
}: ConfirmPaidDialogProps) {
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/salary/${salaryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "PAID",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        customToast(
          "error",
          "Something went wrong 😵",
          errorData.message || "Failed to confirm salary",
        );
        return;
      }

      customToast("success", "Success 🎉", "Salary marked as paid");
      setSuccessOpen(true);
      setTimeout(() => {
        setConfirmOpen(false);
      }, 150);
      router.refresh();
    } catch (error) {
      console.error(error);
      customToast("error", "Server Error ❌", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1: Alert Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogTrigger asChild>
          <Button
            disabled={salaryStatus == "PAID"}
            size={"icon"}
            className="flex cursor-pointer items-center gap-2 bg-green-500 text-sm text-white duration-200 hover:bg-green-600"
          >
            <BadgeDollarSignIcon size={16} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="w-[350px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the salary as <strong>PAID</strong>. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={loading}
              className="cursor-pointer bg-green-500 duration-200 hover:bg-green-600"
            >
              {loading ? "Processing..." : "Yes, Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 2: Success Dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="w-[350px] text-center">
          <DialogHeader>
            <DialogTitle>Payment Confirmed 🎉</DialogTitle>
            <DialogDescription>
              The salary has been marked as paid successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Image
              src="/assets/success-medal.png"
              alt="Success Illustration"
              className="mx-auto size-52"
              width={160}
              height={160}
            />
          </div>
          <DialogFooter className="flex items-center justify-center">
            <Button onClick={() => setSuccessOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
