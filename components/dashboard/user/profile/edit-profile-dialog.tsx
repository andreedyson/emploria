"use client";

import { customToast } from "@/components/custom-toast";
import { SubmitButton } from "@/components/submit-button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_URL } from "@/constants";
import { updateUserProfileSchema } from "@/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mars, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  userId: string;
  defaultValues: {
    name: string;
    phone?: string;
    address?: string;
    gender?: "MALE" | "FEMALE";
    dateOfBirth?: Date | null;
  };
};

export default function EditProfileDialog({ userId, defaultValues }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof updateUserProfileSchema>>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      ...defaultValues,
      dateOfBirth: defaultValues.dateOfBirth
        ? new Date(defaultValues.dateOfBirth).toISOString().split("T")[0]
        : "",
    },
  });

  useEffect(() => {
    form.reset({
      name: defaultValues.name,
      phone: defaultValues.phone ?? "",
      address: defaultValues.address ?? "",
      gender:
        defaultValues.gender === "MALE" || defaultValues.gender === "FEMALE"
          ? defaultValues.gender
          : undefined,
      dateOfBirth: defaultValues.dateOfBirth
        ? defaultValues.dateOfBirth.toISOString().split("T")[0]
        : "",
    });
  }, [defaultValues, form]);

  async function onSubmit(values: z.infer<typeof updateUserProfileSchema>) {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone", values.phone || "");
      formData.append("address", values.address || "");
      formData.append("gender", values.gender || "");
      formData.append("dateOfBirth", values.dateOfBirth || "");

      const res = await fetch(`${BASE_URL}/api/user/${userId}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        customToast("error", "Update failed", data.message);
      } else {
        customToast("success", "Updated 🎉", "Profile updated successfully.");
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      customToast("error", "Server Error", "Could not update user.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="cursor-pointer bg-yellow-500 text-white hover:bg-yellow-600"
        >
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Mars size={14} />
                    Gender
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <SubmitButton
                isSubmitting={submitting}
                className="w-full bg-yellow-500 hover:bg-yellow-600"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
