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
import { LeaveColumnProps } from "@/types/admin/leave";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteLeaveDialogProps = {
  leaveData: LeaveColumnProps;
};

function DeleteLeaveDialog({ leaveData }: DeleteLeaveDialogProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/leave`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leaveId: leaveData.id,
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
          size={"icon"}
          className="flex cursor-pointer items-center gap-2 bg-red-500 text-sm text-white duration-200 hover:bg-red-600"
        >
          <Trash size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[350px] rounded-lg sm:max-w-[380px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the leave data and remove its data from the
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <SubmitButton
            onClick={handleDelete}
            isSubmitting={submitting}
            className="w-[100px] cursor-pointer rounded-sm bg-red-500 text-white duration-200 hover:bg-red-300"
          >
            {submitting ? "Deleting" : "Delete"}
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteLeaveDialog;
