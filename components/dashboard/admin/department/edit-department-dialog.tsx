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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { customToast } from "@/components/custom-toast";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/constants";
import { companySchema } from "@/validations/super-admin";
import { Department } from "@prisma/client";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

type EditDepartmentDialogProps = {
  companyId: string;
  departmentData: Department;
};

function EditDepartmentDialog({
  companyId,
  departmentData,
}: EditDepartmentDialogProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: departmentData.name,
    },
  });

  useEffect(() => {
    form.reset({
      name: departmentData.name,
    });
  }, [departmentData.name, form]);

  async function onSubmit(values: z.infer<typeof companySchema>) {
    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/department`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departmentId: departmentData.id,
          name: values.name,
          companyId: companyId,
        }),
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
      setSubmitting(false);
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          className="flex cursor-pointer items-center gap-2 bg-yellow-500 text-white duration-200 hover:bg-yellow-600"
        >
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px] rounded-md sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Department</DialogTitle>
          <DialogDescription>
            Edit the details of this department.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g: Human Resources"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex gap-2">
              <SubmitButton
                isSubmitting={submitting}
                className="dark:text-foreground w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600"
              >
                {submitting ? "Editing..." : "Edit"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditDepartmentDialog;
