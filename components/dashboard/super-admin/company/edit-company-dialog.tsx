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
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { customToast } from "@/components/custom-toast";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/constants";
import { AllCompaniesProps } from "@/types/super-admin/company";
import { companySchema } from "@/validations/super-admin";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

type EditCompanyDialogProps = {
  companyData: AllCompaniesProps;
};

function EditCompanyDialog({ companyData }: EditCompanyDialogProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: companyData.name,
      image: "",
      isActive: companyData.isActive,
    },
  });

  useEffect(() => {
    form.reset({
      name: companyData.name,
      image: "",
      isActive: companyData.isActive,
    });
  }, [companyData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
      form.setValue("image", file);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    form.setValue("image", "");
  };

  async function onSubmit(values: z.infer<typeof companySchema>) {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("companyId", companyData.id);
      formData.append("name", values.name);
      formData.append("isActive", values.isActive.toString());
      if (values.image instanceof File && values.image.size > 0) {
        formData.append("image", values.image);
      }

      const res = await fetch(`${BASE_URL}/api/super-admin/company`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        customToast("error", "Uh oh! Something went wrong 😵", data.message);
      } else {
        setSubmitting(false);
        customToast("success", "Success 🎉", data.message);
        setOpen(false);
        form.reset();
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
      <DialogContent className="max-w-[350px] rounded-md sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription>Modify a company data.</DialogDescription>
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

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".jpg,.png,.jpeg,.webp"
                      onChange={handleFileChange}
                      ref={(el) => {
                        field.ref(el);
                        fileInputRef.current = el;
                      }}
                      className="bg-input w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedImage && (
              <div className="flex flex-col items-center justify-center gap-2">
                <Image
                  src={selectedImage}
                  width={200}
                  height={200}
                  alt="Selected Logo"
                  className="max-h-[200px] object-cover"
                />
                <p
                  onClick={handleClearImage}
                  className="bg-muted w-fit cursor-pointer border px-2 py-1 text-end text-sm"
                >
                  Clear
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Is Active</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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

export default EditCompanyDialog;
