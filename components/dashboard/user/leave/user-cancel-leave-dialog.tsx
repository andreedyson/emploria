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
import { Leave } from "@prisma/client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UserCancelLeaveDialogProps = {
  leave: Leave;
};

function UserCancelLeaveDialog({ leave }: UserCancelLeaveDialogProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/user/leave/${leave.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "CANCELLED",
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
          disabled={leave.status !== "PENDING"}
          size={"icon"}
          className="flex cursor-pointer items-center gap-2 bg-red-500 text-sm text-white duration-200 hover:bg-red-600"
        >
          <X size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[350px] rounded-lg sm:max-w-[380px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will cancel the <span>{leave.leaveType}</span> leave request
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <SubmitButton
            onClick={handleDelete}
            isSubmitting={submitting}
            className="w-[120px] cursor-pointer rounded-sm bg-red-500 text-white duration-200 hover:bg-red-300"
          >
            {submitting ? "Cancelling..." : "Cancel"}
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UserCancelLeaveDialog;
