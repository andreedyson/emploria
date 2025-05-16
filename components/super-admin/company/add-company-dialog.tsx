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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/constants";
import { Building } from "lucide-react";
import { useRouter } from "next/navigation";
import { companySchema } from "@/validations/super-admin";
import { SubmitButton } from "@/components/submit-button";
import { customToast } from "@/components/custom-toast";

function AddCompanyDialog() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  async function onSubmit(values: z.infer<typeof companySchema>) {
    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/super-admin/company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          image: values.image,
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
          size={"sm"}
          className="bg-picton-blue-400 hover:bg-picton-blue-500 flex h-9 items-center gap-2 px-3 text-xs text-white duration-200 xl:text-sm"
        >
          <Building size={16} />
          Add Company
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px] rounded-md sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create Company</DialogTitle>
          <DialogDescription>
            Add a new company to this SAP system.
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
                      placeholder="e.g: PT. Harapan Persada"
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
                className="bg-picton-blue-400 hover:bg-picton-blue-500 dark:text-foreground w-full"
              >
                {submitting ? "Adding" : "Add Company"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCompanyDialog;
