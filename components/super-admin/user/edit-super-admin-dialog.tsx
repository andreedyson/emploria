"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { customToast } from "@/components/custom-toast";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_URL } from "@/constants";
import { useCompanies } from "@/hooks/use-company";
import { SuperAdminCompanyUserProps } from "@/types/super-admin/user";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

const editSuperAdminUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  companyId: z.string(),
  isActive: z.boolean(),
});

type EditSuperAdminUserDialogProps = {
  user: SuperAdminCompanyUserProps;
};

function EditSuperAdminUserDialog({ user }: EditSuperAdminUserDialogProps) {
  const { data: companies } = useCompanies();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof editSuperAdminUserSchema>>({
    resolver: zodResolver(editSuperAdminUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      companyId: user.company.id,
      isActive: user.isActive,
    },
  });

  useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
      companyId: user.company.id,
      isActive: user.isActive,
    });
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof editSuperAdminUserSchema>) {
    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/super-admin/user/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        customToast("error", "Update failed", data.message);
      } else {
        setOpen(false);
        setSubmitting(false);
        customToast("success", "User updated 🎉", data.message);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setSubmitting(false);
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
      <DialogContent className="max-w-[350px] sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Admin</DialogTitle>
          <DialogDescription>
            Update the company admin&apos;s information.
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
                    <Input {...field} placeholder="e.g: Jane Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g: jane@mail.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies?.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(Boolean(checked))
                      }
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <SubmitButton
                isSubmitting={submitting}
                className="bg-picton-blue-400 hover:bg-picton-blue-500 w-full"
              >
                {submitting ? "Updating..." : "Update User"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditSuperAdminUserDialog;
