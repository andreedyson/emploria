"use client";

import { customToast } from "@/components/custom-toast";
import { SubmitButton } from "@/components/submit-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { BASE_URL } from "@/constants";
import { getImageUrl } from "@/lib/supabase";
import { changeProfileImageSchema } from "@/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type UserProfileAvatarProps = {
  userId: string;
  name?: string;
  image?: string | null;
};

function UserProfileAvatar({ userId, name, image }: UserProfileAvatarProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof changeProfileImageSchema>>({
    resolver: zodResolver(changeProfileImageSchema),
    defaultValues: {
      image: "",
    },
  });

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "-";

  useEffect(() => {
    form.reset({
      image: image,
    });
  }, [image, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
      form.setValue("image", file);
    }
  };

  async function onSubmit(values: z.infer<typeof changeProfileImageSchema>) {
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (values.image instanceof File && values.image.size > 0) {
        formData.append("image", values.image);
      }

      const res = await fetch(`${BASE_URL}/api/user/${userId}`, {
        method: "PATCH",
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
    <div className="relative">
      {/* User Avatar */}
      <Avatar className="size-[100px]">
        <AvatarImage
          src={
            getImageUrl(image as string, "users") ||
            "/assets/image-placeholder.svg"
          }
          width={100}
          height={100}
          alt={name || "User Profile"}
          className="border-background z-[99] rounded-full border-4 object-cover"
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          asChild
          className="absolute right-0 bottom-0 z-[100] cursor-pointer"
        >
          <div className="bg-muted grid size-8 place-items-center rounded-full border-2 border-gray-300">
            <Pencil size={16} className="text-yellow-500" />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[350px] rounded-md sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Image</DialogTitle>
            <DialogDescription>
              Change your user profile image.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    className="max-h-[200px] object-contain"
                  />
                </div>
              )}

              <DialogFooter className="flex gap-2">
                <SubmitButton
                  isSubmitting={submitting}
                  className="dark:text-foreground w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600"
                >
                  {submitting ? "Changing..." : "Change"}
                </SubmitButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserProfileAvatar;
