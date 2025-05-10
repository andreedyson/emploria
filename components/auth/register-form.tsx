"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/constants";
import { registerSchema } from "@/types/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  GalleryVerticalEnd,
  Lock,
  Mail,
  UserRound,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { customToast } from "../custom-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export function RegisterForm() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const session = useSession();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const isAutheticated = session.status === "authenticated";
    const systemRole = session.data?.user.role;

    if (isAutheticated && systemRole == "USER") {
      router.replace("/");
    }

    if (
      isAutheticated &&
      (systemRole == "SUPER_ADMIN" || systemRole == "ADMIN")
    ) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitting(false);

        customToast("error", "Something went wrong 😵", data.message);
      } else {
        setSubmitting(false);
        customToast("success", "Success 🌟", data.message);
        form.reset();
        router.push("/sign-in");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitting(false);
      customToast("error", "Unexpected error occured 😵");
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <section className="mb-2 text-center md:text-start">
            <Link
              href="/"
              className="mb-3 flex items-center gap-2 font-semibold"
            >
              <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              Emploria
            </Link>
            <p className="mt-2.5 mb-3 text-sm font-bold tracking-wide uppercase">
              Register
            </p>
            <h2 className="text-xl font-bold md:text-2xl">
              Create an account 📦
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Fill out the form below to create your account and start managing
              your dashboard with ease.
            </p>
          </section>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <div className="border-input flex items-center justify-center rounded-md border dark:bg-zinc-700">
                  <UserRound size={24} className="mx-2" />
                  <FormControl>
                    <Input
                      placeholder="ex: Andre Edyson"
                      {...field}
                      autoComplete="off"
                      className="rounded-l-none"
                    />
                  </FormControl>
                </div>
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
                <div className="border-input flex items-center justify-center rounded-md border dark:bg-zinc-700">
                  <Mail size={24} className="mx-2" />
                  <FormControl>
                    <Input
                      placeholder="user@mail.com"
                      {...field}
                      autoComplete="off"
                      className="rounded-l-none"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="border-input relative flex items-center justify-center rounded-md border dark:bg-zinc-700">
                  <Lock size={24} className="mx-2" />
                  <FormControl>
                    <Input
                      placeholder={showPassword ? "Your Password" : "******"}
                      {...field}
                      autoComplete="off"
                      type={showPassword ? "text" : "password"}
                      className="rounded-l-none"
                    />
                  </FormControl>
                  <div
                    className="desc-2 absolute right-3 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {!showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full cursor-pointer"
          >
            {submitting ? "Registering..." : "Register"}
          </Button>
          <Link href={"/sign-in"} className="mt-2 text-center text-sm">
            Already have an account?{" "}
            <span className="text-main-500 font-semibold underline">
              Sign In
            </span>
          </Link>
          <div className="desc-2 mt-3 text-center text-sm md:mt-12 md:text-start">
            <p>© 2025 Emploria</p>
          </div>
        </form>
      </Form>
    </div>
  );
}
